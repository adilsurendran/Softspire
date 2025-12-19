
tailwind.config = {
    theme: {
        extend: {
            colors: {
                softRed: "rgb(238, 47, 80)",
                primary: "rgb(238, 47, 80)"
            },
            boxShadow: {
                glow: "0 4px 20px rgba(238, 47, 80, 0.4)",
                "glow-hover": "0 4px 25px rgba(238, 47, 80, 0.6)",
            }
        },
    }
};

document.addEventListener("DOMContentLoaded", function () {
    // --- Mobile Menu Logic ---
    const body = document.body;
    const menu = document.getElementById("mobileMenu");
    const menuBtn = document.getElementById("menuBtn");
    const closeMenu = document.getElementById("closeMenu");
    const overlay = document.getElementById("overlay");

    const servicesBtn = document.getElementById("servicesBtn");
    const servicesMenu = document.getElementById("servicesMenu");
    const servicesArrow = document.getElementById("servicesArrow");

    if (menuBtn) {
        menuBtn.onclick = () => {
            menu.classList.add("open");
            overlay.classList.add("show");
            body.classList.add("no-scroll");
        };
    }

    function closeSidebar() {
        if (menu) menu.classList.remove("open");
        if (overlay) overlay.classList.remove("show");
        body.classList.remove("no-scroll");
    }

    if (closeMenu) closeMenu.onclick = closeSidebar;
    if (overlay) overlay.onclick = closeSidebar;

    if (servicesBtn) {
        servicesBtn.onclick = () => {
            servicesMenu.classList.toggle("hidden");
            servicesArrow.classList.toggle("rotate-180");
        };
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach((el) => observer.observe(el));

    // =======================
    // TESTIMONIAL SLIDER
    // =======================
    const track = document.getElementById("testimonialTrack");
    const prevBtn = document.getElementById("testimonialPrev");
    const nextBtn = document.getElementById("testimonialNext");

    if (track && prevBtn && nextBtn) {
        let isAnimating = false;
        let autoTimer = null;

        function getSlideDistance() {
            const firstCard = track.querySelector(".testimonial-card");
            if (!firstCard) return 0;

            const cardRect = firstCard.getBoundingClientRect();
            const styles = window.getComputedStyle(track);
            const gap =
                parseFloat(styles.columnGap || styles.gap || "0") || 0;

            return cardRect.width + gap;
        }

        function goNext() {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideDistance();
            if (!distance) {
                isAnimating = false;
                return;
            }

            track.style.transition = "transform 0.7s ease";
            track.style.transform = `translateX(-${distance}px)`;
        }

        function goPrev() {
            if (isAnimating) return;
            isAnimating = true;

            const distance = getSlideDistance();
            if (!distance) {
                isAnimating = false;
                return;
            }

            // move last card to the front instantly, then slide back to 0
            track.style.transition = "none";
            const last = track.lastElementChild;
            if (last) {
                track.insertBefore(last, track.firstElementChild);
            }

            track.style.transform = `translateX(-${distance}px)`;
            // force reflow so browser applies the transform before animating
            void track.offsetWidth;

            track.style.transition = "transform 0.7s ease";
            track.style.transform = "translateX(0)";
        }

        // When the animation to next finishes, move first to end and reset
        track.addEventListener("transitionend", () => {
            const style = window.getComputedStyle(track);
            const matrix = new WebKitCSSMatrix(style.transform);
            const movedLeft = matrix.m41 !== 0; // negative when moved left

            if (movedLeft) {
                const first = track.firstElementChild;
                if (first) {
                    track.appendChild(first);
                }
            }

            track.style.transition = "none";
            track.style.transform = "translateX(0)";

            // force reflow after resetting
            void track.offsetWidth;

            isAnimating = false;
        });

        function resetAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = setInterval(() => {
                goNext();
            }, 5000); // 5 seconds
        }

        // Buttons
        nextBtn.addEventListener("click", () => {
            goNext();
            resetAuto();
        });

        prevBtn.addEventListener("click", () => {
            goPrev();
            resetAuto();
        });

        // Pause on hover (optional, nice UX)
        const section = track.closest("section");
        if (section) {
            section.addEventListener("mouseenter", () => {
                if (autoTimer) clearInterval(autoTimer);
            });
            section.addEventListener("mouseleave", resetAuto);
        }

        // Handle resize – just restart timer (distance is always recalculated)
        window.addEventListener("resize", () => {
            resetAuto();
        });

        // start autoplay
        resetAuto();
    }

    // =======================
    // FAQ ACCORDION
    // =======================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle active class on the button
            question.classList.toggle('active');

            // Toggle max-height on the answer panel
            const answer = question.nextElementSibling;
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = "0";
            }
        });
    });

    // =======================
    // CONTACT FAQ ACCORDION
    // =======================
    const minimalFaqBtns = document.querySelectorAll('.faq-btn-minimal');

    minimalFaqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class
            btn.classList.toggle('active');

            // Toggle content
            const content = btn.nextElementSibling;
            content.classList.toggle('open');

            if (content.style.maxHeight && content.style.maxHeight !== '0px') {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = '1';
            }
        });
    });

    // =======================
    // NEWSLETTER FORM
    // =======================
    const newsletterForm = document.getElementById('unifiedNewsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const userText = btn.innerHTML;

            // Simple visual feedback
            btn.innerHTML = 'Subscribed!';
            btn.classList.add('bg-green-600', 'hover:bg-green-700');
            btn.classList.remove('bg-softRed', 'hover:bg-red-600');

            setTimeout(() => {
                newsletterForm.reset();
                btn.innerHTML = userText;
                btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                btn.classList.add('bg-softRed', 'hover:bg-red-600');
            }, 3000);
        });
    }

    // =======================
    // SCROLL TO TOP BUTTON
    // =======================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        // Toggle visibility on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight) {
                scrollTopBtn.setAttribute('data-visible', 'true');
            } else {
                scrollTopBtn.setAttribute('data-visible', 'false');
            }
        });

        // Smooth scroll to top
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
