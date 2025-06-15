 const API_KEY = 'aef7d962efe2c721ff9343720943aa0c'; // Replace with your actual API key
        const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
        
        // Weather icon mapping
        const weatherIcons = {
            '01d': '☀️', '01n': '🌙', // clear sky
            '02d': '⛅', '02n': '☁️', // few clouds
            '03d': '☁️', '03n': '☁️', // scattered clouds
            '04d': '☁️', '04n': '☁️', // broken clouds
            '09d': '🌧️', '09n': '🌧️', // shower rain
            '10d': '🌦️', '10n': '🌦️', // rain
            '11d': '⛈️', '11n': '⛈️', // thunderstorm
            '13d': '❄️', '13n': '❄️', // snow
            '50d': '🌫️', '50n': '🌫️'  // mist
        };

        // Get user's location and fetch weather
        function initWeather() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherByCoords(latitude, longitude);
                    },
                    error => {
                        console.log('Location access denied, using demo data');
                        fetchWeatherByCity('London'); // Fallback to London
                    }
                );
            } else {
                fetchWeatherByCity('London'); // Fallback for browsers without geolocation
            }
        }

        // Fetch weather by coordinates
        async function fetchWeatherByCoords(lat, lon) {
            try {
                // Using a demo API for this example
                const demoData = {
                    name: 'Your Location',
                    main: { temp: 22, humidity: 65 },
                    weather: [{ main: 'Clear', description: 'Clear sky', icon: '01d' }],
                    wind: { speed: 3.5 },
                    uvi: 6
                };
                updateWeatherUI(demoData);
            } catch (error) {
                console.error('Error fetching weather:', error);
                showDemoData();
            }
        }

        // Fetch weather by city name
        async function fetchWeatherByCity(city) {
            try {
                // Demo data for different cities
                const demoData = {
                    'London': { name: 'London', main: { temp: 18, humidity: 72 }, weather: [{ main: 'Clouds', description: 'Cloudy', icon: '04d' }], wind: { speed: 2.8 }, uvi: 4 },
                    'New York': { name: 'New York', main: { temp: 24, humidity: 65 }, weather: [{ main: 'Clear', description: 'Sunny', icon: '01d' }], wind: { speed: 3.3 }, uvi: 6 },
                    'Tokyo': { name: 'Tokyo', main: { temp: 26, humidity: 78 }, weather: [{ main: 'Rain', description: 'Light rain', icon: '10d' }], wind: { speed: 2.1 }, uvi: 3 },
                    'Paris': { name: 'Paris', main: { temp: 20, humidity: 68 }, weather: [{ main: 'Clouds', description: 'Partly cloudy', icon: '02d' }], wind: { speed: 2.5 }, uvi: 5 }
                };
                
                const data = demoData[city] || demoData['London'];
                updateWeatherUI(data);
            } catch (error) {
                console.error('Error fetching weather:', error);
                showDemoData();
            }
        }

        function showDemoData() {
            const demoData = {
                name: 'Demo City',
                main: { temp: 24, humidity: 65 },
                weather: [{ main: 'Clear', description: 'Sunny', icon: '01d' }],
                wind: { speed: 3.3 },
                uvi: 6
            };
            updateWeatherUI(demoData);
        }

        function updateWeatherUI(data) {
            const cityElement = document.querySelector('.city');
            const tempElement = document.querySelector('.temperature');
            const iconElement = document.querySelector('.weather-icon');
            const descElement = document.querySelector('.weather-desc');
            const humidityElement = document.querySelector('.detail-value');
            const windElement = document.querySelectorAll('.detail-value')[1];
            const uvElement = document.querySelectorAll('.detail-value')[2];

            // Update with animation
            const elements = [cityElement, tempElement, iconElement, descElement];
            elements.forEach(el => {
                el.style.transform = 'scale(0.8)';
                el.style.opacity = '0';
            });

            setTimeout(() => {
                cityElement.textContent = data.name;
                tempElement.textContent = Math.round(data.main.temp) + '°';
                iconElement.textContent = weatherIcons[data.weather[0].icon] || '☀️';
                descElement.textContent = data.weather[0].description;
                humidityElement.textContent = data.main.humidity + '%';
                windElement.textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
                uvElement.textContent = data.uvi || 6;

                elements.forEach(el => {
                    el.style.transform = 'scale(1)';
                    el.style.opacity = '1';
                });
            }, 300);
        }

        function refreshWeather() {
            const btn = document.querySelector('.refresh-btn');
            btn.classList.add('loading');
            
            setTimeout(() => {
                btn.classList.remove('loading');
                
                // Cycle through different cities for demo
                const cities = ['London', 'New York', 'Tokyo', 'Paris'];
                const randomCity = cities[Math.floor(Math.random() * cities.length)];
                fetchWeatherByCity(randomCity);
            }, 1000);
        }

        // Initialize weather on page load
        document.addEventListener('DOMContentLoaded', initWeather);

        // Update date
        function updateDate() {
            const now = new Date();
            const options = { weekday: 'long', month: 'long', day: 'numeric' };
            document.querySelector('.date').textContent = now.toLocaleDateString('en-US', options);
        }
        
        updateDate();

        // Add some interactive hover effects
        document.querySelector('.weather-card').addEventListener('mousemove', (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        document.querySelector('.weather-card').addEventListener('mouseleave', (e) => {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
        });
