// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Application State Management
// ══════════════════════════════════════════════════════════════════════════

import { KEY_XE, DEFAULT_COORDS } from './constants.js';

export function docLuu() {
  try {
    return localStorage.getItem('loai_xe') || localStorage.getItem(KEY_XE) || null;
  } catch (e) {
    return null;
  }
}

export function ghiLuu(val) {
  try {
    localStorage.setItem('loai_xe', val);
    localStorage.setItem(KEY_XE, val);
  } catch (e) {
    console.warn('[state] Could not save vehicle to localStorage:', e);
  }
}

export const state = {
  // User preferences
  loaiXe: docLuu(), // FR-13: lưu loại xe trên thiết bị
  khuVuc: '',       // F03: lọc theo khu vực

  // Server data cache
  cauHinh: null,
  lanCuoi: null,
  activeStationId: null,

  // Map & markers
  map: null,
  markers: {},
  daFit: false,
  timer: null,

  // Smart route planner state
  route: {
    active: false,
    isPickingOrigin: false,
    isPickingDest: false,
    userPos: { lat: DEFAULT_COORDS[0], lng: DEFAULT_COORDS[1], name: 'Vị trí của bạn' },
    originPos: null,
    destPos: null,
    originMarker: null,
    destMarker: null,
    gpsAccuracyCircle: null,
    routePolylines: [],
    hazardCircles: [],
    hazardMarkers: [], // Chứa các icon trạm ngập hiển thị ở tâm khung tròn
    currentRoute: null
  }
};
