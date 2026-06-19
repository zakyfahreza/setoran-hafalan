# 📖 Setoran Bacaan & Hafalan Al-Qur'an

Website form pencatatan setoran bacaan dan hafalan Al-Qur'an harian yang ringan, modern, dan berjalan sepenuhnya di GitHub Pages tanpa backend/server. Data tersimpan otomatis ke **Google Spreadsheet** via **Google Apps Script**.

---

## ✨ Fitur

- 📅 Input tanggal otomatis (hari ini), bisa diubah manual
- 📖 Form bacaan Ba'da Shubuh & Ba'da Maghrib
- 🧠 Form hafalan Ba'da Shubuh & Ba'da Maghrib
- ✅ Kolom setoran hafalan yang sudah dihafal
- 💾 Data otomatis masuk ke Google Spreadsheet
- 📱 Responsif — nyaman di HP maupun desktop
- 🕌 Desain nuansa islami (warna hijau emerald & emas)
- ⚡ Notifikasi sukses/gagal secara real-time

---

## 🚀 Cara Deploy (Step-by-Step)

### Langkah 1 — Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet baru
2. Beri nama tab/sheet: **`Setoran`** (huruf S kapital, persis sama)
3. Biarkan kosong — header akan dibuat otomatis oleh Apps Script
4. Catat **ID Spreadsheet** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[ID_SPREADSHEET_DI_SINI]/edit
   ```

---

### Langkah 2 — Pasang Google Apps Script

1. Di Spreadsheet, klik menu **Extensions → Apps Script**
2. Hapus semua kode bawaan (function myFunction...)
3. Copy seluruh isi file **`Code.gs`** dari repo ini, lalu paste
4. Ganti baris berikut dengan ID Spreadsheet Anda:
   ```javascript
   const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
   ```
5. Klik **💾 Simpan** (Ctrl+S)

---

### Langkah 3 — Deploy sebagai Web App

1. Di Apps Script, klik **Deploy → New deployment**
2. Klik ikon ⚙️ di samping "Select type", pilih **Web App**
3. Isi konfigurasi:
   - **Description**: Setoran Al-Qur'an API
   - **Execute as**: `Me (your email)`
   - **Who has access**: **Anyone** ← ⚠️ WAJIB diatur ke Anyone
4. Klik **Deploy**
5. **Izinkan akses** saat diminta (klik "Review permissions" → pilih akun Google → Allow)
6. Salin **URL Web App** yang muncul:
   ```
   https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXX/exec
   ```

> **⚠️ Penting:** Setiap kali Anda mengubah kode `Code.gs`, buat **deployment baru** (bukan edit deployment lama) agar perubahan berlaku.

---

### Langkah 4 — Hubungkan URL ke Website

1. Buka file **`script.js`**
2. Ganti baris berikut:
   ```javascript
   const APPS_SCRIPT_URL = 'GANTI_DENGAN_URL_WEB_APP_ANDA';
   ```
   Menjadi URL Web App Anda, contoh:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXX/exec';
   ```
3. Simpan file

---

### Langkah 5 — Deploy ke GitHub Pages

1. **Buat repository baru** di GitHub (misal: `setoran-quran`)
2. Upload semua file berikut ke repository:
   ```
   📁 setoran-quran/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── Code.gs      ← (opsional, untuk dokumentasi)
   └── README.md
   ```
3. Di GitHub, masuk ke **Settings → Pages**
4. Pada bagian **Source**, pilih branch `main` dan folder `/ (root)`
5. Klik **Save**
6. Website akan live di:
   ```
   https://[username].github.io/[nama-repo]/
   ```

---

## 📊 Struktur Data di Spreadsheet

| Kolom | Nama Kolom | Keterangan |
|-------|-----------|-----------|
| A | Nama Santri | Nama yang mengisi form |
| B | Hari/Tanggal | Format: Kamis, 19 Juni 2025 |
| C | Membaca Ba'da Shubuh | Rincian bacaan pagi |
| D | Membaca Ba'da Maghrib | Rincian bacaan malam |
| E | Menghafal Ba'da Shubuh | Hafalan pagi (baru) |
| F | Menghafal Ba'da Maghrib | Hafalan malam (baru) |
| G | Setoran Yang Sudah Dihafal | Detail setoran ke guru |
| H | Timestamp | Waktu pengiriman otomatis |

---

## 🔧 Testing

### Test Apps Script Tanpa Website
1. Di Apps Script, buka fungsi `testKirimData()`
2. Klik **Run**
3. Cek Spreadsheet — baris data dummy akan masuk

### Test Web App URL
Buka URL Web App di browser (GET request):
```
https://script.google.com/macros/s/AKfycbXXXX.../exec
```
Jika aktif, akan menampilkan:
```json
{"status":"ok","message":"API Setoran Al-Qur'an aktif..."}
```

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Data tidak masuk spreadsheet | Pastikan "Who has access" = **Anyone** saat deploy |
| Error CORS | Normal, gunakan `mode: 'no-cors'` (sudah dikonfigurasi) |
| URL belum diganti | Ganti `APPS_SCRIPT_URL` di `script.js` |
| Sheet tidak ditemukan | Pastikan nama tab sheet = **`Setoran`** (huruf besar S) |
| Setelah edit Code.gs tidak berlaku | Buat deployment **baru**, bukan edit yang lama |

---

## 📁 Struktur File

```
setoran-quran/
├── index.html    → Halaman utama (form setoran)
├── style.css     → Styling modern bernuansa islami
├── script.js     → Logic form & koneksi ke Google Apps Script
├── Code.gs       → Kode Google Apps Script (untuk referensi)
└── README.md     → Panduan setup & deployment ini
```

---

## 📜 Lisensi

Bebas digunakan dan dimodifikasi untuk kebutuhan pendidikan dan keagamaan.

---

> وَلَقَدْ يَسَّرْنَا الْقُرْاٰنَ لِلذِّكْرِ فَهَلْ مِنْ مُّدَّكِرٍ
>
> *"Dan sungguh, telah Kami mudahkan Al-Qur'an untuk peringatan, maka adakah yang mau mengambil pelajaran?"*
> — Q.S. Al-Qamar: 17
