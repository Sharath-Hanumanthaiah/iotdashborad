import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

export function formatLargeNumber(num) {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString();
}

export function formatPercentage(num) {
  if (num === null || num === undefined) return '—';
  return num.toFixed(1) + '%';
}

export function formatTimestamp(isoString) {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'HH:mm:ss');
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    return format(parseISO(isoString), 'MMM dd, HH:mm:ss');
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return isoString;
  }
}

export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
}

export function truncateId(id, length = 8) {
  if (!id) return '—';
  return id.length > length ? id.substring(0, length) + '…' : id;
}

export function formatJsonSyntax(obj) {
  const json = JSON.stringify(obj, null, 2);
  return json
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
    .replace(/: (null)/g, ': <span class="json-null">$1</span>');
}
