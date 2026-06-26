(function () {
  var API_URL = 'https://v1.hitokoto.cn/?c=b';
  var TYPED_URL = 'https://cdn.jsdelivr.net/npm/typed.js@3.0.0/dist/typed.umd.min.js';
  var FALLBACK = {
    hitokoto: '我和你，可以做朋友吗？',
    from: '声の形'
  };

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (typeof window.Typed === 'function') {
        resolve();
        return;
      }

      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function fetchHitokoto() {
    return fetch(API_URL)
      .then(function (response) {
        if (!response.ok) throw new Error('Hitokoto request failed');
        return response.json();
      })
      .then(function (data) {
        return {
          hitokoto: data.hitokoto || FALLBACK.hitokoto,
          from: data.from || FALLBACK.from
        };
      })
      .catch(function () {
        return FALLBACK;
      });
  }

  function startTyped(data) {
    var subtitle = document.getElementById('subtitle');
    if (!subtitle || typeof window.Typed !== 'function') return;

    if (window.typed && typeof window.typed.destroy === 'function') {
      window.typed.destroy();
    }

    subtitle.textContent = '';
    window.typed = new window.Typed('#subtitle', {
      strings: [data.hitokoto, '出自 ' + data.from],
      startDelay: 300,
      typeSpeed: 120,
      backSpeed: 45,
      backDelay: 1800,
      loop: true
    });
  }

  function initHitokotoTyped() {
    if (!document.getElementById('subtitle')) return;

    Promise.all([loadScript(TYPED_URL), fetchHitokoto()])
      .then(function (result) {
        startTyped(result[1]);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHitokotoTyped, { once: true });
  } else {
    initHitokotoTyped();
  }
})();
