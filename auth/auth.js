// Variabel Global
let kodeOTPBenar = "";
let dataPengguna = {};

// ELEMEN HALAMAN DAFTAR
const registerForm = document.getElementById('register-form');
const kirimOtpBtn = document.getElementById('kirim-otp-btn');
const otpArea = document.getElementById('otp-area');
const alertBox = document.getElementById('alert-box');

// --- FUNGSI BANTU ---
function tampilPesan(teks, tipe = 'error') {
    alertBox.style.display = 'block';
    alertBox.textContent = teks;
    alertBox.className = `alert ${tipe}`;
    setTimeout(() => alertBox.style.display = 'none', 4000);
}

function buatKodeOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 Digit
}

// --- KIRIM OTP SAAT DAFTAR ---
if (kirimOtpBtn) {
    kirimOtpBtn.addEventListener('click', async () => {
        const nama = document.getElementById('nama').value;
        const email = document.getElementById('email').value;
        const hp = document.getElementById('hp').value;
        const password = document.getElementById('password').value;

        if (!nama || !email || !hp || !password) return tampilPesan('Lengkapi semua data dulu!');

        // Simpan data sementara
        dataPengguna = { nama, email, hp, password };
        kodeOTPBenar = buatKodeOTP();

        try {
            // ✅ SUDAH DIISI SEMUA DATA KAMU
            await emailjs.send(
                "service_zdl5plo",      
                "template_r0iozpq",    
                {
                    user_email: email,  // Sesuai variabel yang kita buat tadi
                    to_name: nama,
                    kode_otp: kodeOTPBenar
                }
            );

            tampilPesan('✅ Kode OTP sudah dikirim ke Email kamu! Cek Kotak Masuk/Spam', 'success');
            otpArea.style.display = 'block';
            kirimOtpBtn.disabled = true;

        } catch (err) {
            tampilPesan('❌ Gagal kirim kode: ' + err.text);
        }
    });
}

// --- VERIFIKASI DAFTAR AKUN ---
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputOTP = document.getElementById('kode-otp').value;

        if (inputOTP === kodeOTPBenar) {
            // SUKSES: Simpan ke LocalStorage
            localStorage.setItem('wibuzone_user', JSON.stringify(dataPengguna));
            tampilPesan('🎉 Berhasil daftar! Kamu akan dialihkan...', 'success');
            
            // Alihkan ke halaman utama
            setTimeout(() => window.location.href = '../index.html', 2000);
        } else {
            tampilPesan('❌ Kode OTP salah atau sudah kadaluarsa!');
        }
    });
}

// --- LOGIN DAN OTP LOGIN ---
const kirimOtpLoginBtn = document.getElementById('kirim-otp-login-btn');
const otpAreaLogin = document.getElementById('otp-area-login');

if (kirimOtpLoginBtn) {
    kirimOtpLoginBtn.addEventListener('click', async () => {
        const emailInput = document.getElementById('email-login').value;
        const passInput = document.getElementById('password-login').value;

        // Ambil data yang disimpan saat daftar
        const userTersimpan = JSON.parse(localStorage.getItem('wibuzone_user'));

        if (!userTersimpan || userTersimpan.email !== emailInput || userTersimpan.password !== passInput) {
            return tampilPesan('❌ Email atau Kata Sandi salah / Belum terdaftar!');
        }

        // Buat OTP untuk Login
        kodeOTPBenar = buatKodeOTP();
        
        // ✅ SUDAH DIISI SEMUA DATA KAMU
        try {
            await emailjs.send(
                "service_zdl5plo",
                "template_r0iozpq",
                {
                    user_email: emailInput,
                    to_name: userTersimpan.nama,
                    kode_otp: kodeOTPBenar
                }
            );
            tampilPesan('✅ Kode OTP Masuk dikirim ke Email!', 'success');
            otpAreaLogin.style.display = 'block';
            kirimOtpLoginBtn.disabled = true;
        } catch (err) {
            tampilPesan('❌ Gagal kirim OTP: ' + err.text);
        }
    });

    // Verifikasi Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputOTP = document.getElementById('kode-otp-login').value;
        if (inputOTP === kodeOTPBenar) {
            localStorage.setItem('wibuzone_login', 'aktif');
            tampilPesan('✅ Berhasil Masuk! Selamat menonton.', 'success');
            setTimeout(() => window.location.href = '../index.html', 1500);
        } else {
            tampilPesan('❌ Kode OTP salah!');
        }
    });
}
