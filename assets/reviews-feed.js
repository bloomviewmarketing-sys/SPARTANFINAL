/* Spartan Roofing live Google review feed (row 312, Jeff 2026-11-17 "Our own free build").
   Reads https://bloomviewgrowth.com/feeds/spartan-reviews.json (refreshed daily on Bloomview's Hostinger from
   DataForSEO, ~/spartan-reviews-feed/refresh.php). Shows the 3 newest written reviews as written, with the
   source and date. Static selected reviews above stay as the fallback. No Review schema on purpose. */
(function () {
  var box = document.querySelector('.rev-live[data-feed]');
  if (!box || !window.fetch) return;
  var grid = box.querySelector('.rev-grid');
  var note = box.querySelector('.rev-live-note');
  var tpl = document.querySelector('.review-card .stars .star');
  var shown = {};
  document.querySelectorAll('.review-card figcaption').forEach(function (f) {
    shown[(f.firstChild && f.firstChild.textContent || '').trim()] = 1;
  });
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  function fmt(d) {
    var p = (d || '').split('-'); if (p.length < 3) return d || '';
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+p[1] - 1];
    return m + ' ' + (+p[2]) + ', ' + p[0];
  }
  fetch(box.getAttribute('data-feed'), { credentials: 'omit' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j || !j.reviews || !j.reviews.length) return;
    var list = j.reviews.filter(function (x) { return x.text && !shown[x.name]; }).slice(0, 3);
    if (!list.length) return;
    list.forEach(function (x, i) {
      var fig = el('figure', 'review-card');
      fig.setAttribute('data-review-source', 'google-live');
      fig.setAttribute('role', 'group');
      fig.setAttribute('aria-label', 'Newest Google review ' + (i + 1) + ' of ' + list.length);
      var st = el('span', 'stars');
      st.setAttribute('role', 'img');
      st.setAttribute('aria-label', x.rating + ' out of 5 stars');
      for (var k = 0; k < (x.rating || 0) && tpl; k++) st.appendChild(tpl.cloneNode(true));
      fig.appendChild(st);
      fig.appendChild(el('blockquote', '', x.text));
      var cap = el('figcaption', '', x.name);
      cap.appendChild(el('span', 'muted', ' · Google review · ' + fmt(x.date)));
      fig.appendChild(cap);
      grid.appendChild(fig);
    });
    note.textContent = 'Live from Google · updated ' + fmt((j.updated_at || '').slice(0, 10)) +
      ' · the newest written reviews, shown word for word.';
    box.hidden = false;
  }).catch(function () {});
})();
