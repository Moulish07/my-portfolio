// =========================================
// 1. MOBILE MENU TOGGLE
// =========================================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
}));

// =========================================
// 2. NAVBAR SCROLL EFFECT & ACTIVE LINKS
// =========================================
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
    
    // Check active sections for navbar highlight
    let current = "";
    const sections = document.querySelectorAll("section");
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute("id");
        }
    });

    document.querySelectorAll(".nav-links li a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});

// =========================================
// 3. TYPING EFFECT FOR HERO SECTION
// =========================================
const textArray = ["a Dreamer", "an ECE Engineer","a Frontend Developer", "a Creative Thinker", "a Lifelong Learner"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedElement = document.getElementById("typed");

function type() {
    if (!typedElement) return;
    const currentText = textArray[textIndex];
    
    if (isDeleting) {
        // Remove a character
        typedElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Add a character
        typedElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    // Determine typing speed
    let typeSpeed = isDeleting ? 50 : 100;

    // If word is complete
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 1500; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeSpeed = 500; // Pause before starting new word
    }

    setTimeout(type, typeSpeed);
}

// Start typing effect on load
document.addEventListener("DOMContentLoaded", () => {
    if(textArray.length) setTimeout(type, 1000);
});

// =========================================
// 4. COOL BACKGROUND PARTICLE ANIMATION
// =========================================
const canvas = document.getElementById("bg-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Variables
    let particlesArray = [];
    const numberOfParticles = 80;

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); // Re-initialize particles to fit new screen size
    });

    // Create Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            // Occasional highlight color for particles
            const isLight = document.body.classList.contains('light-mode');
            const primaryColor = isLight ? '#00aa88' : '#00ffcc';
            const defaultColor = isLight ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)';
            this.color = Math.random() > 0.8 ? primaryColor : defaultColor;
        }

        // Update particle position
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }

        // Draw particle
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles array
    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Animate particles and draw lines between close ones
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Draw connecting lines
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    const isLight = document.body.classList.contains('light-mode');
                    const alpha = Math.max(0, 0.1 - distance/1200);
                    ctx.strokeStyle = isLight ? `rgba(0, 0, 0, ${alpha * 1.5})` : `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    // Start background animation
    init();
    animateParticles();
}

// =========================================
// 5. FORM SUBMISSION (Live Web3Forms)
// =========================================
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevents actual page reload
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        
        // Bundle up the form data
        const formData = new FormData(form);
        // !! IMPORTANT: Put your free Web3Forms Access Key here !!
        formData.append("access_key", "fad73105-415c-463d-a79c-6511fc1ea651"); 

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Success feedback
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = '#00ccaa'; 
                form.reset(); // Clear form fields
            } else {
                // API rejected it
                console.error("Web3Forms Error:", data);
                btn.innerHTML = 'Error! <i class="fas fa-times"></i>';
                btn.style.background = '#ff4d4d'; 
            }
            
            // Revert button back after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);

        } catch (error) {
            console.error("Network Error:", error);
            btn.innerHTML = 'Error! <i class="fas fa-times"></i>';
            btn.style.background = '#ff4d4d'; 
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        }
    });
}

// =========================================
// 6. MODAL & PDF PREVIEW
// =========================================
const modal = document.getElementById("pdf-modal");
const pdfViewer = document.getElementById("pdf-viewer");
const closeBtn = document.querySelector(".close-btn");
const previewBtns = document.querySelectorAll(".preview-btn");

if (modal && closeBtn) {
    // Open Modal
    previewBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const pdfSrc = btn.getAttribute("data-src");
            if (pdfSrc) {
                // Determine if we should append #view=FitH, rarely useful for native embedded viewer
                pdfViewer.src = pdfSrc; 
                modal.classList.add("show");
                document.body.style.overflow = "hidden"; // Prevent background scrolling
            }
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore background scrolling
        setTimeout(() => {
            pdfViewer.src = ""; // Clear src to stop loading if running
        }, 300); // Wait for transition animation to finish before clearing
    };

    closeBtn.addEventListener("click", closeModal);

    // Close on outside click (clicking the dark overlay)
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close with Escape key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });
}

// =========================================
// 7. SCROLL REVEAL ANIMATIONS
// =========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // observer.unobserve(entry.target); // Optional: stop observing once revealed
        }
    });
}, observerOptions);

// Elements to animate
const animElements = document.querySelectorAll('.section-title, .about-text, .timeline-item, .skill-card, .language-item, .project-card, .contact-container');
animElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// =========================================
// 8. SCROLL TO TOP BUTTON
// =========================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show");
    } else {
        scrollTopBtn.classList.remove("show");
    }
});

if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// =========================================
// 9. LIGHT / DARK MODE TOGGLE
// =========================================
const themeBtn = document.getElementById("theme-btn");
const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;

// Check localStorage for saved theme
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    if(themeIcon) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLightMode = document.body.classList.contains("light-mode");
        
        // Update Icon
        if (isLightMode) {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
            localStorage.setItem("portfolio-theme", "light");
        } else {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
            localStorage.setItem("portfolio-theme", "dark");
        }

        // Re-init particle canvas to adjust dot colors
        window.dispatchEvent(new Event('resize'));
    });
}

// =========================================
// 10. PROJECT FILTERS
// =========================================
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach(card => {
            if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
        
        // Retrigger Scroll Reveal for visible cards
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 100);
    });
});
