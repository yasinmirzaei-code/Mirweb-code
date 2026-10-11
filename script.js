document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.glass-nav');
    const menuToggle = document.querySelector('.menu-toggle');

    if (!nav) {
        console.error('Element .glass-nav not found');
        return;
    }

    const links = nav.querySelectorAll('a');
    const bubble = nav.querySelector('.nav-bubble');
    const activeLink = nav.querySelector('a.active') || links[0];

    /* ---------- Sliding bubble (desktop) ---------- */
    function moveBubbleTo(el) {
        if (!bubble || !el) return;
        bubble.style.width = el.offsetWidth + 'px';
        bubble.style.height = el.offsetHeight + 'px';
        bubble.style.transform =
            'translate(' + el.offsetLeft + 'px, ' + el.offsetTop + 'px)';
        bubble.style.opacity = 1;
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
    if (!menuToggle) {
        console.error('Element .menu-toggle not found');
        return;
    }

    function closeMenu() {
        nav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        const isOpen = nav.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
        if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1000) {
            closeMenu();
        }
        moveBubbleTo(activeLink);
    });
});