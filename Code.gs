// ============================================================
// Code.gs — Google Apps Script untuk Setoran Al-Qur'an
// Paste kode ini di Google Apps Script (script.google.com)
// ============================================================

// ──────────────────────────────────────────────────────────
// KONFIGURASI: Ganti dengan ID Spreadsheet Anda
// ID Spreadsheet ada di URL:
// https://docs.google.com/spreadsheets/d/[ID_DI_SINI]/edit
// ──────────────────────────────────────────────────────────
const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_ANDA';
const SHEET_NAME     = 'Setoran';   // nama tab/sheet (sesuaikan jika perlu)

// ──────────────────────────────────────────────────────────
// doPost(e) — Endpoint utama, menerima POST dari website
// ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    // Parse JSON body yang dikirim dari website
    const data = JSON.parse(e.postData.contents);

    // Buka spreadsheet dan sheet
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    // Jika sheet belum ada header, buat header terlebih dahulu
    if (sheet.getLastRow() === 0) {
      buatHeader(sheet);
    }

    // Susun baris data sesuai urutan kolom
    const row = [
      data.tanggal       || '',   // Hari/Tanggal (format Indo)
      data.baca_shubuh   || '-',  // Membaca Ba'da Shubuh
      data.baca_maghrib  || '-',  // Membaca Ba'da Maghrib
      data.hafal_shubuh  || '-',  // Menghafal Ba'da Shubuh
      data.hafal_maghrib || '-',  // Menghafal Ba'da Maghrib
      data.setoran       || '-',  // Setoran Yang Sudah Dihafal
      new Date(),                  // Timestamp otomatis
    ];

    // Tambahkan baris baru di akhir
    sheet.appendRow(row);

    // Format kolom timestamp (kolom ke-8) agar terbaca
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 8).setNumberFormat('dd/MM/yyyy HH:mm:ss');

    // Kembalikan response sukses (JSON)
    return ContentService
      .createTextOutput(JSON.stringify({
        status:  'success',
        message: 'Data berhasil disimpan.',
        row:     lastRow,
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Kembalikan response error
    return ContentService
      .createTextOutput(JSON.stringify({
        status:  'error',
        message: err.toString(),
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ──────────────────────────────────────────────────────────
// doGet(e) — Untuk test apakah Web App aktif
// ──────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  'ok',
      message: 'API Setoran Al-Qur\'an aktif. Gunakan metode POST untuk mengirim data.',
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ──────────────────────────────────────────────────────────
// buatHeader — Buat baris header jika sheet masih kosong
// ──────────────────────────────────────────────────────────
function buatHeader(sheet) {
  const headers = [
    'Hari/Tanggal',
    "Membaca Ba'da Shubuh",
    "Membaca Ba'da Maghrib",
    "Menghafal Ba'da Shubuh",
    "Menghafal Ba'da Maghrib",
    'Setoran Yang Sudah Dihafal',
    'Timestamp',
  ];

  sheet.appendRow(headers);

  // Styling header
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0d3b2e');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setWrap(true);

  // Freeze baris header
  sheet.setFrozenRows(1);

  // Auto-resize kolom
  sheet.autoResizeColumns(1, headers.length);
}

// ──────────────────────────────────────────────────────────
// testKirimData — Fungsi untuk testing manual di Apps Script
// Klik Run → testKirimData untuk mencoba tanpa website
// ──────────────────────────────────────────────────────────
function testKirimData() {
  const dummyEvent = {
    postData: {
      contents: JSON.stringify({
        tanggal:       "Kamis, 19 Juni 2025",
        tanggal_iso:   "2025-06-19",
        baca_shubuh:   "Al-Baqarah: 1-10",
        baca_maghrib:  "Al-Baqarah: 11-20",
        hafal_shubuh:  "Al-Mulk: 1-5",
        hafal_maghrib: "Al-Mulk: 6-10",
        setoran:       "Al-Fatihah dan Al-Ikhlas",
        timestamp:     new Date().toISOString(),
      }),
    },
  };

  const result = doPost(dummyEvent);
  Logger.log(result.getContent());
}
