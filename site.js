/* Draft Season store pages: language switch (en, tr) and support e-mail from config.json.
 * No cookies, no local storage, no external requests. */
(function () {
  var LANGS = ['en', 'tr'];
  var root = document.documentElement;
  var base = root.getAttribute('data-root') || './';
  var qMatch = /[?&]lang=([\w-]+)/.exec(window.location.search);
  var qLang = qMatch ? qMatch[1] : null;
  var nav = (navigator.language || '').toLowerCase();
  var lang = (qLang && LANGS.indexOf(qLang) >= 0) ? qLang : (nav.indexOf('tr') === 0 ? 'tr' : 'en');
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang);
  var title = document.querySelector('meta[name="title-' + lang + '"]');
  if (title) document.title = title.getAttribute('content');
  var inner = document.querySelectorAll('a[href]');
  for (var k = 0; k < inner.length; k++) {
    var h = inner[k].getAttribute('href');
    if (!/^(#|[a-z]+:|\/\/|\?)/i.test(h) && h.indexOf('?') < 0) inner[k].setAttribute('href', h + '?lang=' + lang);
  }
  var links = document.querySelectorAll('.langs a');
  for (var i = 0; i < links.length; i++) links[i].setAttribute('aria-current', links[i].getAttribute('hreflang') === lang ? 'true' : 'false');

  function fill(email) {
    var nodes = document.querySelectorAll('[data-email]');
    for (var j = 0; j < nodes.length; j++) {
      var n = nodes[j];
      var subject = n.getAttribute('data-email');
      n.textContent = email;
      if (n.tagName === 'A') n.setAttribute('href', 'mailto:' + email + (subject ? '?subject=' + encodeURIComponent(subject) : ''));
    }
  }
  if (!window.fetch) return;
  fetch(base + 'config.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (c) {
      var email = c && typeof c.supportEmail === 'string' ? c.supportEmail.trim() : '';
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fill(email);
    })
    .catch(function () {});
})();
