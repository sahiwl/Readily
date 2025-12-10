export function dollarsToRupees(amount, rate = 83) {
  // strings like "$12.34"
  if (typeof amount === 'string') {
    // Remove currency symbols and commas
    const cleaned = amount.replace(/[^0-9.]/g, '');
    amount = parseFloat(cleaned);
  }
  const numeric = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return Math.round(numeric * rate);
}

export function formatRupees(amount) {
  return typeof amount === 'number'
    ? amount.toLocaleString('en-IN')
    : '—';
}

