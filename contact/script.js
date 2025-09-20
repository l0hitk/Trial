// script.js | DSCRUTINY: Definitive Version with Static Grid

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('contact-canvas')) {
        document.body.classList.add('no-custom-cursor');
    }

    // --- 4. Static Grid Background (Contact Page) ---
    const contactCanvas = document.getElementById('contact-canvas');
    if (contactCanvas) {
        const ctx = contactCanvas.getContext('2d');
        let dots = [];

        class Dot {
            constructor(x, y) { this.x = x; this.y = y; this.size = 1; }
            draw() {
                ctx.fillStyle = 'rgba(0, 246, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }
        
        const initDots = () => {
            dots = [];
            const dotSpacing = 40;
            for (let x = dotSpacing; x < contactCanvas.width; x += dotSpacing) {
                for (let y = dotSpacing; y < contactCanvas.height; y += dotSpacing) {
                    dots.push(new Dot(x, y));
                }
            }
        };

        const drawGrid = () => {
            ctx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
            dots.forEach(d => d.draw());
        };

        const resizeCanvas = () => {
            contactCanvas.width = contactCanvas.parentElement.clientWidth;
            contactCanvas.height = contactCanvas.parentElement.clientHeight;
            initDots();
            drawGrid(); // Draw the grid once after initializing
        };
        
        resizeCanvas(); // Initial setup
        window.addEventListener('resize', resizeCanvas); // Redraw only on resize
    }
    
 // --- 5. Phone Number Input Filtering ---
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            // Replace any character that is not a number (0-9) or a plus sign (+) with an empty string
            phoneInput.value = phoneInput.value.replace(/[^0-9+]/g, '');
        });
    }

    // --- 6. Mobile Navigation & Scrolled Header ---
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    if (navToggle) { navToggle.addEventListener('click', () => nav.classList.toggle('is-open')); }
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 50); });

    // --- 7. Scroll Animations ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stat-number')) {
                    const counter = entry.target; const target = +counter.getAttribute('data-target'); let current = 0; const increment = target / 100;
                    const updateCounter = () => { current += increment; if (current < target) { counter.innerText = Math.ceil(current); requestAnimationFrame(updateCounter); } else { counter.innerText = target; } };
                    updateCounter();
                }
                if (!entry.target.classList.contains('process-timeline-container')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const timeline = document.querySelector('.process-timeline-container');
    if (timeline) { timelineObserver.observe(timeline); }

    // --- 8. DYNAMIC FOOTER INJECTION ---
const footerElement = document.querySelector('.main-footer');
if (footerElement) {
    const footerData = {
        columns: [
            { 
                title: "Business Intelligence", 
                links: [ 
                    { text: "Analytics Roadmap", href: "/services/analytics-roadmap.html" }, 
                    { text: "Data Strategy", href: "/services/data-strategy.html" }, 
                    { text: "Platform Strategy", href: "/services/platform-strategy.html" } 
                ] 
            },
            { 
                title: "Data Engineering", 
                links: [ 
                    { text: "Data Modernization", href: "/services/data-modernization.html" }, 
                    { text: "Data Foundation", href: "/services/data-foundation.html" }, 
                    { text: "Data Operations", href: "/services/data-operations.html" } 
                ] 
            },
            { 
                title: "Web Operations", 
                links: [ 
                    { text: "Domain Management", href: "/services/web-operations.html" }, 
                    { text: "Email Infrastructure", href: "/services/web-operations.html" }, 
                    { text: "Web Optimization", href: "/services/web-operations.html" }, 
                    { text: "Web Hosting", href: "/services/web-operations.html" } 
                ] 
            },
            { 
                title: "Company", 
                links: [ 
                    { text: "About Us", href: "/about.html" },
                    { text: "Contact", href: "/contact.html" }, 
                    { text: "LinkedIn", href: "https://www.linkedin.com/company/dscrutiny" } 
                ] 
            },
            {
                title: "Contact Us",
                hasSeparator: true,
                addressLines: [
                    "<strong>Head Office</strong>",
                    "24 Sanderling Close,",
                    "Thornton Cleveleys, Blackpool.",
                    "United Kingdom FY53FN",
                    "<strong>UK:</strong> +44 74438 89535",
                    "<strong>IN:</strong> +91 96067 23930"
                ]
            }
        ],
        bottom: {
            copyright: `© ${new Date().getFullYear()} DSCRUTINY TECHNOLOGIES LIMITED. All Rights Reserved.`,
        }
    };

    const pathPrefix = window.location.pathname.includes('/services/') ? '..' : '.';
    let footerHTML = '<div class="container"><div class="footer-grid">';
    footerData.columns.forEach(column => {
        const columnClass = column.hasSeparator ? 'footer-column footer-separator' : 'footer-column';
        footerHTML += `<div class="${columnClass}"><h4>${column.title}</h4>`;

        if (column.links && column.links.length > 0) {
            footerHTML += '<ul>';
            column.links.forEach(link => { 
                const isAbsoluteUrl = link.href.startsWith('http');
                const linkHref = isAbsoluteUrl ? link.href : `${pathPrefix}${link.href}`;
                footerHTML += `<li><a href="${linkHref}">${link.text}</a></li>`; 
            });
            footerHTML += '</ul>';
        }

        if (column.addressLines && column.addressLines.length > 0) {
            footerHTML += `<p class="footer-address">${column.addressLines.join('<br>')}</p>`;
        }
        
        footerHTML += '</div>';
    });
    
    footerHTML += '</div><div class="footer-bottom">';
    footerHTML += `<p class="footer-copyright">${footerData.bottom.copyright}</p>`;
    footerElement.innerHTML = footerHTML;
}
});

