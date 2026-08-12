// Authentication System for Modi Medical
// Handles login, registration, role management, and password changes

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.selectedRole = 'admin';
        this.initializeAuth();
    }

    initializeAuth() {
        if (isAuthenticated()) {
            this.currentUser = getCurrentUser();
            this.showAppropriateDashboard();
        } else {
            this.showFrontPage();
        }

        this.setupEventListeners();
        this.setupModalBackdropClicks();
    }

    setupEventListeners() {
        // Brand logo & name click -> Home
        const brandHomeBtn = document.getElementById('brandHomeBtn');
        if (brandHomeBtn) brandHomeBtn.addEventListener('click', () => this.showFrontPage());

        // Nav Buttons
        const navHomeBtn = document.getElementById('navHomeBtn');
        if (navHomeBtn) navHomeBtn.addEventListener('click', () => this.showFrontPage());

        const navCatalogBtn = document.getElementById('navCatalogBtn');
        if (navCatalogBtn) navCatalogBtn.addEventListener('click', () => this.showPublicDashboard('public-medicines'));

        const navPromoBtn = document.getElementById('navPromoBtn');
        if (navPromoBtn) navPromoBtn.addEventListener('click', () => this.showPublicDashboard('public-materials'));

        const headerLoginBtn = document.getElementById('headerLoginBtn');
        if (headerLoginBtn) headerLoginBtn.addEventListener('click', () => this.showLoginPage());

        const loginPageBtn = document.getElementById('loginPageBtn');
        if (loginPageBtn) loginPageBtn.addEventListener('click', () => this.showLoginPage());

        const quickRegisterBtn = document.getElementById('quickRegisterBtn');
        if (quickRegisterBtn) quickRegisterBtn.addEventListener('click', () => this.showRegisterPage());

        const exploreBtn = document.getElementById('exploreBtn');
        if (exploreBtn) exploreBtn.addEventListener('click', () => this.showPublicDashboard('public-medicines'));

        const exploreBtn2 = document.getElementById('exploreBtn2');
        if (exploreBtn2) exploreBtn2.addEventListener('click', () => this.showPublicDashboard('public-medicines'));

        // Role Card Selection
        document.querySelectorAll('.role-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const role = target.dataset.role;
                this.selectedRole = role;
                
                document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
                target.classList.add('selected');
                
                const loginRoleInput = document.getElementById('loginRole');
                if (loginRoleInput) loginRoleInput.value = role;

                if (role === 'public') {
                    this.showPublicDashboard();
                }
            });
        });

        // Form Submit Listeners
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }

        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterPage();
            });
        }

        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginPage();
            });
        }

        // Admin Password Change Button & Modal
        const adminPasswordChangeBtn = document.getElementById('adminPasswordChangeBtn');
        if (adminPasswordChangeBtn) {
            adminPasswordChangeBtn.addEventListener('click', () => this.showPasswordChangeModal());
        }

        const closePasswordModal = document.getElementById('closePasswordModal');
        if (closePasswordModal) {
            closePasswordModal.addEventListener('click', () => this.hidePasswordChangeModal());
        }

        const passwordChangeForm = document.getElementById('passwordChangeForm');
        if (passwordChangeForm) {
            passwordChangeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordChange();
            });
        }

        // Logout Listeners
        const adminLogout = document.getElementById('adminLogout');
        if (adminLogout) adminLogout.addEventListener('click', () => this.handleLogout());

        const staffLogout = document.getElementById('staffLogout');
        if (staffLogout) staffLogout.addEventListener('click', () => this.handleLogout());

        const publicLogout = document.getElementById('publicLogout');
        if (publicLogout) publicLogout.addEventListener('click', () => this.handleLogout());
    }

    setupModalBackdropClicks() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    handleLogin() {
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';

        if (!username || !password) {
            this.showToast('Please enter both username and password', 'error');
            return;
        }

        const user = authenticateUser(username, password);

        if (user) {
            this.currentUser = user;
            setSession({
                user_id: user.id,
                username: user.username,
                role: user.role
            });

            this.showToast(`Welcome back, ${user.name}!`, 'success');
            this.showAppropriateDashboard();
        } else {
            this.showToast('Invalid username or password', 'error');
        }
    }

    handleRegistration() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const fullName = document.getElementById('regFullName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const role = document.getElementById('regRole').value;
        const shopName = document.getElementById('regShopName').value.trim();

        if (getUserByUsername(username)) {
            this.showToast('Username is already taken. Please choose another.', 'error');
            return;
        }

        const newUser = createUser({
            username,
            password,
            name: fullName,
            phone,
            role,
            shop_name: shopName,
            registration_source: 'web_form'
        });

        this.showToast('Registration successful! You can now log in.', 'success');
        this.showLoginPage();
    }

    handlePasswordChange() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            this.showToast('New passwords do not match', 'error');
            return;
        }

        if (this.currentUser && this.currentUser.password === currentPassword) {
            updateUser(this.currentUser.id, {
                password: newPassword,
                force_password_change: false
            });
            this.currentUser.password = newPassword;
            this.hidePasswordChangeModal();
            this.showToast('Password changed successfully!', 'success');
        } else {
            this.showToast('Current password is incorrect', 'error');
        }
    }

    showFrontPage() {
        this.hideAllPages();
        document.getElementById('landingPage').classList.remove('hidden');
        this.updateNavActive('navHomeBtn');
    }

    showLoginPage() {
        this.hideAllPages();
        document.getElementById('loginPage').classList.remove('hidden');
        this.updateNavActive('headerLoginBtn');
    }

    showRegisterPage() {
        this.hideAllPages();
        document.getElementById('registerPage').classList.remove('hidden');
    }

    showAppropriateDashboard() {
        if (!this.currentUser) {
            this.showFrontPage();
            return;
        }

        this.hideAllPages();
        if (this.currentUser.role === 'admin') {
            document.getElementById('adminDashboard').classList.remove('hidden');
            if (window.adminDashboard) window.adminDashboard.initializeDashboard();
        } else if (this.currentUser.role === 'staff') {
            document.getElementById('staffDashboard').classList.remove('hidden');
            if (window.staffDashboard) window.staffDashboard.initializeDashboard();
        } else {
            this.showPublicDashboard();
        }
    }

    showPublicDashboard(tab = 'public-materials') {
        this.hideAllPages();
        const publicDash = document.getElementById('publicDashboard');
        if (publicDash) {
            publicDash.classList.remove('hidden');
            if (window.publicDashboard) {
                window.publicDashboard.initializeDashboard();
                window.publicDashboard.switchTab(tab);
            }
        }
    }

    updateNavActive(activeBtnId) {
        document.querySelectorAll('.nav-link-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === activeBtnId);
        });
    }

    hideAllPages() {
        document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    }

    showPasswordChangeModal() {
        const modal = document.getElementById('passwordChangeModal');
        if (modal) modal.classList.remove('hidden');
    }

    hidePasswordChangeModal() {
        const modal = document.getElementById('passwordChangeModal');
        if (modal) modal.classList.add('hidden');
    }

    handleLogout() {
        clearSession();
        this.currentUser = null;
        this.showFrontPage();
        this.showToast('You have been logged out.', 'info');
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isStaff() {
        return this.currentUser && this.currentUser.role === 'staff';
    }

    isPublic() {
        return !this.currentUser || this.currentUser.role === 'public';
    }

    showToast(msg, type = 'info') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = msg;
            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3500);
        }
    }
}

let authSystem;
document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
    window.authSystem = authSystem;
});