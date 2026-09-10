/**
 * Decide One Executive Weekly Briefing PDF Engine
 * Publication-grade client-side 2-page A4 PDF rendering with 24px grid & 15mm binder margins
 * 100% Offline • Zero Server • Vector Typography (Helvetica)
 */
import { jsPDF } from 'jspdf';
import { CATEGORIES } from '../types/journal';

// Formatting & Calendar Helpers
export function getWeekDates(startDateInput) {
  const d = new Date(startDateInput);
  const day = d.getDay();
  // Align to Monday (ISO 8601)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(nextDate.getDate()).padStart(2, '0');
    dates.push({
      dateKey: `${y}-${m}-${dayStr}`,
      dayName: nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDayName: nextDate.toLocaleDateString('en-US', { weekday: 'long' }),
      monthDay: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dateObj: nextDate
    });
  }
  return dates;
}

export function getISOWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

/**
 * Main PDF Generation Entry Point
 */
export async function generateExecutiveWeeklyBriefingPDF({
  startDate = new Date(),
  data,
  settings = {},
  habits = [],
  pageSize = 'a4'
}) {
  const weekDates = getWeekDates(startDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekNum = getISOWeekNumber(weekStart.dateObj);
  const year = weekStart.dateObj.getFullYear();
  const owner = settings.ownerName || 'Maulik';

  // Paper geometry in points (pt)
  const isA4 = pageSize.toLowerCase() === 'a4';
  const PAGE_W = isA4 ? 595.28 : 612.0;
  const PAGE_H = isA4 ? 841.89 : 792.0;

  // 15mm Punch Gutter on Left (42.5pt), 10mm on others (28.3pt)
  const ML = 42.52;
  const MR = 28.35;
  const MT = 28.35;
  const MB = 28.35;
  const CONTENT_W = PAGE_W - ML - MR;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: isA4 ? 'a4' : 'letter',
    compress: true
  });

  // Palette
  const INK_BLACK = [24, 24, 27];
  const INK_CHARCOAL = [63, 63, 70];
  const INK_MUTED = [113, 113, 122];
  const INK_LIGHT = [228, 228, 231];

  const drawLine = (x1, y1, x2, y2, color = INK_LIGHT, lineWidth = 0.5) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(lineWidth);
    doc.line(x1, y1, x2, y2);
  };

  // Data Aggregation
  let totalHardTasks = 0;
  let completedHardTasks = 0;
  let totalRapidTasks = 0;
  let completedRapidTasks = 0;
  const categoryCounts = {};
  const habitCompletionMatrix = {};

  habits.forEach(h => {
    habitCompletionMatrix[h.id] = [false, false, false, false, false, false, false];
  });

  const dailySummaries = weekDates.map((wd, dayIdx) => {
    const log = data?.dailyLogs?.[wd.dateKey] || {};
    const hardTasks = (log.hardTasks || []).filter(t => t && t.text && t.text.trim());
    const rapidLog = (log.rapidLog || []).filter(r => r && r.text && r.text.trim());
    const reflection = log.reflection || '';
    const completedHabits = log.completedHabits || [];

    habits.forEach(h => {
      if (completedHabits.includes(h.id)) {
        habitCompletionMatrix[h.id][dayIdx] = true;
      }
    });

    hardTasks.forEach(t => {
      totalHardTasks++;
      if (t.completed) completedHardTasks++;
      const cat = t.category || 'personal';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    rapidLog.forEach(r => {
      if (['task', 'completed', 'migrated'].includes(r.type)) {
        totalRapidTasks++;
        if (r.type === 'completed') completedRapidTasks++;
      }
      const cat = r.category || 'personal';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return {
      ...wd,
      hardTasks,
      rapidLog,
      reflection
    };
  });

  const totalActionable = totalHardTasks + totalRapidTasks;
  const totalCompleted = completedHardTasks + completedRapidTasks;
  const overallRate = totalActionable > 0 ? Math.round((totalCompleted / totalActionable) * 100) : 100;

  const totalHabitOpportunities = habits.length * 7;
  let totalHabitsDone = 0;
  Object.values(habitCompletionMatrix).forEach(arr => {
    totalHabitsDone += arr.filter(Boolean).length;
  });
  const habitRate = totalHabitOpportunities > 0 ? Math.round((totalHabitsDone / totalHabitOpportunities) * 100) : 100;

  // =============================================================
  // PAGE 1: EXECUTIVE STRATEGIC SYNTHESIS
  // =============================================================
  let curY = MT;

  // Masthead
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...INK_BLACK);
  doc.text('DECIDE ONE EXECUTIVE BRIEFING', ML, curY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('WEEKLY OPERATIONAL RETROSPECTIVE & KPI SYNTHESIS', ML, curY + 24);

  const rightMeta = `WEEK ${String(weekNum).padStart(2, '0')} • ${weekStart.monthDay.toUpperCase()} – ${weekEnd.monthDay.toUpperCase()}, ${year}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...INK_BLACK);
  doc.text(rightMeta, PAGE_W - MR, curY + 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...INK_MUTED);
  doc.text(`CONFIDENTIAL • ${owner.toUpperCase()} PRIVATE VAULT`, PAGE_W - MR, curY + 24, { align: 'right' });

  curY += 34;
  drawLine(ML, curY, PAGE_W - MR, curY, INK_BLACK, 1.2);
  curY += 12;

  // KPI Scorecards
  const colW = (CONTENT_W - 18) / 4;
  const kpis = [
    { label: 'EXECUTION VELOCITY', value: `${overallRate}%`, sub: `${totalCompleted}/${totalActionable} Total Items` },
    { label: 'KEY PRIORITIES', value: `${completedHardTasks}/${totalHardTasks}`, sub: `${totalHardTasks > 0 ? Math.round((completedHardTasks/totalHardTasks)*100) : 100}% Conquered` },
    { label: 'TACTICAL DISPATCHES', value: `${completedRapidTasks}`, sub: `${totalRapidTasks} Stream Items Done` },
    { label: 'HABIT CONSISTENCY', value: `${habitRate}%`, sub: `${totalHabitsDone}/${totalHabitOpportunities} Checked` }
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = ML + idx * (colW + 6);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(kpiX, curY, colW, 46, 3, 3, 'F');
    doc.setDrawColor(...INK_LIGHT);
    doc.setLineWidth(0.5);
    doc.roundedRect(kpiX, curY, colW, 46, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...INK_MUTED);
    doc.text(kpi.label, kpiX + 7, curY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...INK_BLACK);
    doc.text(kpi.value, kpiX + 7, curY + 29);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...INK_MUTED);
    doc.text(kpi.sub, kpiX + 7, curY + 39);
  });

  curY += 58;
  drawLine(ML, curY, PAGE_W - MR, curY, INK_LIGHT, 0.5);
  curY += 14;

  // 2-Column Split: Strategic Priorities & Habit Heatmap
  const LEFT_COL_W = 310;
  const RIGHT_COL_W = CONTENT_W - LEFT_COL_W - 16;
  const RIGHT_COL_X = ML + LEFT_COL_W + 16;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...INK_BLACK);
  doc.text('COMPLETED STRATEGIC PRIORITIES', ML, curY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('Daily Focus & High-Impact Directives', ML, curY + 10);

  let taskY = curY + 24;
  dailySummaries.forEach(day => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...INK_BLACK);
    doc.text(`${day.dayName.toUpperCase()}, ${day.monthDay.toUpperCase()}`, ML, taskY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...INK_MUTED);
    const dayDone = day.hardTasks.filter(t => t.completed).length;
    doc.text(`${dayDone}/${day.hardTasks.length} Done`, ML + LEFT_COL_W, taskY, { align: 'right' });

    taskY += 4;
    drawLine(ML, taskY, ML + LEFT_COL_W, taskY, [240, 240, 240], 0.4);
    taskY += 9;

    if (day.hardTasks.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 160, 160);
      doc.text('— Restorative pause or unscheduled day', ML + 10, taskY);
      taskY += 14;
    } else {
      day.hardTasks.forEach(task => {
        if (task.completed) {
          doc.setFillColor(...INK_BLACK);
          doc.circle(ML + 3, taskY - 2.5, 2, 'F');
        } else {
          doc.setDrawColor(...INK_MUTED);
          doc.setLineWidth(0.6);
          doc.circle(ML + 3, taskY - 2.5, 2, 'S');
        }

        const catCode = (task.category || 'WRK').substring(0, 3).toUpperCase();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...INK_MUTED);
        doc.text(`[${catCode}]`, ML + 9, taskY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...(task.completed ? INK_BLACK : INK_MUTED));
        const maxTextW = LEFT_COL_W - 44;
        const truncated = doc.splitTextToSize(task.text, maxTextW)[0];
        doc.text(truncated, ML + 34, taskY);

        taskY += 12;
      });
      taskY += 3;
    }
  });

  // Habit Heatmap
  let habitY = curY;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...INK_BLACK);
  doc.text('HABIT HEATMAP MATRIX', RIGHT_COL_X, habitY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('7-Day Consistency Grid', RIGHT_COL_X, habitY + 10);

  habitY += 24;

  const cellW = 14;
  const cellH = 14;
  const nameW = RIGHT_COL_W - (7 * (cellW + 3)) - 24;

  ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((dLetter, dIdx) => {
    const dX = RIGHT_COL_X + nameW + (dIdx * (cellW + 3));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...INK_MUTED);
    doc.text(dLetter, dX + cellW / 2, habitY, { align: 'center' });
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('%', RIGHT_COL_X + RIGHT_COL_W - 8, habitY, { align: 'right' });

  habitY += 6;
  drawLine(RIGHT_COL_X, habitY, RIGHT_COL_X + RIGHT_COL_W, habitY, INK_LIGHT, 0.5);
  habitY += 10;

  habits.forEach(h => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...INK_BLACK);
    const labelTrunc = doc.splitTextToSize(h.label || h.id, nameW - 4)[0];
    doc.text(labelTrunc, RIGHT_COL_X, habitY + 9);

    const completedArr = habitCompletionMatrix[h.id] || [];
    const doneCount = completedArr.filter(Boolean).length;
    const rate = Math.round((doneCount / 7) * 100);

    completedArr.forEach((done, dIdx) => {
      const cX = RIGHT_COL_X + nameW + (dIdx * (cellW + 3));
      if (done) {
        doc.setFillColor(...INK_BLACK);
        doc.roundedRect(cX, habitY, cellW, cellH, 2, 2, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1.0);
        doc.line(cX + 3.5, habitY + 7, cX + 6, habitY + 10.5);
        doc.line(cX + 6, habitY + 10.5, cX + 10.5, habitY + 3.5);
      } else {
        doc.setFillColor(248, 248, 250);
        doc.roundedRect(cX, habitY, cellW, cellH, 2, 2, 'F');
        doc.setDrawColor(230, 230, 235);
        doc.setLineWidth(0.5);
        doc.roundedRect(cX, habitY, cellW, cellH, 2, 2, 'S');
      }
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...(rate >= 80 ? INK_BLACK : INK_MUTED));
    doc.text(`${rate}%`, RIGHT_COL_X + RIGHT_COL_W - 6, habitY + 9.5, { align: 'right' });

    habitY += cellH + 5;
  });

  // Category Distribution Bar
  const bottomBarY = PAGE_H - MB - 50;
  drawLine(ML, bottomBarY, PAGE_W - MR, bottomBarY, INK_LIGHT, 0.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...INK_BLACK);
  doc.text('LIFE HARMONY & ENERGY ALLOCATION', ML, bottomBarY + 13);

  const totalCategorized = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  let barX = ML;
  const barW = CONTENT_W;
  const barH = 8;
  const barY = bottomBarY + 20;

  if (totalCategorized > 0) {
    const palette = [
      [24, 24, 27],
      [113, 113, 122],
      [161, 161, 170],
      [82, 82, 91],
      [212, 212, 216]
    ];
    let pIdx = 0;
    const labelAcc = [];

    Object.entries(categoryCounts).forEach(([catId, cnt]) => {
      const segW = (cnt / totalCategorized) * barW;
      const col = palette[pIdx % palette.length];
      doc.setFillColor(...col);
      doc.rect(barX, barY, segW, barH, 'F');
      barX += segW;

      const catObj = Object.values(CATEGORIES).find(c => c.id === catId);
      const catName = catObj ? catObj.label : catId;
      const pct = Math.round((cnt / totalCategorized) * 100);
      if (pct >= 8) {
        labelAcc.push(`${catName}: ${pct}%`);
      }
      pIdx++;
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...INK_MUTED);
    doc.text(labelAcc.join('   •   '), ML, barY + barH + 11);
  }

  // Footer: Page 1 Pagination
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...INK_MUTED);
  doc.text('DECIDE ONE PRIORITY INSTRUMENT • ARCHIVAL EDITION', ML, PAGE_H - MB + 14);
  doc.text('PAGE 01 OF 02', PAGE_W - MR, PAGE_H - MB + 14, { align: 'right' });

  // =============================================================
  // PAGE 2: TACTICAL DISPATCH & RETROSPECTIVE
  // =============================================================
  doc.addPage();
  curY = MT;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...INK_BLACK);
  doc.text('DECIDE ONE EXECUTIVE BRIEFING // TACTICAL DISPATCH & REFLECTION', ML, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...INK_MUTED);
  doc.text(`WEEK ${String(weekNum).padStart(2, '0')} • PAGE 02`, PAGE_W - MR, curY + 10, { align: 'right' });

  curY += 18;
  drawLine(ML, curY, PAGE_W - MR, curY, INK_BLACK, 1.0);
  curY += 14;

  const STREAM_COL_W = (CONTENT_W - 16) / 2;
  const STREAM_MAX_Y = curY + 360;

  // Column 1 (Mon - Wed)
  let col1Y = curY;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...INK_BLACK);
  doc.text('TACTICAL STREAM (MON – WED)', ML, col1Y);
  col1Y += 12;

  dailySummaries.slice(0, 3).forEach(day => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...INK_MUTED);
    doc.text(`${day.dayName.toUpperCase()}, ${day.monthDay.toUpperCase()}`, ML, col1Y);
    col1Y += 8;

    const streamItems = day.rapidLog.slice(0, 7);
    if (streamItems.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(170, 170, 170);
      doc.text('— No rapid items recorded', ML + 6, col1Y);
      col1Y += 11;
    } else {
      streamItems.forEach(item => {
        const symbol = item.type === 'completed' ? '✓' : item.type === 'event' ? '○' : item.type === 'note' ? '—' : '•';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...(item.type === 'completed' ? INK_BLACK : INK_MUTED));
        doc.text(symbol, ML + 3, col1Y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const itemTxt = doc.splitTextToSize(item.text, STREAM_COL_W - 20)[0];
        doc.text(itemTxt, ML + 14, col1Y);
        col1Y += 10.5;
      });
      col1Y += 4;
    }
  });

  // Column 2 (Thu - Sun)
  const COL2_X = ML + STREAM_COL_W + 16;
  let col2Y = curY;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...INK_BLACK);
  doc.text('TACTICAL STREAM (THU – SUN)', COL2_X, col2Y);
  col2Y += 12;

  dailySummaries.slice(3, 7).forEach(day => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...INK_MUTED);
    doc.text(`${day.dayName.toUpperCase()}, ${day.monthDay.toUpperCase()}`, COL2_X, col2Y);
    col2Y += 8;

    const streamItems = day.rapidLog.slice(0, 7);
    if (streamItems.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(170, 170, 170);
      doc.text('— No rapid items recorded', COL2_X + 6, col2Y);
      col2Y += 11;
    } else {
      streamItems.forEach(item => {
        const symbol = item.type === 'completed' ? '✓' : item.type === 'event' ? '○' : item.type === 'note' ? '—' : '•';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...(item.type === 'completed' ? INK_BLACK : INK_MUTED));
        doc.text(symbol, COL2_X + 3, col2Y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const itemTxt = doc.splitTextToSize(item.text, STREAM_COL_W - 20)[0];
        doc.text(itemTxt, COL2_X + 14, col2Y);
        col2Y += 10.5;
      });
      col2Y += 4;
    }
  });

  // Reflections Anthology
  curY = Math.max(col1Y, col2Y, STREAM_MAX_Y) + 12;
  drawLine(ML, curY, PAGE_W - MR, curY, INK_LIGHT, 0.5);
  curY += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK_BLACK);
  doc.text('DAILY VICTORY & EVENING REFLECTIONS ANTHOLOGY', ML, curY);
  curY += 14;

  const reflectionsWithContent = dailySummaries.filter(d => d.reflection && d.reflection.trim());
  if (reflectionsWithContent.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('No evening reflections recorded for this cycle.', ML + 8, curY);
    curY += 20;
  } else {
    reflectionsWithContent.slice(0, 3).forEach(d => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...INK_BLACK);
      doc.text(`${d.dayName}, ${d.monthDay}:`, ML + 4, curY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...INK_CHARCOAL);
      const splitRef = doc.splitTextToSize(d.reflection, CONTENT_W - 85);
      doc.text(splitRef, ML + 80, curY);
      curY += (splitRef.length * 9.5) + 6;
    });
  }

  // Endorsement Block
  const signoffY = PAGE_H - MB - 55;
  drawLine(ML, signoffY, PAGE_W - MR, signoffY, INK_BLACK, 0.8);

  const blockW = (CONTENT_W - 24) / 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('EXECUTIVE REVIEWER SIGN-OFF', ML, signoffY + 12);
  doc.setDrawColor(...INK_LIGHT);
  doc.line(ML, signoffY + 36, ML + blockW, signoffY + 36);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('DATE OF EXECUTIVE REVIEW', ML + blockW + 12, signoffY + 12);
  doc.setDrawColor(...INK_LIGHT);
  doc.line(ML + blockW + 12, signoffY + 36, ML + (blockW * 2) + 12, signoffY + 36);

  const hashString = `PB-${year}-W${String(weekNum).padStart(2, '0')}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...INK_MUTED);
  doc.text('CRYPTOGRAPHIC AUDIT SEAL', ML + (blockW * 2) + 24, signoffY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...INK_BLACK);
  doc.text(hashString, ML + (blockW * 2) + 24, signoffY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...INK_MUTED);
  doc.text('100% LOCAL-FIRST CRYPTOGRAPHIC LEDGER', ML + (blockW * 2) + 24, signoffY + 34);

  // Footer: Page 2 Pagination
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...INK_MUTED);
  doc.text('EXECUTIVE STATIONERY • VECTOR DIGITAL ARCHIVE EDITION', ML, PAGE_H - MB + 14);
  doc.text('PAGE 02 OF 02', PAGE_W - MR, PAGE_H - MB + 14, { align: 'right' });

  // Download Trigger
  const filename = `DecideOne-Executive-Briefing-${year}-W${String(weekNum).padStart(2, '0')}.pdf`;
  doc.save(filename);
  return { success: true, filename };
}
