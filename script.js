document.addEventListener('DOMContentLoaded', () => {

    // --- Definitive Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const siteContent = document.getElementById('site-content');
    const graphContainer = document.querySelector('.preloader-graph');
    const hasVisited = sessionStorage.getItem('dscrutinyVisited');

    // Generate graph bars only if the preloader is active
    if (graphContainer) {
        const numberOfBars = 40;
        for (let i = 0; i < numberOfBars; i++) {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            // Randomize animation duration and delay for a generative effect
            bar.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`;
            bar.style.animationDelay = `${Math.random() * 0.5}s`;
            graphContainer.appendChild(bar);
        }
    }

    if (!hasVisited) {
        // First visit in this session
        sessionStorage.setItem('dscrutinyVisited', 'true');
        // Set a timeout to hide the preloader and show the site content
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
            }
            if (siteContent) {
                siteContent.classList.add('loaded');
            }
        }, 3800); // Duration matches the premium feel
    } else {
        // Return visit, hide preloader immediately
        if (preloader) {
            preloader.style.display = 'none';
        }
        if (siteContent) {
            siteContent.classList.add('loaded');
        }
    }


    // --- Particle Class & Animation ---
    class Particle {
        constructor(canvas, ctx) {
            this.canvas = canvas;
            this.ctx = ctx;
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = 0.3;
            this.targetAlpha = this.baseAlpha;
            this.currentAlpha = this.baseAlpha;
        }

        update(mouse) {
            if (!mouse.x) return;
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                this.targetAlpha = Math.min(1.0, 1.2 - dist / mouse.radius);
            } else {
                this.targetAlpha = this.baseAlpha;
            }
            this.currentAlpha += (this.targetAlpha - this.currentAlpha) * 0.1;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
        }

        draw() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(74, 144, 226, ${this.currentAlpha})`;
            this.ctx.fill();
        }
    }

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = window.innerWidth > 768 ? 250 : 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx));
    }

    const mouse = {
        x: null,
        y: null,
        radius: 150
    };
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update(mouse);
            p.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const combinedAlpha = p1.currentAlpha * p2.currentAlpha;
                    if (combinedAlpha > 0.1) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(74, 144, 226, ${combinedAlpha * 0.5})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const newCount = window.innerWidth > 768 ? 250 : 100;
        for (let i = 0; i < newCount; i++) {
            particles.push(new Particle(canvas, ctx));
        }
    });


    // --- Headline Animation ---
    const headline = document.getElementById('hero-headline');
    if (headline) {
        const words = headline.innerText.split(' ');
        headline.innerHTML = words.map((word, i) => `<span class="word" style="animation-delay: ${i * 0.1}s">${word}</span>`).join(' ');
    }


    // --- Scroll Animations ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.querySelector('.animated-line')) {
                    entry.target.querySelector('.animated-line').style.transform = 'scaleX(1)';
                }
            }
        });
    }, {
        threshold: 0.1
    });
    document.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));


    // --- Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-link');
    window.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });


    // --- Magnetic Elements ---
    function applyMagneticEffect(el, strength) {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    }
    document.querySelectorAll('.magnetic-button').forEach(el => applyMagneticEffect(el, 0.2));
    document.querySelectorAll('.magnetic-link').forEach(el => applyMagneticEffect(el, 0.4));
    document.querySelectorAll('.service-card, .why-us-card').forEach(el => applyMagneticEffect(el, 0.1));

});