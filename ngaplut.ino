// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – ESP32 Firmware cho Trạm thật TR01 (Chạy trên Render)
// Cảm biến siêu âm HC-SR04 + Đèn LED cảnh báo + Kết nối WiFi & Render HTTPS
// ══════════════════════════════════════════════════════════════════════════

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <time.h>

// ── 0. CHẾ ĐỘ ĐÈN CẢNH BÁO ─────────────────────────────────────────────
// 0: Đèn đỏ bật khi H >= 15 cm, tắt khi H < 13 cm, giữ trong 13 - 15 cm (vùng trễ)
// 1: 4 đèn theo 10 / 20 / 35 cm không vùng trễ (phiên bản cũ)
#define CHE_DO_DEN_4_MUC 0

// ── 1. CẤU HÌNH WIFI & MÁY CHỦ RENDER ──────────────────────────────────
// Điền tên WiFi và mật khẩu nơi bạn cấp mạng cho ESP32 (ví dụ WiFi nhà, trường hoặc phát từ 4G điện thoại)
const char* WIFI_SSID     = "YOUR_WIFI_NAME";        // <-- Đổi thành tên WiFi của bạn
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";    // <-- Đổi thành mật khẩu WiFi

// Địa chỉ máy chủ Backend FloodSafe trên Render (chuẩn HTTPS)
const char* SERVER_URL    = "https://flood-ov2h.onrender.com/api/ban-ghi";

// Thông tin định danh trạm (Khớp chính xác với config.json trên server Render)
const char* MA_TRAM       = "TR01";
const char* API_KEY       = "tr01demokey_change_me_0123456789";

// Chu kỳ hẹn giờ đo và gửi dữ liệu (millis)
const unsigned long DO_INTERVAL        = 2000;   // Đo và cập nhật đèn mỗi 2 giây
const unsigned long SEND_INTERVAL      = 5000;   // Gửi dữ liệu lên máy chủ mỗi 5 giây
const unsigned long RECONNECT_INTERVAL = 10000;  // Thử kết nối lại WiFi chạy nền mỗi 10 giây
const int HTTP_TIMEOUT                 = 4000;   // Timeout kết nối HTTP 4.000 ms

unsigned long lastDoTime        = 0;
unsigned long lastSendTime      = 0;
unsigned long lastReconnectTime = 0;
bool trangThaiDenDo             = false;

// ── 2. KHAI BÁO CHÂN PHẦN CỨNG ─────────────────────────────────────────
// Chân cảm biến siêu âm HC-SR04
const int trigPin = 5;   
const int echoPin = 18;  // Qua mạch cầu phân áp (5V -> 3.3V)

// Chân 4 đèn LED cảnh báo: Đỏ -> Vàng -> Xanh dương -> Xanh lá
const int ledRed    = 23;  // Mức 4: Ngập sâu nghiêm trọng (>= 35cm) - Đỏ (hoặc đèn cảnh báo vùng trễ)
const int ledYellow = 22;  // Mức 3: Nguy hiểm (20 - 35cm) - Vàng
const int ledBlue   = 21;  // Mức 2: Cảnh báo (10 - 20cm) - Xanh dương
const int ledGreen  = 19;  // Mức 1: An toàn (< 10cm) - Xanh lá

// Hằng số khoảng cách gốc từ cảm biến đến mặt đất đã chốt (cm)
const float DISTANCE_TO_GROUND = 52.0;

// ── 3. HÀM ĐO MỰC NƯỚC (HC-SR04) ───────────────────────────────────────
// Đo 5 lần, nghỉ 200 ms giữa 2 lần đọc, chỉ nhận 0 < d <= DISTANCE_TO_GROUND + 2 cm
float doMucNuoc() {
  float sum = 0;
  int validCount = 0;
  
  for (int i = 0; i < 5; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000); // Timeout 30ms (~5m)
    if (duration > 0) {
      float dist = duration * 0.034 / 2.0;
      if (dist > 0 && dist <= (DISTANCE_TO_GROUND + 2.0)) {
        sum += dist;
        validCount++;
      }
    }
    if (i < 4) delay(200); // Nghỉ 200 ms giữa 2 lần đọc
  }
  
  if (validCount > 0) {
    float distanceToWater = sum / validCount;
    float waterLevel = DISTANCE_TO_GROUND - distanceToWater;
    if (waterLevel < 0) waterLevel = 0.0;
    return waterLevel;
  }
  return -1.0; // Báo lỗi không đo được
}

// ── 4. CẬP NHẬT ĐÈN CẢNH BÁO ───────────────────────────────────────────
void capNhatDen(float waterLevel) {
  if (waterLevel < 0) return;

#if CHE_DO_DEN_4_MUC
  // Khối 4 đèn cũ theo 10 / 20 / 35 cm không vùng trễ
  digitalWrite(ledRed, LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledBlue, LOW);
  digitalWrite(ledGreen, LOW);

  if (waterLevel >= 35.0) {
    digitalWrite(ledRed, HIGH);
  } else if (waterLevel >= 20.0) {
    digitalWrite(ledYellow, HIGH);
  } else if (waterLevel >= 10.0) {
    digitalWrite(ledBlue, HIGH);
  } else {
    digitalWrite(ledGreen, HIGH);
  }
#else
  // Chế độ CHE_DO_DEN_4_MUC = 0:
  // Đèn đỏ bật khi H >= 15 cm, tắt khi H < 13 cm, giữ trạng thái trong 13 - 15 cm
  if (waterLevel >= 15.0) {
    trangThaiDenDo = true;
  } else if (waterLevel < 13.0) {
    trangThaiDenDo = false;
  }

  digitalWrite(ledRed, trangThaiDenDo ? HIGH : LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledBlue, LOW);
  digitalWrite(ledGreen, LOW);
#endif
}

// ── 5. THỜI ĐIỂM ĐO (NTP UTC HOẶC MILLIS) ──────────────────────────────
String thoiDiemDo() {
  time_t now = time(nullptr);
  // Nếu đã đồng bộ NTP thành công (sau mốc 2020)
  if (now > 1577836800) {
    char buf[30];
    struct tm timeinfo;
    gmtime_r(&now, &timeinfo);
    strftime(buf, sizeof(buf), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
    return String(buf);
  }
  return String(millis());
}

// ── 6. HÀM KẾT NỐI WIFI ────────────────────────────────────────────────
void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.printf("\n[WiFi] Đang kết nối tới: %s ...\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // Lúc khởi động chờ kết nối tối đa <= 4 giây (10 lần * 400 ms)
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 10) {
    delay(400);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Đã kết nối thành công!");
    Serial.printf("[WiFi] Địa chỉ IP ESP32: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] Chưa thể kết nối WiFi (sẽ tự động kết nối nền trong loop).");
  }
}

// ── 7. HÀM GỬI DỮ LIỆU LÊN RENDER (HTTPS POST) ────────────────────────
void sendDataToServer(float waterLevel) {
  if (waterLevel < 0) {
    Serial.println("[Render HTTPS] Bỏ qua gửi: Không có dữ liệu đo hợp lệ");
    return;
  }

  // Mất WiFi thì bỏ lượt, không gọi chặn
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Render HTTPS] Bỏ qua lượt gửi: Chưa kết nối WiFi");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Bỏ qua kiểm tra chứng chỉ SSL root trên ESP32

  HTTPClient http;
  if (!http.begin(client, SERVER_URL)) {
    Serial.println("[Render HTTPS] Không thể khởi tạo kết nối tới server!");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", API_KEY);
  http.setTimeout(HTTP_TIMEOUT); // 4000 ms

  String payload = "{\"ma_tram\":\"" + String(MA_TRAM) + "\","
                 + "\"muc_nuoc\":" + String(waterLevel, 1) + ","
                 + "\"thoi_diem_do\":\"" + thoiDiemDo() + "\"}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[Render HTTPS] Gửi TR01 thành công: HTTP %d | Phản hồi: %s\n", httpCode, response.c_str());
  } else {
    Serial.printf("[Render HTTPS] Lỗi gửi: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

// ── 8. SETUP ───────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n══════════════════════════════════════════════════════");
  Serial.println("  FloodSafe Đà Nẵng – Khởi động Trạm Cảm Biến TR01  ");
  Serial.println("  Kết nối trực tiếp Render: flood-ov2h.onrender.com   ");
  Serial.println("══════════════════════════════════════════════════════");

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  pinMode(ledRed, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledBlue, OUTPUT);
  pinMode(ledGreen, OUTPUT);

  // Nhấp nháy test 4 đèn LED lúc khởi động mạch
  digitalWrite(ledRed, HIGH);
  digitalWrite(ledYellow, HIGH);
  digitalWrite(ledBlue, HIGH);
  digitalWrite(ledGreen, HIGH);
  delay(500);
  digitalWrite(ledRed, LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledBlue, LOW);
  digitalWrite(ledGreen, LOW);

  // Kết nối WiFi (chờ tối đa <= 4 giây)
  connectWiFi();

  // Đồng bộ giờ NTP UTC dạng 2026-11-17T08:00:00Z
  configTime(0, 0, "pool.ntp.org", "time.google.com");
}

// ── 9. LOOP CHÍNH ──────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // Tự động kết nối lại WiFi chạy nền mỗi 10 giây nếu mất kết nối
  if (WiFi.status() != WL_CONNECTED && (now - lastReconnectTime >= RECONNECT_INTERVAL)) {
    lastReconnectTime = now;
    WiFi.reconnect();
  }

  // Hẹn giờ 1: Gửi mỗi 5 giây (SEND_INTERVAL) và đo mới ngay trước khi gửi
  if (now - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = now;
    float waterLevel = doMucNuoc();
    capNhatDen(waterLevel);
    sendDataToServer(waterLevel);
    lastDoTime = millis();
    return;
  }

  // Hẹn giờ 2: Đo và cập nhật đèn mỗi 2 giây (DO_INTERVAL)
  if (now - lastDoTime >= DO_INTERVAL) {
    lastDoTime = now;
    float waterLevel = doMucNuoc();
    capNhatDen(waterLevel);
    if (waterLevel >= 0) {
      Serial.printf("[TR01] Mực nước: %.1f cm | Đèn đỏ: %s\n", waterLevel, trangThaiDenDo ? "BẬT" : "TẮT");
    } else {
      Serial.println("[TR01] Cảnh báo: Không nhận được tín hiệu từ HC-SR04!");
    }
  }

  delay(20);
}
