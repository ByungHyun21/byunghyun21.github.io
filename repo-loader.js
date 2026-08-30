// repo loader — fetches from GitHub API, merges local descriptions, renders paginated by push date
function renderRepos(container) {
  Promise.all([
    fetch('https://api.github.com/users/ByungHyun21/repos?sort=pushed&per_page=100').then(r => r.json()),
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

    const PER_PAGE = 10;
    const pageCount = Math.ceil(list.length / PER_PAGE);
    let page = 0;

    function card(repo) {
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
    }

    function render() {
      const slice = list.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
      const numbers = Array.from({ length: pageCount }, (_, i) =>
        `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i + 1}</button>`).join('');
      container.innerHTML = slice.map(card).join('') + `
        <div class="pager">
          <button class="page-btn" data-page="${page - 1}"${page === 0 ? ' disabled' : ''}>← prev</button>
          ${numbers}
          <button class="page-btn" data-page="${page + 1}"${page === pageCount - 1 ? ' disabled' : ''}>next →</button>
          <span class="pager-info">${list.length} repos</span>
        </div>`;
      container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const next = Number(btn.dataset.page);
          if (next >= 0 && next < pageCount && next !== page) {
            page = next;
            render();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });
    }
    render();
  }).catch(() => {
    container.innerHTML = '<p style="color:var(--text-dim);">Failed to load repos.</p>';
  });
}
