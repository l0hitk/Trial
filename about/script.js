document.addEventListener('DOMContentLoaded', () => {

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
                // Animate stats counter if the element has the class
                if (entry.target.classList.contains('stat-number')) {
                    const counter = entry.target; const target = +counter.getAttribute('data-target'); let current = 0; const increment = target / 100;
                    const updateCounter = () => { current += increment; if (current < target) { counter.innerText = Math.ceil(current); requestAnimationFrame(updateCounter); } else { counter.innerText = target; } };
                    updateCounter();
                }
                // Do not unobserve here if it's the timeline, handled by its own observer
                if (!entry.target.classList.contains('process-timeline-container')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

    // NEW: Specific observer for the timeline animation
    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the timeline is visible

    const timeline = document.querySelector('.process-timeline-container');
    if (timeline) {
        timelineObserver.observe(timeline);
    }


    // --- 6. DYNAMIC FOOTER INJECTION ---
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