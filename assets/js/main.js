/**
 * Softspire Technologies - Enhanced JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Header Scroll Effect
    const initStickyHeader = () => {
        const header = document.getElementById('header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check on load
    };

    // Mobile Navigation
    const initMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close menu when clicking links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    };

    // Smooth Scrolling
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerHeight = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // Active Navigation Links
    const initActiveNavLinks = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    };

    // Number Counter Animation
    const initCounters = () => {
        const counters = document.querySelectorAll('[data-target]');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    };

    // FAQ Accordion
    const initFAQ = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active', !isActive);
            });
        });
    };

    // Contact Form Handler
    const initContactForm = () => {
        const form = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'message'];
            const missingFields = requiredFields.filter(field => !data[field]?.trim());
            
            if (missingFields.length > 0) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                form.reset();
                
            } catch (error) {
                showFormMessage('Something went wrong. Please try again.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });

        function showFormMessage(message, type) {
            if (!formMessage) return;
            
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    };

    // Newsletter Form Handler
    const initNewsletterForm = () => {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            try {
                button.textContent = 'Subscribing...';
                button.disabled = true;
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showNotification('Thank you for subscribing! Check your email for confirmation.', 'success');
                form.reset();
                
            } catch (error) {
                showNotification('Something went wrong. Please try again.', 'error');
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    };

    // Clients Carousel
    const initClientsCarousel = () => {
        const track = document.getElementById('clientsTrack');
        if (!track) return;

        // Clone elements for seamless loop
        const items = track.children;
        const itemsArray = Array.from(items);
        
        // Clone all items and append them
        itemsArray.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // Pause animation on hover
        const carousel = document.querySelector('.clients-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                track.style.animationPlayState = 'paused';
            });
            
            carousel.addEventListener('mouseleave', () => {
                track.style.animationPlayState = 'running';
            });
        }
    };

    // Form Input Enhancements
    const initFormEnhancements = () => {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            // Focus effects
            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--primary)';
                input.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.style.borderColor = 'var(--gray-200)';
                    input.style.boxShadow = 'none';
                }
            });
            
            // Keep focus styles if input has value
            if (input.value) {
                input.style.borderColor = 'var(--primary)';
            }
        });
    };

    // Scroll Animations
    const initScrollAnimations = () => {
        const animateElements = document.querySelectorAll('.card, .service-card, .testimonial-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };

    // Back to Top Button
    const initBackToTop = () => {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(backToTop);
        
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'translateY(-3px)';
        });

        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'translateY(0)';
        });
    };

    // Notification System
    const showNotification = (message, type = 'info') => {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'var(--secondary)' : type === 'error' ? '#EF4444' : 'var(--primary)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-xl);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    };

    // Resize Handler
    const handleResize = () => {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    };

    // Initialize all functions
    initStickyHeader();
    initMobileNav();
    initSmoothScroll();
    initActiveNavLinks();
    initCounters();
    initFAQ();
    initContactForm();
    initNewsletterForm();
    initClientsCarousel();
    initFormEnhancements();
    initScrollAnimations();
    initBackToTop();

    // Event listeners
    window.addEventListener('resize', handleResize);

    // Make showNotification available globally
    window.showNotification = showNotification;
});