document.addEventListener('DOMContentLoaded', () => {
            const slider = document.getElementById('slider');
            const slides = document.querySelectorAll('#slider > div');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const pagination = document.getElementById('pagination');
            const progressFill = document.getElementById('progressFill');
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            const autoplaySpeed = 5000;
            let autoplayInterval;
            let touchStartX = 0;
            let touchEndX = 0;

            // Initialize Pagination
            slides.forEach((_, i) => {
                const pill = document.createElement('div');
                pill.className = `h-2 rounded-full transition-all duration-300 cursor-pointer ${i === 0 ? 'w-8 bg-primary-container' : 'w-2 bg-white/20 hover:bg-white/40'}`;
                pill.addEventListener('click', () => goToSlide(i));
                pagination.appendChild(pill);
            });

            const updatePagination = () => {
                const pills = pagination.querySelectorAll('div');
                pills.forEach((pill, i) => {
                    if (i === currentIndex) {
                        pill.className = 'h-2 w-8 bg-primary-container rounded-full transition-all duration-300';
                    } else {
                        pill.className = 'h-2 w-2 bg-white/20 rounded-full transition-all duration-300 hover:bg-white/40';
                    }
                });
            };

            const animateContent = (index) => {
                const allContent = document.querySelectorAll('.slide-content');
                allContent.forEach((el, i) => {
                    if (i === index) {
                        setTimeout(() => {
                            el.classList.remove('opacity-0', 'translate-y-10');
                            el.classList.add('opacity-100', 'translate-y-0');
                        }, 200);
                    } else {
                        el.classList.add('opacity-0', 'translate-y-10');
                        el.classList.remove('opacity-100', 'translate-y-0');
                    }
                });
            };

            const resetProgressBar = () => {
                progressFill.style.transition = 'none';
                progressFill.style.width = '0%';
                setTimeout(() => {
                    progressFill.style.transition = `width ${autoplaySpeed}ms linear`;
                    progressFill.style.width = '100%';
                }, 50);
            };

            const goToSlide = (index) => {
                currentIndex = index;
                if (currentIndex >= totalSlides) currentIndex = 0;
                if (currentIndex < 0) currentIndex = totalSlides - 1;
                
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                updatePagination();
                animateContent(currentIndex);
                startAutoplay();
            };

            const startAutoplay = () => {
                clearInterval(autoplayInterval);
                resetProgressBar();
                autoplayInterval = setInterval(() => {
                    goToSlide(currentIndex + 1);
                }, autoplaySpeed);
            };

            // Event Listeners
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

            // Keyboard Nav
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
                if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
            });

            // Touch support
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});

            const handleSwipe = () => {
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) goToSlide(currentIndex + 1);
                    else goToSlide(currentIndex - 1);
                }
            };

            // Init call
            goToSlide(0);
        });