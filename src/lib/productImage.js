/** Paths under public/products (and public/assets/dummy-data). */
export function productImageUrl(url) {
  if (!url) return '';
  let normalized = url.replace(/\\/g, '/').trim();

  // If path starts with /src/assets/ or src/assets/
  if (normalized.startsWith('/src/assets/')) {
    normalized = normalized.replace('/src/assets/', '/assets/');
  } else if (normalized.startsWith('src/assets/')) {
    normalized = normalized.replace('src/assets/', '/assets/');
  }

  // Handle relative ../assets/ or ./assets/
  if (normalized.startsWith('../assets/')) {
    normalized = normalized.replace('../assets/', '/assets/');
  } else if (normalized.startsWith('./assets/')) {
    normalized = normalized.replace('./assets/', '/assets/');
  }

  // Handle public/products
  if (normalized.includes('public/products')) {
    const idx = normalized.indexOf('/products/');
    if (idx !== -1) return normalized.slice(idx);
  }

  // If it contains dummy-data/ but wasn't prefixed with /assets/
  if (normalized.includes('dummy-data/') && !normalized.startsWith('/assets/')) {
    const idx = normalized.indexOf('dummy-data/');
    return `/assets/${normalized.slice(idx)}`;
  }

  if (normalized.startsWith('/') && !normalized.startsWith('//')) {
    return normalized;
  }

  return normalized;
}

