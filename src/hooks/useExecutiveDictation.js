import { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../utils/audio';
import { 
  formatSpokenPunctuation, 
  parseVoiceTargetRouting, 
  isSpeechRecognitionSupported 
} from '../utils/speechVoiceCapture';

export function useExecutiveDictation({
  onCommitEntry,
  isMuted = false,
  activeTarget = 'today'
}) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [targetDestination, setTargetDestination] = useState(activeTarget);
  const [audioLevel, setAudioLevel] = useState(0); // 0.0 to 1.0
  const [errorState, setErrorState] = useState(null); // 'permission-denied' | 'unsupported' | null

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceTimerRef = useRef(null);

  const isSupported = isSpeechRecognitionSupported();

  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, Math.max(0, avg / 128));
        setAudioLevel(normalized);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Web Audio decibel analyzer could not attach:', err);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  const commitSpeech = useCallback((rawSpeech) => {
    if (!rawSpeech || !rawSpeech.trim()) return;

    const formatted = formatSpokenPunctuation(rawSpeech);
    const { target: routedTarget, cleanText } = parseVoiceTargetRouting(formatted);
    const finalTarget = routedTarget !== 'today' ? routedTarget : targetDestination;

    playSound('check', isMuted);
    onCommitEntry?.({
      target: finalTarget,
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });

    setInterimTranscript('');
  }, [formatSpokenPunctuation, targetDestination, isMuted, onCommitEntry]);

  const stopDictation = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setIsListening(false);
    stopAudioAnalysis();
    setInterimTranscript('');
  }, []);

  const startDictation = useCallback((target = null) => {
    if (!isSupported) {
      setErrorState('unsupported');
      return;
    }

    if (target) {
      setTargetDestination(target);
    }

    setErrorState(null);
    setInterimTranscript('');

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        playSound('click', isMuted);
        startAudioAnalysis();
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interim);

        if (finalChunk.trim()) {
          commitSpeech(finalChunk);
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          stopDictation();
        }, 5000);
      };

      recognition.onerror = (event) => {
        console.warn('Speech Recognition Error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorState('permission-denied');
        }
        stopDictation();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioAnalysis();
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setIsListening(false);
      stopAudioAnalysis();
    }
  }, [isSupported, isMuted, commitSpeech, stopDictation]);

  const toggleDictation = useCallback((target = null) => {
    if (isListening) {
      stopDictation();
    } else {
      startDictation(target);
    }
  }, [isListening, startDictation, stopDictation]);

  useEffect(() => {
    return () => {
      stopDictation();
    };
  }, [stopDictation]);

  return {
    isListening,
    isSupported,
    interimTranscript,
    targetDestination,
    setTargetDestination,
    audioLevel,
    errorState,
    dismissError: () => setErrorState(null),
    startDictation,
    stopDictation,
    toggleDictation
  };
}
