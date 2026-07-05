/* ============================================
   THINU CABS & TOURS - Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ========== MOBILE NAVIGATION ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.createElement('div');
    navOverlay.classList.add('nav-overlay');
    document.body.appendChild(navOverlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);

    // Close menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ========== HEADER SCROLL ==========
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== ACTIVE NAV LINK ON SCROLL ==========
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========== HERO SLIDER ==========
    const heroSlider = document.getElementById('heroSlider');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    const heroDotsContainer = document.getElementById('heroDots');
    let currentSlide = 0;
    let heroInterval;
    const SLIDE_DURATION = 6000;

    // Create dots
    heroSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
        dot.addEventListener('click', () => goToSlide(index));
        heroDotsContainer.appendChild(dot);
    });

    const heroDots = document.querySelectorAll('.hero-dot');

    function goToSlide(index) {
        heroSlides[currentSlide].classList.remove('active');
        heroDots[currentSlide].classList.remove('active');

        currentSlide = index;

        heroSlides[currentSlide].classList.add('active');
        heroDots[currentSlide].classList.add('active');

        // Re-trigger hero animations
        const content = heroSlides[currentSlide].querySelector('.hero-content');
        const subtitle = content.querySelector('.hero-subtitle');
        const title = content.querySelector('.hero-title');
        const desc = content.querySelector('.hero-desc');
        const buttons = content.querySelector('.hero-buttons');

        [subtitle, title, desc, buttons].forEach((el, i) => {
            if (el) {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = `heroFadeUp 0.8s ease ${i * 0.2}s forwards`;
            }
        });

        resetHeroInterval();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % heroSlides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
    }

    function resetHeroInterval() {
        clearInterval(heroInterval);
        heroInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    heroNext.addEventListener('click', nextSlide);
    heroPrev.addEventListener('click', prevSlide);

    // Auto-play
    heroInterval = setInterval(nextSlide, SLIDE_DURATION);

    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => clearInterval(heroInterval));
    heroSlider.addEventListener('mouseleave', () => {
        heroInterval = setInterval(nextSlide, SLIDE_DURATION);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'Escape') closeLightbox();
    });

    // Touch / swipe support for hero
    let heroTouchStartX = 0;
    let heroTouchEndX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
        heroTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
        heroTouchEndX = e.changedTouches[0].screenX;
        const diff = heroTouchStartX - heroTouchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    // ========== STATS COUNTER ANIMATION ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target'));
            const isDecimal = el.getAttribute('data-decimal') === 'true';
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    el.textContent = current.toFixed(1);
                } else {
                    el.textContent = Math.floor(current).toLocaleString() + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // ========== SCROLL ANIMATIONS (Intersection Observer) ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stats bar
                if (entry.target.classList.contains('stats-bar')) {
                    animateStats();
                }

                // Fade in elements
                entry.target.classList.add('visible');

                // Only observe once
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in classes and observe
    document.querySelectorAll('.service-card, .tour-card, .fleet-card, .gallery-item, .contact-card, .about-feature, .about-images, .about-content').forEach(el => {
        el.classList.add('fade-in');
        scrollObserver.observe(el);
    });

    // Observe stats bar
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        scrollObserver.observe(statsBar);
    }

    // ========== TOUR FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            tourCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Add fadeIn keyframe dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);

    // ========== REVIEWS SLIDER ==========
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewPrev = document.getElementById('reviewPrev');
    const reviewNext = document.getElementById('reviewNext');
    let reviewIndex = 0;
    let reviewsPerView = 3;
    let autoReviewInterval;

    function updateReviewsPerView() {
        if (window.innerWidth <= 768) {
            reviewsPerView = 1;
        } else if (window.innerWidth <= 1024) {
            reviewsPerView = 2;
        } else {
            reviewsPerView = 3;
        }
    }

    function getMaxReviewIndex() {
        return Math.max(0, reviewCards.length - reviewsPerView);
    }

    function updateReviewSlider() {
        updateReviewsPerView();
        const maxIndex = getMaxReviewIndex();
        if (reviewIndex > maxIndex) reviewIndex = maxIndex;
        const percentage = (reviewIndex * 100) / reviewCards.length;
        reviewsTrack.style.transform = `translateX(-${percentage}%)`;
    }

    reviewNext.addEventListener('click', () => {
        const maxIndex = getMaxReviewIndex();
        reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
        updateReviewSlider();
        resetAutoReview();
    });

    reviewPrev.addEventListener('click', () => {
        const maxIndex = getMaxReviewIndex();
        reviewIndex = reviewIndex <= 0 ? maxIndex : reviewIndex - 1;
        updateReviewSlider();
        resetAutoReview();
    });

    function resetAutoReview() {
        clearInterval(autoReviewInterval);
        autoReviewInterval = setInterval(() => {
            const maxIndex = getMaxReviewIndex();
            reviewIndex = reviewIndex >= maxIndex ? 0 : reviewIndex + 1;
            updateReviewSlider();
        }, 5000);
    }

    updateReviewSlider();
    resetAutoReview();

    // Touch / swipe support for reviews
    let reviewTouchStartX = 0;
    let reviewTouchEndX = 0;

    const reviewsSlider = document.getElementById('reviewsSlider');
    reviewsSlider.addEventListener('touchstart', (e) => {
        reviewTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewsSlider.addEventListener('touchend', (e) => {
        reviewTouchEndX = e.changedTouches[0].screenX;
        const diff = reviewTouchStartX - reviewTouchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) reviewNext.click();
            else reviewPrev.click();
        }
    }, { passive: true });

    // Resize handler
    window.addEventListener('resize', () => {
        updateReviewSlider();
    });

    // ========== GALLERY LIGHTBOX ==========
    const galleryItems = document.querySelectorAll('.gallery-item');
    let lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close lightbox"><i class="fas fa-times"></i></button><img src="" alt="Gallery image">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    function getBackgroundImageUrl(el) {
        const bg = window.getComputedStyle(el).backgroundImage;
        const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
        return match ? match[1].replace(/w=\d+/, 'w=1200') : '';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgUrl = getBackgroundImageUrl(item);
            lightboxImg.src = imgUrl;
            lightboxImg.alt = item.querySelector('.gallery-overlay span').textContent;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // ========== BOOKING FORM VALIDATION & SUBMISSION ==========
    const bookingForm = document.getElementById('bookingForm');

    // Set minimum date to today
    const dateInput = document.getElementById('fdate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    if (!dateInput.value) {
        dateInput.value = today;
    }

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Clear previous errors
        bookingForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        bookingForm.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));

        // Validate required fields
        const requiredFields = [
            { id: 'fname', name: 'Full Name' },
            { id: 'femail', name: 'Email' },
            { id: 'fphone', name: 'Phone / WhatsApp' },
            { id: 'fpickup', name: 'Pickup Location' },
            { id: 'fdate', name: 'Travel Date' },
            { id: 'fservice', name: 'Service Type' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const value = input.value.trim();

            if (!value) {
                showError(input, field.name + ' is required');
                isValid = false;
                return;
            }

            // Email validation
            if (field.id === 'femail' && !isValidEmail(value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
                return;
            }
        });

        if (!isValid) return;

        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');

            // Show success message
            bookingForm.style.display = 'none';

            const successMsg = document.createElement('div');
            successMsg.classList.add('form-success', 'visible');
            successMsg.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Booking Request Sent!</h3>
                <p>Thank you for choosing Thinu Cabs & Tours. We will review your request and send you a confirmation email with a detailed quote within 1 hour.</p>
                <p style="margin-top: 16px; color: var(--gold-500); font-weight: 600;">For immediate assistance, contact us on WhatsApp: +94 76 526 2359</p>
            `;
            bookingForm.parentElement.appendChild(successMsg);

            // Reset form after delay
            setTimeout(() => {
                bookingForm.reset();
                bookingForm.style.display = '';
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                successMsg.remove();
                dateInput.value = today;
            }, 8000);

        }, 1500);
    });

    function showError(input, message) {
        input.classList.add('error');

        // Check if error message already exists
        let errorMsg = input.parentElement.querySelector('.error-msg');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.classList.add('error-msg');
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.classList.add('visible');

        // Remove error on input
        input.addEventListener('input', function handler() {
            input.classList.remove('error');
            if (errorMsg) errorMsg.classList.remove('visible');
            input.removeEventListener('input', handler);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== PARALLAX-LIKE SUBTLE EFFECT ON HERO ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            const activeSlide = document.querySelector('.hero-slide.active');
            if (activeSlide) {
                activeSlide.style.backgroundPositionY = `${scrolled * 0.3}px`;
            }
        }
    });

    // ========== TYPING / CURSOR EFFECT (Optional Enhancement) ==========
    // Subtle gold shimmer on section titles when in view
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.section-title').forEach(title => {
        titleObserver.observe(title);
    });

    // ========== PERFORMANCE: Lazy load images in gallery ==========
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    imgObserver.unobserve(entry.target);
                }
            });
        });

        galleryItems.forEach(item => {
            imgObserver.observe(item);
        });
    }

    // ========== CONSOLE BRANDING ==========
    console.log(
        '%c Thinu Cabs & Tours ',
        'background: linear-gradient(135deg, #d4af37, #f0d060); color: #0a1628; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 4px;'
    );
    console.log('%c Premium Sri Lanka Tours & Airport Transfers', 'color: #d4af37; font-size: 12px;');
    console.log('%c WhatsApp: +94 76 526 2359', 'color: #888; font-size: 11px;');

});