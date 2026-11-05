// ══════════════════════════════════════════════════════════════════════════
// FloodSafe Đà Nẵng – ESP32 Firmware cho Trạm thật TR01
// Cảm biến siêu âm HC-SR04 + 4 Đèn LED cảnh báo + Kết nối WiFi & HTTP API
// ══════════════════════════════════════════════════════════════════════════

#include <WiFi.h>
#include <HTTPClient.h>

// ── 1. CẤU HÌNH WIFI & SERVER ──────────────────────────────────────────
// Điền tên WiFi và mật khẩu nơi đặt mạch ESP32
const char* WIFI_SSID     = "YOUR_WIFI_NAME";        // Đổi thành tên WiFi của bạn
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";    // Đổi thành mật khẩu WiFi

// Địa chỉ máy chủ Backend FloodSafe
// • Khi chạy test trên máy tính cùng mạng WiFi: "http://192.168.1.xxx:3000/api/ban-ghi"
// • Khi chạy server Render online: "https://flood-ov2h.onrender.com/api/ban-ghi"
const char* SERVER_URL    = "https://flood-ov2h.onrender.com/api/ban-ghi";

// Thông tin định danh trạm (Khớp với config.json trên server)
const char* MA_TRAM       = "TR01";
const char* API_KEY       = "tr01demokey_change_me_0123456789";

// Chu kỳ gửi dữ liệu lên server (mỗi 3000 ms = 3 giây)
const unsigned long SEND_INTERVAL = 3000;
unsigned long lastSendTime = 0;

// ── 2. KHAI BÁO CHÂN PHẦN CỨNG ─────────────────────────────────────────
// Chân cảm biến siêu âm HC-SR04
const int trigPin = 5;   
const int echoPin = 18;  // Qua mạch cầu phân áp (5V -> 3.3V)

// Chân 4 đèn LED cảnh báo: Đỏ -> Vàng -> Xanh dương -> Xanh lá
const int ledRed    = 23;  // Mức 4: Ngập sâu nghiêm trọng (>= 35cm) - Đỏ
const int ledYellow = 22;  // Mức 3: Nguy hiểm (20 - 35cm) - Vàng
const int ledBlue   = 21;  // Mức 2: Cảnh báo (10 - 20cm) - Xanh dương
const int ledGreen  = 19;  // Mức 1: An toàn (< 10cm) - Xanh lá

// Hằng số khoảng cách gốc từ cảm biến đến đáy/mặt đất đã chốt (cm)
const float DISTANCE_TO_GROUND = 52.0;

// ── 3. HÀM KẾT NỐI WIFI ────────────────────────────────────────────────
void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.printf("\n[WiFi] Đang kết nối tới: %s ...\n", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Đã kết nối thành công!");
    Serial.printf("[WiFi] Địa chỉ IP ESP32: %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n[WiFi] Chưa thể kết nối WiFi (sẽ tự động thử lại sau).");
  }
}

// ── 4. HÀM GỬI DỮ LIỆU LÊN SERVER (HTTP POST) ─────────────────────────
void sendDataToServer(float waterLevel) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] Bỏ qua gửi: Chưa có kết nối WiFi.");
    connectWiFi();
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", API_KEY);
  http.setTimeout(4000); // Timeout 4s

  // Tạo payload JSON gửi lên server
  // Định dạng: {"ma_tram":"TR01","muc_nuoc":15.4,"thoi_diem_do":"2026-11-05T03:20:00Z"}
  String payload = "{\"ma_tram\":\"" + String(MA_TRAM) + "\","
                 + "\"muc_nuoc\":" + String(waterLevel, 1) + ","
                 + "\"thoi_diem_do\":\"" + String(millis()) + "\"}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[HTTP] Gửi TR01 -> Server: HTTP %d | Phản hồi: %s\n", httpCode, response.c_str());
  } else {
    Serial.printf("[HTTP] Lỗi kết nối server: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

// ── 5. SETUP ───────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n══════════════════════════════════════════════════════");
  Serial.println("  FloodSafe Đà Nẵng – Khởi động Trạm Cảm Biến TR01  ");
  Serial.println("══════════════════════════════════════════════════════");

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  pinMode(ledRed, OUTPUT);
  pinMode(ledYellow, OUTPUT);
  pinMode(ledBlue, OUTPUT);
  pinMode(ledGreen, OUTPUT);

  // Nhấp nháy test đèn LED lúc khởi động
  digitalWrite(ledRed, HIGH);
  digitalWrite(ledYellow, HIGH);
  digitalWrite(ledBlue, HIGH);
  digitalWrite(ledGreen, HIGH);
  delay(500);
  digitalWrite(ledRed, LOW);
  digitalWrite(ledYellow, LOW);
  digitalWrite(ledBlue, LOW);
  digitalWrite(ledGreen, LOW);

  // Kết nối WiFi
  connectWiFi();
}

// ── 6. LOOP CHÍNH ──────────────────────────────────────────────────────
void loop() {
  float sum = 0;
  int validCount = 0;
  
  // Đo liên tục 5 lần để lọc nhiễu sóng siêu âm
  for (int i = 0; i < 5; i++) {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH, 30000); // Timeout 30ms (~5m)
    if (duration > 0) {
      float dist = duration * 0.034 / 2.0;
      sum += dist;
      validCount++;
    }
    delay(30);
  }
  
  if (validCount > 0) {
    float distanceToWater = sum / validCount;
    float waterLevel = DISTANCE_TO_GROUND - distanceToWater;
    if (waterLevel < 0) waterLevel = 0.0;

    // Tắt toàn bộ đèn trước khi bật đèn mức tương ứng
    digitalWrite(ledRed, LOW);
    digitalWrite(ledYellow, LOW);
    digitalWrite(ledBlue, LOW);
    digitalWrite(ledGreen, LOW);

    int alertLevel = 1;
    String statusStr = "SAFE";

    // Phân định mức nước và bật đèn tương ứng
    if (waterLevel >= 35.0) {
      alertLevel = 4;
      statusStr = "DANGER_HIGH";
      digitalWrite(ledRed, HIGH);     // Bật Đèn Đỏ (Khẩn cấp)
    } else if (waterLevel >= 20.0) {
      alertLevel = 3;
      statusStr = "DANGER_MID";
      digitalWrite(ledYellow, HIGH);  // Bật Đèn Vàng (Nguy hiểm)
    } else if (waterLevel >= 10.0) {
      alertLevel = 2;
      statusStr = "WARNING";
      digitalWrite(ledBlue, HIGH);    // Bật Đèn Xanh dương (Cảnh báo)
    } else {
      alertLevel = 1;
      statusStr = "SAFE";
      digitalWrite(ledGreen, HIGH);   // Bật Đèn Xanh lá (Bình thường / An toàn)
    }

    Serial.printf("[TR01] K.Cách: %.1f cm | Mực nước: %.1f cm | Cấp: %d (%s)\n", 
                  distanceToWater, waterLevel, alertLevel, statusStr.c_str());

    // Gửi dữ liệu lên máy chủ mỗi chu kỳ SEND_INTERVAL (3 giây)
    unsigned long now = millis();
    if (now - lastSendTime >= SEND_INTERVAL) {
      lastSendTime = now;
      sendDataToServer(waterLevel);
    }

  } else {
    Serial.println("[TR01] Cảnh báo: Không nhận được tín hiệu phản hồi từ cảm biến HC-SR04!");
  }

  delay(1000);
}
