import { useEffect, useState } from "react";

/**
 * Lightweight localized weather snapshot (open-meteo, no API key needed).
 * @param {string} district — Bangladesh district name (e.g. "Dhaka", "Rajshahi")
 * @returns {{ weather: object|null, loading: boolean }}
 *   weather: { temp, windspeed, todayMax, todayMin, rainProb, location }
 */
export function useWeatherSnapshot(district) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const q = encodeURIComponent((district || "Dhaka") + ", Bangladesh");
        const geo = await (await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`)).json();
        const lat = geo[0]?.lat ?? 23.8103;
        const lon = geo[0]?.lon ?? 90.4125;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FDhaka`;
        const d = await (await fetch(url)).json();
        if (!cancelled && d.current_weather) {
          setWeather({
            temp: `${Math.round(d.current_weather.temperature)}°C`,
            windspeed: `${Math.round(d.current_weather.windspeed)} km/h`,
            todayMax: `${Math.round(d.daily.temperature_2m_max[0])}°C`,
            todayMin: `${Math.round(d.daily.temperature_2m_min[0])}°C`,
            rainProb: d.daily.precipitation_probability_max?.[0] ?? 0,
            location: geo[0]?.display_name?.split(",")[0] || district || "Dhaka",
          });
        }
      } catch (e) {
        /* fall back to empty state */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [district]);

  return { weather, loading };
}