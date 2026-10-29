(() => {
  const form = document.querySelector('#card-form');
  const fields = ['recipient', 'sender', 'headline', 'message', 'photo'];
  const state = { theme: 'rose', occasion: 'appreciation' };
  const $ = (selector) => document.querySelector(selector);
  const val = (id) => document.getElementById(id).value.trim();
  const occasionCopy = {
    appreciation: ['A LITTLE NOTE FOR YOU', 'flower'], birthday: ['A LITTLE BIRTHDAY MAGIC', 'sparkle'],
    love: ['A LITTLE LOVE NOTE', 'heart'], congratulations: ['A LITTLE NOTE TO CELEBRATE', 'star']
  };
  function setFavicon(theme) {
    const colors = { rose: '#c55763', sunset: '#d26037', midnight: '#66745e', pastel: '#8c6bb0', matcha: '#5e8064', blue: '#3c64a0' };
    const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="20" fill="${colors[theme]}"/><path d="M32 47S13 36 17 24c3-9 14-8 15 1 2-9 13-10 16-1 4 12-16 23-16 23Z" fill="none" stroke="#fff6eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    document.querySelector('link[rel="icon"]').href = `data:image/svg+xml,${encodeURIComponent(mark)}`;
  }
  function updatePreview() {
    const recipient = val('recipient') || 'Someone lovely';
    $('#preview-recipient').textContent = recipient.toLocaleUpperCase();
    $('#preview-sender').textContent = val('sender') || 'You';
    $('#preview-headline').textContent = val('headline') || 'A little something, just for you.';
    $('#preview-message').textContent = (val('message') || 'A few honest words, made just for them.').slice(0, 190);
    $('#preview').dataset.theme = state.theme;
    setFavicon(state.theme);
    $('#preview-kicker').textContent = occasionCopy[state.occasion][0];
    $('#preview-flower').dataset.mark = occasionCopy[state.occasion][1];
    document.getElementById('message').value.length;
    $('#char-count').textContent = `${document.getElementById('message').value.length} / 900`;
    const photo = val('photo'), photoWrap = $('#preview-photo'), image = $('#preview-photo-image');
    if (photo) { photoWrap.hidden = false; image.classList.remove('loaded'); photoWrap.classList.remove('image-loaded'); image.onload = () => { image.classList.add('loaded'); photoWrap.classList.add('image-loaded'); }; image.src = photo; image.onerror = () => { photoWrap.hidden = true; DearlyUI.toast('That photo could not be loaded. Check the public image URL.', 'error'); }; }
    else { photoWrap.hidden = true; image.removeAttribute('src'); }
  }
  fields.forEach((id) => document.getElementById(id).addEventListener('input', updatePreview));
  document.querySelectorAll('.theme-option').forEach((button) => button.addEventListener('click', () => {
    state.theme = button.dataset.theme; document.querySelectorAll('.theme-option').forEach((item) => item.classList.toggle('active', item === button)); updatePreview();
  }));
  document.querySelectorAll('.occasion-option').forEach((button) => button.addEventListener('click', () => {
    state.occasion = button.dataset.occasion; document.getElementById('occasion').value = state.occasion;
    document.querySelectorAll('.occasion-option').forEach((item) => item.classList.toggle('active', item === button)); updatePreview();
  }));
  function encodeData(data) { const bytes = new TextEncoder().encode(JSON.stringify(data)); let binary = ''; bytes.forEach((byte) => binary += String.fromCharCode(byte)); return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); }
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const data = { version: 2, recipient: val('recipient'), sender: val('sender'), headline: val('headline'), message: val('message'), photo: val('photo'), occasion: state.occasion, theme: state.theme };
    const encoded = encodeData(data), viewUrl = new URL('view.html', window.location.href); viewUrl.hash = `card=${encodeURIComponent(encoded)}`;
    $('#share-link').value = viewUrl.href; $('#open-link').href = viewUrl.href; $('#share-result').hidden = false;
    $('#share-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); DearlyUI.toast('Your share link is ready.', 'success');
  });
  $('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#share-link').value); DearlyUI.toast('Link copied. Send it to them.', 'success'); }
    catch { $('#share-link').focus(); $('#share-link').select(); const copied = document.execCommand('copy'); DearlyUI.toast(copied ? 'Link copied. Send it to them.' : 'Select the link above, then copy it.', copied ? 'success' : 'error'); }
  });
  updatePreview();
})();