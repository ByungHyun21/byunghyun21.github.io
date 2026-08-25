// activity loader — fetches activity.json and renders table rows
function renderActivity(container, max) {
  fetch('activity.json')
    .then(r => r.json())
    .then(items => {
      const list = max ? items.slice(0, max) : items;
      container.innerHTML = list.map(item => {
        const title = item.url
          ? `<a href="${item.url}">${item.title}</a>`
          : `<span style="font-weight:600;color:var(--text-bright);">${item.title}</span>`;
        return `<tr>
          <td class="date">${item.date}</td>
          <td class="type">${item.type}</td>
          <td>${title}<span class="desc">${item.desc}</span></td>
        </tr>`;
      }).join('');
    })
    .catch(() => {
      container.innerHTML = '<tr><td colspan="3" style="color:var(--text-dim);">Failed to load.</td></tr>';
    });
}
