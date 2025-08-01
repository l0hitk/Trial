// script.js | Project Singularity: The Final Cut

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Interactive Cursor (Hybrid Mode) ---
    const spotlight = document.querySelector('.cursor-spotlight');
    const cursorDot = document.querySelector('.cursor-dot');
    
    // Only run this on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', e => {
            spotlight.style.top = e.pageY + 'px';
            spotlight.style.left = e.pageX + 'px';
            cursorDot.style.top = e.pageY + 'px';
            cursorDot.style.left = e.pageX + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovered'));
        });
    }


    // --- 2. Live Particle Canvas Background ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = []; let mouse = { x: null, y: null };
        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = canvas.parentElement.clientHeight; };
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        class Particle { constructor(x, y, size, color) { this.x = x; this.y = y; this.size = size; this.color = color; this.baseX = this.x; this.baseY = this.y; this.density = (Math.random() * 30) + 1; } draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.closePath(); ctx.fill(); } update() { let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx * dx + dy * dy); let forceDirectionX = dx / distance; let forceDirectionY = dy / distance; let maxDistance = 100; let force = (maxDistance - distance) / maxDistance; if (distance < maxDistance) { this.x -= forceDirectionX * force * this.density * 0.1; this.y -= forceDirectionY * force * this.density * 0.1; } else { if (this.x !== this.baseX) { let dx = this.x - this.baseX; this.x -= dx / 10; } if (this.y !== this.baseY) { let dy = this.y - this.baseY; this.y -= dy / 10; } } } }
        const initParticles = () => { particles = []; let numberOfParticles = window.innerWidth > 768 ? 70 : 25; for (let i = 0; i < numberOfParticles; i++) { let size = (Math.random() * 1.5) + 1; let x = Math.random() * (canvas.width - size * 2); let y = Math.random() * (canvas.height - size * 2); let color = 'rgba(0, 246, 255, 0.7)'; particles.push(new Particle(x, y, size, color)); } };
        const animateParticles = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animateParticles); };
        resizeCanvas(); initParticles(); animateParticles(); window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    }

    // --- 3. 3D Tilt Effect for Service Cards ---
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), { max: 15, speed: 400, glare: true, "max-glare": 0.2, perspective: 1000 });
    }

    // --- 4. Mobile Navigation & Scrolled Header ---
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    if (navToggle) { navToggle.addEventListener('click', () => nav.classList.toggle('is-open')); }
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 50); });

    // --- 5. Scroll Animations ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stat-number')) {
                    const counter = entry.target; const target = +counter.getAttribute('data-target'); let current = 0; const increment = target / 100;
                    const updateCounter = () => { current += increment; if (current < target) { counter.innerText = Math.ceil(current); requestAnimationFrame(updateCounter); } else { counter.innerText = target; } };
                    updateCounter();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll, .stat-number').forEach(el => scrollObserver.observe(el));

    // --- 6. DYNAMIC FOOTER INJECTION (Complete with all links) ---
const footerElement = document.querySelector('.main-footer');
    if (footerElement) {
        const footerData = {
            columns: [
                { title: "Business Intelligence", links: [ { text: "Analytics Roadmap", href: "/services/analytics-roadmap.html" }, { text: "Data Strategy", href: "/services/data-strategy.html" }, { text: "Platform Strategy", href: "/services/platform-strategy.html" } ] },
                { title: "Data Engineering", links: [ { text: "Data Modernization", href: "/services/data-modernization.html" }, { text: "Data Foundation", href: "/services/data-foundation.html" }, { text: "Data Operations", href: "/services/data-operations.html" } ] },
                { title: "Web Operations", links: [ { text: "Domain Management", href: "#" }, { text: "Email Infrastructure", href: "#" }, { text: "Web Optimization", href: "#" }, { text: "Web Hosting", href: "#" } ] },
                { title: "Company", links: [ { text: "About Us", href: "/about.html" }, { text: "Portfolio", href: "/portfolio.html" }, { text: "Contact", href: "/contact.html" }, { text: "Linkedin", href: "" } ] }
            ],
            bottom: {
                copyright: `© ${new Date().getFullYear()} DSCRUTINY Inc. All Rights Reserved.`,
                social: { name: "LinkedIn", href: "#", icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>' }
            }
        };

        const pathPrefix = window.location.pathname.includes('/services/') ? '..' : '.';
        let footerHTML = '<div class="container"><div class="footer-grid">';
        footerData.columns.forEach(column => {
            footerHTML += `<div class="footer-column"><h4>${column.title}</h4><ul>`;
            column.links.forEach(link => { footerHTML += `<li><a href="${pathPrefix}${link.href}">${link.text}</a></li>`; });
            footerHTML += '</ul></div>';
        });
        footerHTML += '</div><div class="footer-bottom">';
        
       
footerHTML += `<p class="footer-copyright">${footerData.bottom.copyright}</p></div></div>`;
        footerElement.innerHTML = footerHTML;
    }
});