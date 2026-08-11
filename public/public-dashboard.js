// Public Dashboard Manager for Modi Medical
// Read-only catalog browsing and promotional media viewer for public users

class PublicDashboard {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.currentTab = 'public-materials';
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.setupEventListeners();
        this.loadMarketingMaterials();
        this.loadMedicines();
        this.loadFeaturedMaterial();
    }

    setupEventListeners() {
        document.querySelectorAll('#publicDashboard .nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                if (tab) this.switchTab(tab);
            });
        });

        const publicSearch = document.getElementById('publicMedicineSearch');
        if (publicSearch) publicSearch.oninput = (e) => this.filterMedicines(e.target.value);
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('#publicDashboard .nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('#publicDashboard .tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(`${tabName}Tab`);
        if (activeContent) activeContent.classList.add('active');
    }

    loadMarketingMaterials() {
        const grid = document.getElementById('publicMaterialsGrid');
        if (!grid) return;
        const materials = getMarketingMaterials();
        grid.innerHTML = '';

        materials.forEach(mat => {
            const card = document.createElement('div');
            card.className = 'card material-card';
            
            // Normalize file path
            const displayPath = mat.file_path ? mat.file_path.replace(/\\/g, '/') : '';
            
            if (mat.type === 'video') {
                card.innerHTML = `
                    <video controls muted autoplay loop style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
                        <source src="${displayPath}" type="video/mp4">
                        Your browser does not support video.
                    </video>
                    <h4 style="margin-top:10px; font-size:1.1rem; color:var(--primary-color);">${mat.title}</h4>
                `;
            } else {
                card.innerHTML = `
                    <img src="${displayPath}" alt="${mat.title}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;" onerror="this.src='assets/logo.jpg'">
                    <h4 style="margin-top:10px; font-size:1.1rem; color:var(--primary-color);">${mat.title}</h4>
                `;
            }
            grid.appendChild(card);
        });
    }

    loadFeaturedMaterial() {
        const container = document.getElementById('featuredMaterial');
        if (!container) return;

        const materials = getMarketingMaterials();
        const featuredVideo = materials.find(m => m.type === 'video' && m.is_featured) || materials.find(m => m.type === 'video');

        if (featuredVideo) {
            // Normalize file path
            const displayPath = featuredVideo.file_path ? featuredVideo.file_path.replace(/\\/g, '/') : '';
            container.innerHTML = `
                <video controls autoplay muted loop style="width:100%; max-height:400px; border-radius:12px; object-fit:cover;">
                    <source src="${displayPath}" type="video/mp4">
                </video>
            `;
        } else {
            container.innerHTML = `
                <img src="assets/MainYouTubeImage.gif" alt="Featured Offer" style="width:100%; max-height:400px; border-radius:12px; object-fit:cover;" onerror="this.src='assets/MainYouTubeImageFinalInJPEG.jpg'">
            `;
        }
    }

    loadMedicines() {
        const medicines = getMedicines();
        this.renderMedicineCards(medicines);
    }

    renderMedicineCards(medicines) {
        const container = document.getElementById('publicMedicineCards');
        if (!container) return;
        container.innerHTML = '';

        medicines.forEach(med => {
            const discount = med.mrp_price > 0 
                ? Math.round(((med.mrp_price - med.discounted_price) / med.mrp_price) * 100) 
                : 0;

            const card = document.createElement('div');
            card.className = 'medicine-card';
            card.innerHTML = `
                <h4>${med.name}</h4>
                <p class="manufacturer">${med.manufacturer} • ${med.category}</p>
                <div class="prices">
                    <span class="price original">MRP: ₹${med.mrp_price.toFixed(2)}</span>
                    <span class="price discounted">₹${med.discounted_price.toFixed(2)} (${discount}% OFF)</span>
                </div>
                <span class="stock-badge ${med.stock_status}">${med.stock_status.replace('_', ' ')}</span>
                <div style="margin-top:12px;">
                    <a href="https://wa.me/918709484805?text=Hello!%20I%20want%20to%20order/inquire%20about%20${encodeURIComponent(med.name)}." target="_blank" class="btn btn-whatsapp btn-sm btn-block">
                        💬 Order via WhatsApp
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    filterMedicines(query) {
        const lower = query.toLowerCase();
        const filtered = getMedicines().filter(med => 
            med.name.toLowerCase().includes(lower) || 
            med.manufacturer.toLowerCase().includes(lower) ||
            med.category.toLowerCase().includes(lower)
        );
        this.renderMedicineCards(filtered);
    }
}

let publicDashboard;
document.addEventListener('DOMContentLoaded', () => {
    publicDashboard = new PublicDashboard();
    window.publicDashboard = publicDashboard;
});