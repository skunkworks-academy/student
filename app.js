(() => {
  const titles = {
    dashboard: 'Your dashboard',
    learning: 'My learning',
    classes: 'Classes',
    achievements: 'Achievements',
    resources: 'Resources',
    messages: 'Messages',
    companion: 'AI Companion',
    profile: 'Profile & settings'
  };

  const navButtons = [...document.querySelectorAll('[data-view]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const title = document.getElementById('viewTitle');

  function showView(view) {
    navButtons.forEach((button) => {
      const active = button.dataset.view === view;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === view));
    if (title) title.textContent = titles[view] || 'Student workspace';
    window.history.replaceState(null, '', `#${view}`);
    document.getElementById('student-main')?.focus({ preventScroll: true });
  }

  navButtons.forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
  document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.go)));

  const initial = window.location.hash.replace('#', '');
  if (titles[initial]) showView(initial);

  const search = document.getElementById('courseSearch');
  const cards = [...document.querySelectorAll('#courseGrid [data-search]')];
  const count = document.getElementById('courseCount');
  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const matches = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    if (count) count.textContent = `${visible} course${visible === 1 ? '' : 's'}`;
    if (document.querySelector('[data-panel="learning"]')?.classList.contains('active') === false && query) showView('learning');
  });

  const messageCopy = {
    class: ['Today', 'New class added: Cloud foundations', 'A Cloud foundations study group is available this Thursday at 18:00. Reserve your place from the Portal.'],
    plan: ['Yesterday', 'Your learning plan is ready', 'Start with one priority pathway, choose a weekly learning target, and use the Academy labs to turn concepts into evidence of capability.'],
    welcome: ['2 days ago', 'Welcome to Skunkworks Academy', 'Your student workspace brings learning, live classes, resources, achievements and support into one focused experience.']
  };
  const detail = document.getElementById('messageDetail');
  document.querySelectorAll('[data-message]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-message]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const [meta, heading, body] = messageCopy[button.dataset.message];
      detail.innerHTML = `<p class="student-kicker">${meta}</p><h2>${heading}</h2><p>${body}</p>`;
    });
  });

  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatLog = document.getElementById('chatLog');
  function sendPrompt(value) {
    const prompt = String(value || '').trim();
    if (!prompt) return;
    chatLog.insertAdjacentHTML('beforeend', `<div class="student-chat-message mine"><strong>You</strong><p>${prompt.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p></div>`);
    chatLog.insertAdjacentHTML('beforeend', '<div class="student-chat-message"><strong>Skunkie</strong><p>This public landing experience is a preview. Sign in to the Academy Portal for personalised learning context and authenticated AI assistance.</p></div>');
    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = '';
  }
  chatForm?.addEventListener('submit', (event) => { event.preventDefault(); sendPrompt(chatInput.value); });
  document.querySelectorAll('.student-prompt-suggestions button').forEach((button) => button.addEventListener('click', () => sendPrompt(button.textContent)));
})();