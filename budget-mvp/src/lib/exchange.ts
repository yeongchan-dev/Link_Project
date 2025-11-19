import type { ExchangeRate } from '../types';

export async function getRateForDate(date: string): Promise<number> {
  // Check for manual override first
  const overrideKey = `rate-override-${date}`;
  const manualRate = localStorage.getItem(overrideKey);
  if (manualRate) {
    return parseFloat(manualRate);
  }

  // Check cache
  const cacheKey = `rate-${date}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return parseFloat(cached);
  }

  // Fetch from API
  try {
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=USD&symbols=KRW`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rate');
    }

    const data = await response.json();
    const rate = data.rates?.KRW;

    if (!rate || typeof rate !== 'number') {
      throw new Error('Invalid exchange rate data');
    }

    // Cache the rate
    localStorage.setItem(cacheKey, rate.toString());
    return rate;

  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);

    // Fallback to a reasonable default rate if API fails
    const fallbackRate = 1300; // Approximate USD to KRW rate

    // Prompt user for manual override
    const userRate = prompt(
      `Failed to fetch exchange rate. Current fallback: ${fallbackRate} KRW per USD.\n` +
      `Enter a manual rate for ${date} (or press Cancel to use fallback):`
    );

    if (userRate && !isNaN(parseFloat(userRate))) {
      const rate = parseFloat(userRate);
      localStorage.setItem(overrideKey, rate.toString());
      return rate;
    }

    return fallbackRate;
  }
}

export function setManualRate(date: string, rate: number): void {
  const overrideKey = `rate-override-${date}`;
  localStorage.setItem(overrideKey, rate.toString());
}

export function getStoredRates(): ExchangeRate[] {
  const rates: ExchangeRate[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    if (key.startsWith('rate-override-')) {
      const date = key.replace('rate-override-', '');
      const rate = localStorage.getItem(key);
      if (rate) {
        rates.push({
          date,
          rate: parseFloat(rate),
          isManual: true
        });
      }
    } else if (key.startsWith('rate-')) {
      const date = key.replace('rate-', '');
      const rate = localStorage.getItem(key);
      if (rate) {
        rates.push({
          date,
          rate: parseFloat(rate),
          isManual: false
        });
      }
    }
  }

  return rates;
}