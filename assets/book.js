/* Row 306 (2026-11-18): "Book online" opens Spartan's Housecall Pro scheduler in place, through Housecall Pro's own
   widget (online-booking.housecallpro.com/script.js, token + org from Spartan's public booking link). The widget is
   loaded on the first click only, so it costs nothing on page load. Every Book online control links to
   /contact/?booking, so without JavaScript the visitor still lands on our contact page. If the widget script fails,
   the visitor goes to the same scheduler page directly. */
(function () {
  var W = 'https://online-booking.housecallpro.com/script.js?token=0115e4b58291472bbae6ff0287a48943&orgName=Spartan-Roofing';
  var FALLBACK = 'https://book.housecallpro.com/book/Spartan-Roofing/0115e4b58291472bbae6ff0287a48943?v2=true';
  var asked = false, loading = false;
  function open() {
    if (window.HCPWidget) { window.HCPWidget.openModal(); return; }
    asked = true;
    if (loading) return;
    loading = true;
    var s = document.createElement('script');
    s.src = W; s.async = true;
    s.onload = function () { if (asked && window.HCPWidget) window.HCPWidget.openModal(); };
    s.onerror = function () { location.href = FALLBACK; };
    document.head.appendChild(s);
  }
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-book]') : null;
    if (!b) return;
    e.preventDefault();
    if (window.gtag) gtag('event', 'book_online_click', { page_path: location.pathname });
    open();
  });
  if (/[?&]booking(=|&|$)/.test(location.search)) open();
})();
