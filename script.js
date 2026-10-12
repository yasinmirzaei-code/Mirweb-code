/* =========================================================
   SETTINGS
   ========================================================= */

// Paste your Formspree form address here (see the setup steps).
// Example: 'https://formspree.io/f/abcdwxyz'
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

// Country code that is selected when the browser language gives no hint
// (use a two-letter country code, for example 'US', 'GB', 'DE', 'TR')
const DEFAULT_COUNTRY = 'US';

// Name | ISO code | dial code
const COUNTRY_DATA = [
    'Afghanistan|AF|93', 'Aland Islands|AX|358', 'Albania|AL|355', 'Algeria|DZ|213',
    'American Samoa|AS|1684', 'Andorra|AD|376', 'Angola|AO|244', 'Anguilla|AI|1264',
    'Antigua and Barbuda|AG|1268', 'Argentina|AR|54', 'Armenia|AM|374', 'Aruba|AW|297',
    'Australia|AU|61', 'Austria|AT|43', 'Azerbaijan|AZ|994', 'Bahamas|BS|1242',
    'Bahrain|BH|973', 'Bangladesh|BD|880', 'Barbados|BB|1246', 'Belarus|BY|375',
    'Belgium|BE|32', 'Belize|BZ|501', 'Benin|BJ|229', 'Bermuda|BM|1441',
    'Bhutan|BT|975', 'Bolivia|BO|591', 'Bonaire, Sint Eustatius and Saba|BQ|599',
    'Bosnia and Herzegovina|BA|387', 'Botswana|BW|267', 'Brazil|BR|55',
    'British Virgin Islands|VG|1284', 'Brunei|BN|673', 'Bulgaria|BG|359',
    'Burkina Faso|BF|226', 'Burundi|BI|257', 'Cambodia|KH|855', 'Cameroon|CM|237',
    'Canada|CA|1', 'Cape Verde|CV|238', 'Cayman Islands|KY|1345',
    'Central African Republic|CF|236', 'Chad|TD|235', 'Chile|CL|56', 'China|CN|86',
    'Christmas Island|CX|61', 'Cocos Islands|CC|61', 'Colombia|CO|57', 'Comoros|KM|269',
    'Congo (Republic)|CG|242', 'Congo (DR)|CD|243', 'Cook Islands|CK|682',
    'Costa Rica|CR|506', 'Croatia|HR|385', 'Cuba|CU|53', 'Curacao|CW|599',
    'Cyprus|CY|357', 'Czechia|CZ|420', 'Denmark|DK|45', 'Djibouti|DJ|253',
    'Dominica|DM|1767', 'Dominican Republic|DO|1809', 'Ecuador|EC|593', 'Egypt|EG|20',
    'El Salvador|SV|503', 'Equatorial Guinea|GQ|240', 'Eritrea|ER|291', 'Estonia|EE|372',
    'Eswatini|SZ|268', 'Ethiopia|ET|251', 'Falkland Islands|FK|500', 'Faroe Islands|FO|298',
    'Fiji|FJ|679', 'Finland|FI|358', 'France|FR|33', 'French Guiana|GF|594',
    'French Polynesia|PF|689', 'Gabon|GA|241', 'Gambia|GM|220', 'Georgia|GE|995',
    'Germany|DE|49', 'Ghana|GH|233', 'Gibraltar|GI|350', 'Greece|GR|30', 'Greenland|GL|299',
    'Grenada|GD|1473', 'Guadeloupe|GP|590', 'Guam|GU|1671', 'Guatemala|GT|502',
    'Guernsey|GG|44', 'Guinea|GN|224', 'Guinea-Bissau|GW|245', 'Guyana|GY|592',
    'Haiti|HT|509', 'Honduras|HN|504', 'Hong Kong|HK|852', 'Hungary|HU|36',
    'Iceland|IS|354', 'India|IN|91', 'Indonesia|ID|62', 'Iran|IR|98', 'Iraq|IQ|964',
    'Ireland|IE|353', 'Isle of Man|IM|44', 'Israel|IL|972', 'Italy|IT|39',
    'Ivory Coast|CI|225', 'Jamaica|JM|1876', 'Japan|JP|81', 'Jersey|JE|44', 'Jordan|JO|962',
    'Kazakhstan|KZ|7', 'Kenya|KE|254', 'Kiribati|KI|686', 'Kosovo|XK|383', 'Kuwait|KW|965',
    'Kyrgyzstan|KG|996', 'Laos|LA|856', 'Latvia|LV|371', 'Lebanon|LB|961', 'Lesotho|LS|266',
    'Liberia|LR|231', 'Libya|LY|218', 'Liechtenstein|LI|423', 'Lithuania|LT|370',
    'Luxembourg|LU|352', 'Macau|MO|853', 'Madagascar|MG|261', 'Malawi|MW|265',
    'Malaysia|MY|60', 'Maldives|MV|960', 'Mali|ML|223', 'Malta|MT|356',
    'Marshall Islands|MH|692', 'Martinique|MQ|596', 'Mauritania|MR|222', 'Mauritius|MU|230',
    'Mayotte|YT|262', 'Mexico|MX|52', 'Micronesia|FM|691', 'Moldova|MD|373', 'Monaco|MC|377',
    'Mongolia|MN|976', 'Montenegro|ME|382', 'Montserrat|MS|1664', 'Morocco|MA|212',
    'Mozambique|MZ|258', 'Myanmar|MM|95', 'Namibia|NA|264', 'Nauru|NR|674', 'Nepal|NP|977',
    'Netherlands|NL|31', 'New Caledonia|NC|687', 'New Zealand|NZ|64', 'Nicaragua|NI|505',
    'Niger|NE|227', 'Nigeria|NG|234', 'Niue|NU|683', 'Norfolk Island|NF|672',
    'North Korea|KP|850', 'North Macedonia|MK|389', 'Northern Mariana Islands|MP|1670',
    'Norway|NO|47', 'Oman|OM|968', 'Pakistan|PK|92', 'Palau|PW|680', 'Palestine|PS|970',
    'Panama|PA|507', 'Papua New Guinea|PG|675', 'Paraguay|PY|595', 'Peru|PE|51',
    'Philippines|PH|63', 'Pitcairn Islands|PN|64', 'Poland|PL|48', 'Portugal|PT|351',
    'Puerto Rico|PR|1787', 'Qatar|QA|974', 'Reunion|RE|262', 'Romania|RO|40', 'Russia|RU|7',
    'Rwanda|RW|250', 'Saint Barthelemy|BL|590', 'Saint Helena|SH|290',
    'Saint Kitts and Nevis|KN|1869', 'Saint Lucia|LC|1758', 'Saint Martin|MF|590',
    'Saint Pierre and Miquelon|PM|508', 'Saint Vincent and the Grenadines|VC|1784',
    'Samoa|WS|685', 'San Marino|SM|378', 'Sao Tome and Principe|ST|239',
    'Saudi Arabia|SA|966', 'Senegal|SN|221', 'Serbia|RS|381', 'Seychelles|SC|248',
    'Sierra Leone|SL|232', 'Singapore|SG|65', 'Sint Maarten|SX|1721', 'Slovakia|SK|421',
    'Slovenia|SI|386', 'Solomon Islands|SB|677', 'Somalia|SO|252', 'South Africa|ZA|27',
    'South Korea|KR|82', 'South Sudan|SS|211', 'Spain|ES|34', 'Sri Lanka|LK|94',
    'Sudan|SD|249', 'Suriname|SR|597', 'Svalbard and Jan Mayen|SJ|47', 'Sweden|SE|46',
    'Switzerland|CH|41', 'Syria|SY|963', 'Taiwan|TW|886', 'Tajikistan|TJ|992',
    'Tanzania|TZ|255', 'Thailand|TH|66', 'Timor-Leste|TL|670', 'Togo|TG|228',
    'Tokelau|TK|690', 'Tonga|TO|676', 'Trinidad and Tobago|TT|1868', 'Tunisia|TN|216',
    'Turkey|TR|90', 'Turkmenistan|TM|993', 'Turks and Caicos Islands|TC|1649',
    'Tuvalu|TV|688', 'Uganda|UG|256', 'Ukraine|UA|380', 'United Arab Emirates|AE|971',
    'United Kingdom|GB|44', 'United States|US|1', 'Uruguay|UY|598',
    'US Virgin Islands|VI|1340', 'Uzbekistan|UZ|998', 'Vanuatu|VU|678',
    'Vatican City|VA|379', 'Venezuela|VE|58', 'Vietnam|VN|84', 'Wallis and Futuna|WF|681',
    'Western Sahara|EH|212', 'Yemen|YE|967', 'Zambia|ZM|260', 'Zimbabwe|ZW|263'
];

/* =========================================================
   PAGE LOGIC
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.glass-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const videoBg = document.querySelector('.video-bg');
    const heroContent = document.querySelector('.hero-content');

    if (!nav) {
        console.error('Element .glass-nav not found');
        return;
    }

    const links = nav.querySelectorAll('a');
    const bubble = nav.querySelector('.nav-bubble');
    let activeLink = nav.querySelector('a.active') || links[0];

    let viewportH = window.innerHeight;
    let lastWidth = window.innerWidth;

    /* ---------- Sliding bubble (desktop) ---------- */
    function moveBubbleTo(el) {
        if (!bubble || !el) return;
        bubble.style.width = el.offsetWidth + 'px';
        bubble.style.height = el.offsetHeight + 'px';
        bubble.style.transform =
            'translate(' + el.offsetLeft + 'px, ' + el.offsetTop + 'px)';
        bubble.style.opacity = 1;
    }

    function setActiveLink(link) {
        if (!link || link === activeLink) return;
        activeLink.classList.remove('active');
        link.classList.add('active');
        activeLink = link;
        moveBubbleTo(activeLink);
    }

    links.forEach(function (link) {
        link.addEventListener('mouseenter', function () {
            moveBubbleTo(link);
        });
    });

    nav.addEventListener('mouseleave', function () {
        moveBubbleTo(activeLink);
    });

    // Wait for fonts so the bubble measures the final link sizes
    window.addEventListener('load', function () {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(function () {
                moveBubbleTo(activeLink);
            });
        } else {
            moveBubbleTo(activeLink);
        }
    });

    /* ---------- Hamburger menu (tablet and phone) ---------- */
    function closeMenu() {
        nav.classList.remove('open');
        if (menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function (event) {
            event.stopPropagation();
            const isOpen = nav.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });
    }

    links.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Mobile browsers fire resize when the address bar hides or shows.
    // Only react when the width really changes.
    window.addEventListener('resize', function () {
        if (window.innerWidth === lastWidth) return;

        lastWidth = window.innerWidth;
        viewportH = window.innerHeight;

        if (lastWidth > 1000) {
            closeMenu();
        }
        moveBubbleTo(activeLink);
    });

    /* ---------- Reveal animations on scroll ---------- */
    const revealItems = document.querySelectorAll('.reveal, .section-title');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add('in-view');
        });
    }

    /* ---------- Active nav link follows the scroll position ---------- */
    const sections = document.querySelectorAll('section[id]');

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const match = nav.querySelector('a[href="#' + id + '"]');
                    setActiveLink(match);
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* ---------- Scroll progress: fades the video and the hero content ---------- */
    let ticking = false;
    let lastProgress = -1;

    function updateScroll() {
        ticking = false;

        const raw = Math.min(window.scrollY / (viewportH * 0.9), 1);
        const progress = Math.round(raw * 100) / 100;

        // Nothing changed: skip all DOM work
        if (progress === lastProgress) return;
        lastProgress = progress;

        // The variable is set only on the video container (not on the whole page)
        if (videoBg) {
            videoBg.style.setProperty('--scroll-p', String(progress));
        }

        if (heroContent) {
            const heroProgress = Math.min(progress / 0.8, 1);
            heroContent.style.opacity = String(1 - heroProgress);
            heroContent.style.transform =
                'translate3d(0, ' + (heroProgress * -60) + 'px, 0)';
        }
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }, { passive: true });

    updateScroll();

    /* ---------- Portfolio and contact ---------- */
    initPortfolio();
    initContact();
});

/* =========================================================
   PORTFOLIO: project details, grid and list view
   ========================================================= */

function initPortfolio() {
    const grid = document.getElementById('pf-grid');
    if (!grid) return;

    const cards = Array.prototype.slice.call(grid.querySelectorAll('.pf-card'));
    const body = document.getElementById('pf-d-body');
    const countEl = document.getElementById('pf-d-count');
    const titleEl = document.getElementById('pf-d-title');
    const descEl = document.getElementById('pf-d-desc');
    const tagsEl = document.getElementById('pf-d-tags');
    const roleEl = document.getElementById('pf-d-role');
    const yearEl = document.getElementById('pf-d-year');
    const linkEl = document.getElementById('pf-d-link');

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function showProject(card, animate) {
        cards.forEach(function (c) {
            c.classList.remove('sel');
        });
        card.classList.add('sel');

        const index = cards.indexOf(card);
        const url = card.dataset.url || '#';

        countEl.textContent = pad(index + 1) + ' / ' + pad(cards.length);
        titleEl.textContent = card.dataset.title;
        descEl.textContent = card.dataset.desc;
        roleEl.textContent = card.dataset.role;
        yearEl.textContent = card.dataset.year;

        tagsEl.innerHTML = '';
        card.dataset.tags.split(',').forEach(function (tag) {
            const span = document.createElement('span');
            span.className = 'pf-tag';
            span.textContent = tag.trim();
            tagsEl.appendChild(span);
        });

        linkEl.setAttribute('href', url);
        if (/^https?:/i.test(url)) {
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('rel', 'noopener');
        } else {
            linkEl.removeAttribute('target');
            linkEl.removeAttribute('rel');
        }

        if (animate) {
            body.classList.remove('swap');
            void body.offsetWidth;   // restart the animation
            body.classList.add('swap');
        }
    }

    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            showProject(card, true);
        });

        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showProject(card, true);
            }
        });
    });

    function step(direction) {
        const current = cards.indexOf(grid.querySelector('.pf-card.sel'));
        const next = (current + direction + cards.length) % cards.length;
        showProject(cards[next], true);
    }

    document.getElementById('pf-prev').addEventListener('click', function () {
        step(-1);
    });
    document.getElementById('pf-next').addEventListener('click', function () {
        step(1);
    });

    // Grid and list view
    const viewButtons = document.querySelectorAll('.pf-view');
    viewButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            viewButtons.forEach(function (b) {
                b.classList.remove('on');
                b.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('on');
            button.setAttribute('aria-pressed', 'true');
            grid.classList.toggle('list', button.dataset.view === 'list');
        });
    });

    showProject(cards[0], false);
}

/* =========================================================
   CONTACT: opening panel, country codes, validation, sending
   ========================================================= */

function initContact() {
    const toggle = document.getElementById('contact-toggle');
    const panel = document.getElementById('contact-panel');
    const closeBtn = document.getElementById('contact-close');
    const form = document.getElementById('contact-form');
    if (!toggle || !panel || !form) return;

    const successBox = document.getElementById('form-success');
    const successName = document.getElementById('success-name');
    const anotherBtn = document.getElementById('send-another');
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('f-submit');
    const honeypot = document.getElementById('f-hp');

    const fields = {
        name: document.getElementById('f-name'),
        email: document.getElementById('f-email'),
        phone: document.getElementById('f-phone'),
        message: document.getElementById('f-message')
    };

    const canHover = window.matchMedia('(hover: hover)').matches;

    /* ---------- Open and close the panel ---------- */
    let settleTimer = null;

    function openPanel() {
        clearTimeout(settleTimer);
        panel.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');

        // Let the country list extend outside the panel after the animation
        settleTimer = setTimeout(function () {
            panel.classList.add('settled');
        }, 850);

        setTimeout(function () {
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 250);

        // Do not open the keyboard automatically on phones
        if (canHover && !form.hidden) {
            setTimeout(function () {
                fields.name.focus({ preventScroll: true });
            }, 500);
        }
    }

    function closePanel() {
        clearTimeout(settleTimer);
        closeCountryList();
        panel.classList.remove('settled');
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
        if (panel.classList.contains('open')) {
            closePanel();
        } else {
            openPanel();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
    }

    /* ---------- Country code picker ---------- */
    const ccBtn = document.getElementById('cc-btn');
    const ccWrap = document.getElementById('cc-wrap');
    const ccSearch = document.getElementById('cc-search');
    const ccList = document.getElementById('cc-list');
    const ccIso = document.getElementById('cc-iso');
    const ccDial = document.getElementById('cc-dial');

    const countries = COUNTRY_DATA.map(function (line) {
        const parts = line.split('|');
        return { name: parts[0], iso: parts[1], dial: parts[2] };
    }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

    let selectedCountry = countries[0];
    const itemByIso = {};

    const emptyItem = document.createElement('li');
    emptyItem.className = 'cc-empty';
    emptyItem.textContent = 'No country found';
    emptyItem.hidden = true;

    const fragment = document.createDocumentFragment();
    countries.forEach(function (country) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        const name = document.createElement('span');
        const dial = document.createElement('span');

        button.type = 'button';
        button.className = 'cc-item';
        name.textContent = country.name;
        dial.className = 'cc-dial';
        dial.textContent = '+' + country.dial;

        button.appendChild(name);
        button.appendChild(dial);
        li.appendChild(button);
        li.dataset.search = (country.name + ' ' + country.iso + ' ' + country.dial).toLowerCase();

        button.addEventListener('click', function () {
            selectCountry(country.iso);
            closeCountryList();
            fields.phone.focus({ preventScroll: true });
        });

        itemByIso[country.iso] = button;
        fragment.appendChild(li);
    });
    fragment.appendChild(emptyItem);
    ccList.appendChild(fragment);

    function selectCountry(iso) {
        const found = countries.filter(function (c) {
            return c.iso === iso;
        })[0];
        if (!found) return;

        selectedCountry = found;
        ccIso.textContent = found.iso;
        ccDial.textContent = '+' + found.dial;

        Object.keys(itemByIso).forEach(function (key) {
            itemByIso[key].classList.toggle('sel', key === iso);
        });
    }

    // Preselect a country from the browser language (for example en-GB gives GB)
    function detectCountry() {
        let region = '';
        try {
            const locale = (navigator.languages && navigator.languages[0]) || navigator.language || '';
            const match = locale.match(/[-_]([A-Za-z]{2})$/);
            if (match) region = match[1].toUpperCase();
        } catch (error) {
            region = '';
        }
        return itemByIso[region] ? region : DEFAULT_COUNTRY;
    }

    selectCountry(detectCountry());

    function visibleItems() {
        return Array.prototype.slice.call(
            ccList.querySelectorAll('li:not([hidden]) .cc-item')
        );
    }

    function openCountryList() {
        ccWrap.classList.add('open');
        ccBtn.setAttribute('aria-expanded', 'true');
        ccSearch.value = '';
        filterCountries('');

        const selected = itemByIso[selectedCountry.iso];
        if (selected) {
            ccList.scrollTop = selected.parentElement.offsetTop - 60;
        }
        if (canHover) {
            setTimeout(function () {
                ccSearch.focus({ preventScroll: true });
            }, 50);
        }
    }

    function closeCountryList() {
        ccWrap.classList.remove('open');
        ccBtn.setAttribute('aria-expanded', 'false');
    }

    function filterCountries(query) {
        const q = query.trim().toLowerCase().replace(/^\+/, '');
        let shown = 0;

        Array.prototype.forEach.call(ccList.children, function (li) {
            if (li === emptyItem) return;
            const match = !q || li.dataset.search.indexOf(q) !== -1;
            li.hidden = !match;
            if (match) shown += 1;
        });

        emptyItem.hidden = shown !== 0;
    }

    ccBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        if (ccWrap.classList.contains('open')) {
            closeCountryList();
        } else {
            openCountryList();
        }
    });

    ccSearch.addEventListener('input', function () {
        filterCountries(ccSearch.value);
    });

    ccSearch.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const items = visibleItems();
            if (items.length) items[0].focus();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const items = visibleItems();
            if (items.length) items[0].click();
        }
    });

    ccList.addEventListener('keydown', function (event) {
        const items = visibleItems();
        const index = items.indexOf(document.activeElement);
        if (index === -1) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (items[index + 1]) items[index + 1].focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (index === 0) {
                ccSearch.focus();
            } else {
                items[index - 1].focus();
            }
        }
    });

    ccWrap.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    document.addEventListener('click', closeCountryList);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && ccWrap.classList.contains('open')) {
            closeCountryList();
            ccBtn.focus();
        }
    });

    // Only digits, spaces, dashes and brackets are allowed in the phone field
    fields.phone.addEventListener('input', function () {
        const cleaned = fields.phone.value.replace(/[^\d\s\-()]/g, '');
        if (cleaned !== fields.phone.value) {
            fields.phone.value = cleaned;
        }
    });

    /* ---------- Validation ---------- */
    function setError(key, message) {
        const field = fields[key].closest('.field');
        const errorEl = document.getElementById('err-' + key);
        field.classList.toggle('invalid', Boolean(message));
        errorEl.textContent = message || '';
    }

    Object.keys(fields).forEach(function (key) {
        fields[key].addEventListener('input', function () {
            setError(key, '');
            statusEl.textContent = '';
        });
    });

    function validate() {
        const name = fields.name.value.trim();
        const email = fields.email.value.trim();
        const digits = fields.phone.value.replace(/\D/g, '');
        const message = fields.message.value.trim();
        let firstInvalid = null;

        function fail(key, text) {
            setError(key, text);
            if (!firstInvalid) firstInvalid = fields[key];
        }

        setError('name', '');
        setError('email', '');
        setError('phone', '');
        setError('message', '');

        if (name.length < 2) {
            fail('name', 'Please enter your name.');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            fail('email', 'Please enter a valid email address.');
        }
        if (digits.length < 5 || digits.length > 14) {
            fail('phone', 'Please enter a valid phone number.');
        }
        if (message.length < 10) {
            fail('message', 'Please tell me a little more about your project.');
        }

        if (firstInvalid) {
            firstInvalid.focus();
            return null;
        }

        return {
            name: name,
            email: email,
            phone: '+' + selectedCountry.dial + ' ' + digits,
            country: selectedCountry.name,
            message: message,
            _subject: 'New project inquiry from ' + name
        };
    }

    /* ---------- Sending ---------- */
    function setBusy(isBusy) {
        submitBtn.setAttribute('aria-busy', String(isBusy));
        submitBtn.firstChild.textContent = isBusy ? 'Sending... ' : 'Send message ';
    }

    function showSuccess(name) {
        successName.textContent = name;
        form.hidden = true;
        successBox.hidden = false;
    }

    let sending = false;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (sending) return;

        statusEl.textContent = '';
        const payload = validate();
        if (!payload) return;

        // Bots fill the hidden field: pretend it worked and send nothing
        if (honeypot.value) {
            showSuccess(payload.name);
            return;
        }

        if (FORM_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
            console.error('Contact form is not connected: set FORM_ENDPOINT at the top of script.js');
            statusEl.textContent = 'The contact form is not connected yet.';
            return;
        }

        sending = true;
        setBusy(true);

        fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Request failed with status ' + response.status);
                }
                showSuccess(payload.name);
            })
            .catch(function (error) {
                console.error(error);
                statusEl.textContent = 'Something went wrong. Please check your connection and try again.';
            })
            .then(function () {
                sending = false;
                setBusy(false);
            });
    });

    anotherBtn.addEventListener('click', function () {
        form.reset();
        Object.keys(fields).forEach(function (key) {
            setError(key, '');
        });
        statusEl.textContent = '';
        successBox.hidden = true;
        form.hidden = false;
    });
}



/* =========================================================
   LANGUAGE SWITCH (English / Persian)
 
   How it works:
   - Every element with data-i18n="key" gets its text from the FA
     dictionary below when Persian is on. The English text is read
     from the HTML itself, so index.html stays your English source.
   - data-i18n-attr="placeholder:key;aria-label:key" does the same
     for attributes.
   - To add a new translated text: put data-i18n="my.key" on the
     element and add "my.key" to the FA dictionary.
   ========================================================= */
 
(function () {
    'use strict';
 
    var STORAGE_KEY = 'site-lang';
 
    /* ---------- Persian texts ---------- */
    var FA = {
        // Navigation
        'nav.home': 'خانه',
        'nav.services': 'خدمات',
        'nav.portfolio': 'نمونه‌کارها',
        'nav.about': 'درباره من',
        'nav.contact': 'تماس',
        'menu.aria': 'باز و بسته کردن منو',
        'logo.alt': 'لوگوی وب‌سایت',
 
        // Language button (shows the language you can switch TO)
        'lang.label': 'EN',
        'lang.aria': 'تغییر زبان به انگلیسی',
 
        // Hero
        'hero.tag': 'راهکار دیجیتال',
        'hero.l1': 'از ایده تا',
        'hero.l2': 'واقعیت دیجیتال',
        'hero.text': 'من وب‌سایت، اپلیکیشن وب و تجربه‌های دیجیتال مدرن طراحی و توسعه می‌دهم تا ایده‌های شما به راهکارهای واقعی تبدیل شوند.',
        'hero.btn': 'مشاهده نمونه‌کارها',
        'hero.scroll': 'اسکرول',
 
        // Services
        's.tag': 'کارهایی که انجام می‌دهم',
        's.l1': 'ساخت تجربه‌های دیجیتال',
        's.l2': 'که اهمیت دارند',
        's.text': 'از اولین طرح تا راه‌اندازی نهایی، وب‌سایت‌هایی سریع، مدرن و زیبا می‌سازم که کسب‌وکار شما را متمایز می‌کنند.',
        's.c1.t': 'طراحی وب',
        's.c1.p': 'رابط‌های تمیز و مدرن، طراحی‌شده بر اساس برند و مخاطبان شما.',
        's.c2.t': 'توسعه',
        's.c2.p': 'وب‌سایت‌ها و اپلیکیشن‌های وب سریع و واکنش‌گرا با فناوری‌های روز.',
        's.c3.t': 'تجربه دیجیتال',
        's.c3.p': 'انیمیشن‌های نرم و جزئیاتی که یک صفحه ساده را به تجربه‌ای ماندگار تبدیل می‌کنند.',
 
        // Portfolio
        'p.tag': 'نمونه‌کارهای منتخب',
        'p.l1': 'وب‌سایت‌هایی که',
        'p.l2': 'به جای من حرف می‌زنند',
        'p.count': '4 وب‌سایت · 2025 تا 2026',
        'p.grid': 'نمای شبکه‌ای',
        'p.list': 'نمای فهرستی',
        'p.cat2026': 'طراحی وب · 2026',
        'p.cat2025': 'طراحی وب · 2025',
        'p.prev': 'پروژه قبلی',
        'p.next': 'پروژه بعدی',
        'p.view': 'مشاهده پروژه',
 
        // About
        'a.tag': 'درباره من',
        'a.l1': 'طراحی وب،',
        'a.l2': 'با دقت در هر جزئیات',
        'a.name': 'یاسین میرزایی',
        'a.role': 'طراح و توسعه‌دهنده وب',
        'a.pill': 'آماده همکاری در پروژه‌ها',
        'a.bio': 'ایده‌های شما را به وب‌سایت‌هایی سریع، مدرن و زیبا تبدیل می‌کنم. هر پروژه از اهداف شما شروع می‌شود و بعد طراحی و جزئیات انیمیشنی کوچکی را می‌سازم که آن را زنده می‌کنند.',
        'a.cv': 'دانلود رزومه',
        'a.stat1': 'پروژه تحویل‌شده',
        'a.stat2': 'سال تجربه',
        'a.jtitle': 'مسیر من',
        'a.j1': 'شروع طراحی وب‌سایت',
        'a.j2': 'راه‌اندازی اولین پروژه‌های مشتریان',
        'a.j3': 'ساخت تجربه‌های وب سینمایی',
        'a.tools': 'ابزارهایی که استفاده می‌کنم',
 
        // Contact
        'c.tag': 'تماس',
        'c.l1': 'بیایید چیزی',
        'c.l2': 'عالی بسازیم',
        'c.text': 'ایده یا پروژه‌ای در ذهن دارید؟ از هر راهی که برایتان راحت‌تر است با من در تماس باشید.',
        'c.mail.label': 'ایمیل بزنید',
        'c.mail.copy': 'کپی ایمیل',
        'c.phone.label': 'تماس یا پیام',
        'c.phone.copy': 'کپی شماره تلفن',
        'c.wa': 'واتس‌اپ',
        'c.tg': 'تلگرام',
        'c.status': 'معمولاً بین 9 صبح تا 9 شب پاسخ می‌دهم',
        'c.cta.t': 'پروژه‌ای در ذهن دارید؟',
        'c.cta.p': 'درباره ایده‌تان به من بگویید تا با شما تماس بگیرم.',
        'c.cta.btn': 'بیایید صحبت کنیم',
 
        // Contact form
        'f.close': 'بستن فرم',
        'f.title': 'درباره پروژه‌تان صحبت کنیم',
        'f.sub': 'فرم را پر کنید تا در اسرع وقت با شما تماس بگیرم.',
        'f.name': 'نام شما',
        'f.name.ph': 'علی رضایی',
        'f.email': 'ایمیل',
        'f.phone': 'شماره تلفن',
        'f.cc.aria': 'انتخاب کد کشور',
        'f.cc.search': 'جست‌وجوی کشور یا کد',
        'f.msg': 'درباره پروژه‌تان بگویید',
        'f.msg.ph': 'چه نوع وب‌سایتی نیاز دارید؟ اهداف، صفحات، مهلت زمانی یا هر چیز دیگری که کمک می‌کند بنویسید.',
        'f.note': 'اطلاعات شما فقط برای پاسخ به پیامتان استفاده می‌شود.',
        'form.send': 'ارسال پیام',
        'success.title': 'سپاس،',
        'success.sub': 'پیامتان ارسال شد. به‌زودی با شما تماس می‌گیرم.',
        'success.another': 'ارسال پیام دیگر',
 
        // Texts used only by script.js
        'form.sending': 'در حال ارسال...',
        'cc.empty': 'کشوری پیدا نشد',
        'err.name': 'لطفاً نام خود را وارد کنید.',
        'err.email': 'لطفاً یک ایمیل معتبر وارد کنید.',
        'err.phone': 'لطفاً یک شماره تلفن معتبر وارد کنید.',
        'err.message': 'لطفاً کمی بیشتر درباره پروژه‌تان بنویسید.',
        'status.notconnected': 'فرم تماس هنوز متصل نشده است.',
        'status.failed': 'مشکلی پیش آمد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.'
    };
 
    /* ---------- English texts that exist only in script.js ---------- */
    var EN_EXTRA = {
        'form.sending': 'Sending...',
        'cc.empty': 'No country found',
        'err.name': 'Please enter your name.',
        'err.email': 'Please enter a valid email address.',
        'err.phone': 'Please enter a valid phone number.',
        'err.message': 'Please tell me a little more about your project.',
        'status.notconnected': 'The contact form is not connected yet.',
        'status.failed': 'Something went wrong. Please check your connection and try again.'
    };
 
    var root = document.documentElement;
    var records = [];
    var enDom = {};
    var current = 'en';
 
    function readSaved() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            return saved === 'fa' ? 'fa' : 'en';
        } catch (error) {
            return 'en';
        }
    }
 
    /* Returns the text for a key in the current language */
    function t(key) {
        if (current === 'fa' && FA[key] !== undefined) return FA[key];
        if (enDom[key] !== undefined) return enDom[key];
        if (EN_EXTRA[key] !== undefined) return EN_EXTRA[key];
        return key;
    }
 
    /* Remember the original English text of every translatable element */
    function collect() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var en = el.textContent.trim();
            records.push({ el: el, key: key, attr: null, en: en });
            if (enDom[key] === undefined) enDom[key] = en;
        });
 
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
                var parts = pair.split(':');
                if (parts.length < 2) return;
 
                var attr = parts[0].trim();
                var key = parts[1].trim();
                var en = el.getAttribute(attr) || '';
 
                records.push({ el: el, key: key, attr: attr, en: en });
                if (enDom[key] === undefined) enDom[key] = en;
            });
        });
    }
 
    function apply(lang, silent) {
        current = lang === 'fa' ? 'fa' : 'en';
 
        root.setAttribute('lang', current);
        root.setAttribute('dir', current === 'fa' ? 'rtl' : 'ltr');
 
        records.forEach(function (record) {
            var value = (current === 'fa' && FA[record.key] !== undefined)
                ? FA[record.key]
                : record.en;
 
            if (record.attr) {
                record.el.setAttribute(record.attr, value);
            } else {
                record.el.textContent = value;
            }
        });
 
        if (!silent) {
            try {
                localStorage.setItem(STORAGE_KEY, current);
            } catch (error) { /* private mode: the choice is just not saved */ }
 
            document.dispatchEvent(new CustomEvent('sitelangchange', {
                detail: { lang: current }
            }));
        }
    }
 
    collect();
    apply(readSaved(), true);
 
    var switchBtn = document.getElementById('lang-toggle');
    if (switchBtn) {
        switchBtn.addEventListener('click', function () {
            apply(current === 'fa' ? 'en' : 'fa');
        });
    }
 
    window.I18N = {
        t: t,
        set: apply,
        get lang() { return current; }
    };
})();