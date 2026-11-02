// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Constants & Configuration
// ══════════════════════════════════════════════════════════════════════════

export const KEY_XE = 'flood_loai_xe';
export const DEFAULT_COORDS = [16.0678, 108.2208]; // Đà Nẵng center

export const MAU = {
  'Bình thường': '#16a34a',
  'Cảnh báo': '#eab308',
  'Nguy hiểm': '#ea580c',
  'Khẩn cấp': '#dc2626',
  'Mất kết nối – dữ liệu cũ': '#94a3b8',
};

export const LOP = {
  'Bình thường': 'binhthuong',
  'Cảnh báo': 'canhbao',
  'Nguy hiểm': 'nguyhiem',
  'Khẩn cấp': 'khancap',
  'Mất kết nối – dữ liệu cũ': 'matketnoi',
};

export const ICON_MARKER = {
  'binhthuong': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/><path d="M2 21c3-1.5 6 1.5 9 0s6-1.5 9 0" stroke-width="1.8" opacity="0.85"/></svg>',
  'canhbao': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L2 19h20L12 3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  'nguyhiem': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/><path d="M4 19c2-1 4 1 6 0s4-1 6 0 4 1 4 0" stroke-width="1.8"/></svg>',
  'khancap': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/><path d="M4 19c2.5-1 5 1 7.5 0s5-1 7.5 0" stroke-width="1.8"/></svg>',
  'matketnoi': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/></svg>',
  'chuachon': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
};

export const BADGE_ICON = {
  'binhthuong': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
  'canhbao': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
  'nguyhiem': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  'khancap': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  'matketnoi': '⚠',
  'chuachon': '?',
};

export const VEHICLE_ICON = {
  'XM': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/></svg>',
  'OT_THAP': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="8" width="22" height="8" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>',
  'OT_CAO': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="6" width="20" height="10" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M2 12h20"/></svg>',
};

export const ONBOARD_ICON = {
  'XM': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/></svg>',
  'OT_THAP': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="8" width="22" height="8" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>',
  'OT_CAO': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="10" rx="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M2 12h20"/></svg>',
};

export const ONBOARD_DESC = {
  'XM': 'Nhạy cảm nhất với nước ngập và dòng chảy.',
  'OT_THAP': 'Phù hợp sedan và hatchback phổ biến.',
  'OT_CAO': 'Dành cho SUV và bán tải có gầm cao.',
};

export const ALERT_MSG = {
  'Bình thường': 'Có thể lưu thông, vẫn chú ý quan sát.',
  'Cảnh báo': 'Đi chậm, cân nhắc chọn tuyến khác.',
  'Nguy hiểm': 'Không nên đi qua đoạn đường ngập.',
  'Khẩn cấp': 'Tuyệt đối không đi qua, hãy quay đầu.',
  'Mất kết nối – dữ liệu cũ': 'Chưa nhận được dữ liệu mới từ trạm.',
};

export const MUC_SORT = {
  'Khẩn cấp': 0,
  'Nguy hiểm': 1,
  'Cảnh báo': 2,
  'Bình thường': 3,
  'Mất kết nối – dữ liệu cũ': 4,
};

export const SOVEREIGNTY_POINTS = [
  {
    name: 'Quần đảo Hoàng Sa',
    sub: 'VIỆT NAM',
    lat: 16.5,
    lng: 112.0
  },
  {
    name: 'Quần đảo Trường Sa',
    sub: 'VIỆT NAM',
    lat: 10.0,
    lng: 114.0
  },
  {
    name: 'Biển Đông',
    sub: 'VIỆT NAM',
    lat: 14.5,
    lng: 113.2
  }
];
