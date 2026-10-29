(() => {
  const $ = (selector) => document.querySelector(selector);
  const validThemes = ['rose', 'sunset', 'midnight', 'pastel', 'matcha', 'blue'];
  const validOccasions = ['appreciation', 'birthday', 'love', 'congratulations'];
  const occasionCopy = {
    appreciation: { kicker: 'A LITTLE TRIBUTE, MADE JUST FOR YOU', welcome: 'A LITTLE SURPRISE, MADE WITH LOVE', end: 'You are appreciated more than words can say.' },
    birthday: { kicker: 'A LITTLE CELEBRATION, JUST FOR YOU', welcome: 'A LITTLE BIRTHDAY SURPRISE', end: 'May this next trip around the sun bring you beautiful things.' },
    love: { kicker: 'A LITTLE LOVE NOTE, JUST FOR YOU', welcome: 'A LITTLE SURPRISE FROM MY HEART', end: 'You have a way of making every day feel more like home.' },
    congratulations: { kicker: 'A LITTLE NOTE FOR A BIG MOMENT', welcome: 'A LITTLE SOMETHING TO CELEBRATE', end: 'This is your moment. I hope you let yourself enjoy every bit of it.' }
  };
  function decodeCard() {
    const raw = new URLSearchParams(window.location.hash.slice(1)).get('card');
    if (!raw || raw.length > 12000) throw new Error('Missing or oversized card data');
    const normalized = decodeURIComponent(raw).replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    ['recipient', 'sender', 'headline', 'message'].forEach((key) => { if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`Missing ${key}`); });
    if (!validThemes.includes(data.theme) || !validOccasions.includes(data.occasion)) throw new Error('Invalid design choice');
    if (data.photo && (typeof data.photo !== 'string' || !/^https?:\/\//i.test(data.photo))) data.photo = '';
    return { recipient: data.recipient.slice(0, 48), sender: data.sender.slice(0, 48), headline: data.headline.slice(0, 90), message: data.message.slice(0, 900), photo: data.photo || '', theme: data.theme, occasion: data.occasion };
  }
  const setText = (selector, value) => { $(selector).textContent = value; };
  function render(data) {
    document.body.dataset.theme = data.theme;
    const iconColors = { rose: '#c55763', sunset: '#d26037', midnight: '#66745e', pastel: '#8c6bb0', matcha: '#5e8064', blue: '#3c64a0' };
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="20" fill="${iconColors[data.theme]}"/><path d="M32 47S13 36 17 24c3-9 14-8 15 1 2-9 13-10 16-1 4 12-16 23-16 23Z" fill="#fff6eb"/></svg>`;
    document.querySelector('link[rel="icon"]').href = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`;
    const copy = occasionCopy[data.occasion];
    setText('#welcome-name', data.recipient.toLocaleUpperCase()); setText('#welcome-sender', data.sender); setText('#welcome-kicker', copy.welcome); setText('#hero-kicker', copy.kicker); setText('#hero-name', data.recipient.toLocaleUpperCase()); setText('#hero-headline', data.headline);
    setText('#hero-desc', data.message.split(/[.!?](?:\s|$)/)[0].trim() + '.'); setText('#letter-title', data.occasion === 'birthday' ? 'A whole day to celebrate you.' : data.occasion === 'congratulations' ? 'You did a beautiful thing.' : 'You deserve to hear this.');
    setText('#letter-dear', `Dear ${data.recipient},`); setText('#letter-copy', data.message); setText('#letter-sender', data.sender); setText('#final-title', `One last thing, ${data.recipient}.`); setText('#final-copy', copy.end); setText('#last-message', `${data.headline}\n\n${data.message}`); setText('#final-sender', data.sender);
    if (data.photo) {
      const hero = $('#hero-photo-img'), keepsake = $('#keepsake-img'); $('#hero-photo').hidden = false; $('#keepsake').hidden = false;
      setText('#keepsake-note', `${data.recipient}, some moments are worth keeping close. This one is yours, with love from ${data.sender}.`);
      [hero, keepsake].forEach((image) => { image.onload = () => { image.classList.add('loaded'); image.closest('.hero-photo, .keepsake-photo').classList.add('image-loaded'); }; image.onerror = () => { image.closest('.hero-photo, .keepsake-photo').classList.add('photo-failed'); DearlyUI.toast('This shared photo could not be loaded. The rest of the card is still here.', 'error'); }; image.src = data.photo; });
    }
    $('#open-surprise').addEventListener('click', () => { $('#open-screen').classList.add('opening'); window.setTimeout(() => { $('#open-screen').hidden = true; $('#personal-site').hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); observeSections(); }, 350); });
    $('#last-message-button').addEventListener('click', () => { $('#last-message-button').hidden = true; $('#last-message').hidden = false; });
  }
  function observeSections() {
    const sections = document.querySelectorAll('.reveal-section');
    if (!('IntersectionObserver' in window)) { sections.forEach((section) => section.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.13 });
    sections.forEach((section) => observer.observe(section));
  }
  // Keep the themed placeholder visible for one paint before decoding the local hash.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    try { render(decodeCard()); } catch { $('#open-screen').hidden = true; $('#broken-modal').hidden = false; $('#broken-modal .open-button').focus(); }
    window.setTimeout(() => { $('#decode-skeleton').classList.add('is-leaving'); window.setTimeout(() => { $('#decode-skeleton').hidden = true; }, 280); }, 320);
  }));
})();