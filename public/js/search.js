// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – Smart Place Autocomplete & Search (Google Maps Style)
// ══════════════════════════════════════════════════════════════════════════

import { esc } from './utils.js';

/**
 * Danh mục địa danh & đường phố phổ biến tại TP. Đà Nẵng (Local Cache - Phản hồi 0ms)
 */
export const DANANG_PLACES = [
  // ── Các tuyến đường chính Đà Nẵng ──
  { name: 'Đường Bình Kỳ', sub: 'Phường Hòa Quý, Quận Ngũ Hành Sơn, Đà Nẵng', lat: 16.0014, lng: 108.2384, icon: '📍' },
  { name: 'Đường Nguyễn Văn Linh', sub: 'Quận Hải Châu & Thanh Khê, Đà Nẵng', lat: 16.0615, lng: 108.2170, icon: '📍' },
  { name: 'Đường Hàm Nghi', sub: 'Phường Thạc Gián, Quận Thanh Khê, Đà Nẵng', lat: 16.0655, lng: 108.2085, icon: '📍' },
  { name: 'Đường Hùng Vương', sub: 'Quận Hải Châu & Thanh Khê, Đà Nẵng', lat: 16.0688, lng: 108.2160, icon: '📍' },
  { name: 'Đường Lê Duẩn', sub: 'Quận Hải Châu & Thanh Khê, Đà Nẵng', lat: 16.0725, lng: 108.2175, icon: '📍' },
  { name: 'Đường Bạch Đằng', sub: 'Ven sông Hàn, Quận Hải Châu, Đà Nẵng', lat: 16.0680, lng: 108.2235, icon: '📍' },
  { name: 'Đường Trần Phú', sub: 'Quận Hải Châu, Đà Nẵng', lat: 16.0685, lng: 108.2220, icon: '📍' },
  { name: 'Đường 2 Tháng 9', sub: 'Quận Hải Châu, Đà Nẵng', lat: 16.0510, lng: 108.2220, icon: '📍' },
  { name: 'Đường Trưng Nữ Vương', sub: 'Quận Hải Châu, Đà Nẵng', lat: 16.0535, lng: 108.2215, icon: '📍' },
  { name: 'Đường Hoàng Diệu', sub: 'Quận Hải Châu, Đà Nẵng', lat: 16.0600, lng: 108.2185, icon: '📍' },
  { name: 'Đường Điện Biên Phủ', sub: 'Quận Thanh Khê, Đà Nẵng', lat: 16.0665, lng: 108.1950, icon: '📍' },
  { name: 'Đường Tôn Đức Thắng', sub: 'Quận Cẩm Lệ & Liên Chiểu, Đà Nẵng', lat: 16.0635, lng: 108.1720, icon: '📍' },
  { name: 'Đường Mẹ Suốt', sub: 'Phường Hòa Khánh Nam, Quận Liên Chiểu, Đà Nẵng', lat: 16.0592, lng: 108.1585, icon: '📍' },
  { name: 'Đường Nguyễn Tất Thành', sub: 'Tuyến đường ven vịnh Đà Nẵng', lat: 16.0750, lng: 108.1880, icon: '📍' },
  { name: 'Đường Võ Nguyên Giáp', sub: 'Tuyến đường ven biển Mỹ Khê', lat: 16.0550, lng: 108.2470, icon: '📍' },
  { name: 'Đường Hoàng Sa', sub: 'Đường ven biển Bán đảo Sơn Trà', lat: 16.0980, lng: 108.2580, icon: '📍' },
  { name: 'Đường Trường Sa', sub: 'Đường ven biển Ngũ Hành Sơn đi Hội An', lat: 16.0150, lng: 108.2650, icon: '📍' },
  { name: 'Đường Võ Văn Kiệt', sub: 'Nối Cầu Rồng ra Biển Mỹ Khê, Quận Sơn Trà', lat: 16.0620, lng: 108.2350, icon: '📍' },
  { name: 'Đường Phạm Văn Đồng', sub: 'Nối Cầu Sông Hàn ra Biển, Quận Sơn Trà', lat: 16.0710, lng: 108.2380, icon: '📍' },
  { name: 'Đường Cách Mạng Tháng 8', sub: 'Quận Cẩm Lệ, Đà Nẵng', lat: 16.0320, lng: 108.2090, icon: '📍' },
  { name: 'Đường Nguyễn Hữu Thọ', sub: 'Quận Hải Châu & Cẩm Lệ, Đà Nẵng', lat: 16.0430, lng: 108.2120, icon: '📍' },
  { name: 'Đường Xô Viết Nghệ Tĩnh', sub: 'Quận Hải Châu & Cẩm Lệ, Đà Nẵng', lat: 16.0360, lng: 108.2180, icon: '📍' },
  { name: 'Đường Duy Tân', sub: 'Quận Hải Châu, Đà Nẵng (gần sân bay)', lat: 16.0515, lng: 108.2150, icon: '📍' },
  { name: 'Đường Nguyễn Tri Phương', sub: 'Quận Thanh Khê, Đà Nẵng', lat: 16.0550, lng: 108.2060, icon: '📍' },
  { name: 'Đường Phan Châu Trinh', sub: 'Quận Hải Châu, Đà Nẵng', lat: 16.0640, lng: 108.2205, icon: '📍' },
  { name: 'Đường Lý Thái Tổ', sub: 'Quận Thanh Khê, Đà Nẵng', lat: 16.0670, lng: 108.2080, icon: '📍' },
  { name: 'Đường Hà Huy Tập', sub: 'Quận Thanh Khê, Đà Nẵng', lat: 16.0630, lng: 108.1870, icon: '📍' },
  { name: 'Đường Ngô Quyền', sub: 'Quận Sơn Trà, Đà Nẵng', lat: 16.0750, lng: 108.2320, icon: '📍' },
  { name: 'Đường Ngũ Hành Sơn', sub: 'Quận Ngũ Hành Sơn, Đà Nẵng', lat: 16.0480, lng: 108.2410, icon: '📍' },
  { name: 'Đường Lê Văn Hiến', sub: 'Quận Ngũ Hành Sơn, Đà Nẵng', lat: 16.0220, lng: 108.2520, icon: '📍' },
  { name: 'Đường Nam Kỳ Khởi Nghĩa', sub: 'Quận Ngũ Hành Sơn, Đà Nẵng', lat: 15.9860, lng: 108.2550, icon: '📍' },
  { name: 'Đường Trường Chinh', sub: 'Quận Thanh Khê & Cẩm Lệ, Đà Nẵng', lat: 16.0520, lng: 108.1810, icon: '📍' },
  { name: 'Đường Nguyễn Lương Bằng', sub: 'Quận Liên Chiểu, Đà Nẵng', lat: 16.0820, lng: 108.1450, icon: '📍' },
  { name: 'Đường Như Nguyệt', sub: 'Chân cầu Thuận Phước, Quận Hải Châu', lat: 16.0885, lng: 108.2215, icon: '📍' },
  { name: 'Đường Mai Đăng Chơn', sub: 'Phường Hòa Quý, Quận Ngũ Hành Sơn', lat: 15.9880, lng: 108.2420, icon: '📍' },

  // ── Địa danh & Điểm đến nổi tiếng ──
  { name: 'Bãi biển Mỹ Khê', sub: 'Đường Võ Nguyên Giáp, Phước Mỹ, Sơn Trà', lat: 16.0601, lng: 108.2464, icon: '🏖️' },
  { name: 'Bãi biển Non Nước', sub: 'Phường Hòa Hải, Quận Ngũ Hành Sơn', lat: 16.0125, lng: 108.2675, icon: '🏖️' },
  { name: 'Sân bay Quốc tế Đà Nẵng', sub: 'Đường Duy Tân, Hòa Thuận Tây, Hải Châu', lat: 16.0543, lng: 108.2022, icon: '✈️' },
  { name: 'Cầu Rồng Đà Nẵng', sub: 'Bắc qua sông Hàn nối Hải Châu & Sơn Trà', lat: 16.0611, lng: 108.2272, icon: '🐉' },
  { name: 'Cầu Sông Hàn', sub: 'Cầu quay Sông Hàn, Đà Nẵng', lat: 16.0722, lng: 108.2268, icon: '🌉' },
  { name: 'Cầu Trần Thị Lý', sub: 'Bắc qua sông Hàn, Đà Nẵng', lat: 16.0505, lng: 108.2275, icon: '🌉' },
  { name: 'Cầu Thuận Phước', sub: 'Cầu dây võng cửa biển sông Hàn', lat: 16.0950, lng: 108.2240, icon: '🌉' },
  { name: 'Bến xe Trung tâm Đà Nẵng', sub: 'Đường Tôn Đức Thắng, Hòa Minh, Liên Chiểu', lat: 16.0587, lng: 108.1738, icon: '🚌' },
  { name: 'Ga Đà Nẵng', sub: '202 Hải Phòng, Tam Thuận, Thanh Khê', lat: 16.0715, lng: 108.2125, icon: '🚆' },
  { name: 'Chợ Cồn', sub: 'Ngã tư Hùng Vương – Ông Ích Khiêm, Hải Châu', lat: 16.0694, lng: 108.2163, icon: '🛒' },
  { name: 'Chợ Hàn', sub: '119 Trần Phú, Hải Châu 1, Hải Châu', lat: 16.0682, lng: 108.2238, icon: '🛒' },
  { name: 'Bán đảo Sơn Trà / Chùa Linh Ứng', sub: 'Bán đảo Sơn Trà, Thọ Quang, Sơn Trà', lat: 16.1030, lng: 108.2750, icon: '⛰️' },
  { name: 'Danh thắng Ngũ Hành Sơn', sub: '81 Huyền Trân Công Chúa, Hòa Hải, Ngũ Hành Sơn', lat: 16.0035, lng: 108.2625, icon: '⛰️' },
  { name: 'Trường Đại học Bách Khoa Đà Nẵng', sub: '54 Nguyễn Lương Bằng, Hòa Khánh Bắc, Liên Chiểu', lat: 16.0748, lng: 108.1534, icon: '🎓' },
  { name: 'Trường Đại học Kinh tế Đà Nẵng', sub: '71 Ngũ Hành Sơn, Bắc Mỹ An, Ngũ Hành Sơn', lat: 16.0515, lng: 108.2385, icon: '🎓' },
  { name: 'Trường Đại học Sư phạm Đà Nẵng', sub: '459 Tôn Đức Thắng, Hòa Khánh Nam, Liên Chiểu', lat: 16.0600, lng: 108.1620, icon: '🎓' },
  { name: 'Bệnh viện Đa khoa Đà Nẵng', sub: '124 Hải Phòng, Thạch Thang, Hải Châu', lat: 16.0735, lng: 108.2165, icon: '🏥' },
  { name: 'Bệnh viện Phụ sản - Nhi Đà Nẵng', sub: '402 Lê Văn Hiến, Khuê Mỹ, Ngũ Hành Sơn', lat: 16.0270, lng: 108.2480, icon: '🏥' },
  { name: 'Công viên 29 Tháng 3', sub: 'Đường Điện Biên Phủ & Nguyễn Tri Phương', lat: 16.0630, lng: 108.2045, icon: '🌳' },
  { name: 'Cung Thể thao Tiên Sơn', sub: 'Phan Đăng Lưu, Hòa Cường Bắc, Hải Châu', lat: 16.0350, lng: 108.2270, icon: '🏟️' },
  { name: 'Trung tâm Hành chính TP. Đà Nẵng', sub: '24 Trần Phú, Thạch Thang, Hải Châu', lat: 16.0770, lng: 108.2230, icon: '🏛️' },
  { name: 'Vincom Plaza Đà Nẵng', sub: '910A Ngô Quyền, An Hải Bắc, Sơn Trà', lat: 16.0725, lng: 108.2315, icon: '🏬' }
];

/**
 * Hàm loại bỏ dấu tiếng Việt để tìm kiếm không dấu
 */
export function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.trim();
}

/**
 * Tìm kiếm nhanh trong danh mục địa phương (Local Filter - 0ms)
 */
export function searchLocalPlaces(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = removeVietnameseTones(query);
  const words = cleanQ.split(/\s+/).filter(Boolean);

  return DANANG_PLACES.filter(place => {
    const cleanName = removeVietnameseTones(place.name);
    const cleanSub = removeVietnameseTones(place.sub);
    const target = cleanName + ' ' + cleanSub;
    return words.every(w => target.includes(w));
  }).slice(0, 5);
}

/**
 * Gọi Geocoding API trực tuyến (Photon Komoot & Nominatim OpenStreetMap)
 */
export async function searchOnlinePlaces(query) {
  if (!query || query.trim().length < 2) return [];
  const results = [];

  // 1. Thử qua Photon API (ưu tiên vùng tọa độ Đà Nẵng)
  try {
    const qStr = encodeURIComponent(query.trim() + ' Đà Nẵng');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://photon.komoot.io/api/?q=${qStr}&lat=16.0678&lon=108.2208&limit=6`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.features) {
        data.features.forEach(f => {
          const p = f.properties;
          const coords = f.geometry.coordinates; // [lng, lat]
          // Lọc các kết quả trong phạm vi Đà Nẵng / lân cận (kinh độ 107.8 - 108.6, vĩ độ 15.8 - 16.3)
          if (coords && coords[0] >= 107.8 && coords[0] <= 108.6 && coords[1] >= 15.7 && coords[1] <= 16.4) {
            const name = p.name || p.street || query;
            const subParts = [p.street, p.district, p.city || 'Đà Nẵng'].filter(Boolean);
            const sub = subParts.join(', ');

            results.push({
              name: name,
              sub: sub || 'Thành phố Đà Nẵng',
              lat: coords[1],
              lng: coords[0],
              icon: '📍'
            });
          }
        });
      }
    }
  } catch (e) {
    // Timeout hoặc mạng chậm, chuyển sang fallback
  }

  // 2. Fallback Nominatim nếu Photon không có kết quả
  if (results.length === 0) {
    try {
      const qStr = encodeURIComponent(query.trim() + ', Đà Nẵng');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${qStr}&format=json&limit=5&countrycodes=vn`, {
        headers: { 'Accept-Language': 'vi' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          data.forEach(item => {
            const parts = (item.display_name || '').split(',');
            const name = parts[0] ? parts[0].trim() : query;
            const sub = parts.slice(1, 4).map(s => s.trim()).join(', ');

            results.push({
              name: name,
              sub: sub || 'Đà Nẵng, Việt Nam',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              icon: '📍'
            });
          });
        }
      }
    } catch (e) {
      // Bỏ qua lỗi fallback
    }
  }

  return results;
}

/**
 * Gộp kết quả tìm kiếm Local và Online, loại bỏ trùng lặp
 */
export function mergeSearchResults(localList, onlineList) {
  const merged = [...localList];
  onlineList.forEach(onlineItem => {
    // Tránh trùng với địa điểm đã có trong Local
    const isDuplicate = merged.some(m => {
      const dLat = Math.abs(m.lat - onlineItem.lat);
      const dLng = Math.abs(m.lng - onlineItem.lng);
      return dLat < 0.003 && dLng < 0.003;
    });

    if (!isDuplicate) {
      merged.push(onlineItem);
    }
  });

  return merged.slice(0, 6);
}

/**
 * Thiết lập AutoComplete gắn với một ô Input (như Google Maps)
 * @param {HTMLInputElement} inputEl Ô input text
 * @param {HTMLElement} dropdownEl Khung chứa danh sách gợi ý
 * @param {Function} onSelect Callback khi người dùng chọn một địa điểm: ({ name, lat, lng }) => void
 */
export function setupPlaceAutocomplete(inputEl, dropdownEl, onSelect) {
  if (!inputEl || !dropdownEl) return;

  let debounceTimer = null;
  let currentSelectedIndex = -1;
  let currentResults = [];

  // Đóng dropdown khi click ra ngoài
  document.addEventListener('click', e => {
    if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.style.display = 'none';
      currentSelectedIndex = -1;
    }
  });

  // Render danh sách kết quả vào dropdown
  function renderDropdown(items, isLoading = false) {
    currentResults = items;
    currentSelectedIndex = -1;

    if (items.length === 0 && !isLoading) {
      dropdownEl.innerHTML = '<div class="suggestion-empty">Không tìm thấy địa điểm nào phù hợp tại Đà Nẵng</div>';
      dropdownEl.style.display = 'block';
      return;
    }

    let html = '';
    items.forEach((item, idx) => {
      html += `
        <div class="suggestion-item" data-index="${idx}">
          <div class="suggestion-icon">${item.icon || '📍'}</div>
          <div class="suggestion-content">
            <div class="suggestion-title">${esc(item.name)}</div>
            <div class="suggestion-subtitle">${esc(item.sub)}</div>
          </div>
        </div>
      `;
    });

    if (isLoading) {
      html += '<div class="suggestion-loading"><div class="route-spinner" style="width:14px;height:14px"></div> Đang tìm kiếm thêm...</div>';
    }

    dropdownEl.innerHTML = html;
    dropdownEl.style.display = 'block';

    // Gắn sự kiện click cho từng mục
    Array.from(dropdownEl.querySelectorAll('.suggestion-item')).forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const idx = parseInt(itemEl.getAttribute('data-index'), 10);
        const selected = currentResults[idx];
        if (selected) {
          applySelection(selected);
        }
      });
    });
  }

  function applySelection(place) {
    inputEl.value = place.name;
    dropdownEl.style.display = 'none';
    currentSelectedIndex = -1;
    if (typeof onSelect === 'function') {
      onSelect(place);
    }
  }

  // Sự kiện gõ phím vào ô input
  inputEl.addEventListener('input', () => {
    const query = inputEl.value.trim();
    if (query.length < 2) {
      dropdownEl.style.display = 'none';
      return;
    }

    // 1. Tìm ngay trong Local Cache (phản hồi 0ms tức thì)
    const localMatches = searchLocalPlaces(query);
    if (localMatches.length > 0) {
      renderDropdown(localMatches, true);
    } else {
      dropdownEl.innerHTML = '<div class="suggestion-loading"><div class="route-spinner" style="width:14px;height:14px"></div> Đang tìm kiếm địa điểm...</div>';
      dropdownEl.style.display = 'block';
    }

    // 2. Debounce 280ms gọi Online Geocoding
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const onlineMatches = await searchOnlinePlaces(query);
      const finalResults = mergeSearchResults(localMatches, onlineMatches);
      renderDropdown(finalResults, false);
    }, 280);
  });

  // Hỗ trợ điều hướng bằng bàn phím (Mũi tên Up, Down, Enter, Escape)
  inputEl.addEventListener('keydown', e => {
    const items = dropdownEl.querySelectorAll('.suggestion-item');
    if (!items.length || dropdownEl.style.display === 'none') {
      if (e.key === 'Enter') {
        // Nếu nhấn Enter mà không mở dropdown, thử tìm kiếm ngay
        const query = inputEl.value.trim();
        if (query.length >= 2) {
          const localMatches = searchLocalPlaces(query);
          if (localMatches.length > 0) {
            applySelection(localMatches[0]);
          } else {
            searchOnlinePlaces(query).then(online => {
              if (online.length > 0) applySelection(online[0]);
            });
          }
        }
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentSelectedIndex = (currentSelectedIndex + 1) % items.length;
      updateHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentSelectedIndex = (currentSelectedIndex - 1 + items.length) % items.length;
      updateHighlight(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentSelectedIndex >= 0 && currentSelectedIndex < currentResults.length) {
        applySelection(currentResults[currentSelectedIndex]);
      } else if (currentResults.length > 0) {
        applySelection(currentResults[0]);
      }
    } else if (e.key === 'Escape') {
      dropdownEl.style.display = 'none';
      currentSelectedIndex = -1;
    }
  });

  function updateHighlight(items) {
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === currentSelectedIndex);
      if (i === currentSelectedIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  // Khi click vào ô input nếu có chữ thì mở lại dropdown
  inputEl.addEventListener('focus', () => {
    const query = inputEl.value.trim();
    if (query.length >= 2 && currentResults.length > 0) {
      dropdownEl.style.display = 'block';
    }
  });
}
