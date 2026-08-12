// Main Application Entry Coordinator for Modi Medical App #1

class ModiMedicalApp {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        console.log('Modi Medical Application Initializing...');
        this.setupMobileMenu();
        this.setupHomeSearch();
        this.setupHeroCarousel();
        this.loadFeaturedGrid();
        this.loadHomeMaterials();
        console.log('Modi Medical App Ready!');
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                const isFlex = navLinks.style.display === 'flex';
                navLinks.style.display = isFlex ? 'none' : 'flex';
                if (!isFlex) {
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = '#ffffff';
                    navLinks.style.padding = '16px';
                    navLinks.style.borderBottom = '2px solid #f59e0b';
                    navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                }
            });
        }
    }

    setupHeroCarousel() {
        const navBtns = document.querySelectorAll('.promo-nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.dataset.target;
                navBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                document.querySelectorAll('.promo-item').forEach(item => {
                    item.classList.remove('active');
                });
                const activeItem = document.getElementById(targetId);
                if (activeItem) activeItem.classList.add('active');
            });
        });
    }

    setupHomeSearch() {
        const homeSearch = document.getElementById('homeSearchInput');
        if (homeSearch) {
            homeSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const medicines = getMedicines().filter(m => 
                    m.name.toLowerCase().includes(query) || 
                    m.manufacturer.toLowerCase().includes(query) ||
                    m.category.toLowerCase().includes(query)
                );
                this.renderFeaturedGrid(medicines);
            });
        }
    }

    loadFeaturedGrid() {
        const medicines = getMedicines();
        this.renderFeaturedGrid(medicines);
    }

    renderFeaturedGrid(medicines) {
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;
        grid.innerHTML = '';

        if (medicines.length === 0) {
            grid.innerHTML = '<p class="text-center p-3">No matching medicines found.</p>';
            return;
        }

        medicines.slice(0, 6).forEach(med => {
            const discount = med.mrp_price > 0 
                ? Math.round(((med.mrp_price - med.discounted_price) / med.mrp_price) * 100) 
                : 0;

            const card = document.createElement('div');
            card.className = 'medicine-card';
            card.innerHTML = `
                <h4>${med.name}</h4>
                <p class="manufacturer">${med.manufacturer} • ${med.category}</p>
                <div class="prices">
                    <span class="price original">₹${med.mrp_price.toFixed(2)}</span>
                    <span class="price discounted">₹${med.discounted_price.toFixed(2)} (${discount}% off)</span>
                </div>
                <span class="stock-badge ${med.stock_status}">${med.stock_status.replace('_', ' ')}</span>
                <div style="margin-top:12px;">
                    <a href="https://wa.me/918709484805?text=Hello!%20I%20want%20to%20buy%20${encodeURIComponent(med.name)}." target="_blank" class="btn btn-whatsapp btn-sm btn-block">
                        📱 Order via WhatsApp
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Live Public Promotional Materials Display on Front Page
    loadHomeMaterials() {
        const container = document.getElementById('homeMaterialsGrid');
        if (!container) return;
        const materials = getMarketingMaterials();
        container.innerHTML = '';

        materials.forEach(mat => {
            const div = document.createElement('div');
            div.className = 'card material-card';

            // Normalize file path
            const displayPath = mat.file_path ? mat.file_path.replace(/\\/g, '/') : '';

            if (mat.type === 'video') {
                div.innerHTML = `
                    <video controls muted autoplay loop playsinline style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                        <source src="${displayPath}" type="video/mp4">
                        Your browser does not support HTML5 video.
                    </video>
                    <h4 style="margin-top:10px; font-size:1.1rem; color:var(--primary-color);">${mat.title}</h4>
                    <span class="stock-badge active" style="margin-top:4px;">🎬 Video Commercial</span>
                `;
            } else {
                div.innerHTML = `
                    <img src="${displayPath}" alt="${mat.title}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;" onerror="this.src='assets/logo.jpg'">
                    <h4 style="margin-top:10px; font-size:1.1rem; color:var(--primary-color);">${mat.title}</h4>
                    <span class="stock-badge low_stock" style="margin-top:4px;">🖼️ Offer Flyer</span>
                `;
            }

            container.appendChild(div);
        });
    }
}

let modiMedicalApp;
document.addEventListener('DOMContentLoaded', () => {
    modiMedicalApp = new ModiMedicalApp();
    window.modiMedicalApp = modiMedicalApp;
});