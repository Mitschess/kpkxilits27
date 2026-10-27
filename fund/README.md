# Stokly — inventori sederhana

Dashboard inventori berbasis Vite untuk mencatat barang masuk dan penjualan, melihat sisa stok, dan mengenali barang yang sudah mencapai batas minimum.

## Jalankan

```bash
npm install
npm run dev
```

Buka alamat lokal yang dicetak Vite. Untuk membuat versi produksi, jalankan `npm run build`.

### Login dan database Supabase

1. Buat project Supabase.
2. Di **SQL Editor**, jalankan isi file `fund/supabase/schema.sql`. Ini membuat tabel, fungsi transaksi stok, Row Level Security (RLS), dan sinkronisasi realtime.
3. Di root repo, salin `.env.example` menjadi `.env.local` jika belum ada, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari detail API project Supabase. Aplikasi Fund memakai konfigurasi Supabase root yang sama. `VITE_SUPABASE_PUBLISHABLE_KEY` juga didukung. Jangan masukkan service-role/secret key ke aplikasi.
4. Tambahkan alamat aplikasi, misalnya `http://localhost:5173`, ke daftar **Redirect URLs** di pengaturan Auth Supabase untuk email konfirmasi dan reset password.
5. Jalankan ulang `npm run dev`, lalu buat akun memakai email dan password. Jika konfirmasi email aktif, konfirmasi email sebelum login.

Jika ingin memakai project Supabase yang sudah digunakan website utama, jangan reset project atau mengganti schema yang ada. Jalankan hanya `supabase/migrations/20261026_add_fund_inventory.sql` di SQL Editor. Migration itu menambahkan tabel inventori Fund dan membiarkan tabel serta data website yang sudah ada tetap utuh.

Saat kredensial Supabase tersedia, aplikasi memakai Supabase Auth dan PostgreSQL. Data dipisahkan per akun oleh RLS; penjualan dan restock dijalankan lewat fungsi database yang atomik. Jika Supabase belum dikonfigurasi, layar login memberi opsi **Buka inventori mode lokal** untuk pengembangan. Mode lokal memakai SQLite di `data/inventory.sqlite`; file JSON dari versi lama dimigrasikan otomatis saat database lokal pertama dibuat.

Data SQLite lokal tidak otomatis dipindahkan ke Supabase. Simpan backup sebelum beralih dan impor ulang barang yang ingin dipakai di akun Supabase.

## Alur yang tersedia

- Aplikasi dibuka dengan katalog **contoh**. Label `MODE DEMO · DATA CONTOH` menandainya; pilih **Mulai dengan stok kosong** untuk menggantinya dengan inventori toko.
- Tambahkan barang dengan stok awal, harga, SKU/barcode, dan batas minimum. Pindai kode dengan kamera HP dari kolom SKU/barcode atau ketik kodenya.
- Jika barang belum memiliki barcode, pilih **Buat kode otomatis** pada formulir barang, lalu **Cetak label**. Aplikasi membuat kode internal Code 128 seperti `STK-AB12CD3`; tempelkan labelnya pada barang. Kode internal ini untuk inventori toko, bukan pengganti barcode resmi produk ritel.
- Pilih **Catat penjualan**, lalu **Buka kamera HP**. Arahkan kamera belakang ke barcode; barang cocok akan langsung membuka konfirmasi jumlah terjual. Jika halaman belum HTTPS, gunakan **Foto barcode** bila browser HP menyediakan pilihan kamera. Input manual tetap tersedia.
- Simpan jumlah terjual untuk mengurangi stok dan mencatat pergerakan di aktivitas.
- Menu titik tiga pada barang dapat mencatat penjualan/restock atau mengedit detail. Laporan menjelaskan estimasi penjualan; inventori juga dapat diekspor sebagai CSV.
- Gunakan aksi pada baris barang untuk mencatat penjualan atau restock.
- Dengan Supabase aktif, produk dan riwayat stok disimpan di PostgreSQL Supabase dan perubahan realtime disinkronkan antar perangkat pada akun yang sama.
- Dalam mode lokal, data produk dan riwayat stok disimpan di SQLite server Node. Perubahan dikirim melalui Server-Sent Events ke tab yang tersambung ke server yang sama.

## Batas prototipe

Pemindaian langsung membutuhkan izin pengguna dan halaman HTTPS. Membuka alamat HTTP komputer melalui jaringan Wi-Fi biasanya tidak cukup untuk kamera langsung; gunakan URL HTTPS saat aplikasi di-deploy. Opsi foto memakai pemilih kamera/file bawaan HP. Login Supabase memisahkan inventori per akun; fitur peran/izin beberapa kasir dalam satu toko belum tersedia.
