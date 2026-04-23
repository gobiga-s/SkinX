// Dashboard JavaScript for SkinX Platform

class DashboardManager {
    constructor() {
        this.initializeEventListeners();
        this.loadUserData();
        this.initializeSidebar();
        this.loadDashboardData();
    }
    
    initializeEventListeners() {
        // Sidebar functionality
        this.setupSidebar();
        
        // Navigation menu items
        this.setupNavigation();
        
        // Search functionality
        this.setupSearch();
        
        // Notifications
        this.setupNotifications();
        
        // Quick action cards
        this.setupQuickActions();
    }
    
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        if (mobileSidebarToggle) {
            mobileSidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (sidebar && !sidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }
    
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                // Update active state
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                link.parentElement.classList.add('active');
                
                // Handle navigation
                this.handleNavigation(href);
            });
        });
    }
    
    handleNavigation(href) {
        // Remove the # and handle routing
        const route = href.replace('#', '');
        
        switch (route) {
            case 'dashboard':
                // Already on dashboard
                break;
            case 'patients':
                window.location.href = '/patients';
                break;
            case 'image-analysis':
                window.location.href = '/analysis/image';
                break;
            case 'text-analysis':
                window.location.href = '/analysis/text';
                break;
            case 'history':
                window.location.href = '/history';
                break;
            case 'analytics':
                this.showToast('Analytics dashboard coming soon', 'info');
                break;
            case 'reports':
                this.showToast('Reports section coming soon', 'info');
                break;
            case 'settings':
                this.showToast('Settings page coming soon', 'info');
                break;
            default:
                console.log('Unknown route:', route);
        }
    }
    
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                this.handleSearch(query);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        }
    }
    
    handleSearch(query) {
        // Implement live search functionality
        console.log('Searching for:', query);
    }
    
    performSearch(query) {
        if (query.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }
    
    setupNotifications() {
        const notificationBtn = document.querySelector('.notification-btn');
        
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }
    
    showNotifications() {
        // Mock notifications
        const notifications = [
            {
                id: 1,
                type: 'success',
                title: 'Analysis Complete',
                message: 'John Smith\'s melanoma analysis is ready',
                time: '2 hours ago'
            },
            {
                id: 2,
                type: 'warning',
                title: 'Follow-up Required',
                message: 'Sarah Johnson needs follow-up consultation',
                time: '5 hours ago'
            },
            {
                id: 3,
                type: 'info',
                title: 'System Update',
                message: 'New AI model version available',
                time: '1 day ago'
            }
        ];
        
        this.renderNotifications(notifications);
    }
    
    renderNotifications(notifications) {
        // Create notification dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.innerHTML = `
            <div class="notification-header">
                <h4>Notifications</h4>
                <button onclick="clearAllNotifications()">Clear All</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item ${notif.type}">
                        <div class="notification-content">
                            <div class="notification-title">${notif.title}</div>
                            <div class="notification-message">${notif.message}</div>
                            <div class="notification-time">${notif.time}</div>
                        </div>
                        <button class="notification-close" onclick="dismissNotification(${notif.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-dropdown {
                position: absolute;
                top: 60px;
                right: 20px;
                width: 350px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                z-index: 1000;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .notification-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }
            
            .notification-header button {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                font-size: 14px;
            }
            
            .notification-list {
                max-height: 300px;
                overflow-y: auto;
            }
            
            .notification-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 15px 20px;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.3s ease;
            }
            
            .notification-item:hover {
                background: #f8f9fa;
            }
            
            .notification-item.success {
                border-left: 4px solid #4caf50;
            }
            
            .notification-item.warning {
                border-left: 4px solid #ff9800;
            }
            
            .notification-item.info {
                border-left: 4px solid #2196f3;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 4px;
            }
            
            .notification-message {
                font-size: 14px;
                color: #666;
                margin-bottom: 4px;
            }
            
            .notification-time {
                font-size: 12px;
                color: #999;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 4px;
            }
            
            .notification-close:hover {
                color: #666;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.remove();
                    style.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);
    }
    
    setupQuickActions() {
        const quickActionCards = document.querySelectorAll('.quick-action-card');
        
        quickActionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const href = card.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });
    }
    
    loadUserData() {
        // Load user data from session
        const user = JSON.parse(sessionStorage.getItem('skinx_user') || localStorage.getItem('skinx_user') || '{}');
        
        // Update UI with user data
        this.updateUserUI(user);
    }
    
    updateUserUI(user) {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const welcomeName = document.getElementById('welcomeName');
        
        if (userName) userName.textContent = user.name || 'Dr. Professional';
        if (userRole) userRole.textContent = user.role || 'Healthcare Provider';
        if (welcomeName) welcomeName.textContent = user.name?.split(' ')[0] || 'Doctor';
    }
    
    loadDashboardData() {
        // Simulate loading dashboard data
        this.updateDashboardStats();
        this.loadRecentActivity();
    }
    
    updateDashboardStats() {
        // Update dashboard statistics with animations
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach(stat => {
            const finalValue = stat.textContent;
            const isPercentage = finalValue.includes('%');
            const isTime = finalValue.includes('ms');
            
            let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
            let currentValue = 0;
            const increment = numericValue / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                
                if (isPercentage) {
                    stat.textContent = currentValue.toFixed(1) + '%';
                } else if (isTime) {
                    stat.textContent = Math.round(currentValue) + 'ms';
                } else {
                    stat.textContent = Math.round(currentValue).toLocaleString();
                }
            }, 20);
        });
    }
    
    loadRecentActivity() {
        // Recent activity is already in the HTML, but could be loaded dynamically
        console.log('Loading recent activity...');
    }
    
    showToast(message, type = 'info', duration = 3000) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add toast styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    padding: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    animation: slideInRight 0.3s ease-out;
                }
                
                .toast.success {
                    border-left: 4px solid #4caf50;
                }
                
                .toast.error {
                    border-left: 4px solid #f44336;
                }
                
                .toast.warning {
                    border-left: 4px solid #ff9800;
                }
                
                .toast.info {
                    border-left: 4px solid #2196f3;
                }
                
                .toast-icon {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                
                .toast.success .toast-icon {
                    background: #e8f5e8;
                    color: #4caf50;
                }
                
                .toast.error .toast-icon {
                    background: #ffeaea;
                    color: #f44336;
                }
                
                .toast.warning .toast-icon {
                    background: #fff3e0;
                    color: #ff9800;
                }
                
                .toast.info .toast-icon {
                    background: #e3f2fd;
                    color: #2196f3;
                }
                
                .toast-content {
                    flex: 1;
                }
                
                .toast-title {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }
                
                .toast-message {
                    font-size: 14px;
                    color: #666;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 4px;
                }
                
                .toast-close:hover {
                    color: #666;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Global functions
function logout() {
    sessionStorage.removeItem('skinx_token');
    sessionStorage.removeItem('skinx_user');
    localStorage.removeItem('skinx_token');
    localStorage.removeItem('skinx_user');
    window.location.href = '/login';
}

function viewAllActivity() {
    window.location.href = '/history';
}

function clearAllNotifications() {
    // Clear all notifications
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    
    // Close dropdown
    const dropdown = document.querySelector('.notification-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

function dismissNotification(id) {
    // Dismiss specific notification
    console.log('Dismissing notification:', id);
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
    console.log('Dashboard initialized');
});
