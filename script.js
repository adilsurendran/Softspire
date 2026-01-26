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
            servicesMenu.classList.toggle("d-none");
            servicesMenu.classList.toggle("d-flex");
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
    // MISSION VISION CARD MOUSE TRACKING
    // =======================
    const mvCards = document.querySelectorAll('.mission-vision-card');
    mvCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // =======================
    // CONTACT FAQ ACCORDION
    // =======================
    const minimalFaqBtns = document.querySelectorAll('.faq-btn-minimal');

    minimalFaqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;

            // Toggle classes once
            btn.classList.toggle('active');
            content.classList.toggle('open');

            if (btn.classList.contains('active')) {
                content.style.maxHeight = (content.scrollHeight + 50) + "px";
            } else {
                content.style.maxHeight = "0";
            }
        });
    });

    // =======================
    // NEWSLETTER FORM
    // =======================
    // =======================
    // NEWSLETTER FORM
    // =======================
    const newsletterForm = document.getElementById('unifiedNewsletterForm');
    const newsletterEmailInput = document.getElementById('newsletterEmailInput');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!newsletterEmailInput) return;
            const emailVal = newsletterEmailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Remove error style first
            newsletterEmailInput.classList.remove('border-softRed', 'border-2', 'border-red-500');

            if (!emailVal || !emailPattern.test(emailVal)) {
                // Invalid
                newsletterEmailInput.classList.add('border-softRed', 'border-2', 'border-red-500');
                newsletterEmailInput.focus();
                return;
            }

            // Valid - Show Success Modal
            if (typeof showSuccessModal === 'function') {
                showSuccessModal();
            }
            newsletterEmailInput.value = "";
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
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
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


    // =======================
    // CONTACT FORM VALIDATION Logic (Unified Scope)
    // =======================
    const contactForm = document.getElementById('contactForm');

    const submitBtn = document.getElementById('submitBtn');

    // Inputs
    const nameInput = document.getElementById('nameInput');
    const placeInput = document.getElementById('placeInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const messageInput = document.getElementById('messageInput');

    // SUCCESS MODAL ELEMENTS
    const successModal = document.getElementById('successModal');

    if (submitBtn) {
        submitBtn.addEventListener('click', validateAndSubmit);
    }

    // FAQ Submit Logic
    const faqSubmitBtn = document.getElementById('faqSubmitBtn');
    const faqEmailInput = document.getElementById('faqEmailInput');

    if (faqSubmitBtn) {
        faqSubmitBtn.addEventListener('click', () => {
            if (!faqEmailInput) return;
            const emailVal = faqEmailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Remove error style first
            faqEmailInput.classList.remove('border-softRed', 'border-2', 'border-red-500');

            if (!emailVal || !emailPattern.test(emailVal)) {
                // Invalid: Show error style
                faqEmailInput.classList.add('border-softRed', 'border-2');
                faqEmailInput.focus();
                return;
            }

            // Valid: Show success modal
            showSuccessModal();
            faqEmailInput.value = "";
        });
    }

    function validateAndSubmit() {
        let isValid = true;

        // Reset all errors
        document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));
        [nameInput, placeInput, emailInput, phoneInput].forEach(inp => {
            if (inp) inp.classList.remove('border-softRed');
        });

        // 1. Validate Name (Not empty)
        if (!nameInput.value.trim()) {
            showError(nameInput, 'nameError');
            isValid = false;
        }

        // 2. Validate Place (Not empty)
        if (!placeInput.value.trim()) {
            showError(placeInput, 'placeError');
            isValid = false;
        }

        // 3. Validate Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, 'emailError');
            isValid = false;
        }

        // 4. Validate Phone (Simple check: Just digits/symbols, length > 6)
        // Adjust regex as per strictness required.
        const phonePattern = /^[\d\+\-\s]{7,15}$/;
        if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value.trim())) {
            showError(phoneInput, 'phoneError');
            isValid = false;
        }

        if (isValid) {
            // Form is valid - Show Success Modal
            showSuccessModal();
        }
    }

    function showError(inputElement, errorId) {
        inputElement.classList.add('border-softRed');
        const errorMsg = document.getElementById(errorId);
        if (errorMsg) errorMsg.classList.remove('hidden');
    }

    function showSuccessModal() {
        if (!successModal) return;

        // Show Modal (Ensure flex is applied for centering)
        successModal.classList.remove('hidden');
        successModal.classList.add('flex'); // Add flex explicitly to keep centering

        // Force reflow to enable transition
        void successModal.offsetWidth;

        // Add class to trigger CSS transitions (Opacity/Scale)
        successModal.classList.add('show');

        // Reset Form
        if (contactForm) contactForm.reset();

        // Hide after 5 seconds
        setTimeout(() => {
            hideSuccessModal();
        }, 3000);
    }

    function hideSuccessModal() {
        if (!successModal) return;

        // Remove class to reverse transitions (starts fade out / scale down)
        // BUT keep 'flex' so it stays centered!
        successModal.classList.remove('show');

        // Wait for transition (modified to 500ms for smoothness) before hiding display
        setTimeout(() => {
            successModal.classList.remove('flex'); // Remove flex now
            successModal.classList.add('hidden');
        }, 500); // 500ms matches the new smoother CSS duration
    }

    // =======================
    // PREMIUM SPLASH SCREEN LOGIC
    // =======================
    const splashScreen = document.getElementById('splash-screen');

    function hideSplashScreen() {
        if (!splashScreen) return;

        // Start zoom-out animation on logo
        splashScreen.classList.add('zoom-out');

        // Start fade-out on container
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            body.classList.remove('no-scroll');
        }, 100);

        // Remove from DOM after transition
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 900);
    }

    function showSplashScreen() {
        if (!splashScreen) return;
        splashScreen.style.display = 'flex';
        splashScreen.classList.remove('fade-out', 'zoom-out');
        void splashScreen.offsetWidth; // Force reflow
        splashScreen.classList.add('active');
        body.classList.add('no-scroll');
    }

    // Trigger on initial page load
    window.addEventListener('load', () => {
        // Reduced delay for "silky" feeling, ensuring animation finishes
        setTimeout(hideSplashScreen, 800);
    });

    // Navigation Interception for internal links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Check if it's an internal link and not a hash/external
            if (href && !href.startsWith('#') && !href.startsWith('http') && !link.hasAttribute('target')) {
                e.preventDefault();
                showSplashScreen();
                setTimeout(() => {
                    window.location.href = href;
                }, 600); // Match with zoom-in feel
            }
        });
    });
});
