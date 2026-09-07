# Pemutar Spotify Kantor

Satu layar pemutar bergaya kaca terang: siapa pun di kantor boleh melihat lagu
yang sedang diputar beserta antriannya, sementara semua aksi kontrol dikunci PIN.
Sumber datanya satu akun Spotify milik pemilik aplikasi.

## Menjalankan

```bash
npm install
npm run dev
```

## Environment

Salin `.env.copy` menjadi `.env.local`, lalu isi:

| Variabel | Keterangan |
|---|---|
| `SPOTIFY_CLIENT_ID` | Client ID aplikasi Spotify |
| `SPOTIFY_CLIENT_SECRET` | Client secret aplikasi Spotify |
| `SPOTIFY_REFRESH_TOKEN` | Refresh token akun kantor |
| `SPOTIFY_REDIRECT_URI` | Redirect URI, arahkan ke `<domain>/credential` |
| `SPOTIFY_USER_ID` | ID pengguna Spotify pemilik akun, dipakai menyaring playlist milik sendiri |
| `CONTROL_PIN` | PIN untuk membuka kontrol pemutaran |
| `SESSION_SECRET` | Kunci penanda tangan cookie sesi kontrol |
| `GOOGLE_TAG_ID` | Opsional, ID Google Analytics |

Kredensial Spotify hanya dibaca di sisi server dan tidak ikut masuk ke bundle
sisi klien.

## Halaman

| Rute | Isi |
|---|---|
| `/` | Layar pemutar: lagu berjalan, antrian, playlist, statistik |
| `/login` | Memasukkan PIN kontrol |
| `/setup/authorize` | Memulai otorisasi ulang Spotify (butuh PIN) |
| `/credential` | Menampilkan refresh token hasil otorisasi (butuh PIN) |

## Kunci kontrol

Melihat tidak perlu PIN. Begitu ada aksi yang mengubah pemutaran, sheet PIN
terbuka; setelah PIN benar, cookie sesi bertahan 12 jam dan aksi tadi langsung
dijalankan. Percobaan PIN dibatasi 5 kali per 10 menit per alamat IP.

## Rute shortcut lama

`GET /api/play` dan `GET /api/pause` dipertahankan apa adanya untuk shortcut
harian, termasuk parameter `device_id` dan `context_uri`. Keduanya sengaja tidak
memakai PIN.

## Pintasan papan ketik

- `Ctrl + Shift + Alt + N` — lagu berikutnya
- `Ctrl + Shift + Alt + P` — buka atau tutup panel statistik

## Perintah

```bash
npm run dev      # server pengembangan
npm run build    # build produksi
npm run test     # menjalankan Vitest
npm run lint     # ESLint
npm run format   # Prettier
```
