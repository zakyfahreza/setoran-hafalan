/* ============================================================
   SCRIPT.JS — Setoran Bacaan & Hafalan Al-Qur'an
   Kirim data ke Google Apps Script Web App
   ============================================================ */

/**
 * ⚠️  GANTI URL INI dengan URL Web App Google Apps Script Anda!
 * Cara mendapatkan URL: lihat README.md → Langkah 3
 *
 * Contoh format URL:
 * https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXXXXX/exec
 */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8TwH4tbZqePYoD6EPJf3Voo1etvglrCkys6Dh7T1rbTBSNGpurN7vQlsrHAaxkO-FBg/exec';

/* ============================================================
   INISIALISASI
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // Set tanggal hari ini sebagai default
  setTodayDate();
});

/**
 * Set nilai default input tanggal = hari ini (format YYYY-MM-DD)
 */
function setTodayDate() {
  const input = document.getElementById('tanggal');
  if (!input) return;

  // Gunakan waktu lokal pengguna
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  input.value = `${yyyy}-${mm}-${dd}`;
}

/* ============================================================
   FORMAT TANGGAL → Bahasa Indonesia
   ============================================================ */
function formatTanggalIndo(dateStr) {
  if (!dateStr) return '';
  const [yyyy, mm, dd] = dateStr.split('-');
  const hariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const bulanList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const hari = hariList[d.getDay()];
  const bulan = bulanList[d.getMonth()];
  return `${hari}, ${Number(dd)} ${bulan} ${yyyy}`;
}

/* ============================================================
   VALIDASI FORM
   ============================================================ */
function validateForm() {
  let isValid = true;

  const namaSelect   = document.getElementById('nama');
  const tanggalInput = document.getElementById('tanggal');

  // Reset state
  namaSelect.classList.remove('is-invalid', 'is-valid');
  tanggalInput.classList.remove('is-invalid', 'is-valid');

  // Validasi Nama
  if (!namaSelect.value) {
    namaSelect.classList.add('is-invalid');
    namaSelect.focus();
    showToast('error', '⚠️ Perhatian', 'Nama anak wajib dipilih.');
    isValid = false;
  } else {
    namaSelect.classList.add('is-valid');
  }

  // Validasi Tanggal
  if (isValid && !tanggalInput.value) {
    tanggalInput.classList.add('is-invalid');
    tanggalInput.focus();
    showToast('error', '⚠️ Perhatian', 'Tanggal wajib diisi.');
    isValid = false;
  } else if (tanggalInput.value) {
    tanggalInput.classList.add('is-valid');
  }

  // Cek apakah minimal satu kolom diisi
  const bacaShubuh  = document.getElementById('baca-shubuh').value.trim();
  const bacaMaghrib = document.getElementById('baca-maghrib').value.trim();
  const hafalShubuh = document.getElementById('hafal-shubuh').value.trim();
  const hafalMaghrib = document.getElementById('hafal-maghrib').value.trim();
  const setoran     = document.getElementById('setoran').value.trim();

  if (isValid && !bacaShubuh && !bacaMaghrib && !hafalShubuh && !hafalMaghrib && !setoran) {
    showToast('warning', '📋 Perhatian', 'Isi minimal satu kolom bacaan, hafalan, atau setoran.');
    isValid = false;
  }

  return isValid;
}

/* ============================================================
   KIRIM DATA
   ============================================================ */
async function submitSetoran() {
  // Cek URL sudah dikonfigurasi
  if (APPS_SCRIPT_URL === 'GANTI_DENGAN_URL_WEB_APP_ANDA') {
    showToast(
      'error',
      '⚙️ Konfigurasi Diperlukan',
      'URL Google Apps Script belum diatur. Buka script.js dan ganti APPS_SCRIPT_URL dengan URL Web App Anda.'
    );
    return;
  }

  // Validasi
  if (!validateForm()) return;

  // Ambil data dari form
  const nama       = document.getElementById('nama').value;
  const tanggalRaw = document.getElementById('tanggal').value;
  const payload = {
    nama:         nama,
    tanggal:      formatTanggalIndo(tanggalRaw),
    tanggal_iso:  tanggalRaw,
    // Kunci unik gabungan: memastikan tiap anak punya baris sendiri per hari
    kunci_unik:   nama + '|' + tanggalRaw,
    baca_shubuh:  document.getElementById('baca-shubuh').value.trim()  || '-',
    baca_maghrib: document.getElementById('baca-maghrib').value.trim() || '-',
    hafal_shubuh: document.getElementById('hafal-shubuh').value.trim() || '-',
    hafal_maghrib:document.getElementById('hafal-maghrib').value.trim()|| '-',
    setoran:      document.getElementById('setoran').value.trim()      || '-',
    timestamp:    new Date().toISOString(),
  };

  // Tampilkan loading
  setLoading(true);
  setButtonLoading(true);

  try {
    // Kirim ke Google Apps Script via fetch (no-cors mode karena Apps Script redirect)
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',                       // GAS Web App perlu no-cors
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });

    // Dengan mode no-cors, response.type = 'opaque' → kita anggap sukses jika tidak ada error
    setLoading(false);
    setButtonLoading(false);
    showToast('success', '✅ Berhasil!', `Data setoran ${payload.nama} — ${payload.tanggal} berhasil disimpan.`);
    resetForm();

  } catch (err) {
    setLoading(false);
    setButtonLoading(false);
    console.error('Gagal mengirim data:', err);
    showToast(
      'error',
      '❌ Gagal Menyimpan',
      'Terjadi kesalahan jaringan. Periksa koneksi internet dan URL Apps Script Anda.'
    );
  }
}

/* ============================================================
   RESET FORM (kecuali nama & tanggal)
   ============================================================ */
function resetForm() {
  const fields = ['baca-shubuh', 'baca-maghrib', 'hafal-shubuh', 'hafal-maghrib', 'setoran'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Hapus kelas validasi
  document.querySelectorAll('.form-input').forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
  });
}

/* ============================================================
   UI HELPERS
   ============================================================ */

/** Tampilkan / sembunyikan loading overlay */
function setLoading(show) {
  const overlay = document.getElementById('loading-overlay');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', show ? 'false' : 'true');
  overlay.classList.toggle('loading--visible', show);
}

/** Tampilkan / sembunyikan state loading pada tombol */
function setButtonLoading(loading) {
  const btn = document.getElementById('btn-simpan');
  if (!btn) return;
  btn.disabled = loading;
  const textEl = btn.querySelector('.btn-submit__text');
  if (textEl) {
    textEl.textContent = loading ? 'Menyimpan...' : 'Simpan Setoran';
  }
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
let toastTimer = null;

/**
 * @param {'success'|'error'|'warning'} type
 * @param {string} title
 * @param {string} message
 * @param {number} [duration=5000] ms
 */
function showToast(type, title, message, duration = 5000) {
  const toast = document.getElementById('toast');
  const iconEl = document.getElementById('toast-icon');
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-message');

  if (!toast) return;

  // Ikon berdasarkan tipe
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };

  // Border color class
  toast.classList.remove('toast--error', 'toast--warning', 'toast--success');
  toast.classList.add(`toast--${type}`);

  iconEl.textContent = icons[type] || '📢';
  titleEl.textContent = title;
  msgEl.textContent = message;

  // Tampilkan
  toast.classList.add('toast--visible');

  // Auto close
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(closeToast, duration);
}

function closeToast() {
  const toast = document.getElementById('toast');
  if (toast) toast.classList.remove('toast--visible');
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}

/* ============================================================
   INPUT REAL-TIME VALIDATION FEEDBACK
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // Validasi real-time: tanggal
  const tanggalInput = document.getElementById('tanggal');
  if (tanggalInput) {
    tanggalInput.addEventListener('change', function () {
      this.classList.toggle('is-valid', !!this.value);
      this.classList.toggle('is-invalid', !this.value);
    });
  }

  // Validasi real-time: nama dropdown
  const namaSelect = document.getElementById('nama');
  if (namaSelect) {
    namaSelect.addEventListener('change', function () {
      this.classList.toggle('is-valid', !!this.value);
      this.classList.remove('is-invalid');
    });
  }
});
