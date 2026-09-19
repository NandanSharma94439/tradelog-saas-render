export function getCurrencySymbol(currency = 'INR') {
  switch (currency.toUpperCase()) {
    case 'INR': return '₹';
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    default: return '₹';
  }
}

export function formatCurrency(amount, currency = 'INR', showPlusSign = true) {
  const symbol = getCurrencySymbol(currency);
  const absoluteVal = Math.abs(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2, minimumFractionDigits: 0,
  });
  if (amount > 0) return `${showPlusSign ? '+' : ''}${symbol}${absoluteVal}`;
  else if (amount < 0) return `-${symbol}${absoluteVal}`;
  return `${symbol}0`;
}

export function formatR(rMultiple) {
  if (rMultiple > 0) return `+${rMultiple.toFixed(2)}R`;
  else if (rMultiple < 0) return `${rMultiple.toFixed(2)}R`;
  return `0.00R`;
}

export function formatPercentage(val, showPlus = true) {
  if (val > 0) return `${showPlus ? '+' : ''}${val.toFixed(1)}%`;
  return `${val.toFixed(1)}%`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getEmotionBadgeStyle(emotion) {
  switch (emotion) {
    case 'Calm': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    case 'Confident': return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' };
    case 'Fearful': return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    case 'FOMO': return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
    case 'Angry': return { bg: 'bg-red-600/15', text: 'text-red-400', border: 'border-red-600/30' };
    case 'Excited': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' };
  }
}
