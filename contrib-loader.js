// contribution loader — GitHub contributions heatmap via CORS-enabled API, rendered as a 53-week grid
function renderContributions(container) {
  fetch('https://github-contributions-api.jogruber.de/v4/ByungHyun21?y=last')
    .then(r => r.json())
    .then(data => {
      const days = data.contributions;
      if (!days || !days.length) throw new Error('empty');
      const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
      const months = weeks.map(w => {
        const first = w.find(d => new Date(d.date + 'T00:00:00').getDate() === 1);
        return `<span>${first ? MONTHS[new Date(first.date + 'T00:00:00').getMonth()] : ''}</span>`;
      }).join('');
      const total = days.reduce((s, d) => s + d.count, 0);
      const cells = days.map(d =>
        `<i class="l${d.level}" title="${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}"></i>`
      ).join('');
      const legend = [0, 1, 2, 3, 4].map(l => `<i class="l${l}"></i>`).join('');
      container.innerHTML = `<div class="contrib-scroll">
        <div class="contrib-months">${months}</div>
        <div class="contrib-grid">${cells}</div>
      </div>
      <div class="contrib-legend"><span>${total} contributions · last year</span><span class="spacer">Less</span>${legend}<span>More</span></div>`;
    })
    .catch(() => {
      container.innerHTML = '<p style="color:var(--text-dim);">Failed to load contributions.</p>';
    });
}
