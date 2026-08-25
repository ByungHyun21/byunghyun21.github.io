// repo loader — fetches from GitHub API, merges local descriptions, renders sorted by push date
function renderRepos(container) {
  Promise.all([
    fetch('https://api.github.com/users/ByungHyun21/repos?sort=pushed&per_page=20').then(r => r.json()),
    fetch('repo-descriptions.json').then(r => r.json()).catch(() => ({}))
  ]).then(([repos, descriptions]) => {
    const skip = ['byunghyun21.github.io'];
    const list = repos
      .filter(r => !skip.includes(r.name) && !r.fork)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (!list.length) {
      container.innerHTML = '<p style="color:var(--text-dim);">No repos found.</p>';
      return;
    }

    container.innerHTML = list.map(repo => {
      const desc = descriptions[repo.name];
      const short = desc ? desc.short : (repo.description || '');
      const detail = desc ? desc.desc : '';
      const lang = repo.language || '';
      return `<div class="card">
        <div class="card-title"><a href="${repo.html_url}">${repo.name}</a></div>
        <div class="card-desc">${short}</div>
        ${detail ? `<div class="card-desc" style="margin-top:4px;">${detail}</div>` : ''}
        <div class="card-tags">
          ${lang ? `<span>${lang}</span>` : ''}
          <span>pushed ${repo.pushed_at.slice(0, 10)}</span>
        </div>
      </div>`;
    }).join('');
  }).catch(() => {
    container.innerHTML = '<p style="color:var(--text-dim);">Failed to load repos.</p>';
  });
}
