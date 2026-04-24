export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getOriginalPrice(price, discountPercentage) {
  return price / (1 - discountPercentage / 100);
}

export function formatRating(rating) {
  return Math.round(rating * 10) / 10;
}

export function truncateText(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function getDiscountedPrice(original, discount) {
  return original - (original * discount) / 100;
}

export function generateOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}
