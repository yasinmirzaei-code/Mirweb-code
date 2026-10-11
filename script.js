document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.glass-nav');
    const menuToggle = document.querySelector('.menu-toggle');

    if (!nav) {
        console.error('Element .glass-nav not found');
        return;
    }

    const links = nav.querySelectorAll('a');
    const bubble = nav.querySelector('.nav-bubble');
    let activeLink = nav.querySelector('a.active') || links[0];

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

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1000) {
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
    const heroContent = document.querySelector('.hero-content');
    let ticking = false;

    function updateScroll() {
        const progress = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);

        // Used by CSS to darken and blur the background video
        document.documentElement.style.setProperty('--scroll-p', progress.toFixed(3));

        if (heroContent) {
            const heroProgress = Math.min(progress / 0.8, 1);
            heroContent.style.opacity = String(1 - heroProgress);
            heroContent.style.transform = 'translateY(' + (heroProgress * -60) + 'px)';
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }, { passive: true });

    updateScroll();
});