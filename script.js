class EventCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = this.loadEvents();
        this.selectedDate = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCalendar();
        this.updateEventsList();
        this.setShareUrl();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const addBtn = document.getElementById('addEventBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const shareBtn = document.getElementById('shareBtn');
        const closeShareBtn = document.getElementById('closeShareBtn');
        const copyBtn = document.getElementById('copyBtn');
        const eventForm = document.getElementById('eventForm');
        
        console.log('Elements found:', {
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            addBtn: !!addBtn,
            cancelBtn: !!cancelBtn,
            shareBtn: !!shareBtn,
            closeShareBtn: !!closeShareBtn,
            copyBtn: !!copyBtn,
            eventForm: !!eventForm
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousMonth());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());
        if (addBtn) addBtn.addEventListener('click', () => this.openEventModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeEventModal());
        if (shareBtn) shareBtn.addEventListener('click', () => this.openShareModal());
        if (closeShareBtn) closeShareBtn.addEventListener('click', () => this.closeShareModal());
        if (copyBtn) copyBtn.addEventListener('click', () => this.copyShareUrl());
        
        // Form submission
        if (eventForm) eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));
        
        // Close modals on outside click
        const eventModal = document.getElementById('eventModal');
        const shareModal = document.getElementById('shareModal');
        
        if (eventModal) {
            eventModal.addEventListener('click', (e) => {
                if (e.target.id === 'eventModal') this.closeEventModal();
            });
        }
        
        if (shareModal) {
            shareModal.addEventListener('click', (e) => {
                if (e.target.id === 'shareModal') this.closeShareModal();
            });
        }
        
        console.log('Event listeners setup complete');
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Clear calendar grid
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'p-2 border border-gray-200 rounded-lg';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createDayElement(year, month, day);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(year, month, day) {
        const dayElement = document.createElement('div');
        const dateStr = this.formatDate(new Date(year, month, day));
        const dayEvents = this.events.filter(event => event.date === dateStr);
        const isToday = this.isToday(year, month, day);
        
        dayElement.className = `calendar-day p-2 border border-gray-200 rounded-lg cursor-pointer ${
            isToday ? 'bg-indigo-50 border-indigo-300' : 'hover:bg-gray-50'
        }`;
        
        dayElement.innerHTML = `
            <div class="font-semibold text-gray-800 mb-1">${day}</div>
            <div class="space-y-1">
                ${dayEvents.slice(0, 2).map(event => `
                    <div class="event-badge text-xs bg-indigo-600 text-white px-1 py-0.5 rounded truncate">
                        ${event.time} ${event.name}
                    </div>
                `).join('')}
                ${dayEvents.length > 2 ? `
                    <div class="text-xs text-gray-500">+${dayEvents.length - 2} more</div>
                ` : ''}
            </div>
        `;
        
        dayElement.addEventListener('click', () => this.selectDate(new Date(year, month, day)));
        
        return dayElement;
    }

    selectDate(date) {
        this.selectedDate = date;
        document.getElementById('eventDate').value = this.formatDate(date);
        this.openEventModal();
    }

    openEventModal() {
        document.getElementById('eventModal').classList.add('active');
        if (!this.selectedDate) {
            this.selectedDate = new Date();
            document.getElementById('eventDate').value = this.formatDate(this.selectedDate);
        }
    }

    closeEventModal() {
        document.getElementById('eventModal').classList.remove('active');
        document.getElementById('eventForm').reset();
        this.selectedDate = null;
    }

    openShareModal() {
        document.getElementById('shareModal').classList.add('active');
        this.setShareUrl();
    }

    closeShareModal() {
        document.getElementById('shareModal').classList.remove('active');
    }

    handleEventSubmit(e) {
        e.preventDefault();
        
        const event = {
            id: Date.now(),
            name: document.getElementById('eventName').value,
            discordServer: document.getElementById('discordServer').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            createdAt: new Date().toISOString()
        };
        
        this.events.push(event);
        this.saveEvents();
        this.renderCalendar();
        this.updateEventsList();
        this.closeEventModal();
        
        // Show success message
        this.showNotification('Event added successfully!', 'success');
    }

    updateEventsList() {
        const eventsList = document.getElementById('eventsList');
        const sortedEvents = [...this.events].sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });
        
        const upcomingEvents = sortedEvents.filter(event => {
            const eventDate = new Date(event.date + ' ' + event.time);
            return eventDate >= new Date();
        });
        
        if (upcomingEvents.length === 0) {
            eventsList.innerHTML = '<p class="text-gray-500 text-center py-4">No upcoming events</p>';
            return;
        }
        
        eventsList.innerHTML = upcomingEvents.map(event => `
            <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800">${event.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">
                            <i class="fab fa-discord mr-1"></i>
                            ${event.discordServer}
                        </p>
                        <p class="text-sm text-gray-500 mt-1">
                            <i class="fas fa-clock mr-1"></i>
                            ${this.formatEventDateTime(event.date, event.time)}
                        </p>
                    </div>
                    <button onclick="calendar.deleteEvent(${event.id})" 
                            class="text-red-500 hover:text-red-700 transition ml-4">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.events = this.events.filter(event => event.id !== eventId);
            this.saveEvents();
            this.renderCalendar();
            this.updateEventsList();
            this.showNotification('Event deleted successfully!', 'info');
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    setShareUrl() {
        const shareUrl = window.location.href;
        document.getElementById('shareUrl').value = shareUrl;
    }

    copyShareUrl() {
        const shareUrl = document.getElementById('shareUrl');
        shareUrl.select();
        document.execCommand('copy');
        this.showNotification('Calendar link copied to clipboard!', 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-600' : 'bg-blue-600'
        }`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} mr-2"></i>
            ${message}
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Utility functions
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatEventDateTime(date, time) {
        const eventDate = new Date(date + ' ' + time);
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return eventDate.toLocaleDateString('en-US', options);
    }

    isToday(year, month, day) {
        const today = new Date();
        return year === today.getFullYear() && 
               month === today.getMonth() && 
               day === today.getDate();
    }

    // Storage functions
    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }

    loadEvents() {
        const stored = localStorage.getItem('calendarEvents');
        return stored ? JSON.parse(stored) : [];
    }
}

// Initialize calendar when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing calendar...');
        try {
            window.calendar = new EventCalendar();
            console.log('Calendar initialized successfully');
        } catch (error) {
            console.error('Error initializing calendar:', error);
        }
    });
} else {
    console.log('DOM already loaded, initializing calendar...');
    try {
        window.calendar = new EventCalendar();
        console.log('Calendar initialized successfully');
    } catch (error) {
        console.error('Error initializing calendar:', error);
    }
}
