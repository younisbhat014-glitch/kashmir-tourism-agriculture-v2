export const WEATHER_CITIES = {
  Srinagar: { lat: 34.0837, lon: 74.7973, place: 'Srinagar, Jammu & Kashmir, India', aliases: ['srinagar'] },
  'Dal Lake': { lat: 34.1160, lon: 74.8700, place: 'Dal Lake, Srinagar, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['dal lake', 'dal', 'dallake'] },
  Gulmarg: { lat: 34.0484, lon: 74.3805, place: 'Gulmarg, Jammu & Kashmir, India', aliases: ['gulmarg'] },
  Pahalgam: { lat: 34.0161, lon: 75.3154, place: 'Pahalgam, Jammu & Kashmir, India', aliases: ['pahalgam', 'pahalgam kashmir'] },
  Sonamarg: { lat: 34.3032, lon: 75.2930, place: 'Sonamarg, Jammu & Kashmir, India', aliases: ['sonamarg', 'sonmarg'] },
  'Mughal Gardens': { lat: 34.1492, lon: 74.8738, place: 'Mughal Gardens, Srinagar, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['mughal gardens', 'mughal garden', 'shalimar', 'shalimar bagh', 'nishat', 'nishat bagh'] },
  'Pari Mahal': { lat: 34.1066, lon: 74.8654, place: 'Pari Mahal, Srinagar, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['pari mahal', 'parimahal', 'parimal', 'pari mehal'] },
  Yusmarg: { lat: 33.84, lon: 74.65, place: 'Yusmarg, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['yusmarg', 'yousmarg'] },
  'Betaab Valley': { lat: 34.0066, lon: 75.2910, place: 'Betaab Valley, Pahalgam, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['betaab valley', 'betab valley', 'betaab'] },
  'Dachigam National Park': { lat: 34.1420, lon: 75.0370, place: 'Dachigam National Park, Srinagar, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['dachigam', 'dachigam national park'] },
  Doodhpathri: { lat: 33.9050, lon: 74.6800, place: 'Doodhpathri, Budgam, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['doodhpathri', 'doodpathri', 'doodh pathri'] },
  'Wular Lake': { lat: 34.3680, lon: 74.5670, place: 'Wular Lake, Bandipora, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['wular', 'wular lake', 'wullar lake'] },
  'Manasbal Lake': { lat: 34.2550, lon: 74.6660, place: 'Manasbal Lake, Ganderbal, Jammu & Kashmir, India', source: 'open-meteo', aliases: ['manasbal', 'manasbal lake'] },
};

function normalizeQuery(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function findKnownCity(query) {
  const normalized = normalizeQuery(query);
  return Object.keys(WEATHER_CITIES).find((city) => {
    const entry = WEATHER_CITIES[city];
    const names = [city, ...(entry.aliases || [])];
    return names.some((name) => normalizeQuery(name) === normalized);
  });
}

const WEATHER_CODES = {
  0: { condition: 'Clear sky', icon: '☀️' },
  1: { condition: 'Mainly clear', icon: '🌤️' },
  2: { condition: 'Partly cloudy', icon: '⛅' },
  3: { condition: 'Overcast', icon: '☁️' },
  45: { condition: 'Fog', icon: '🌫️' },
  48: { condition: 'Depositing rime fog', icon: '🌫️' },
  51: { condition: 'Light drizzle', icon: '🌦️' },
  53: { condition: 'Moderate drizzle', icon: '🌦️' },
  55: { condition: 'Dense drizzle', icon: '🌧️' },
  61: { condition: 'Slight rain', icon: '🌧️' },
  63: { condition: 'Rain', icon: '🌧️' },
  65: { condition: 'Heavy rain', icon: '🌧️' },
  71: { condition: 'Slight snow', icon: '❄️' },
  73: { condition: 'Snow', icon: '❄️' },
  75: { condition: 'Heavy snow', icon: '❄️' },
  80: { condition: 'Rain showers', icon: '🌦️' },
  81: { condition: 'Rain showers', icon: '🌧️' },
  82: { condition: 'Violent rain showers', icon: '⛈️' },
  95: { condition: 'Thunderstorm', icon: '⛈️' },
  96: { condition: 'Thunderstorm with hail', icon: '⛈️' },
  99: { condition: 'Thunderstorm with hail', icon: '⛈️' },
};

function formatPlace(location) {
  return [
    location.name,
    location.admin1,
    location.country,
  ].filter(Boolean).join(', ');
}

function normalizeWeather(data, place) {
  const current = data.current || {};
  const daily = data.daily || {};
  const code = WEATHER_CODES[current.weather_code] || { condition: 'Current weather', icon: '🌤️' };

  return {
    temp: Math.round(current.temperature_2m ?? 0),
    condition: code.condition,
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    wind: Math.round(current.wind_speed_10m ?? 0),
    icon: code.icon,
    place,
    forecast: (daily.time || []).slice(0, 3).map((date, i) => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      max: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      min: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      rain: Math.round(daily.precipitation_sum?.[i] ?? 0),
    })),
  };
}

function normalizeWttrWeather(data) {
  const current = data.current_condition?.[0];
  const area = data.nearest_area?.[0];
  if (!current) throw new Error('Weather request failed');

  const description = current.weatherDesc?.[0]?.value || 'Current weather';
  const place = [
    area?.areaName?.[0]?.value,
    area?.region?.[0]?.value,
    area?.country?.[0]?.value,
  ].filter(Boolean).join(', ');

  return {
    temp: Math.round(Number(current.temp_C) || 0),
    condition: description,
    humidity: Math.round(Number(current.humidity) || 0),
    wind: Math.round(Number(current.windspeedKmph) || 0),
    icon: description.toLowerCase().includes('rain') ? '🌧️'
      : description.toLowerCase().includes('snow') ? '❄️'
      : description.toLowerCase().includes('cloud') ? '☁️'
      : description.toLowerCase().includes('clear') || description.toLowerCase().includes('sunny') ? '☀️'
      : '🌤️',
    place,
    forecast: (data.weather || []).slice(0, 3).map((day) => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      max: Math.round(Number(day.maxtempC) || 0),
      min: Math.round(Number(day.mintempC) || 0),
      rain: Math.round(Number(day.totalPrecipMM) || 0),
    })),
  };
}

async function fetchWttrWeather(query) {
  const res = await fetch(`https://wttr.in/${encodeURIComponent(query)}?format=j1`);
  if (!res.ok) throw new Error('Weather request failed');
  return normalizeWttrWeather(await res.json());
}

async function fetchWeatherByCoords({ lat, lon, place }) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_days: '7',
    timezone: 'auto',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('Weather request failed');
  return normalizeWeather(await res.json(), place);
}

export async function fetchCityWeather(city) {
  const coords = WEATHER_CITIES[city];
  if (!coords) return null;
  if (coords.source === 'open-meteo') return fetchWeatherByCoords(coords);

  try {
    return await fetchWttrWeather(city);
  } catch {
    return fetchWeatherByCoords(coords);
  }
}

export async function fetchWeatherByQuery(query) {
  if (!query?.trim()) return null;

  const normalizedQuery = normalizeQuery(query);
  const knownCity = findKnownCity(query);
  if (knownCity) return fetchCityWeather(knownCity);

  const geoParams = new URLSearchParams({
    name: normalizedQuery,
    count: '1',
    language: 'en',
    format: 'json',
  });

  const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${geoParams}`);
  if (!geoRes.ok) throw new Error('Location request failed');

  const geoData = await geoRes.json();
  const location = geoData.results?.[0];
  if (!location) throw new Error('Location not found');

  try {
    return await fetchWeatherByCoords({
      lat: location.latitude,
      lon: location.longitude,
      place: formatPlace(location),
    });
  } catch {
    return fetchWttrWeather(query.trim());
  }
}

export async function fetchAllWeather() {
  const entries = await Promise.all(
    Object.keys(WEATHER_CITIES).map(async (city) => {
      try {
        return [city, await fetchCityWeather(city)];
      } catch {
        return [city, null];
      }
    })
  );

  return Object.fromEntries(entries.filter(([, weather]) => weather));
}
