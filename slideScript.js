// =========================================================================
// Hero Slider with Video Background + Touch Support
// =========================================================================

(function() {
    let currentIndex = 0;
    
    const slides = document.querySelectorAll('.slide-content');
    const videos = document.querySelectorAll('.slide-video');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active-dot', i === index);
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
    }
    
    function playVideo(index) {
        const video = videos[index];
        if (video && video.tagName === 'VIDEO') {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Autoplay blocked — try on first user interaction
                    const tryPlay = () => {
                        video.play().catch(() => {});
                        document.removeEventListener('click', tryPlay);
                        document.removeEventListener('touchstart', tryPlay);
                    };
                    document.addEventListener('click', tryPlay, { once: true });
                    document.addEventListener('touchstart', tryPlay, { once: true });
                });
            }
        }
    }
    
    function pauseVideo(index) {
        const video = videos[index];
        if (video && video.tagName === 'VIDEO') {
            video.pause();
        }
    }
    
    function changeSlide(index) {
        pauseVideo(currentIndex);
        
        slides[currentIndex].classList.remove('active-slide');
        videos[currentIndex].classList.remove('active-video');
        
        currentIndex = index;
        
        slides[currentIndex].classList.add('active-slide');
        videos[currentIndex].classList.add('active-video');
        
        updateDots(currentIndex);
        playVideo(currentIndex);
    }
    
    function nextSlide() {
        changeSlide((currentIndex + 1) % slides.length);
    }
    
    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (index !== currentIndex) {
                changeSlide(index);
                resetInterval();
            }
        });
    });
    
    // ----- TOUCH / SWIPE SUPPORT -----
    const heroSection = document.querySelector('.hero-section');
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;
    
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                if (diff > 0) {
                    // Swipe left → next slide
                    changeSlide((currentIndex + 1) % slides.length);
                } else {
                    // Swipe right → previous slide
                    changeSlide((currentIndex - 1 + slides.length) % slides.length);
                }
                resetInterval();
            }
        }, { passive: true });
    }
    
    // ----- AUTO-ADVANCE INTERVAL -----
    let slideInterval = setInterval(nextSlide, 8000);
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 8000);
    }
    
    // Play first video once DOM is ready
    function startFirstVideo() {
        playVideo(0);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(startFirstVideo, 200);
        });
    } else {
        setTimeout(startFirstVideo, 200);
    }
    
    // Handle page visibility — pause/resume interval
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(slideInterval);
            pauseVideo(currentIndex);
        } else {
            playVideo(currentIndex);
            slideInterval = setInterval(nextSlide, 8000);
        }
    });
})();
