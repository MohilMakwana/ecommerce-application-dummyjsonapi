export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCardNumber(value) {
  const stripped = value.replace(/\s/g, '');
  return /^\d{16}$/.test(stripped);
}

export function validateExpiry(value) {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [month, year] = value.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const fullYear = 2000 + year;
  return fullYear > now.getFullYear() || (fullYear === now.getFullYear() && month >= now.getMonth() + 1);
}

export function validateCVV(value) {
  return /^\d{3,4}$/.test(value);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function validateZip(value) {
  return /^\d{5}(-\d{4})?$/.test(value);
}
