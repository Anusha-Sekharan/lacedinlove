/* ==========================================================================
   LACED IN LOVE - Interactivity & Customizer Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCollectionsFilter();
    initBouquetBuilder();
    initTestimonialSlider();
    initContactForm();
});

/* ==========================================================================
   1. Navigation & Header Scroll Effects
   ========================================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active Link Highlighting on Scroll
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => bar.style.transform = 'none');
            bars[1].style.opacity = '1';
        });
    });
}

/* ==========================================================================
   2. Collections Product Filtering
   ========================================================================== */
function initCollectionsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            productCards.forEach(card => {
                // Get product category
                const category = card.getAttribute('data-category');
                
                // Reset card display with fade effect
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });
}

/* ==========================================================================
   3. Interactive Bouquet & Hamper Customizer Wizard
   ========================================================================== */
function initBouquetBuilder() {
    // Wizard navigation DOM
    const steps = document.querySelectorAll('.wizard-step');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    let currentStepIndex = 0;

    // Customizer selection DOM
    const baseRadios = document.getElementsByName('bouquet-base');
    const fillerCheckboxes = document.getElementsByName('bouquet-filler');
    const extraCheckboxes = document.getElementsByName('bouquet-extra');
    
    // Personalization inputs
    const recipientInput = document.getElementById('recipient-name');
    const noteTextarea = document.getElementById('gift-note');
    const wrappingSelect = document.getElementById('wrapping-color');

    // Summary panel DOM
    const summaryBase = document.getElementById('summary-base');
    const summaryFillers = document.getElementById('summary-fillers');
    const summaryExtras = document.getElementById('summary-extras');
    const summaryColor = document.getElementById('summary-color');
    const summaryTotal = document.getElementById('summary-total');
    const visualTagsContainer = document.getElementById('live-visual-tags');
    const orderBtn = document.getElementById('whatsapp-order-btn');

    // Default builder state
    const state = {
        baseName: "Kraft Wrapping",
        basePrice: 15,
        fillers: [],
        extras: [],
        recipient: "",
        note: "",
        wrapColor: "Blush Pink",
        total: 15
    };

    // Update wizard step visibility
    function updateStep() {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx === currentStepIndex);
        });

        // Navigation button states
        prevBtn.disabled = currentStepIndex === 0;
        
        if (currentStepIndex === steps.length - 1) {
            nextBtn.innerHTML = 'Review <i class="fa-solid fa-check"></i>';
        } else {
            nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
        }
        
        if (currentStepIndex === steps.length) {
            // Already at the end or validation check
            currentStepIndex = steps.length - 1;
        }
    }

    nextBtn.addEventListener('click', () => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            updateStep();
        } else {
            // Highlight preview box on mobile
            document.querySelector('.builder-preview').scrollIntoView({ behavior: 'smooth' });
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateStep();
        }
    });

    // Update State & Re-render UI
    function calculateTotal() {
        let sum = state.basePrice;
        
        state.fillers.forEach(item => sum += item.price);
        state.extras.forEach(item => sum += item.price);
        
        state.total = sum;
        summaryTotal.textContent = `$${sum.toFixed(2)}`;
    }

    function renderSummary() {
        // 1. Base Wrap
        summaryBase.textContent = `${state.baseName} (+$$${state.basePrice})`;
        
        // 2. Fillers
        if (state.fillers.length === 0) {
            summaryFillers.textContent = "None selected";
        } else {
            summaryFillers.textContent = state.fillers.map(f => f.name).join(', ');
        }

        // 3. Extras
        if (state.extras.length === 0) {
            summaryExtras.textContent = "None selected";
        } else {
            summaryExtras.textContent = state.extras.map(e => e.name).join(', ');
        }

        // 4. Wrap color
        summaryColor.textContent = state.wrapColor;

        // 5. Visual tags rendering (making it look alive)
        visualTagsContainer.innerHTML = '';
        
        // Base Wrap Badge
        createVisualBadge(state.baseName, 'fa-scroll');
        
        // Filler badges
        state.fillers.forEach(filler => {
            let icon = 'fa-spa';
            if (filler.name.includes('Roses')) icon = 'fa-rose';
            if (filler.name.includes('Rocher')) icon = 'fa-cookie';
            if (filler.name.includes('Polaroid')) icon = 'fa-camera';
            if (filler.name.includes('Hotwheels')) icon = 'fa-car';
            createVisualBadge(filler.name, icon);
        });

        // Extra badges
        state.extras.forEach(extra => {
            let icon = 'fa-plus';
            if (extra.name.includes('Lights')) icon = 'fa-lightbulb';
            if (extra.name.includes('Teddy')) icon = 'fa-paw';
            if (extra.name.includes('Candle')) icon = 'fa-fire';
            createVisualBadge(extra.name, icon);
        });
        
        // Color badge
        createVisualBadge(`Color: ${state.wrapColor}`, 'fa-palette');
    }

    function createVisualBadge(text, iconClass) {
        const badge = document.createElement('span');
        badge.className = 'visual-tag';
        badge.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${text}`;
        visualTagsContainer.appendChild(badge);
    }

    // Radio Base selection
    baseRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.baseName = e.target.value;
            state.basePrice = parseFloat(e.target.getAttribute('data-price'));
            calculateTotal();
            renderSummary();
        });
    });

    // Checkbox fillers selection
    fillerCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            state.fillers = [];
            fillerCheckboxes.forEach(item => {
                if (item.checked) {
                    state.fillers.push({
                        name: item.value,
                        price: parseFloat(item.getAttribute('data-price'))
                    });
                }
            });
            calculateTotal();
            renderSummary();
        });
    });

    // Checkbox extras selection
    extraCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            state.extras = [];
            extraCheckboxes.forEach(item => {
                if (item.checked) {
                    state.extras.push({
                        name: item.value,
                        price: parseFloat(item.getAttribute('data-price'))
                    });
                }
            });
            calculateTotal();
            renderSummary();
        });
    });

    // Personalization Listeners
    recipientInput.addEventListener('input', (e) => {
        state.recipient = e.target.value;
    });

    noteTextarea.addEventListener('input', (e) => {
        state.note = e.target.value;
    });

    wrappingSelect.addEventListener('change', (e) => {
        state.wrapColor = e.target.value;
        renderSummary();
    });

    // WhatsApp checkout generator
    orderBtn.addEventListener('click', () => {
        const businessPhone = "919876543210"; // Placeholder Business WhatsApp number
        
        let fillersList = state.fillers.map(f => `• ${f.name} ($${f.price})`).join('\n');
        let extrasList = state.extras.map(e => `• ${e.name} ($${e.price})`).join('\n');
        
        let textMessage = `🌸 *Laced in Love - Bouquet Order* 🌸\n\n`;
        textMessage += `*Base Style:* ${state.baseName} ($${state.basePrice})\n`;
        textMessage += `*Wrapping Theme:* ${state.wrapColor}\n\n`;
        
        if (fillersList) {
            textMessage += `*Fillers Chosen:*\n${fillersList}\n\n`;
        } else {
            textMessage += `*Fillers Chosen:* None\n\n`;
        }
        
        if (extrasList) {
            textMessage += `*Add-ons Chosen:*\n${extrasList}\n\n`;
        }
        
        if (state.recipient) {
            textMessage += `*Recipient Name:* ${state.recipient}\n`;
        }
        
        if (state.note) {
            textMessage += `*Gift Card Message:* "${state.note}"\n`;
        }
        
        textMessage += `\n----------------------------------------\n`;
        textMessage += `*Estimated Total Price:* $${state.total.toFixed(2)}\n`;
        textMessage += `----------------------------------------\n\n`;
        textMessage += `Hello, I'd like to place an order for this customized arrangement. Please confirm standard availability and delivery timeline! 😊`;
        
        const encodedText = encodeURIComponent(textMessage);
        const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedText}`;
        
        window.open(whatsappUrl, '_blank');
    });

    // Link catalog buttons to preset loading in builder
    const presetButtons = document.querySelectorAll('.order-now-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const presetId = btn.getAttribute('data-preset');
            loadPreset(presetId);
        });
    });

    function loadPreset(presetId) {
        // Reset selections
        baseRadios.forEach(r => r.checked = false);
        fillerCheckboxes.forEach(c => c.checked = false);
        extraCheckboxes.forEach(c => c.checked = false);
        
        // Presets loading configuration
        if (presetId === 'flowers-classic') {
            baseRadios[0].checked = true; // Kraft
            fillerCheckboxes[0].checked = true; // Red Roses
            wrappingSelect.value = "Blush Pink";
        } 
        else if (presetId === 'chocolate-ferrero') {
            baseRadios[1].checked = true; // Luxury Box
            fillerCheckboxes[1].checked = true; // Ferrero Rocher
            wrappingSelect.value = "Midnight Black";
        } 
        else if (presetId === 'polaroid-memories') {
            baseRadios[0].checked = true; // Kraft
            fillerCheckboxes[2].checked = true; // Polaroids
            extraCheckboxes[0].checked = true; // Fairy Lights
            wrappingSelect.value = "Classic Kraft Brown";
        } 
        else if (presetId === 'hotwheels-racer') {
            baseRadios[0].checked = true; // Kraft
            fillerCheckboxes[3].checked = true; // Hot wheels
            wrappingSelect.value = "Midnight Black";
        } 
        else if (presetId === 'hamper-luxe') {
            baseRadios[2].checked = true; // Basket
            fillerCheckboxes[0].checked = true; // Red roses
            fillerCheckboxes[1].checked = true; // Ferrero
            extraCheckboxes[0].checked = true; // Fairy Lights
            extraCheckboxes[2].checked = true; // Candle
            wrappingSelect.value = "Sage Green";
        }
        else if (presetId === 'flowers-enchanted') {
            baseRadios[0].checked = true; // Kraft
            fillerCheckboxes[0].checked = true; // Red Roses
            wrappingSelect.value = "Sage Green";
        }

        // Trigger change updates on elements to update internal state
        const checkedBase = Array.from(baseRadios).find(r => r.checked);
        if (checkedBase) {
            state.baseName = checkedBase.value;
            state.basePrice = parseFloat(checkedBase.getAttribute('data-price'));
        }

        state.fillers = [];
        fillerCheckboxes.forEach(item => {
            if (item.checked) {
                state.fillers.push({
                    name: item.value,
                    price: parseFloat(item.getAttribute('data-price'))
                });
            }
        });

        state.extras = [];
        extraCheckboxes.forEach(item => {
            if (item.checked) {
                state.extras.push({
                    name: item.value,
                    price: parseFloat(item.getAttribute('data-price'))
                });
            }
        });

        state.wrapColor = wrappingSelect.value;
        
        currentStepIndex = 1; // go to filler selection page directly so they can inspect additions
        updateStep();
        calculateTotal();
        renderSummary();
    }

    // Initialize display call
    calculateTotal();
    renderSummary();
}

/* ==========================================================================
   4. Testimonials Slider
   ========================================================================== */
function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let timer;

    function showSlide(index) {
        cards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        cards[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function startAutoSlide() {
        timer = setInterval(() => {
            let nextSlide = (currentSlide + 1) % cards.length;
            showSlide(nextSlide);
        }, 5000);
    }

    function resetTimer() {
        clearInterval(timer);
        startAutoSlide();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    startAutoSlide();
}

/* ==========================================================================
   5. Quick Contact Form Handler
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;

            // Display beautiful visual receipt prompt
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = 'var(--clr-green)';
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent Successfully!';
            
            setTimeout(() => {
                alert(`Thank you ${name}! We've received your query about "${subject}". We will reply to ${email} within 24 hours.`);
                
                // Reset form state
                form.reset();
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.innerHTML = originalText;
            }, 600);
        });
    }
}
