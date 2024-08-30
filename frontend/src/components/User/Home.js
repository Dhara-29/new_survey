import React, { useEffect, useState } from 'react';
import '../User/Home.css';
import Footer from './Footer';
import Header from './Header';

export default function Home() {
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const carousel = document.querySelector('.carousel');
        const slides = carousel.querySelectorAll('.slide');
        const dotsContainer = carousel.querySelector('.dots');
        const timer = carousel.querySelector('.timer');
        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');
        const pausePlayButton = carousel.querySelector('.pause-play-button');
        const pausePlayIcon = pausePlayButton.querySelector('svg');
        const pausePlayLabel = pausePlayButton.querySelector('span');

        let currentSlide = 0;
        const slideInterval = 4000; // 4 seconds
        let slideTimer;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dotsContainer.children[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dotsContainer.children[currentSlide].classList.add('active');
            resetTimer();
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function resetTimer() {
            if (isPaused) return;
            clearTimeout(slideTimer);
            timer.style.transition = 'none';
            timer.style.width = '0%';
            setTimeout(() => {
                timer.style.transition = 'width 4s linear';
                timer.style.width = '100%';
            }, 10);
            slideTimer = setTimeout(nextSlide, slideInterval);
        }

        function togglePause() {
            setIsPaused(prev => !prev);
        }

        // Event listeners
        const handlePrevButtonClick = (e) => {
            e.preventDefault();
            prevSlide();
        };

        const handleNextButtonClick = (e) => {
            e.preventDefault();
            nextSlide();
        };

        prevButton.addEventListener('click', handlePrevButtonClick);
        nextButton.addEventListener('click', handleNextButtonClick);
        pausePlayButton.addEventListener('click', togglePause);

        function adjustFocalPoint() {
            slides.forEach(slide => {
                const img = slide.querySelector('img');
                const focalX = img.dataset.focalX / 100;
                const focalY = img.dataset.focalY / 100;

                const containerAspect = carousel.offsetWidth / carousel.offsetHeight;
                const imageAspect = img.naturalWidth / img.naturalHeight;

                let scale, translateX, translateY;

                if (containerAspect > imageAspect) {
                    scale = carousel.offsetWidth / img.naturalWidth;
                    translateX = 0;
                    translateY = (carousel.offsetHeight - img.naturalHeight * scale) * focalY;
                } else {
                    scale = carousel.offsetHeight / img.naturalHeight;
                    translateX = (carousel.offsetWidth - img.naturalWidth * scale) * focalX;
                    translateY = 0;
                }

                img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
            });
        }

        window.addEventListener('resize', adjustFocalPoint);

        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        function handleSwipe() {
            if (touchEndX < touchStartX) {
                nextSlide();
            }
            if (touchEndX > touchStartX) {
                prevSlide();
            }
        }

        carousel.addEventListener('touchstart', handleTouchStart);
        carousel.addEventListener('touchend', handleTouchEnd);

        // Cleanup
        return () => {
            clearTimeout(slideTimer);
            prevButton.removeEventListener('click', handlePrevButtonClick);
            nextButton.removeEventListener('click', handleNextButtonClick);
            pausePlayButton.removeEventListener('click', togglePause);
            window.removeEventListener('resize', adjustFocalPoint);
            carousel.removeEventListener('touchstart', handleTouchStart);
            carousel.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPaused]); // Dependency array includes `isPaused` to update when paused state changes

    return (
        <>
            <Header />
            <div className="carousel">
                <div className="timer"></div>
                <div className="slide active">
                    <img src="./img1.jpg" alt="Image 1" />
                    <div className="description">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 1.45312V6.75V6.79688V17.25C24 19.3594 21.9844 21 19.5 21C17.0156 21 15 19.3594 15 17.25C15 15.1875 17.0156 13.5 19.5 13.5C20.2969 13.5 21.0469 13.6875 21.75 14.0156V8.29688L9 12.2344V20.25C9 22.3594 6.98438 24 4.5 24C2.01562 24 0 22.3594 0 20.25C0 18.1875 2.01562 16.5 4.5 16.5C5.29688 16.5 6.04688 16.6875 6.75 17.0156V11.25V5.625C6.75 5.15625 7.03125 4.73438 7.5 4.59375L22.0781 0.09375C22.2188 0.046875 22.3594 0 22.5469 0C23.3438 0 24 0.65625 24 1.45312ZM21.75 17.25C21.75 16.8281 21.1406 15.75 19.5 15.75C17.8125 15.75 17.25 16.8281 17.25 17.25C17.25 17.7188 17.8125 18.75 19.5 18.75C21.1406 18.75 21.75 17.7188 21.75 17.25ZM6.75 20.25C6.75 19.8281 6.14062 18.75 4.5 18.75C2.8125 18.75 2.25 19.8281 2.25 20.25C2.25 20.7188 2.8125 21.75 4.5 21.75C6.14062 21.75 6.75 20.7188 6.75 20.25ZM21.75 5.95312V2.53125L9 6.46875V9.84375L21.75 5.95312Z" fill="#0AC6A6" />
                        </svg>
                        Image description 1
                    </div>
                </div>
                <div className="slide">
                    <img src="./img.jpg" alt="Image 2" />
                    <div className="description">
                        <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 0L30 12L15 24L0 12L15 0Z" fill="#0AC6A6"/>
                        </svg>
                        Image description 2
                    </div>
                </div>
                <div className="slide">
                    <img src="./img3.jpg" alt="Image 3" />
                    <div className="description">
                        <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 0L30 12L15 24L0 12L15 0Z" fill="#0AC6A6"/>
                        </svg>
                        Image description 3
                    </div>
                </div>
                <div className="dots"></div>
                <a href="#" className="nav-arrow prev">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6L9 12L15 18" stroke="#0AC6A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
                <a href="#" className="nav-arrow next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="#0AC6A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </a>
                <button className="pause-play-button" aria-label="Pause carousel">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="#0AC6A6"/>
                    </svg>
                    <span>Pause</span>
                </button>
            </div>
            <Footer />
        </>
    );
}
