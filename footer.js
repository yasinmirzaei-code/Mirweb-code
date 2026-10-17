/* =========================================================
   FOOTER halftone wordmark (plain JavaScript version of HalftoneWordmarkFooter)
   The word is set huge, cropped by the bottom edge, and printed as dots whose size
   follows how much of the letter covers each cell. The pointer pushes dots away
   (they warm in colour); a click sends a shock ring through the word.
   Change the word, dot size or colours in OPTIONS below.
   ========================================================= */
(function () {
    'use strict';

    var OPTIONS = {
        word: 'MIRWEB',
        dotGap: 6,          // distance between dot centres (px); phones use a finer 4
        radius: 80,         // how far the pointer pushes (px)
        crop: 0.2,          // how much of the letters hangs below the bottom edge (0 - 0.6)
        grain: 0.5,         // print grain (0 - 1)
        fontFamily: '"Syne", "Inter Tight", "Inter", "Helvetica Neue", Arial, sans-serif',
        fontWeight: 800,
        background: '#060606',
        ink: '#e9e4da',
        warm: '#5DCAA5'
    };

    function hex(h) {
        var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((h || '').trim());
        if (!m) return null;
        var s = m[1].length === 3 ? m[1].split('').map(function (c) { return c + c; }).join('') : m[1];
        return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    }
    function dotRadius(cov, gap) { var c = cov < 0 ? 0 : cov > 1 ? 1 : cov; return Math.sqrt(c) * gap * 0.56; }
    function step(x, y, vx, vy, hx, hy, px, py, r) {
        var dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
        if (r > 0 && d2 < r * r) {
            var d = Math.sqrt(d2) + 0.001, f = (1 - d / r) * 2.6;
            vx += (dx / d) * f; vy += (dy / d) * f;
        }
        vx = (vx + (hx - x) * 0.05) * 0.84;
        vy = (vy + (hy - y) * 0.05) * 0.84;
        return [x + vx, y + vy, vx, vy];
    }
    function warmth(x, y, hx, hy, span) { var d = Math.hypot(x - hx, y - hy); return span > 0 ? Math.min(1, d / span) : 0; }
    function fitSize(measured, width) { return measured > 0 ? (width / measured) * 100 : 0; }

    function init() {
        var root = document.getElementById('site-footer');
        if (!root) return;
        var canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        root.insertBefore(canvas, root.firstChild);
        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        root.style.setProperty('--hwf-bg', OPTIONS.background);
        root.style.setProperty('--hwf-ink', OPTIONS.ink);

        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var w = 0, h = 0, dpr = 1, px = -1e5, py = -1e5, raf = 0, visible = true, awake = true;
        var ring = { x: 0, y: 0, t: -1 };
        var dots = new Float32Array(0), count = 0, grainTile = null;
        var ink = hex(OPTIONS.ink) || [233, 228, 218];
        var warm = hex(OPTIONS.warm) || [93, 202, 165];

        function layout() {
            var rect = root.getBoundingClientRect();
            w = Math.max(1, Math.round(rect.width));
            h = Math.max(1, Math.round(rect.height));
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);

            var mask = document.createElement('canvas');
            mask.width = w; mask.height = h;
            var m = mask.getContext('2d', { willReadFrequently: true });
            if (!m) return;
            m.font = OPTIONS.fontWeight + ' 100px ' + OPTIONS.fontFamily;
            var word = OPTIONS.word || ' ';
            var fit = fitSize(m.measureText(word).width, w * 0.97);
            m.font = OPTIONS.fontWeight + ' ' + fit + 'px ' + OPTIONS.fontFamily;
            var box = m.measureText(word);
            var cap = box.actualBoundingBoxAscent || fit * 0.72;
            var c = Math.max(0, Math.min(0.6, OPTIONS.crop));
            m.fillStyle = '#000';
            m.textBaseline = 'alphabetic';
            m.fillText(word, (w - box.width) / 2, h + cap * c);
            var img = m.getImageData(0, 0, w, h).data;

            var gap = Math.max(3, w < 720 ? 4 : OPTIONS.dotGap);
            var cols = Math.ceil(w / gap), rows = Math.ceil(h / gap), tmp = [];
            for (var gy = 0; gy < rows; gy++) {
                for (var gx = 0; gx < cols; gx++) {
                    var sum = 0;
                    for (var sy = 0; sy < 3; sy++) {
                        for (var sx = 0; sx < 3; sx++) {
                            var x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
                            var y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
                            sum += img[(y * w + x) * 4 + 3];
                        }
                    }
                    var cov = sum / (9 * 255);
                    if (cov < 0.06) continue;
                    var hx = gx * gap + gap / 2, hy = gy * gap + gap / 2;
                    tmp.push(hx, hy, 0, 0, hx, hy, dotRadius(cov, gap));
                }
            }
            dots = new Float32Array(tmp);
            count = tmp.length / 7;

            grainTile = document.createElement('canvas');
            grainTile.width = 256; grainTile.height = 256;
            var g = grainTile.getContext('2d');
            if (g) {
                var id = g.createImageData(256, 256);
                for (var i = 0; i < id.data.length; i += 4) {
                    var v = Math.random() * 255;
                    id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
                    id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
                }
                g.putImageData(id, 0, 0);
            }
            awake = true;
        }

        function draw(now) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.fillStyle = OPTIONS.background;
            ctx.fillRect(0, 0, w, h);
            var r = !reduced ? Math.max(0, OPTIONS.radius) : 0;
            var ringAge = ring.t < 0 ? 1e9 : now - ring.t, ringR = ringAge * 0.9, moving = false;

            for (var i = 0; i < count; i++) {
                var j = i * 7, x = dots[j], y = dots[j + 1], vx = dots[j + 2], vy = dots[j + 3];
                var hx = dots[j + 4], hy = dots[j + 5];
                if (!reduced) {
                    if (ringAge < 900) {
                        var dx = hx - ring.x, dy = hy - ring.y, d = Math.sqrt(dx * dx + dy * dy) + 0.001;
                        var band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
                        if (band > 0) {
                            var f = band * 3.2 * (1 - ringAge / 900);
                            vx += (dx / d) * f; vy += (dy / d) * f;
                        }
                    }
                    var s = step(x, y, vx, vy, hx, hy, px, py, r);
                    x = s[0]; y = s[1]; vx = s[2]; vy = s[3];
                    if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true;
                    else { x = hx; y = hy; vx = 0; vy = 0; }
                    dots[j] = x; dots[j + 1] = y; dots[j + 2] = vx; dots[j + 3] = vy;
                }
                var k = warmth(x, y, hx, hy, 28);
                ctx.fillStyle = k > 0.02
                    ? 'rgb(' + Math.round(ink[0] + (warm[0] - ink[0]) * k) + ',' + Math.round(ink[1] + (warm[1] - ink[1]) * k) + ',' + Math.round(ink[2] + (warm[2] - ink[2]) * k) + ')'
                    : OPTIONS.ink;
                ctx.beginPath();
                ctx.arc(x, y, dots[j + 6], 0, 6.2832);
                ctx.fill();
            }

            if (grainTile && OPTIONS.grain > 0) {
                ctx.globalAlpha = Math.min(1, OPTIONS.grain) * 0.09;
                ctx.globalCompositeOperation = 'overlay';
                var pattern = ctx.createPattern(grainTile, 'repeat');
                if (pattern) { ctx.fillStyle = pattern; ctx.fillRect(0, 0, w, h); }
                ctx.globalAlpha = 1;
                ctx.globalCompositeOperation = 'source-over';
            }
            awake = moving || ringAge < 900 || px > -1e4;   // sleep when everything is home
        }

        function loop(now) {
            raf = 0;
            if (!visible) return;
            draw(now);
            if (awake) raf = requestAnimationFrame(loop);
        }
        function wake() { awake = true; if (!raf && visible) raf = requestAnimationFrame(loop); }

        function local(e) { var b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
        root.addEventListener('pointermove', function (e) { var p = local(e); px = p[0]; py = p[1]; wake(); });
        root.addEventListener('pointerleave', function () { px = -1e5; py = -1e5; wake(); });
        root.addEventListener('pointerdown', function (e) {
            if (reduced || (e.target.closest && e.target.closest('a,button'))) return;
            var p = local(e);
            ring = { x: p[0], y: p[1], t: performance.now() };
            wake();
        });

        layout();
        draw(performance.now());
        wake();

        new ResizeObserver(function () { layout(); wake(); }).observe(root);
        new IntersectionObserver(function (entries) {
            visible = entries[0] ? entries[0].isIntersecting : true;
            if (visible) wake();
        }).observe(root);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); wake(); });

        var up = document.getElementById('hwf-up');
        if (up) up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
