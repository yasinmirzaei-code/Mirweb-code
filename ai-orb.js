/* =========================================================
   AI ORB: "Ask anything" pill that flies up, thinks as a dotted orb,
   then unfolds into an answer card.
   Plain JavaScript version of the MorphOrb component (no React needed).

   Hook your own AI:  window.MIRWEB_ASK = async function (question) { return 'answer text'; };
   Without it, a small built-in FAQ about this site answers.
   ========================================================= */
(function () {
    'use strict';

    /* ---------- copy (English / Persian) ---------- */
    var TEXT = {
        en: { placeholder: 'Ask anything…', labels: ['Thinking', 'Searching', 'Analyzing', 'Composing'], done: 'Done', answerTitle: 'Answer', reset: 'New question', send: 'Send', open: 'Ask AI', close: 'Close', fallback: 'The answer goes here' },
        fa: { placeholder: 'هر چیزی بپرس…', labels: ['در حال فکر کردن', 'در حال جست‌وجو', 'در حال تحلیل', 'در حال نوشتن'], done: 'انجام شد', answerTitle: 'پاسخ', reset: 'پرسش تازه', send: 'ارسال', open: 'از هوش مصنوعی بپرس', close: 'بستن', fallback: 'پاسخ اینجا نمایش داده می‌شود' }
    };
    var COPY = {};
    function isFa() { return document.documentElement.lang === 'fa'; }
    function loadCopy() { var s = TEXT[isFa() ? 'fa' : 'en']; for (var k in s) COPY[k] = s[k]; }
    loadCopy();

    /* ---------- built-in answers (only facts that are on this site) ----------
       Each topic has keywords (English + Persian). The topic with the most matching
       keywords wins; if two topics tie, both answers are joined (when short enough).
       To teach the assistant something new, add an entry below. */
    var FAQ = [
        { k: ['hello', 'hey', 'hi', 'سلام', 'درود', 'خوبی'], en: 'Hi! Ask me about the services, tools, projects, process or contact details on this site.', fa: 'سلام! درباره‌ی خدمات، ابزارها، نمونه‌کارها، روند کار یا راه‌های تماس همین سایت بپرس.' },
        { k: ['thanks', 'thank', 'bye', 'مرسی', 'ممنون', 'خداحافظ', 'سپاس'], en: "You're welcome! If you have a project in mind, the contact form is the quickest way to reach Yasin.", fa: 'خواهش می‌کنم! اگه پروژه‌ای در سر داری، فرم تماس سریع‌ترین راه برای رسیدن به یاسین است.' },
        { k: ['who are you', 'what are you', 'are you ai', 'bot', 'assistant', 'تو کی', 'ربات', 'هوش مصنوعی', 'دستیار'], en: "I'm a small assistant on this site. I answer from the information on it: services, tools, projects and how to get in touch.", fa: 'من یک دستیار کوچک همین سایتم و فقط از اطلاعات خود سایت جواب می‌دهم: خدمات، ابزارها، نمونه‌کارها و راه‌های تماس.' },
        { k: ['who is', 'yasin', 'mirzaei', 'introduce', 'about you', 'about yasin', 'یاسین', 'میرزایی', 'کیست', 'معرفی', 'درباره‌ی یاسین', 'درباره تو', 'اسمت'], en: 'Yasin Mirzaei is a web designer and developer. He builds fast, modern, good-looking websites: he starts from your goals, then shapes the design and the small animated details.', fa: 'یاسین میرزایی طراح و برنامه‌نویس وب است و سایت‌های سریع، مدرن و زیبا می‌سازد. اول هدف شما را می‌شناسد، بعد طراحی و جزئیات متحرک را می‌سازد.' },
        { k: ['service', 'offer', 'what do you do', 'design', 'develop', 'build', 'خدمات', 'طراحی', 'چه کار', 'چیکار', 'می‌سازی', 'برنامه‌نویسی'], en: 'Yasin offers web design, web development and digital experiences: fast, responsive sites with smooth animations.', fa: 'یاسین طراحی سایت، برنامه‌نویسی وب و ساخت تجربه‌های دیجیتال انجام می‌دهد؛ سایت‌های سریع و واکنش‌گرا با انیمیشن‌های نرم.' },
        { k: ['tool', 'tech', 'stack', 'wordpress', 'html', 'css', 'javascript', 'git', 'language', 'ابزار', 'تکنولوژی', 'وردپرس', 'جاوااسکریپت'], en: 'The main tools are HTML, CSS, JavaScript, WordPress and Git.', fa: 'ابزارهای اصلی: HTML، CSS، جاوااسکریپت، وردپرس و Git.' },
        { k: ['price', 'cost', 'rate', 'quote', 'budget', 'how much', 'هزینه', 'قیمت', 'تعرفه', 'بودجه', 'چقدر'], en: 'Pricing depends on the project. Describe your idea in the contact form and Yasin will reply.', fa: 'هزینه به پروژه بستگی دارد. ایده‌ات را از طریق فرم تماس بنویس تا یاسین پاسخ بدهد.' },
        { k: ['how long', 'deadline', 'delivery', 'duration', 'turnaround', 'چقدر طول', 'زمان', 'مدت', 'تحویل', 'ددلاین'], en: "Timing depends on the size of the project. Describe what you need in the contact form and Yasin will tell you what's realistic.", fa: 'زمان به بزرگی پروژه بستگی دارد. نیازت را در فرم تماس بنویس تا یاسین زمان واقعی را بگوید.' },
        { k: ['email', 'mail', 'gmail', 'ایمیل', 'جیمیل'], en: 'Email: yasinmirzaei715@gmail.com. You can copy it with the copy button in the contact section.', fa: 'ایمیل: yasinmirzaei715@gmail.com . با دکمه‌ی کپی در بخش تماس می‌توانی آن را کپی کنی.' },
        { k: ['phone', 'number', 'whatsapp', 'call', 'mobile', 'شماره', 'تلفن', 'واتس', 'تماس تلفنی', 'موبایل'], en: 'Phone and WhatsApp: +98 999 104 9494. There are WhatsApp and Telegram buttons in the contact section.', fa: 'تلفن و واتس‌اپ: \u200E+98 999 104 9494\u200E . در بخش تماس دکمه‌های واتس‌اپ و تلگرام هم هست.' },
        { k: ['telegram', 'تلگرام', 'تلگرم'], en: 'Telegram: @yasinmiirzaei (there is a Telegram button in the contact section).', fa: 'تلگرام: \u200E@yasinmiirzaei\u200E (در بخش تماس دکمه‌ی تلگرام هم هست).' },
        { k: ['contact', 'hire', 'reach', 'get in touch', 'message', 'form', 'تماس', 'ارتباط', 'استخدام', 'پیام', 'فرم'], en: 'You can reach Yasin by email (yasinmirzaei715@gmail.com), Telegram (@yasinmiirzaei), WhatsApp, or the "Let\'s talk" form in the contact section.', fa: 'می‌توانی از راه ایمیل (yasinmirzaei715@gmail.com)، تلگرام (\u200E@yasinmiirzaei\u200E)، واتس‌اپ یا فرم «شروع گفتگو» در بخش تماس با یاسین در ارتباط باشی.' },
        { k: ['available', 'availability', 'free', 'open to', 'new project', 'آزاد', 'وقت دارد', 'پذیرای', 'پروژه جدید'], en: 'Yes, Yasin is currently available for new projects.', fa: 'بله، یاسین الان پذیرای پروژه‌های تازه است.' },
        { k: ['experience', 'years', 'how many', 'تجربه', 'سابقه', 'سال'], en: 'More than 2 years of experience and 4 projects delivered so far.', fa: 'بیش از ۲ سال تجربه و ۴ پروژه‌ی تحویل‌شده.' },
        { k: ['journey', 'history', 'started', 'career', 'timeline', 'مسیر', 'شروع', 'سابقه کاری', 'تاریخچه'], en: 'Journey: 2025, started designing websites. 2025, launched the first client projects. 2026, building cinematic, detail-rich web experiences.', fa: 'مسیر کاری: ۲۰۲۵ شروع طراحی سایت. ۲۰۲۵ اولین پروژه‌های مشتری. ۲۰۲۶ ساخت سایت‌های سینمایی و پرجزئیات.' },
        { k: ['process', 'workflow', 'how do you work', 'start a project', 'steps', 'روند', 'مراحل', 'چطور کار', 'چگونه کار', 'شروع پروژه'], en: 'Yasin first learns your goals and audience, then builds the design and the small animated details. To start, send a short description through the "Let\'s talk" form.', fa: 'یاسین اول هدف و مخاطب شما را می‌شناسد، بعد طراحی و جزئیات متحرک را می‌سازد. برای شروع، یک توضیح کوتاه از طریق فرم «شروع گفتگو» بفرست.' },
        { k: ['mobile', 'responsive', 'phone screen', 'screen', 'device', 'ریسپانسیو', 'گوشی', 'واکنش‌گرا', 'صفحه'], en: 'The sites are built to look good and work well on every screen, from phones to desktops.', fa: 'سایت‌ها طوری ساخته می‌شوند که روی همه‌ی صفحه‌ها، از گوشی تا دسکتاپ، خوب دیده شوند و کار کنند.' },
        { k: ['animation', 'animated', 'motion', 'effect', 'style', 'cinematic', 'انیمیشن', 'حرکت', 'افکت', 'سینمایی', 'سبک'], en: 'Yasin likes smooth scroll animations and small animated details, which give the sites a cinematic, alive feel.', fa: 'یاسین به انیمیشن‌های نرم هنگام اسکرول و جزئیات متحرک اهمیت می‌دهد تا سایت حس سینمایی و زنده داشته باشد.' },
        { k: ['persian', 'farsi', 'english', 'translate', 'فارسی', 'انگلیسی', 'زبان'], en: 'This site is available in English and Persian. Use the EN / FA button at the top.', fa: 'این سایت انگلیسی و فارسی است. با دکمه‌ی EN / FA بالای صفحه زبان را عوض کن.' },
        { w: 2, k: ['cactus', 'کاکتوس'], en: 'Cactus Cafe (2026): a warm, modern website for a desert-themed cafe, with a menu showcase and smooth scroll animations.', fa: 'Cactus Cafe (۲۰۲۶): وب‌سایتی گرم و مدرن برای یک کافه با تم کویری، با منوی تصویری و انیمیشن‌های نرم هنگام اسکرول.' },
        { w: 2, k: ['shell', 'seaside', 'booking', 'reservation', 'رزرو', 'ساحلی'], en: 'Shell Cafe (2026): a seaside cafe website with a clean menu and a booking experience that works great on every screen.', fa: 'Shell Cafe (۲۰۲۶): سایت یک کافه ساحلی با منوی مرتب و تجربه‌ی رزرو که روی همه‌ی صفحه‌ها عالی کار می‌کند.' },
        { w: 2, k: ['nimbus', 'agency', 'corporate', 'company', 'آژانس', 'شرکتی', 'سازمانی'], en: 'Nimbus Agency (2025): a corporate website for a digital agency, with a bold, modern look and a clear structure.', fa: 'Nimbus Agency (۲۰۲۵): سایت سازمانی یک آژانس دیجیتال با ظاهری جسور و مدرن و ساختاری روشن.' },
        { w: 2, k: ['pulse', 'store', 'shop', 'ecommerce', 'e-commerce', 'checkout', 'online store', 'فروشگاه', 'خرید', 'پالس'], en: 'Pulse Store (2025): a fast online store with clean product browsing and a simple checkout flow.', fa: 'Pulse Store (۲۰۲۵): فروشگاه آنلاین سریع با مرور راحت محصولات و فرایند خرید ساده.' },
        { k: ['cafe', 'restaurant', 'menu', 'کافه', 'رستوران', 'منو'], en: 'Cafe work: Cactus Cafe (desert theme, menu showcase) and Shell Cafe (seaside, menu and booking). See them in the Portfolio section.', fa: 'نمونه‌کارهای کافه: Cactus Cafe (تم کویری و منوی تصویری) و Shell Cafe (ساحلی با منو و رزرو). در بخش نمونه‌کارها ببینشان.' },
        { k: ['portfolio', 'projects', 'your work', 'samples', 'examples', 'نمونه', 'پروژه‌ها', 'کارها'], en: 'Selected work: Cactus Cafe, Shell Cafe, Nimbus Agency and Pulse Store. Ask about any of them or see the Portfolio section.', fa: 'نمونه‌کارها: Cactus Cafe، Shell Cafe، Nimbus Agency و Pulse Store. درباره‌ی هرکدام بپرس یا بخش نمونه‌کارها را ببین.' }
    ];

    function hasKeyword(text, kw, tokens) {
        if (/^[a-z]+$/.test(kw) && kw.length <= 3) return new RegExp('(^|[^a-z])' + kw + '([^a-z]|$)').test(text);
        if (/[\u0600-\u06FF]/.test(kw) && kw.length <= 3) {
            // short Persian words must match a whole word (so "منو" does not match inside "ممنون")
            return tokens.some(function (t) { return t === kw || (t.indexOf(kw) === 0 && t.length <= kw.length + 2); });
        }
        return text.indexOf(kw) !== -1;
    }
    function localAnswer(q) {
        var fa = isFa(), text = q.toLowerCase(), scored = [];
        var tokens = text.split(/[^a-z0-9\u0600-\u06FF\u200c]+/).filter(Boolean);
        FAQ.forEach(function (item, idx) {
            var score = 0;
            item.k.forEach(function (kw) { if (hasKeyword(text, kw, tokens)) score += 1 + (kw.length > 6 ? 0.5 : 0); });
            score *= item.w || 1;
            if (score > 0) scored.push({ item: item, score: score, idx: idx });
        });
        if (!scored.length) {
            return fa ? 'این را دقیق نمی‌دانم. درباره‌ی خدمات، ابزارها، نمونه‌کارها، روند کار یا راه‌های تماس بپرس.'
                      : "I'm not sure about that. Try asking about services, tools, projects, process or how to get in touch.";
        }
        scored.sort(function (a, b) { return b.score - a.score || a.idx - b.idx; });
        var first = scored[0].item[fa ? 'fa' : 'en'];
        if (scored[1] && scored[1].score >= scored[0].score * 0.5) {
            var both = first + ' ' + scored[1].item[fa ? 'fa' : 'en'];
            if (both.length <= 330) return both;
        }
        return first;
    }

    function defaultSubmit(q) {
        if (typeof window.MIRWEB_ASK === 'function') return window.MIRWEB_ASK(q);
        return localAnswer(q);
    }

    /* ---------- geometry ---------- */
    var PILL_H = 60, BALL_SMALL = 60, ORB_D = 132, ORB_R = 66, CANVAS = 220, FLY_D = 138;
    var CARD_H = 108;
    function pillW() { return Math.min(560, window.innerWidth - 32); }
    function cardW() { return Math.min(340, window.innerWidth - 32); }
    function homeDy() { return window.innerHeight * 0.54 - 96; }

    /* ---------- math + easing ---------- */
    var TAU = Math.PI * 2;
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function fmt(v) { return String(Math.round(v * 1e4) / 1e4); }
    function mulberry32(a) {
        return function () {
            a |= 0; a = (a + 0x6d2b79f5) | 0;
            var t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    function cubicBezier(x1, y1, x2, y2) {
        var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
        var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
        function sx(t) { return ((ax * t + bx) * t + cx) * t; }
        function sy(t) { return ((ay * t + by) * t + cy) * t; }
        function dx(t) { return (3 * ax * t + 2 * bx) * t + cx; }
        function solve(x) {
            var t = x, i, e, d;
            for (i = 0; i < 8; i++) {
                e = sx(t) - x;
                if (Math.abs(e) < 1e-6) return t;
                d = dx(t);
                if (Math.abs(d) < 1e-6) break;
                t -= e / d;
            }
            var lo = 0, hi = 1; t = x;
            for (i = 0; i < 40; i++) {
                e = sx(t);
                if (Math.abs(e - x) < 1e-6) break;
                if (x > e) lo = t; else hi = t;
                t = (hi - lo) / 2 + lo;
            }
            return t;
        }
        return function (x) { return x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)); };
    }
    var E = {
        out: cubicBezier(0.22, 1, 0.36, 1), io: cubicBezier(0.65, 0, 0.35, 1), 'in': cubicBezier(0.4, 0, 1, 1),
        fly: cubicBezier(0.5, 0, 0.1, 1), grow: cubicBezier(0.3, 0, 0.2, 1), vortex: cubicBezier(0.6, 0, 0.2, 1),
        spring: cubicBezier(0.34, 1.4, 0.64, 1), card: cubicBezier(0.65, 0, 0.2, 1), lin: function (t) { return t; }
    };
    function bez(t, p0, c, p2) { return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p2; }

    /* ---------- timelines ---------- */
    function T(ch, from, to, t0, t1, ease) { return { ch: ch, from: from, to: to, t0: t0, t1: t1, ease: ease || E.io }; }

    function launchTracks(g) {
        return [
            T('w', g.pw, g.pw - 12, 0, 100, E.out), T('oInput', 1, 0, 0, 160, E['in']), T('inScale', 1, 0.6, 0, 160, E['in']),
            T('oGlow', 1, 0, 0, 300, E.out), T('oAur', 1, 0, 0, 300, E.out),
            T('w', g.pw - 12, BALL_SMALL, 100, 560, E.io), T('h', PILL_H, PILL_H + 6, 380, 500, E.out), T('h', PILL_H + 6, BALL_SMALL, 500, 620, E.out),
            T('oPill', 1, 0, 300, 560, E.out), T('oBall', 0, 1, 300, 560, E.out),
            T('u', 0, 1, 620, 1500, E.fly), T('w', BALL_SMALL, FLY_D, 620, 1300, E.grow), T('h', BALL_SMALL, FLY_D, 620, 1300, E.grow),
            T('w', FLY_D, ORB_D, 1300, 1500, E.out), T('h', FLY_D, ORB_D, 1300, 1500, E.out),
            T('cHalo', 0, 0.6, 620, 1500, E.out), T('trail', 0, 1, 700, 800, E.out), T('trail', 1, 0, 1300, 1500, E['in'])
        ];
    }
    var ASSEMBLE = [
        T('oRing', 1, 0, 0, 300, E.out), T('oBall', 1, 0, 0, 260, E.out),
        T('orb.k', 0, 1, 0, 800, E.out), T('orb.alpha', 0, 1, 0, 800, E.out), T('orb.spin', 0, 0.9, 0, 800, E.out),
        T('orb.pop', 1, 1.05, 0, 420, E.out), T('orb.pop', 1.05, 1, 420, 800, E.io),
        T('sOp', 0, 1, 300, 620, E.out), T('sTy', 6, 0, 300, 620, E.out)
    ];
    var RESOLVE = [
        T('orb.sweep', 0, 1, 0, 700, E.io), T('orb.spin', 0.9, 0.3, 0, 700, E.out), T('orb.gain', 1, 0, 0, 700, E.out),
        T('orb.floor', 0, 0.95, 400, 900, E.out), T('orb.rad', 0, 0.15, 400, 900, E.out),
        T('orb.pop', 1, 1.04, 600, 800, E.out), T('orb.pop', 1.04, 1, 800, 900, E.out)
    ];
    var CONDENSE = [
        T('orb.pop', 1, 1.06, 0, 120, E.out), T('sOp', 1, 0, 0, 160, E['in']), T('sTy', 0, -6, 0, 160, E['in']),
        T('orb.k', 1, 0, 120, 640, E.vortex), T('orb.vortex', 0, 1.6, 120, 640, E.vortex),
        T('oGreen', 0, 1, 260, 700, E.spring), T('gs', 0.55, 1, 260, 700, E.spring), T('pulse', 0, 1, 320, 760, E.out),
        T('oHalo', 0, 0.35, 380, 700, E.out), T('orb.alpha', 1, 0, 500, 800, E.out)
    ];
    function unfoldTracks(g, tw) {
        return [
            T('w', ORB_D, 124, 0, 90, E['in']), T('h', ORB_D, 124, 0, 90, E['in']),
            T('w', 124, g.cw, 90, 700, E.card), T('h', 124, CARD_H, 90, 700, E.out), T('r', ORB_D / 2, 20, 90, 700, E.io),
            T('oGreen', 1, 0, 200, 560, E.out), T('oCard', 0, 1, 200, 560, E.out),
            T('oHalo', 0.35, 0, 300, 700, E.out), T('cHalo', 0.6, 0.22, 300, 700, E.out),
            T('hOp', 0, 1, 520, 840, E.out), T('dotS', 0, 1, 520, 840, E.spring),
            T('wp', 0, 1, 600, 600 + tw, E.lin), T('bloom', 1, 0.625, 700, 1200, E.io)
        ];
    }
    var R_OUT = [T('oInput', 1, 0, 0, 140, E.out), T('oPill', 1, 0, 0, 200, E.out), T('oGlow', 1, 0, 0, 200, E.out), T('oAur', 1, 0, 0, 200, E.out), T('oRing', 1, 0, 0, 200, E.out)];
    var R_IN = [T('orb.alpha', 0, 1, 0, 200, E.out), T('sOp', 0, 1, 0, 200, E.out), T('cHalo', 0, 0.6, 0, 200, E.out)];
    var R_RESOLVE = [T('orb.sweep', 0, 1, 0, 250, E.io), T('orb.floor', 0, 0.95, 0, 250, E.out)];
    var R_CONDENSE = [T('oGreen', 0, 1, 0, 250, E.out), T('orb.alpha', 1, 0, 0, 250, E.out), T('sOp', 1, 0, 0, 250, E.out)];
    var R_GREEN_OUT = [T('oGreen', 1, 0, 0, 120, E.out)];
    function rCardIn(tw) { return [T('oCard', 0, 1, 0, 250, E.out), T('hOp', 0, 1, 0, 250, E.out), T('wp', 0, 1, 0, tw, E.lin), T('bloom', 1, 0.625, 0, 250, E.out)]; }

    var FADE = ['oGlow', 'oAur', 'oPill', 'oBall', 'oGreen', 'oCard', 'oRing', 'oInput', 'oHalo', 'sOp', 'orb.alpha', 'trail'];
    var INIT = {
        h: PILL_H, r: 999, oGlow: 1, oHalo: 0, oPill: 1, oBall: 0, oGreen: 0, oCard: 0, oRing: 1, oInput: 1, inScale: 1, oAur: 1,
        gs: 0.55, cs: 1, hOp: 0, dotS: 0, bloom: 1, u: 0, yOff: 0, trail: 0, pulse: -1, sOp: 0, sTy: 6, cHalo: 0, wp: 0,
        'orb.k': 0, 'orb.alpha': 0, 'orb.spin': 0, 'orb.pop': 1, 'orb.sweep': 0, 'orb.vortex': 0, 'orb.gain': 1, 'orb.floor': 0, 'orb.rad': 0
    };

    /* ---------- async utils ---------- */
    var ABORT = {};
    function sleep(ms, sig) {
        return new Promise(function (res) {
            if (sig.aborted) return res();
            var id = 0;
            function onAbort() { window.clearTimeout(id); res(); }
            id = window.setTimeout(function () { sig.removeEventListener('abort', onAbort); res(); }, Math.max(0, ms));
            sig.addEventListener('abort', onAbort, { once: true });
        });
    }
    function abortable(p, sig) {
        return new Promise(function (res) {
            if (sig.aborted) return res(undefined);
            function onAbort() { res(undefined); }
            sig.addEventListener('abort', onAbort, { once: true });
            p.then(function (v) { sig.removeEventListener('abort', onAbort); res(v); },
                   function () { sig.removeEventListener('abort', onAbort); res(undefined); });
        });
    }

    /* ---------- dotted orb ---------- */
    var RINGS = 16;
    var DOT_LIST = (function () {
        var rand = mulberry32(7), out = [];
        for (var k = 0; k < RINGS; k++) {
            var y = 1 - ((k + 0.5) / RINGS) * 2, r = Math.sqrt(1 - y * y), m = Math.max(4, Math.round(30 * r));
            for (var j = 0; j < m; j++) {
                var a = (j / m) * TAU + k * 0.35;
                out.push({ x: Math.cos(a) * r, y: y, z: Math.sin(a) * r, u: (1 - y) / 2, seed: rand() * 6.283 });
            }
        }
        return out;
    })();
    var N = DOT_LIST.length;
    var DX = Float32Array.from(DOT_LIST, function (d) { return d.x; });
    var DY = Float32Array.from(DOT_LIST, function (d) { return d.y; });
    var DZ = Float32Array.from(DOT_LIST, function (d) { return d.z; });
    var DU = Float32Array.from(DOT_LIST, function (d) { return d.u; });
    var DS = Float32Array.from(DOT_LIST, function (d) { return d.seed; });

    var G_STEPS = 24, A_STEPS = 48;
    var COLORS = (function () {
        var out = [];
        for (var gi = 0; gi <= G_STEPS; gi++) {
            var g = gi / G_STEPS;
            var r = Math.round(lerp(235, 52, g)), gg = Math.round(lerp(235, 211, g)), b = Math.round(lerp(235, 153, g));
            for (var ai = 0; ai <= A_STEPS; ai++) out.push('rgba(' + r + ',' + gg + ',' + b + ',' + (ai / A_STEPS).toFixed(3) + ')');
        }
        return out;
    })();
    var ORB_KEYS = ['k', 'alpha', 'spin', 'sweep', 'pop', 'vortex', 'gain', 'floor', 'rad'];

    function createOrb(canvas, getSpeed, isReduced) {
        var P = { k: 0, alpha: 0, spin: 0, rot: 0, sweep: 0, pop: 1, vortex: 0, gain: 1, floor: 0, rad: 0, prog: 0 };
        var ctx = canvas.getContext('2d');
        var lit = new Float32Array(N), SX = new Float32Array(N), SY = new Float32Array(N), SR = new Float32Array(N), SD = new Float32Array(N);
        var SC = new Int16Array(N), pw = [1, 0, 0, 0];
        var time = 0, raf = 0, last = 0, dead = false;

        function reset() {
            P.k = 0; P.alpha = 0; P.spin = 0; P.rot = 0; P.sweep = 0; P.pop = 1; P.vortex = 0; P.gain = 1; P.floor = 0; P.rad = 0; P.prog = 0;
            lit.fill(0); pw[0] = 1; pw[1] = 0; pw[2] = 0; pw[3] = 0;
            time = isReduced() ? 1.2 : 0;
        }
        reset();
        if (!ctx) return { P: P, ensure: function () {}, reset: reset, destroy: function () {} };

        var dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.round(CANVAS * dpr);
        canvas.height = Math.round(CANVAS * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var S = 0.6, CP = Math.cos(0.35), SP = Math.sin(0.35), C0 = CANVAS / 2;

        function draw(dt) {
            ctx.clearRect(0, 0, CANVAS, CANVAS);
            time += dt;
            P.rot += P.spin * dt;
            var yaw = P.rot + P.vortex, cyw = Math.cos(yaw), syw = Math.sin(yaw);
            var stepW = dt / 0.35, q, d;
            for (q = 0; q < 4; q++) {
                d = (q === P.prog ? 1 : 0) - pw[q];
                pw[q] += Math.abs(d) <= stepW ? d : d > 0 ? stepW : -stepW;
            }
            var decay = Math.exp(-dt / 0.5);
            var h0 = (time * 300) % N, h3 = (time * 480) % N;
            var a1 = time * 0.8, b1 = Math.sin(time * 0.5) * 0.9;
            var f1x = Math.cos(b1) * Math.cos(a1), f1y = Math.sin(b1), f1z = Math.cos(b1) * Math.sin(a1);
            var a2 = time * 0.55 + 2.1, b2 = Math.cos(time * 0.42) * 0.9;
            var f2x = Math.cos(b2) * Math.cos(a2), f2y = Math.sin(b2), f2z = Math.cos(b2) * Math.sin(a2);
            var lat = Math.sin(time * 2.2), swirlK = P.vortex * 1.5;

            for (var n = 0; n < N; n++) {
                var dx = DX[n], dy = DY[n], dz = DZ[n], u = DU[n], pulse = 0, dd, v;
                if (pw[0] > 0.001) { dd = Math.abs(n - h0); if (dd > N - dd) dd = N - dd; v = Math.max(0, 1 - dd / 16); pulse = Math.max(pulse, v * v * pw[0]); }
                if (pw[1] > 0.001) {
                    var v1 = Math.max(0, (dx * f1x + dy * f1y + dz * f1z - 0.72) / 0.28);
                    var v2 = Math.max(0, (dx * f2x + dy * f2y + dz * f2z - 0.72) / 0.28);
                    v = Math.max(v1, v2); pulse = Math.max(pulse, v * v * pw[1]);
                }
                if (pw[2] > 0.001) { var e = dy - lat; v = Math.max(0, 1 - (e * e) / 0.02); pulse = Math.max(pulse, v * v * pw[2]); }
                if (pw[3] > 0.001) { dd = Math.abs(n - h3); if (dd > N - dd) dd = N - dd; v = Math.max(0, 1 - dd / 22); pulse = Math.max(pulse, v * v * pw[3]); }
                var l = Math.max(lit[n] * decay, pulse * P.gain);
                lit[n] = l;

                var ki = clamp01(P.k * (1 + S) - S * u);
                if (ki <= 0.001) { SC[n] = -1; continue; }
                var eo = E.out(ki), kk = eo * P.pop;
                var x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
                var y2 = dy * CP - z1 * SP, z2 = dy * SP + z1 * CP;
                var f = 2.8 / (2.8 - z2), depth = (z2 + 1) / 2;
                var ox = x1 * ORB_R * kk * f, oy = -y2 * ORB_R * kk * f;
                if (swirlK > 0.001) {
                    var sw = (1 - ki) * swirlK, cc = Math.cos(sw), ss = Math.sin(sw), tx = ox * cc - oy * ss;
                    oy = ox * ss + oy * cc; ox = tx;
                }
                var g = clamp01((P.sweep * 1.4 - u) / 0.4);
                var a = 0.1 + 0.035 * Math.sin(DS[n] + time * 1.6) * (1 - g) + 0.32 * depth * depth + 0.75 * l * (1 - g) + g * (0.55 + 0.4 * depth) + 2 * g * (1 - g);
                a = Math.max(a, P.floor * (0.7 + 0.3 * depth));
                if (a > 1) a = 1;
                a *= eo * P.alpha;
                SX[n] = C0 + ox; SY[n] = C0 + oy; SD[n] = depth;
                SR[n] = (1.15 * (0.45 + 0.75 * depth) * f + 0.9 * l + g * 0.25) * (1 + P.rad) * (0.4 + 0.6 * eo);
                var ai = Math.round(a * A_STEPS), gi = Math.round(g * G_STEPS);
                SC[n] = ai <= 0 ? -1 : gi * (A_STEPS + 1) + ai;
            }
            for (var pass = 0; pass < 2; pass++) {
                for (var m = 0; m < N; m++) {
                    var c = SC[m];
                    if (c < 0) continue;
                    if ((SD[m] >= 0.5) !== (pass === 1)) continue;
                    ctx.fillStyle = COLORS[c];
                    ctx.beginPath(); ctx.arc(SX[m], SY[m], SR[m], 0, TAU); ctx.fill();
                }
            }
        }
        function frame(now) {
            raf = 0;
            if (dead) return;
            var dt = isReduced() ? 0 : Math.max(0, Math.min(0.05, (now - last) / 1000)) * getSpeed();
            last = now;
            draw(dt);
            if (P.alpha > 0.002) raf = requestAnimationFrame(frame);
            else ctx.clearRect(0, 0, CANVAS, CANVAS);
        }
        function ensure() {
            if (raf || dead || P.alpha <= 0.002) return;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        }
        function destroy() { dead = true; if (raf) cancelAnimationFrame(raf); raf = 0; }
        return { P: P, ensure: ensure, reset: reset, destroy: destroy };
    }

    /* ---------- runtime ---------- */
    function sampleAt(h, t, out) {
        var n = h.length;
        function copy(s) { out.x = s.x; out.y = s.y; out.d = s.d; }
        if (n === 0) { out.x = 0; out.y = 0; out.d = 0; return; }
        if (t <= h[0].t) return copy(h[0]);
        for (var i = n - 1; i > 0; i--) {
            var a = h[i - 1], b = h[i];
            if (t >= a.t) {
                if (t >= b.t) return copy(b);
                var k = (t - a.t) / (b.t - a.t || 1);
                out.x = lerp(a.x, b.x, k); out.y = lerp(a.y, b.y, k); out.d = lerp(a.d, b.d, k);
                return;
            }
        }
        copy(h[n - 1]);
    }

    function createRuntime(env) {
        var actor = env.actor, mover = env.mover, root = env.root, status = env.status, pulse = env.pulse, ghosts = env.ghosts, form = env.form;
        var life = new AbortController();
        var geo = { pw: pillW(), cw: cardW(), H: homeDy(), dir: -1 };
        var orb = createOrb(env.canvas, env.getSpeed, env.isReduced);
        var vals = {}, dirty = new Set(), CH = {};
        var current = null, idleCtl = null, busy = false, idling = false, epoch = 0;
        var curX = 0, curY = 0, curD = BALL_SMALL, trailVis = 0, ghostsShown = false, wStagger = 45, wDur = 320;
        var hist = [], tmp = { t: 0, x: 0, y: 0, d: 0 };

        function child() {
            var ac = new AbortController();
            if (life.signal.aborted) ac.abort();
            else life.signal.addEventListener('abort', function () { ac.abort(); }, { once: true });
            return ac;
        }
        function renderTrail() {
            if (trailVis <= 0.001) {
                if (ghostsShown) { ghosts.forEach(function (g) { g.style.opacity = '0'; }); ghostsShown = false; }
                return;
            }
            ghostsShown = true;
            var now = performance.now();
            for (var i = 0; i < ghosts.length; i++) {
                sampleAt(hist, now - (i + 1) * 45, tmp);
                var k = (tmp.d * (1 - 0.08 * (i + 1))) / 100, g = ghosts[i];
                g.style.transform = 'translate3d(' + (tmp.x - curX).toFixed(2) + 'px,' + (tmp.y - curY).toFixed(2) + 'px,0) translate(-50%,-50%) scale(' + k.toFixed(3) + ')';
                g.style.opacity = (0.28 * Math.pow(1 - i / 6, 1.5) * trailVis).toFixed(3);
            }
        }
        function applyPath() {
            var u = vals.u || 0, H = geo.H;
            curX = bez(u, 0, geo.dir * 0.3 * H, 0);
            curY = bez(u, H, 0.6 * H, 0) + (vals.yOff || 0);
            mover.style.transform = 'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px,0)';
            var now = performance.now();
            hist.push({ t: now, x: curX, y: curY, d: curD });
            while (hist.length > 2 && hist[0].t < now - 500) hist.shift();
            renderTrail();
        }
        function applyWords(v) {
            var body = env.getBody();
            if (!body) return;
            var nodes = body.querySelectorAll('.mo-w');
            var total = (nodes.length - 1) * wStagger + wDur, time = v * total, reduced = env.isReduced();
            nodes.forEach(function (el, i) {
                var p = E.out(clamp01((time - i * wStagger) / wDur));
                el.style.opacity = fmt(p);
                el.style.transform = p >= 0.999 || reduced ? 'none' : 'translateY(' + fmt((1 - p) * 4) + 'px)';
                el.style.filter = p >= 0.999 || reduced ? 'none' : 'blur(' + fmt((1 - p) * 4) + 'px)';
            });
        }

        ['oGlow', 'oHalo', 'oPill', 'oBall', 'oGreen', 'oCard', 'oRing', 'oInput', 'oAur', 'gs', 'cs', 'hOp', 'dotS', 'bloom'].forEach(function (n) {
            CH[n] = function (v) { actor.style.setProperty('--' + n, fmt(v)); };
        });
        ['w', 'h', 'r'].forEach(function (n) {
            CH[n] = function (v) { actor.style.setProperty('--' + n, fmt(v) + 'px'); if (n === 'w') curD = v; };
        });
        CH.inScale = function (v) { actor.style.setProperty('--inScale', fmt(v)); form.style.filter = v >= 0.999 ? 'none' : 'blur(' + fmt((1 - v) * 15) + 'px)'; };
        CH.sOp = function (v) { status.style.setProperty('--sOp', fmt(v)); };
        CH.sTy = function (v) { status.style.setProperty('--sTy', fmt(v)); };
        CH.cHalo = function (v) { root.style.setProperty('--oCenter', fmt(v)); };
        CH.u = function () { applyPath(); };
        CH.yOff = function () { applyPath(); };
        CH.trail = function (v) { trailVis = v; renderTrail(); };
        CH.pulse = function (v) {
            if (v < 0) { pulse.style.opacity = '0'; return; }
            pulse.style.opacity = fmt(0.5 * (1 - v));
            pulse.style.transform = 'scale(' + fmt(1 + v) + ')';
        };
        CH.wp = applyWords;
        ORB_KEYS.forEach(function (name) {
            CH['orb.' + name] = function (v) { orb.P[name] = v; if (name === 'alpha') orb.ensure(); };
        });

        function set(ch, v) { vals[ch] = v; dirty.add(ch); }
        function flush() { dirty.forEach(function (ch) { if (CH[ch]) CH[ch](vals[ch]); }); dirty.clear(); }
        function setNow(ch, v) { vals[ch] = v; if (CH[ch]) CH[ch](v); }
        function resetChannels() { setNow('w', geo.pw); for (var ch in INIT) setNow(ch, INIT[ch]); }

        function play(tracks, sig) {
            return new Promise(function (res) {
                if (sig.aborted) return res();
                var end = tracks.reduce(function (m, k) { return Math.max(m, k.t1); }, 0);
                var done = new Set(), raf = 0, t = 0, last = performance.now();
                function onAbort() { cancelAnimationFrame(raf); res(); }
                function finish() { sig.removeEventListener('abort', onAbort); res(); }
                function step(now) {
                    var dt = Math.max(0, Math.min(100, now - last));
                    last = now;
                    t += dt * env.getSpeed();
                    for (var i = 0; i < tracks.length; i++) {
                        var k = tracks[i];
                        if (done.has(k) || t < k.t0) continue;
                        var p = Math.min(1, (t - k.t0) / Math.max(1, k.t1 - k.t0));
                        set(k.ch, k.from + (k.to - k.from) * (k.ease || E.io)(p));
                        if (p === 1) done.add(k);
                    }
                    flush();
                    if (t >= end) finish(); else raf = requestAnimationFrame(step);
                }
                sig.addEventListener('abort', onAbort, { once: true });
                raf = requestAnimationFrame(step);
            });
        }

        async function labelLoop(sig, ctl) {
            var i = 0;
            for (;;) {
                await sleep(1150 / env.getSpeed(), sig);
                if (sig.aborted || ctl.stop) return;
                i = (i + 1) % COPY.labels.length;
                orb.P.prog = i % 4;
                env.ui.swapLabel(COPY.labels[i]);
            }
        }

        function cardHeightFor(text, cw) {
            var perLine = Math.max(12, (cw - 40) / 7.4);
            var lines = Math.ceil((text.length / perLine) * 1.1);
            return Math.max(108, Math.min(280, Math.round(70 + lines * 21)));
        }

        async function run(text, sig, cfg) {
            var reduced = env.isReduced();
            async function go(tracks) { await play(tracks, sig); if (sig.aborted) throw ABORT; }
            try {
                env.ui.setPhase('launch');
                hist.length = 0;
                if (!reduced) {
                    await go(launchTracks(geo));
                    setNow('r', ORB_D / 2);
                    env.ui.setPhase('assemble');
                    await go(ASSEMBLE);
                } else {
                    await go(R_OUT);
                    setNow('u', 1); setNow('w', ORB_D); setNow('h', ORB_D); setNow('r', ORB_D / 2);
                    setNow('sTy', 0); setNow('orb.k', 1); setNow('orb.spin', 0);
                    env.ui.setPhase('assemble');
                    await go(R_IN);
                }

                env.ui.setPhase('think');
                env.ui.live(COPY.labels[0]);
                var ctl = { stop: false };
                labelLoop(sig, ctl);
                var t0 = performance.now();
                var pending = Promise.resolve().then(function () { return cfg.onSubmit(text); })
                    .then(function (b) { return typeof b === 'string' && b.trim() ? b : COPY.fallback; }, function () { return COPY.fallback; });
                var got = await abortable(pending, sig);
                if (sig.aborted) throw ABORT;
                var body = got === undefined ? COPY.fallback : got;
                await sleep(cfg.minThink / env.getSpeed() - (performance.now() - t0), sig);
                ctl.stop = true;
                if (sig.aborted) throw ABORT;

                var n = Math.max(1, body.split(/\s+/).filter(Boolean).length);
                CARD_H = cardHeightFor(body, geo.cw);
                root.style.setProperty('--cardH', CARD_H + 'px');

                if (!reduced) {
                    env.ui.setPhase('resolve');
                    env.ui.swapLabel(COPY.done);
                    await go(RESOLVE);
                    env.ui.setPhase('condense');
                    await go(CONDENSE);
                    env.ui.setPhase('unfold');
                    wDur = 320;
                    wStagger = n > 1 ? Math.min(45, 280 / (n - 1)) : 0;
                    env.ui.setAnswer(body);
                    await go(unfoldTracks(geo, (n - 1) * wStagger + wDur));
                } else {
                    env.ui.setPhase('resolve');
                    env.ui.swapLabel(COPY.done);
                    await go(R_RESOLVE);
                    await sleep(350 / env.getSpeed(), sig);
                    if (sig.aborted) throw ABORT;
                    env.ui.setPhase('condense');
                    setNow('gs', 1);
                    await go(R_CONDENSE);
                    env.ui.setPhase('unfold');
                    wDur = 250; wStagger = 0;
                    env.ui.setAnswer(body);
                    await go(R_GREEN_OUT);
                    setNow('w', geo.cw); setNow('h', CARD_H); setNow('r', 20); setNow('dotS', 1);
                    await go(rCardIn(wDur));
                }
                env.ui.setPhase('answered');
                env.ui.live(COPY.answerTitle + ': ' + body);
                env.ui.focusAnswer();
            } catch (e) {
                if (e === ABORT) return;
                console.error(e);
                hard();
            }
        }

        async function toIdle(kind) {
            if (idling) return;
            idling = true;
            var my = ++epoch, ac = child();
            idleCtl = ac;
            var sig = ac.signal, outMs = kind === 'reset' ? 240 : 200, inMs = kind === 'reset' ? 420 : 200;
            env.ui.setPhase('reset');
            var out = [T('cHalo', vals.cHalo || 0, 0, 0, outMs, E.out)];
            FADE.forEach(function (ch) { var v = vals[ch] || 0; if (v > 0.001) out.push(T(ch, v, 0, 0, outMs, E.out)); });
            if (kind === 'reset') out.push(T('cs', 1, 0.98, 0, outMs, E.out));
            await play(out, sig);
            if (sig.aborted || my !== epoch) return;

            setNow('pulse', -1);
            env.ui.setAnswer('');
            env.ui.resetLabel();
            env.ui.clearInput();
            orb.reset();
            hist.length = 0;
            geo.pw = pillW(); geo.cw = cardW(); geo.H = homeDy();
            resetChannels();
            var pillCh = ['oPill', 'oInput', 'oGlow', 'oAur', 'oRing'];
            pillCh.forEach(function (ch) { setNow(ch, 0); });
            setNow('yOff', kind === 'reset' ? 8 : 0);
            var inn = pillCh.map(function (ch) { return T(ch, 0, 1, 0, inMs, E.out); });
            if (kind === 'reset') inn.push(T('yOff', 8, 0, 0, inMs, E.out));
            await play(inn, sig);
            if (sig.aborted || my !== epoch) return;

            resetChannels();
            current = null; idleCtl = null; busy = false; idling = false;
            env.ui.lock(false);
            env.ui.setPhase('idle');
            env.ui.idleReady();
        }

        function hard() {
            epoch++;
            if (current) current.abort(); current = null;
            if (idleCtl) idleCtl.abort(); idleCtl = null;
            orb.reset();
            hist.length = 0;
            env.ui.setAnswer('');
            env.ui.resetLabel();
            geo.pw = pillW(); geo.cw = cardW(); geo.H = homeDy();
            resetChannels();
            setNow('pulse', -1);
            busy = false; idling = false;
            env.ui.lock(false);
            env.ui.setPhase('idle');
            env.ui.idleReady();
        }
        resetChannels();

        return {
            start: function (text, cfg) {
                if (busy) return false;
                busy = true;
                geo.pw = pillW(); geo.cw = cardW(); geo.H = homeDy();
                geo.dir = -geo.dir;
                orb.reset();
                setNow('u', 0);
                var ac = child();
                current = ac;
                env.ui.lock(true);
                run(text, ac.signal, cfg);
                return true;
            },
            escape: function () { if (!busy || idling) return; if (current) current.abort(); toIdle('esc'); },
            reset: function () { if (!busy || idling) return; toIdle('reset'); },
            hard: hard,
            home: function () { if (busy) return; geo.pw = pillW(); geo.cw = cardW(); geo.H = homeDy(); setNow('w', geo.pw); setNow('u', 0); },
            busy: function () { return busy; },
            destroy: function () { life.abort(); orb.destroy(); }
        };
    }

    /* ---------- the widget (DOM + wiring) ---------- */
    var SPARK = '<svg class="mo-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3.5l1.7 4.8 4.8 1.7-4.8 1.7L10 16.5l-1.7-4.8L3.5 10l4.8-1.7L10 3.5z"/><path d="M18 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z"/></svg>';

    function init() {
        var launch = document.createElement('button');
        launch.type = 'button';
        launch.className = 'mo-launch';
        launch.innerHTML = SPARK.replace('mo-spark', 'mo-launch-ico');
        document.body.appendChild(launch);

        var root = document.createElement('div');
        root.className = 'mo-root';
        root.setAttribute('data-phase', 'idle');
        root.setAttribute('aria-hidden', 'true');
        var ghostHtml = '';
        for (var i = 0; i < 6; i++) ghostHtml += '<span class="mo-trail" aria-hidden="true"></span>';
        root.innerHTML =
            '<div class="mo-bg" aria-hidden="true"></div><div class="mo-halo" aria-hidden="true"></div>' +
            '<button type="button" class="mo-close">×</button>' +
            '<div class="mo-mover">' + ghostHtml +
            '<div class="mo-actor">' +
            '<div class="mo-underglow" aria-hidden="true"></div><div class="mo-halo-green" aria-hidden="true"></div>' +
            '<div class="mo-surface" aria-hidden="true"><div class="mo-aurora"><i></i><i></i><i></i><i></i></div></div>' +
            '<div class="mo-ball" aria-hidden="true"></div><div class="mo-green" aria-hidden="true"></div><div class="mo-card" aria-hidden="true"></div><div class="mo-ring" aria-hidden="true"></div>' +
            '<form class="mo-input" autocomplete="off">' + SPARK +
            '<input class="mo-field" type="text" maxlength="200" spellcheck="false">' +
            '<button type="submit" class="mo-send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5.5 11.5L12 5l6.5 6.5"/></svg></button></form>' +
            '<canvas class="mo-orb" aria-hidden="true"></canvas><div class="mo-pulse" aria-hidden="true"></div>' +
            '<div class="mo-answer" tabindex="-1" role="group"><div class="mo-a-head"><i class="mo-a-dot" aria-hidden="true"></i><span class="mo-a-title"></span></div><p class="mo-a-body"></p></div>' +
            '</div></div>' +
            '<div class="mo-status" aria-hidden="true"></div>' +
            '<button type="button" class="mo-reset"></button>' +
            '<div class="mo-live" role="status" aria-live="polite"></div>';
        document.body.appendChild(root);

        function q(sel) { return root.querySelector(sel); }
        var mover = q('.mo-mover'), actor = q('.mo-actor'), form = q('.mo-input'), input = q('.mo-field'), send = q('.mo-send');
        var canvas = q('.mo-orb'), pulse = q('.mo-pulse'), status = q('.mo-status'), answerEl = q('.mo-answer');
        var bodyEl = q('.mo-a-body'), liveEl = q('.mo-live'), resetBtn = q('.mo-reset'), closeBtn = q('.mo-close');
        var ghosts = Array.prototype.slice.call(root.querySelectorAll('.mo-trail'));

        var phase = 'idle', reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches, isOpen = false;
        var typingT = 0, shakeT = 0, flashT = 0, curLab = null, curName = null;

        function labelNode(name, cls) {
            var el = document.createElement('span');
            el.className = 'mo-lab ' + cls;
            el.innerHTML = name === COPY.done
                ? '<span class="mo-lab-done"></span>'
                : '<span class="mo-lab-t"></span><span class="mo-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
            el.firstChild.textContent = name;
            return el;
        }

        var rt = createRuntime({
            root: root, mover: mover, actor: actor, form: form, ghosts: ghosts, canvas: canvas, pulse: pulse, status: status,
            getBody: function () { return bodyEl; },
            getSpeed: function () { return 1; },
            isReduced: function () { return reduced; },
            ui: {
                setPhase: function (p) { phase = p; root.setAttribute('data-phase', p); },
                swapLabel: function (name) {
                    if (curName === name) return;
                    var prev = curLab;
                    if (prev) { prev.className = 'mo-lab mo-out'; setTimeout(function () { prev.remove(); }, 420); }
                    curLab = labelNode(name, 'mo-in');
                    status.appendChild(curLab);
                    curName = name;
                },
                resetLabel: function () {
                    status.innerHTML = '';
                    curName = COPY.labels[0];
                    curLab = labelNode(curName, 'mo-in');
                    status.appendChild(curLab);
                },
                setAnswer: function (s) {
                    bodyEl.innerHTML = '';
                    s.split(/\s+/).filter(Boolean).forEach(function (w) {
                        var sp = document.createElement('span');
                        sp.className = 'mo-w';
                        sp.textContent = w;
                        bodyEl.appendChild(sp);
                        bodyEl.appendChild(document.createTextNode(' '));
                    });
                },
                clearInput: function () { input.value = ''; send.removeAttribute('data-ready'); },
                live: function (s) { liveEl.textContent = s; },
                lock: function (on) { form.toggleAttribute('inert', on); },
                idleReady: function () { if (isOpen) input.focus({ preventScroll: true }); },
                focusAnswer: function () { answerEl.focus({ preventScroll: true }); }
            }
        });
        rt.hard();

        function applyLang() {
            loadCopy();
            input.placeholder = COPY.placeholder;
            input.setAttribute('aria-label', COPY.placeholder);
            send.setAttribute('aria-label', COPY.send);
            resetBtn.textContent = COPY.reset;
            closeBtn.setAttribute('aria-label', COPY.close);
            launch.setAttribute('aria-label', COPY.open);
            launch.title = COPY.open;
            answerEl.setAttribute('aria-label', COPY.answerTitle);
            root.querySelector('.mo-a-title').textContent = COPY.answerTitle;
            root.setAttribute('data-lang', isFa() ? 'fa' : 'en');
            if (phase === 'idle') { status.innerHTML = ''; curName = null; curLab = null; }
        }
        applyLang();
        document.addEventListener('sitelangchange', applyLang);

        function openWidget() {
            if (isOpen) return;
            isOpen = true;
            applyLang();
            root.classList.add('open');
            root.setAttribute('aria-hidden', 'false');
            launch.classList.add('hide');
            rt.home();
            setTimeout(function () { input.focus({ preventScroll: true }); }, 250);
        }
        function closeWidget() {
            if (!isOpen) return;
            isOpen = false;
            rt.hard();
            input.value = '';
            send.removeAttribute('data-ready');
            root.classList.remove('open');
            root.setAttribute('aria-hidden', 'true');
            launch.classList.remove('hide');
            launch.focus({ preventScroll: true });
        }
        launch.addEventListener('click', openWidget);
        closeBtn.addEventListener('click', closeWidget);
        root.querySelector('.mo-bg').addEventListener('click', function () { if (phase === 'idle') closeWidget(); });

        window.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape' || !isOpen) return;
            e.preventDefault();
            if (phase === 'idle') closeWidget();
            else if (phase !== 'reset') rt.escape();
        });
        window.addEventListener('resize', function () { if (phase === 'idle' && !rt.busy()) rt.home(); });

        input.addEventListener('input', function () {
            if (input.value.trim()) send.setAttribute('data-ready', ''); else send.removeAttribute('data-ready');
            actor.setAttribute('data-typing', '');
            clearTimeout(typingT);
            typingT = setTimeout(function () { actor.removeAttribute('data-typing'); }, 300);
        });

        function shake() {
            actor.removeAttribute('data-shake');
            void actor.offsetWidth;
            actor.setAttribute('data-shake', '');
            actor.setAttribute('data-flash', '');
            clearTimeout(shakeT); clearTimeout(flashT);
            shakeT = setTimeout(function () { actor.removeAttribute('data-shake'); }, 260);
            flashT = setTimeout(function () { actor.removeAttribute('data-flash'); }, 200);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (rt.busy() || phase !== 'idle') return;
            var text = input.value.trim();
            if (!text) { shake(); return; }
            rt.start(text, { onSubmit: defaultSubmit, minThink: 3450 });
        });
        resetBtn.addEventListener('click', function () { if (phase === 'answered') rt.reset(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
