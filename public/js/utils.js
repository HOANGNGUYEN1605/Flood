// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Utility Functions & Geometry
// ══════════════════════════════════════════════════════════════════════════

export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

export function gio(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function tuoi(serverTime, iso) {
  const s = Math.max(0, Math.round((new Date(serverTime) - new Date(iso)) / 1000));
  if (s < 10) return 'Vừa xong';
  if (s < 60) return s + ' giây trước';
  if (s < 3600) return Math.floor(s / 60) + ' phút trước';
  return Math.floor(s / 3600) + ' giờ trước';
}

export function parseStationName(t) {
  const raw = t.ten_vi_tri || '';
  if (raw.indexOf('–') !== -1) {
    const parts = raw.split('–');
    return {
      title: parts[0].trim(),
      sub: parts[1] ? parts[1].trim() : (t.khu_vuc || '')
    };
  }
  return {
    title: raw || t.ma_tram,
    sub: t.khu_vuc || ''
  };
}

export function getShortLocationLabel(t) {
  if (t.khu_vuc) return t.khu_vuc.toUpperCase();
  const p = parseStationName(t);
  return p.title.replace(/^Trạm\s+/i, '').toUpperCase();
}

export function banner(hien, text) {
  const b = document.getElementById('banner');
  if (!b) return;
  if (!hien) {
    b.hidden = true;
    b.textContent = '';
  } else {
    b.hidden = false;
    b.textContent = text || '';
  }
}

// Distance in meters between 2 geographic points (Haversine formula)
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Shortest distance in meters from a point P to a line segment AB
export function distancePointToSegment(plat, plon, lat1, lon1, lat2, lon2) {
  const d12 = haversineDistance(lat1, lon1, lat2, lon2);
  if (d12 === 0) return haversineDistance(plat, plon, lat1, lon1);
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  let t = ((plon - lon1) * dx + (plat - lat1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  const projLat = lat1 + t * dy;
  const projLon = lon1 + t * dx;
  return haversineDistance(plat, plon, projLat, projLon);
}

export function formatDistance(meters) {
  if (meters < 1000) return Math.round(meters) + ' m';
  return (meters / 1000).toFixed(1) + ' km';
}

export function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return mins + ' phút';
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return hrs + 'h ' + (remMins > 0 ? remMins + 'p' : '');
}
