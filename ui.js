(() => {
  const host = document.getElementById('notice-host');
  function toast(message, kind = 'info') {
    if (!host) return;
    const notice = document.createElement('div'); notice.className = `toast toast-${kind}`; notice.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    const mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); mark.setAttribute('viewBox', '0 0 24 24'); mark.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', kind === 'error' ? 'M12 3 22 21H2L12 3Zm0 6v5m0 3v.1' : 'm5 12 4 4L19 6'); mark.append(path);
    const text = document.createElement('span'); text.textContent = message; notice.append(mark, text); host.append(notice);
    requestAnimationFrame(() => notice.classList.add('is-visible'));
    window.setTimeout(() => { notice.classList.remove('is-visible'); window.setTimeout(() => notice.remove(), 280); }, 3600);
  }
  window.DearlyUI = { toast };
})();