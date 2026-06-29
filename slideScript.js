
(function() {
    let currentIndex = 0;
    
    const slides = document.querySelectorAll('.slide-content');
    const videos = document.querySelectorAll('.slide-video');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    function updateDots(index) {
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    }
    
    function playVideo(index) {
        const video = videos[index];
        if (video && video.tagName === 'VIDEO') {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log('Autoplay blocked:', e);
                    const tryPlay = () => {
                        video.play().catch(() => {});
                        document.removeEventListener('click', tryPlay);
                        document.removeEventListener('touchstart', tryPlay);
                    };
                    document.addEventListener('click', tryPlay);
                    document.addEventListener('touchstart', tryPlay);
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
        // Pause current video
        pauseVideo(currentIndex);
        
        // Remove active classes
        slides[currentIndex].classList.remove('active-slide');
        videos[currentIndex].classList.remove('active-video');
        
        // Update current index
        currentIndex = index;
        
        // Add active classes to new slide
        slides[currentIndex].classList.add('active-slide');
        videos[currentIndex].classList.add('active-video');
        
        // Update dots
        updateDots(currentIndex);
        
        // Play new video
        playVideo(currentIndex);
    }
    
    function nextSlide() {
        let nextIndex = (currentIndex + 1) % slides.length;
        changeSlide(nextIndex);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (index !== currentIndex) {
                changeSlide(index);
                
                // Reset the interval timer
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 8000);
            }
        });
    });
    
    // Try to play first video immediately with multiple attempts
    function startFirstVideo() {
        playVideo(0);
    }
    
    // Attempt on page load
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(startFirstVideo, 100);
        setTimeout(startFirstVideo, 500);
        setTimeout(startFirstVideo, 1000);
    });
    
    // Also try when window loads
    window.addEventListener('load', function() {
        setTimeout(startFirstVideo, 100);
    });
    
    // Start the interval
    let slideInterval = setInterval(nextSlide, 8000);
    
    // Handle page visibility
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            playVideo(currentIndex);
        }
    });
})();
