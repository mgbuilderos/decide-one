import { useState, useEffect, useCallback, useRef } from 'react';
import { playSound } from '../utils/audio';

const REMINDERS_KEY = 'DECIDEONE_REMINDERS_CONFIG_V1';
const LEGACY_REMINDERS_KEYS = ['PRIMACY_REMINDERS_CONFIG_V1', 'POCKETBOOK_REMINDERS_CONFIG_V1'];

const DEFAULT_CONFIG = {
  notificationsEnabled: false,
  eveningReviewTime: '20:30', // 8:30 PM
  quietHoursStart: '22:00',   // 10:00 PM
  quietHoursEnd: '07:00',     // 7:00 AM
  lastEveningAlertDate: null
};

export function useAmbientReminders({
  onOpenClosureRitual,
  isMuted = false
}) {
  const [config, setConfig] = useState(() => {
    try {
      const current = localStorage.getItem(REMINDERS_KEY);
      const legacy = LEGACY_REMINDERS_KEYS.reduce((found, k) => found || localStorage.getItem(k), null);
      if (!current && legacy) localStorage.setItem(REMINDERS_KEY, legacy);
      const saved = current || legacy;
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [permissionState, setPermissionState] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const checkIntervalRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save reminders config:', e);
    }
  }, [config]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermissionState('unsupported');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission === 'granted') {
        setConfig(prev => ({ ...prev, notificationsEnabled: true }));
        playSound('check', isMuted);
        new Notification('Decide One', {
          body: 'On-device ambient signals activated. Zero data leaves this hardware.',
          silent: isMuted
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Notification permission error:', err);
      return false;
    }
  }, [isMuted]);

  const isWithinQuietHours = useCallback(() => {
    const now = new Date();
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();

    const [startH, startM] = (config.quietHoursStart || '22:00').split(':').map(Number);
    const [endH, endM] = (config.quietHoursEnd || '07:00').split(':').map(Number);
    const startMinutes = (startH * 60) + startM;
    const endMinutes = (endH * 60) + endM;

    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }, [config.quietHoursStart, config.quietHoursEnd]);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const todayIso = now.toISOString().split('T')[0];
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const currentMinutes = (currentH * 60) + currentM;

      // The evening closure notification (8:30 PM). The 6 PM spine glow that
      // used to sit above it is gone with the bi-fold it was drawn on (B-39).

      const [revH, revM] = (config.eveningReviewTime || '20:30').split(':').map(Number);
      const revMinutes = (revH * 60) + revM;

      const hasTriggeredToday = config.lastEveningAlertDate === todayIso;

      if (
        !hasTriggeredToday &&
        config.notificationsEnabled &&
        permissionState === 'granted' &&
        !isWithinQuietHours() &&
        currentMinutes >= revMinutes &&
        currentMinutes <= revMinutes + 15
      ) {
        try {
          const notification = new Notification('Decide One', {
            body: '8:30 PM — Close your day and clear your cognitive residue.',
            tag: 'decideone-evening-closure'
          });

          notification.onclick = () => {
            window.focus();
            onOpenClosureRitual?.();
            notification.close();
          };

          setConfig(prev => ({ ...prev, lastEveningAlertDate: todayIso }));
        } catch {}
      }
    };

    checkSchedule();
    checkIntervalRef.current = setInterval(checkSchedule, 30000);
    return () => clearInterval(checkIntervalRef.current);
  }, [
    config.eveningReviewTime,
    config.notificationsEnabled,
    config.lastEveningAlertDate,
    permissionState,
    isWithinQuietHours,
    onOpenClosureRitual
  ]);

  return {
    config,
    setConfig,
    permissionState,
    requestPermission
  };
}
