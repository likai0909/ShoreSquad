/**
 * ShoreSquad - Main Application JavaScript
 * Features: Navigation, Smooth Scrolling, Weather API, Map Integration
 */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 ShoreSquad - Initializing application...');
    console.log('📅 Date:', new Date().toLocaleString());
    
    try {
        initNavigation();
        console.log('✅ Navigation initialized');
    } catch (error) {
        console.error('❌ Navigation init error:', error);
    }
    
    try {
        initSmoothScroll();
        console.log('✅ Smooth scroll initialized');
    } catch (error) {
        console.error('❌ Smooth scroll init error:', error);
    }
    
    try {
        initWeatherWidget();
        console.log('✅ Weather widget initialized');
    } catch (error) {
        console.error('❌ Weather widget init error:', error);
    }
    
    try {
        initEventListeners();
        console.log('✅ Event listeners initialized');
    } catch (error) {
        console.error('❌ Event listeners init error:', error);
    }
    
    try {
        loadUserPreferences();
        console.log('✅ User preferences loaded');
    } catch (error) {
        console.error('❌ User preferences error:', error);
    }
    
    // Check for Tawk.to
    if (typeof Tawk_API !== 'undefined') {
        console.log('✅ Tawk.to chat widget loaded');
    } else {
        console.log('⏳ Tawk.to chat widget loading...');
    }
    
    console.log('🎉 ShoreSquad initialized successfully!');
    console.log('💡 Open Chrome DevTools to see API calls and error handling');
});

// ==================== NAVIGATION ====================
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', 
                navMenu.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu?.contains(e.target) && !navToggle?.contains(e.target)) {
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Active nav link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Header background on scroll
    updateHeaderBackground();
    window.addEventListener('scroll', throttle(updateHeaderBackground, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function updateHeaderBackground() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== WEATHER WIDGET (NEA Singapore API) ====================
function initWeatherWidget() {
    const refreshBtn = document.getElementById('weather-refresh-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            fetchNEAWeather();
        });
    }
    
    // Automatically load weather on page load
    fetchNEAWeather();
}

/**
 * Fetch 24-hour weather forecast from NEA Singapore using JSONP
 * API: https://api.data.gov.sg/v1/environment/24-hour-weather-forecast
 */
function fetchNEAWeather() {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;
    
    // Show loading state
    weatherDisplay.className = 'weather-display loading-state';
    weatherDisplay.innerHTML = '<div class="loading">🌤️ Fetching live weather from NEA Singapore...</div>';
    
    try {
        console.log('🌤️ Fetching NEA weather data...');
        
        // Create JSONP callback
        const callbackName = 'neaWeatherCallback_' + Date.now();
        const apiUrl = `https://api.data.gov.sg/v1/environment/24-hour-weather-forecast`;
        
        // Since NEA API doesn't support JSONP, we'll use fetch with error handling
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Weather data received:', data);
                displayNEAWeather(data);
            })
            .catch(error => {
                console.error('❌ Weather API Error:', error);
                showWeatherError(`Failed to load weather data: ${error.message}. Check Chrome DevTools Console for details.`);
            });
            
    } catch (error) {
        console.error('❌ Unexpected error in fetchNEAWeather:', error);
        showWeatherError(`Unexpected error: ${error.message}`);
    }
}

/**
 * Display NEA weather forecast data
 * @param {Object} data - NEA API response data
 */
function displayNEAWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;
    
    try {
        if (!data || !data.items || data.items.length === 0) {
            throw new Error('No weather data available');
        }
        
        const forecast = data.items[0];
        const periods = forecast.periods || [];
        const general = forecast.general || {};
        
        let forecastHTML = '<div class="weather-forecast-grid">';
        
        // General Forecast Card
        if (general.forecast) {
            forecastHTML += `
                <div class="forecast-card">
                    <div class="forecast-header">
                        <div class="forecast-icon">${getWeatherIcon(general.forecast)}</div>
                        <div>
                            <h3 class="forecast-title">General Forecast</h3>
                            <p style="color: var(--text-secondary); font-size: 0.875rem;">Singapore</p>
                        </div>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">Condition:</span>
                        <span class="forecast-detail-value">${general.forecast}</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">Temperature:</span>
                        <span class="forecast-detail-value">${general.temperature?.low || 'N/A'}°C - ${general.temperature?.high || 'N/A'}°C</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">Humidity:</span>
                        <span class="forecast-detail-value">${general.relative_humidity?.low || 'N/A'}% - ${general.relative_humidity?.high || 'N/A'}%</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">Wind:</span>
                        <span class="forecast-detail-value">${general.wind?.direction || 'N/A'} ${general.wind?.speed?.low || 'N/A'}-${general.wind?.speed?.high || 'N/A'} km/h</span>
                    </div>
                </div>
            `;
        }
        
        // Period Forecasts (Morning, Afternoon, etc.)
        periods.slice(0, 3).forEach(period => {
            forecastHTML += `
                <div class="forecast-card">
                    <div class="forecast-header">
                        <div class="forecast-icon">${getWeatherIcon(period.regions?.west || 'Partly Cloudy')}</div>
                        <div>
                            <h3 class="forecast-title">${formatPeriodTime(period.time)}</h3>
                            <p style="color: var(--text-secondary); font-size: 0.875rem;">Regional Forecast</p>
                        </div>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">West:</span>
                        <span class="forecast-detail-value">${period.regions?.west || 'N/A'}</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">East:</span>
                        <span class="forecast-detail-value">${period.regions?.east || 'N/A'}</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">Central:</span>
                        <span class="forecast-detail-value">${period.regions?.central || 'N/A'}</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">South:</span>
                        <span class="forecast-detail-value">${period.regions?.south || 'N/A'}</span>
                    </div>
                    <div class="forecast-detail">
                        <span class="forecast-detail-label">North:</span>
                        <span class="forecast-detail-value">${period.regions?.north || 'N/A'}</span>
                    </div>
                </div>
            `;
        });
        
        forecastHTML += '</div>';
        
        // Add timestamp
        const timestamp = new Date(forecast.timestamp || forecast.update_timestamp).toLocaleString();
        forecastHTML += `
            <div class="weather-timestamp">
                📅 Last updated: ${timestamp} | Source: NEA Singapore
            </div>
        `;
        
        weatherDisplay.className = 'weather-display';
        weatherDisplay.innerHTML = forecastHTML;
        
        console.log('✅ Weather display updated successfully');
        
    } catch (error) {
        console.error('❌ Error displaying weather:', error);
        showWeatherError(`Failed to display weather data: ${error.message}`);
    }
}

/**
 * Get appropriate weather icon emoji based on forecast text
 * @param {string} forecast - Weather forecast description
 * @returns {string} - Weather emoji
 */
function getWeatherIcon(forecast) {
    if (!forecast) return '🌤️';
    
    const condition = forecast.toLowerCase();
    
    if (condition.includes('thunder') || condition.includes('storm')) return '⛈️';
    if (condition.includes('heavy rain') || condition.includes('shower')) return '🌧️';
    if (condition.includes('rain') || condition.includes('drizzle')) return '🌦️';
    if (condition.includes('cloudy') || condition.includes('overcast')) return '☁️';
    if (condition.includes('partly cloudy') || condition.includes('fair')) return '⛅';
    if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
    if (condition.includes('hazy') || condition.includes('haze')) return '🌫️';
    if (condition.includes('windy')) return '💨';
    
    return '🌤️'; // Default
}

/**
 * Format period time object to readable string
 * @param {Object} time - Time object with start and end
 * @returns {string} - Formatted time string
 */
function formatPeriodTime(time) {
    if (!time) return 'N/A';
    
    try {
        const start = new Date(time.start);
        const end = new Date(time.end);
        
        const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        
        return `${startTime} - ${endTime}`;
    } catch (error) {
        return 'N/A';
    }
}

function showWeatherError(message) {
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay) {
        weatherDisplay.className = 'weather-display';
        weatherDisplay.innerHTML = `
            <div class="weather-error">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <h3 style="color: var(--danger-color); margin-bottom: 0.5rem;">Weather Data Unavailable</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="fetchNEAWeather()" style="margin-top: 1rem;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Button click handlers
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', handleCTAClick);
    });
    
    // Event card buttons
    const eventButtons = document.querySelectorAll('.event-card .btn');
    eventButtons.forEach(btn => {
        btn.addEventListener('click', handleEventJoin);
    });
    
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta .btn, .nav-cta');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', handleSignup);
    });
    
    // Map interactions
    initMapInteractions();
    
    // Intersection Observer for scroll animations
    observeElements();
}

function handleCTAClick(e) {
    console.log('CTA clicked:', e.target.textContent);
    // In production, navigate to appropriate page or show modal
    alert('Feature coming soon! 🌊');
}

function handleEventJoin(e) {
    console.log('Join event clicked');
    // In production, show event details and registration form
    alert('Event registration coming soon! 🏖️');
}

function handleSignup(e) {
    console.log('Signup clicked');
    // In production, show signup modal or navigate to registration page
    alert('Squad signup coming soon! 👥');
}

// ==================== SCROLL ANIMATIONS ====================
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards, event cards, etc.
    const elementsToObserve = document.querySelectorAll(
        '.feature-card, .event-card, .hero-content, .hero-image'
    );
    
    elementsToObserve.forEach(el => observer.observe(el));
}

// ==================== LOCAL STORAGE ====================
function loadUserPreferences() {
    const preferences = localStorage.getItem('shoresquad_preferences');
    if (preferences) {
        const prefs = JSON.parse(preferences);
        console.log('Loaded user preferences:', prefs);
        // Apply saved preferences (e.g., theme, location)
    }
}

function saveUserPreferences(preferences) {
    localStorage.setItem('shoresquad_preferences', JSON.stringify(preferences));
    console.log('Preferences saved:', preferences);
}

// ==================== MAP INTERACTIONS ====================
function initMapInteractions() {
    // Map search functionality
    const mapSearchBtn = document.getElementById('map-search-btn');
    const mapSearchInput = document.getElementById('map-search');
    
    if (mapSearchBtn && mapSearchInput) {
        mapSearchBtn.addEventListener('click', () => {
            const searchTerm = mapSearchInput.value.trim();
            if (searchTerm) {
                handleMapSearch(searchTerm);
            }
        });
        
        mapSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                mapSearchBtn.click();
            }
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            handleMapFilter(filter);
        });
    });
    
    // Map event item interactions
    const mapEventItems = document.querySelectorAll('.map-event-item');
    mapEventItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
                highlightMapLocation(item.getAttribute('data-location'));
            }
        });
    });
    
    // Demo pin interactions
    const demoPins = document.querySelectorAll('.demo-pin');
    demoPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const locationName = pin.querySelector('.pin-label').textContent;
            showLocationInfo(locationName);
        });
    });
}

function handleMapSearch(searchTerm) {
    console.log('Searching map for:', searchTerm);
    // In production, this would filter the map and event list
    const eventCount = document.getElementById('event-count');
    if (eventCount) {
        eventCount.textContent = `Searching for "${searchTerm}"...`;
        
        setTimeout(() => {
            eventCount.textContent = `2 events found near "${searchTerm}"`;
        }, 1000);
    }
}

function handleMapFilter(filter) {
    console.log('Filtering by:', filter);
    const eventCount = document.getElementById('event-count');
    
    // Simulate filtering
    const filterCounts = {
        'all': 3,
        'upcoming': 3,
        'today': 1,
        'near-me': 2
    };
    
    if (eventCount) {
        eventCount.textContent = `${filterCounts[filter] || 0} events found`;
    }
    
    // In production, this would filter the map markers and event list
}

function highlightMapLocation(location) {
    console.log('Highlighting location:', location);
    
    // Remove highlight from all pins
    const demoPins = document.querySelectorAll('.demo-pin');
    demoPins.forEach(pin => {
        pin.style.transform = '';
    });
    
    // Add visual feedback
    const mapEventItems = document.querySelectorAll('.map-event-item');
    mapEventItems.forEach(item => {
        if (item.getAttribute('data-location') === location) {
            item.style.backgroundColor = '#E0F2FE';
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 2000);
        }
    });
}

function showLocationInfo(locationName) {
    console.log('Showing info for:', locationName);
    alert(`📍 ${locationName}\n\nClick "View Details" on the event card to learn more!`);
}

// ==================== UTILITY FUNCTIONS ====================
/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

/**
 * Debounce function to delay execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Format date for display
 * @param {Date} date - Date object
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// ==================== DEBUGGING & TESTING ====================
// Make functions available in console for testing
window.ShoreSquadDebug = {
    fetchWeather: fetchNEAWeather,
    testErrorHandling: () => {
        console.log('🧪 Testing error handling...');
        try {
            throw new Error('This is a test error');
        } catch (error) {
            console.error('✅ Error caught successfully:', error);
            showWeatherError('Test error: ' + error.message);
        }
    },
    checkTawkTo: () => {
        if (typeof Tawk_API !== 'undefined') {
            console.log('✅ Tawk.to Status:', Tawk_API);
            console.log('✅ Tawk.to is loaded and ready!');
        } else {
            console.log('❌ Tawk.to is not loaded yet');
        }
    },
    testAPI: () => {
        console.log('🧪 Testing NEA API...');
        fetch('https://api.data.gov.sg/v1/environment/24-hour-weather-forecast')
            .then(r => {
                console.log('✅ API Response Status:', r.status);
                return r.json();
            })
            .then(d => {
                console.log('✅ API Data:', d);
            })
            .catch(e => {
                console.error('❌ API Error:', e);
            });
    },
    info: () => {
        console.log(`
🌊 ShoreSquad Debug Console
========================
Available commands:
- ShoreSquadDebug.fetchWeather() - Refresh weather data
- ShoreSquadDebug.testErrorHandling() - Test error handling
- ShoreSquadDebug.checkTawkTo() - Check Tawk.to status
- ShoreSquadDebug.testAPI() - Test NEA API directly
- ShoreSquadDebug.info() - Show this help

Tips for Chrome DevTools:
1. Open Console (F12 or Ctrl+Shift+J)
2. Watch Network tab for API calls
3. Check Console for error messages
4. Test functions directly in console
        `);
    }
};

// Show debug info on load
console.log('💡 Debug tools available! Type ShoreSquadDebug.info() for commands');

// ==================== EXPORT FOR TESTING ====================
// Uncomment for module-based testing
// export { initNavigation, fetchNEAWeather, throttle, debounce };
