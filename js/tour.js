/**
 * Guided Tour Engine — Pusat Arsip Anka
 * Lightweight, no-dependency tour engine with premium glassmorphism aesthetics.
 */

const Tour = {
    steps: [],
    currentStep: 0,
    overlay: null,
    spotlight: null,
    tooltip: null,

    init(steps) {
        this.steps = steps;
        this.currentStep = 0;
        this.createElements();
    },

    createElements() {
        // Main Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] transition-opacity duration-500 opacity-0 pointer-events-none';
        this.overlay.style.cssText = 'pointer-events: auto;';

        // Spotlight Box
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'absolute z-[101] rounded-2xl border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.3)] transition-all duration-500 pointer-events-none';
        this.overlay.appendChild(this.spotlight);

        // Tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'absolute z-[102] w-72 glass-card p-5 rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 opacity-0 scale-95';
        this.tooltip.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <span id="tour-counter" class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-lg">Step 1 / 5</span>
                <button onclick="Tour.stop()" class="text-gray-500 hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <h4 id="tour-title" class="text-white font-bold text-sm mb-2">Title</h4>
            <p id="tour-desc" class="text-gray-400 text-xs leading-relaxed mb-5">Description goes here.</p>
            <div class="flex items-center justify-between gap-3">
                <button onclick="Tour.stop()" class="text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-wider">Lewati</button>
                <button id="tour-next" onclick="Tour.next()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Selanjutnya</button>
            </div>
        `;
        this.overlay.appendChild(this.tooltip);

        document.body.appendChild(this.overlay);
    },

    start() {
        if (this.steps.length === 0) return;

        // Anti-scroll
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            this.overlay.classList.remove('opacity-0');
            this.showStep(0);
        }, 100);
    },

    getZoom() {
        // Detect zoom level from body (default to 1)
        const zoom = parseFloat(getComputedStyle(document.body).zoom) || 1;
        return zoom;
    },

    showStep(index) {
        if (index < 0 || index >= this.steps.length) {
            this.stop();
            return;
        }

        this.currentStep = index;
        const step = this.steps[index];
        const target = document.querySelector(step.target);

        if (!target || target.offsetParent === null) {
            console.warn(`[Tour] Skipping step ${index + 1}: Target "${step.target}" is missing or hidden.`);
            // If target is hidden or missing, skip to next
            this.next();
            return;
        }

        const zoom = this.getZoom();

        // --- 1. Positioning Spotlight ---
        const rect = target.getBoundingClientRect();
        const padding = 10;

        this.spotlight.style.width = `${(rect.width + padding * 2) / zoom}px`;
        this.spotlight.style.height = `${(rect.height + padding * 2) / zoom}px`;
        this.spotlight.style.left = `${(rect.left - padding) / zoom}px`;
        this.spotlight.style.top = `${(rect.top - padding) / zoom}px`;

        // --- 2. Update Content ---
        document.getElementById('tour-counter').textContent = `Langkah ${index + 1} / ${this.steps.length}`;
        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-desc').textContent = step.content;

        const nextBtn = document.getElementById('tour-next');
        nextBtn.textContent = index === this.steps.length - 1 ? 'Selesai' : 'Selanjutnya';

        // --- 3. Positioning Tooltip ---
        this.tooltip.classList.remove('opacity-0', 'scale-95');

        const tooltipRect = this.tooltip.getBoundingClientRect();
        const gap = 20;

        let top = (rect.bottom + gap) / zoom;
        let left = rect.left / zoom;

        // Overflow check (y-axis)
        if ((top * zoom) + tooltipRect.height > window.innerHeight) {
            top = (rect.top - tooltipRect.height - gap) / zoom;
        }

        // Overflow check (x-axis)
        if ((left * zoom) + tooltipRect.width > window.innerWidth) {
            left = (window.innerWidth - tooltipRect.width - (20 * zoom)) / zoom;
        }
        if (left < 0) left = 20 / zoom;

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;

        // Scroll into view if needed
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    next() {
        this.showStep(this.currentStep + 1);
    },

    stop() {
        this.overlay.classList.add('opacity-0');
        this.tooltip.classList.add('scale-95');
        document.body.style.overflow = '';

        setTimeout(() => {
            this.overlay.remove();
            localStorage.setItem('tour_completed', 'true');
        }, 500);
    }
};

window.Tour = Tour;
