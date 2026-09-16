document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Guest Logic
    let guestData = null;
    const urlParams = new URLSearchParams(window.location.search);
    const guestId = urlParams.get('id');
    let isPlaying = false;
    const musicBtn = document.getElementById('music-toggle');

    async function loadGuestInfo() {
        if (guestId) {
            try {
                const response = await fetch('invitados.json?v=' + new Date().getTime());
                const data = await response.json();
                guestData = data[guestId];

                if (guestData) {
                    // Update Cover Greeting
                    const greetingContainer = document.getElementById('guest-greeting-container');
                    const nameText = document.getElementById('guest-name-text');
                    const ticketText = document.getElementById('guest-tickets-count');
                    const ninosCountText = document.getElementById('guest-ninos-count');
                    const ninosDisplay = document.getElementById('guest-ninos-display');

                    if (greetingContainer) greetingContainer.style.display = 'block';
                    if (nameText) {
                        if (guestData.name.includes('&')) {
                            nameText.innerHTML = guestData.name.replace(/&/g, '<span class="normal-amp">&</span>');
                        } else {
                            nameText.innerText = guestData.name;
                        }
                    }
                    if (ticketText) {
                        ticketText.innerText = guestData.invitados;
                        const ticketLabel = document.getElementById('guest-tickets-label');
                        if (ticketLabel) {
                            ticketLabel.innerText = guestData.invitados === 1 ? 'Pase para adulto' : 'Pases para adulto';
                        }
                    }

                    if (guestData.ninos > 0) {
                        if (ninosDisplay) ninosDisplay.style.display = 'block';
                        if (ninosCountText) {
                            ninosCountText.innerText = guestData.ninos;
                            const ninosLabel = document.getElementById('guest-ninos-label');
                            if (ninosLabel) {
                                ninosLabel.innerText = guestData.ninos === 1 ? 'Pase para niño' : 'Pases para niños';
                            }
                        }
                    } else {
                        if (ninosDisplay) ninosDisplay.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Error cargando invitados:', error);
            }
        }
    }

    loadGuestInfo();

    // Reveal Invitation
    const cover = document.getElementById('cover');
    const mainInvitation = document.getElementById('main-invitation');
    const openBtn = document.getElementById('open-invitation');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (cover) cover.classList.add('hidden');
            setTimeout(() => {
                if (cover) cover.style.display = 'none';
                if (mainInvitation) {
                    mainInvitation.classList.remove('invitation-hidden');
                    mainInvitation.classList.add('invitation-visible');
                }
                window.scrollTo(0, 0);

                // Start music automatically when opening
                const bgMusic = document.getElementById('bg-music');
                if (bgMusic && !isPlaying) {
                    bgMusic.play().then(() => {
                        isPlaying = true;
                        if (musicBtn) {
                            musicBtn.innerHTML = '<span>&#10074;&#10074;</span>';
                            musicBtn.classList.remove('pulse');
                        }
                    }).catch(() => {
                        console.log("Autoplay bloqueado por el navegador. Haz clic en el botón de música.");
                    });
                }
            }, 800);
        });
    }

    // Countdown Timer (Octubre 03, 2026 14:00 hrs)
    const babyShowerDate = new Date('2026-10-03T14:00:00-06:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = babyShowerDate - now;

        const dateElements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        if (dateElements.days) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            dateElements.days.innerText = String(Math.max(0, days)).padStart(2, '0');
            dateElements.hours.innerText = String(Math.max(0, hours)).padStart(2, '0');
            dateElements.minutes.innerText = String(Math.max(0, minutes)).padStart(2, '0');
            dateElements.seconds.innerText = String(Math.max(0, seconds)).padStart(2, '0');
        }

        if (distance < 0 && document.getElementById('countdown')) {
            clearInterval(timerInterval);
            document.getElementById('countdown').innerHTML = "<h3 style='color: #5a4a3a; font-family: var(--font-serif);'>¡ES HOY!</h3>";
        }
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // Music Toggle
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            const bgMusic = document.getElementById('bg-music');
            if (!bgMusic) return;

            isPlaying = !isPlaying;
            if (isPlaying) {
                bgMusic.play();
                musicBtn.innerHTML = '<span>&#10074;&#10074;</span>';
                musicBtn.classList.remove('pulse');
            } else {
                bgMusic.pause();
                musicBtn.innerHTML = '<span class="icon-music">&#9835;</span>';
                musicBtn.classList.add('pulse');
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(el => {
        observer.observe(el);
    });
});
