/* =========================================================
   HERO BACKGROUND: "Anomalous matter" - a glowing wireframe sphere that breathes with
   noise and is lit by the pointer. Plain WebGL2 (no libraries, no CDN).

   Based on the AnomalousMatterHero / GenerativeArtScene component (Three.js version),
   rewritten in vanilla JavaScript so it works in this plain HTML site.
   Fixes compared with the original code: the light uniform name did not match
   (the light never worked), and "hsl(var(--sky-300))" is not a valid colour for THREE.Color.

   Change the look in OPTIONS below.
   ========================================================= */
(function () {
    'use strict';

    var OPTIONS = {
        color: [0.94, 0.94, 0.95],      // white (soft)
        detail: 64,                      // wireframe density (original: 64)
        radius: 1.2,
        noiseScale: 2.0,
        noiseAmount: 0.2,
        noiseSpeed: 0.0003,              // per millisecond
        spinY: 0.0005,                   // per frame at 60fps
        spinX: 0.0002
    };

    var host = document.getElementById('hero-sculpture');
    if (!host) return;

    /* ---------- shaders ---------- */
    var VERT = `#version 300 es
precision highp float;
in vec3 position;
uniform float time;
uniform mat4 uModel;
uniform mat4 uViewProj;
uniform float uNoiseScale;
uniform float uNoiseAmount;
out vec3 vNormal;
out vec3 vWorld;

// Perlin Noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
const vec2 C = vec2(1.0/6.0, 1.0/3.0);
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
vec3 i = floor(v + dot(v, C.yyy));
vec3 x0 = v - i + dot(i, C.xxx);
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min(g.xyz, l.zxy);
vec3 i2 = max(g.xyz, l.zxy);
vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy;
vec3 x3 = x0 - D.yyy;
i = mod289(i);
vec4 p = permute(permute(permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0))
+ i.x + vec4(0.0, i1.x, i2.x, 1.0));
float n_ = 0.142857142857;
vec3 ns = n_ * D.wyz - D.xzx;
vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_);
vec4 x = x_ * ns.x + ns.yyyy;
vec4 y = y_ * ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);
vec4 b0 = vec4(x.xy, y.xy);
vec4 b1 = vec4(x.zw, y.zw);
vec4 s0 = floor(b0) * 2.0 + 1.0;
vec4 s1 = floor(b1) * 2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));
vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
vec3 p0 = vec3(a0.xy, h.x);
vec3 p1 = vec3(a0.zw, h.y);
vec3 p2 = vec3(a1.xy, h.z);
vec3 p3 = vec3(a1.zw, h.w);
vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
m = m * m;
return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
    vec3 normal = normalize(position);
    float displacement = snoise(position * uNoiseScale + time * 0.5) * uNoiseAmount;
    vec3 newPosition = position + normal * displacement;
    vec4 world = uModel * vec4(newPosition, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(uModel) * normal);
    gl_Position = uViewProj * world;
}`;

    var FRAG = `#version 300 es
precision highp float;
uniform vec3 color;
uniform vec3 pointLightPosition;
uniform vec3 uCamera;
in vec3 vNormal;
in vec3 vWorld;
out vec4 outColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(pointLightPosition - vWorld);
    float diffuse = max(dot(normal, lightDir), 0.0);

    // Fresnel effect for the glow
    vec3 viewDir = normalize(uCamera - vWorld);
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.0);

    vec3 finalColor = color * (0.16 + diffuse) + color * fresnel * 0.5;
    outColor = vec4(finalColor, 1.0);
}`;

    /* ---------- tiny matrix helpers (column-major) ---------- */
    function mul(a, b) {
        var o = new Float32Array(16);
        for (var c = 0; c < 4; c++) {
            for (var r = 0; r < 4; r++) {
                var s = 0;
                for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
                o[c * 4 + r] = s;
            }
        }
        return o;
    }
    function perspective(fovDeg, aspect, near, far) {
        var f = 1 / Math.tan(fovDeg * Math.PI / 360), nf = 1 / (near - far);
        return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
    }
    function translate(x, y, z) { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]); }
    function scale(s) { return new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]); }
    function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); }
    function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); }

    /* ---------- icosphere wireframe (indices for gl.LINES) ---------- */
    function buildMesh(n, radius) {
        var t = (1 + Math.sqrt(5)) / 2;
        var V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
        var F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
                 [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
        var perFace = (n + 1) * (n + 2) / 2;
        var pos = new Float32Array(F.length * perFace * 3);
        var edges = [];
        var p = 0;
        for (var f = 0; f < F.length; f++) {
            var A = V[F[f][0]], B = V[F[f][1]], C = V[F[f][2]];
            var base = f * perFace;
            var idx = {};
            var k = 0;
            for (var i = 0; i <= n; i++) {
                for (var j = 0; j <= n - i; j++) {
                    var wa = n - i - j, x = A[0] * wa + B[0] * i + C[0] * j, y = A[1] * wa + B[1] * i + C[1] * j, z = A[2] * wa + B[2] * i + C[2] * j;
                    var len = Math.sqrt(x * x + y * y + z * z) / radius;
                    pos[p++] = x / len; pos[p++] = y / len; pos[p++] = z / len;
                    idx[i * (n + 1) + j] = base + k++;
                }
            }
            for (var a = 0; a <= n; a++) {
                for (var b = 0; b <= n - a; b++) {
                    var cur = idx[a * (n + 1) + b];
                    if (a + b + 1 <= n) {
                        edges.push(cur, idx[a * (n + 1) + b + 1]);
                        edges.push(cur, idx[(a + 1) * (n + 1) + b]);
                        edges.push(idx[(a + 1) * (n + 1) + b], idx[a * (n + 1) + b + 1]);
                    }
                }
            }
        }
        return { positions: pos, indices: new Uint32Array(edges) };
    }

    /* ---------- setup ---------- */
    var canvas = document.createElement('canvas');
    canvas.className = 'matter-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    var gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) { host.classList.add('matter-off'); return; }

    function compile(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
    }

    var program, loc = {}, vao, count;
    try {
        program = gl.createProgram();
        gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.bindAttribLocation(program, 0, 'position');
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    } catch (e) {
        if (window.console) console.error('Hero background:', e);
        host.classList.add('matter-off');
        return;
    }
    ['time', 'uModel', 'uViewProj', 'uNoiseScale', 'uNoiseAmount', 'color', 'pointLightPosition', 'uCamera'].forEach(function (name) {
        loc[name] = gl.getUniformLocation(program, name);
    });

    var mesh = buildMesh(OPTIONS.detail, OPTIONS.radius);
    count = mesh.indices.length;
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    /* ---------- state ---------- */
    var CAM_Z = 3, FOV = 75, NEAR = 0.1, FAR = 1000;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w = 1, h = 1, aspect = 1, halfH = CAM_Z * Math.tan(FOV * Math.PI / 360);
    var offsetX = 0, offsetY = 0, meshScale = 1;
    var rotYa = 0, rotXa = 0;
    var light = [0, 0, 2.6];
    var lightTarget = [0, 0, 2.6];
    var raf = 0, running = false, tabVisible = true, scrolledAway = false, shown = false;

    function resize() {
        var r = host.getBoundingClientRect();
        w = Math.max(1, Math.round(r.width));
        h = Math.max(1, Math.round(r.height));
        aspect = w / h;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var cw = Math.round(w * dpr), ch = Math.round(h * dpr);
        if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
        gl.viewport(0, 0, canvas.width, canvas.height);

        var halfW = halfH * aspect;
        if (aspect > 1.1) {
            // desktop / landscape: sphere on the right, text on the left
            meshScale = Math.min(1.1, (halfH * 0.85) / OPTIONS.radius);
            offsetX = Math.min(halfW * 0.34, 2.0);
            offsetY = 0;
        } else {
            // phones / portrait: sphere centred in the upper area, sized to the width
            meshScale = Math.min(1, (halfW * 0.86) / OPTIONS.radius, (halfH * 0.86) / OPTIONS.radius);
            offsetX = 0;
            offsetY = 0;
        }
        if (!running) draw(performance.now());
    }

    function draw(now) {
        var proj = perspective(FOV, aspect, NEAR, FAR);
        var view = translate(0, 0, -CAM_Z);
        var model = mul(translate(offsetX, offsetY, 0), mul(rotY(rotYa), mul(rotX(rotXa), scale(meshScale))));

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(loc.time, reduced ? 0 : now * OPTIONS.noiseSpeed);
        gl.uniformMatrix4fv(loc.uModel, false, model);
        gl.uniformMatrix4fv(loc.uViewProj, false, mul(proj, view));
        gl.uniform1f(loc.uNoiseScale, OPTIONS.noiseScale);
        gl.uniform1f(loc.uNoiseAmount, OPTIONS.noiseAmount);
        gl.uniform3fv(loc.color, OPTIONS.color);
        gl.uniform3fv(loc.pointLightPosition, light);
        gl.uniform3f(loc.uCamera, 0, 0, CAM_Z);
        gl.bindVertexArray(vao);
        gl.drawElements(gl.LINES, count, gl.UNSIGNED_INT, 0);

        if (!shown) { shown = true; host.classList.add('matter-ready'); }
    }

    var last = 0;
    function frame(now) {
        raf = 0;
        if (!running) return;
        var dt = last ? Math.min(3, (now - last) / 16.667) : 1;
        last = now;
        if (!reduced) {
            rotYa += OPTIONS.spinY * dt;
            rotXa += OPTIONS.spinX * dt;
        }
        light[0] += (lightTarget[0] - light[0]) * 0.12;
        light[1] += (lightTarget[1] - light[1]) * 0.12;
        draw(now);
        raf = requestAnimationFrame(frame);
    }

    function updateRunning() {
        var should = tabVisible && !scrolledAway && !reduced;
        if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
        else if (!should && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    }

    /* ---------- pointer: moves the light ---------- */
    function onPointer(e) {
        var x = (e.clientX / window.innerWidth) * 2 - 1;
        var y = -(e.clientY / window.innerHeight) * 2 + 1;
        lightTarget[0] = x * halfH * Math.max(aspect, 1);
        lightTarget[1] = y * halfH;
        if (reduced && !running) { light[0] = lightTarget[0]; light[1] = lightTarget[1]; draw(performance.now()); }
    }
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });

    /* ---------- scroll: blur/dim the sculpture (CSS reads --sc-p), pause when hidden ---------- */
    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;
            var p = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
            host.style.setProperty('--sc-p', p.toFixed(3));
            var away = p >= 1;
            if (away !== scrolledAway) { scrolledAway = away; updateRunning(); }
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    document.addEventListener('visibilitychange', function () {
        tabVisible = !document.hidden;
        updateRunning();
    });

    if (window.ResizeObserver) new ResizeObserver(resize).observe(host);
    window.addEventListener('resize', resize);

    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); running = false; host.classList.add('matter-off'); });

    resize();
    draw(performance.now());
    updateRunning();
})();
