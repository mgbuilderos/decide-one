/**
 * Decide One Archival Vault Export & Print Engine
 * 100% Client-Side Private Processing (Zero Server Transmission)
 */

/**
 * Generates an Obsidian / Notion compliant Markdown archive
 */
export function generateMarkdownArchive(data, settings) {
  const dailyLogs = data?.dailyLogs || {};
  const habits = data?.habits || [];
  const owner = settings?.ownerName || '';
  const exportDate = new Date().toISOString().split('T')[0];

  let md = `# Decide One Archival Vault\n`;
  md += `> ${owner ? `Owner: ${owner} | ` : ''}Exported: ${exportDate} | Format: Obsidian & Notion Markdown\n\n`;
  md += `---\n\n`;

  const sortedDateKeys = Object.keys(dailyLogs).sort().reverse();

  if (sortedDateKeys.length === 0) {
    md += `*No daily logs recorded yet.*\n`;
    return md;
  }

  for (const dateKey of sortedDateKeys) {
    const log = dailyLogs[dateKey];
    if (!log) continue;

    const [year, month, day] = dateKey.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Frontmatter for Obsidian Dataview / Notion properties
    md += `---\n`;
    md += `date: ${dateKey}\n`;
    md += `day: ${dayName}\n`;
    md += `framework: "${log.activeFramework || 'rule_of_3'}"\n`;
    if (log.reflection?.mood) md += `mood: "${log.reflection.mood}"\n`;
    md += `---\n\n`;

    md += `## ${dayName}, ${fullDate}\n\n`;

    // Priorities
    if (log.hardTasks && log.hardTasks.length > 0) {
      md += `### Priority Tasks\n`;
      log.hardTasks.forEach(task => {
        if (task && task.text) {
          md += `- [${task.completed ? 'x' : ' '}] ${task.text}\n`;
        }
      });
      md += `\n`;
    }

    // Daily Rapid Log
    if (log.rapidLog && log.rapidLog.length > 0) {
      md += `### Daily Log & Notes\n`;
      log.rapidLog.forEach(item => {
        if (item && item.text) {
          const checkMark = item.completed ? '[x]' : item.type === 'note' ? '-' : item.type === 'event' ? 'o' : '[ ]';
          md += `- ${checkMark} ${item.text}\n`;
        }
      });
      md += `\n`;
    }

    // Habits
    if (habits.length > 0 && log.habitsCompleted) {
      md += `### Habit Consistency\n`;
      habits.forEach(h => {
        const done = !!log.habitsCompleted[h.id];
        md += `- [${done ? 'x' : ' '}] ${h.name}\n`;
      });
      md += `\n`;
    }

    // Reflection
    if (log.reflection && (log.reflection.text || log.reflection.highlight)) {
      md += `### Evening Reflection\n`;
      if (log.reflection.highlight) {
        md += `**Highlight:** ${log.reflection.highlight}\n\n`;
      }
      if (log.reflection.text) {
        md += `${log.reflection.text}\n\n`;
      }
    }

    md += `---\n\n`;
  }

  return md;
}

/**
 * Downloads the generated Markdown vault file to local disk
 */
export function downloadMarkdownVault(data, settings) {
  const content = generateMarkdownArchive(data, settings);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `DecideOne-Vault-${dateStr}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean 1-click Typeset Print Engine
 */
export function printAnnualBook(data, settings, year = new Date().getFullYear()) {
  window.print();
}
