// Notification System for Modi Medical
// Handles admin notifications for public user registrations and system events

class NotificationSystem {
    constructor(authSystem) {
        this.authSystem = authSystem;
        this.notificationContainer = null;
        this.initializeNotificationSystem();
    }

    initializeNotificationSystem() {
        if (this.authSystem && this.authSystem.isAdmin()) {
            this.createNotificationContainer();
            this.startNotificationPolling();
        }
    }

    createNotificationContainer() {
        // Check if container already exists
        if (document.getElementById('adminNotifications')) {
            this.notificationContainer = document.getElementById('adminNotifications');
            return;
        }

        // Create notification container
        const container = document.createElement('div');
        container.id = 'adminNotifications';
        container.className = 'admin-notifications';
        document.body.appendChild(container);
        this.notificationContainer = container;

        // Add notification button to dashboard header
        this.addNotificationButton();
    }

    addNotificationButton() {
        const dashboardHeader = document.querySelector('#adminDashboard .dashboard-header .user-info');
        if (dashboardHeader) {
            const button = document.createElement('button');
            button.className = 'btn btn-secondary notification-btn';
            button.id = 'notificationBtn';
            button.innerHTML = '🔔 <span class="notification-badge hidden">0</span>';
            button.style.marginRight = '1rem';
            button.style.position = 'relative';
            
            button.addEventListener('click', () => this.toggleNotificationPanel());
            
            dashboardHeader.insertBefore(button, dashboardHeader.firstChild);
        }
    }

    toggleNotificationPanel() {
        const container = this.notificationContainer;
        container.classList.toggle('hidden');
        
        if (!container.classList.contains('hidden')) {
            this.renderNotifications();
        }
    }

    renderNotifications() {
        const notifications = getNotifications();
        const container = this.notificationContainer;
        
        if (notifications.length === 0) {
            container.innerHTML = '<div class="notification-item"><p class="notification-message">No notifications</p></div>';
            return;
        }

        container.innerHTML = '';
        
        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? '' : 'unread'}`;
            
            const icon = this.getNotificationIcon(notification.type);
            
            item.innerHTML = `
                <div class="notification-icon">${icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.created_at)}</div>
                </div>
                <button class="notification-close" onclick="notificationSystem.closeNotification('${notification.id}')">&times;</button>
            `;
            
            container.appendChild(item);
        });

        // Mark all as read when panel is opened
        markAllNotificationsAsRead();
        this.updateNotificationBadge();
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'user_registration':
                return '👤';
            case 'system':
                return '⚙️';
            case 'alert':
                return '⚠️';
            case 'success':
                return '✅';
            default:
                return '📢';
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleDateString();
    }

    closeNotification(notificationId) {
        deleteNotification(notificationId);
        this.renderNotifications();
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const count = getUnreadNotificationCount();
        
        if (count > 0) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    startNotificationPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(() => {
            this.updateNotificationBadge();
        }, 30000);
    }

    // Public method to add notification
    addNotification(title, message, type = 'system') {
        return addNotification({
            title,
            message,
            type
        });
    }

    // Notify admin about new public user registration
    notifyPublicUserRegistration(userData) {
        const notification = this.addNotification(
            'New Public User Registration',
            `${userData.name} (${userData.phone}) has registered via WhatsApp link.`,
            'user_registration'
        );
        
        // Update badge immediately
        this.updateNotificationBadge();
        
        // Show toast notification
        if (this.authSystem && this.authSystem.isAdmin()) {
            this.authSystem.showToast(`New user registered: ${userData.name}`, 'success');
        }
        
        return notification;
    }

    destroy() {
        if (this.notificationContainer) {
            this.notificationContainer.remove();
        }
    }
}

// Create global instance
let notificationSystem;

// Initialize notification system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to ensure auth system is ready
    setTimeout(() => {
        if (typeof authSystem !== 'undefined' && authSystem && authSystem.isAdmin()) {
            if (!notificationSystem) {
                notificationSystem = new NotificationSystem(authSystem);
            }
        }
    }, 1000);
});