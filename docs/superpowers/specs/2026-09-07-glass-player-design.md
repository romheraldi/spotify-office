# Glass Player — Design Spec

Tanggal: 2026-09-07
Status: disetujui untuk implementasi

## 1. Tujuan

Membangun ulang aplikasi Spotify internal kantor menjadi satu layar player
bergaya *light glass* (mengacu pada referensi desain yang diberikan), dengan
kontrol playback yang dikunci PIN agar tidak semua orang di kantor bisa
mengubah lagu.

Sumber data tidak berubah: satu akun Spotify milik pemilik aplikasi, diakses
lewat `SPOTIFY_REFRESH_TOKEN` di environment.

## 2. Keputusan yang sudah diambil

| Topik | Keputusan |
|---|---|
| Model auth | Tetap satu akun (env refresh token). Tidak ada OAuth per pengunjung. |
| Cakupan kunci | Semua orang boleh melihat. Semua aksi kontrol butuh PIN. |
| Struktur halaman | Satu shell; `/` adalah layar player. Statistik jadi panel di dalamnya. |
| Tema | Light glass, mengikuti referensi. Tidak ada mode gelap di v1. |
| Fitur kontrol | Transport lengkap, seek, volume, search + antrian, pilih playlist + device. |
| Mekanisme sesi | Cookie HttpOnly bertanda tangan HMAC. PIN dibandingkan timing-safe. |
| Realtime | Polling 3 detik + interpolasi progres lokal. SSE dihapus. |
| Route lama | `/api/play` dan `/api/pause` (GET) dipertahankan apa adanya, tanpa auth. |

## 3. Arsitektur

```
src/
  app/
    layout.tsx                  shell global: font, backdrop, toast host
    page.tsx                    / = layar player (server component)
    login/page.tsx              halaman PIN penuh
    setup/authorize/page.tsx    (dulu /login) redirect OAuth, digate PIN
    setup/credential/page.tsx   (dulu /credential) tampil token, digate PIN
    player/page.tsx             redirect -> /
    player/devices/page.tsx     redirect -> /
    api/
      auth/pin/route.ts         POST login, DELETE logout
      auth/session/route.ts     GET status sesi
      player/route.ts           GET state + queue (publik)
      library/route.ts          GET playlist + device (digate)
      search/route.ts           GET cari lagu (digate)
      control/[action]/route.ts POST semua aksi kontrol (digate)
      play/route.ts             LEGACY, tidak diubah
      pause/route.ts            LEGACY, hanya bug device_id dibetulkan
      token/route.ts            tukar authorization code -> refresh token
  modules/
    auth/{session.ts,guard.ts,rate-limit.ts,pin.ts}
    player/{data/,hooks/,components/,types/}
    stats/{data/,components/,types/}
  components/ui/                primitif glass
  lib/spotify.ts                axios instance ke api.spotify.com
```

Dihapus: `/api/spotify-data` (SSE), `modules/home/*` (dipindah ke
`modules/stats`), `modules/players/*` (dipindah ke `modules/player`),
`modules/axios` (jadi `lib/spotify.ts`).

## 4. Autentikasi

### Environment baru

- `CONTROL_PIN` — PIN kontrol, server-only, tidak pernah dikirim ke client.
- `SESSION_SECRET` — kunci HMAC untuk menandatangani cookie sesi.

### Alur

1. `/` dapat dibuka siapa saja. Data playback tampil penuh.
2. Tombol kontrol tetap terlihat, dengan badge gembok. Menekannya tanpa sesi
   membuka sheet PIN.
3. `POST /api/auth/pin` membandingkan PIN dengan `timingSafeEqual`, lalu
   memasang cookie `sp_ctrl` (`HttpOnly`, `Secure`, `SameSite=Lax`, 12 jam)
   berisi `exp.HMAC(exp, SESSION_SECRET)`.
4. Semua route mutasi dibungkus `withControl()`. Cookie tidak sah atau
   kedaluwarsa menghasilkan `401 { ok: false, error: { code: 'PIN_REQUIRED' } }`.
5. Client menangkap 401, membuka sheet PIN, menahan aksi, lalu menjalankannya
   kembali setelah PIN benar.
6. Rate limit PIN: 5 percobaan per 10 menit per IP, in-memory (best effort di
   serverless), melebihi itu `429`.
7. `DELETE /api/auth/pin` menghapus cookie.

## 5. Permukaan API

| Route | Method | Gate | Body / Query | Respons |
|---|---|---|---|---|
| `/api/player` | GET | publik | — | `{ ok, data: { state, queue, devices } }` |
| `/api/auth/pin` | POST | — | `{ pin }` | `{ ok, data: { expiresAt } }` |
| `/api/auth/pin` | DELETE | — | — | `{ ok }` |
| `/api/auth/session` | GET | — | — | `{ ok, data: { unlocked, expiresAt } }` |
| `/api/search` | GET | PIN | `?q=` | `{ ok, data: Track[] }` |
| `/api/library` | GET | PIN | — | `{ ok, data: { playlists, devices } }` |
| `/api/control/play` | POST | PIN | `{ contextUri?, deviceId?, uri? }` | `{ ok }` |
| `/api/control/pause` | POST | PIN | `{ deviceId? }` | `{ ok }` |
| `/api/control/next` | POST | PIN | `{ deviceId? }` | `{ ok }` |
| `/api/control/previous` | POST | PIN | `{ deviceId? }` | `{ ok }` |
| `/api/control/seek` | POST | PIN | `{ positionMs, deviceId? }` | `{ ok }` |
| `/api/control/volume` | POST | PIN | `{ percent, deviceId? }` | `{ ok }` |
| `/api/control/shuffle` | POST | PIN | `{ state: boolean }` | `{ ok }` |
| `/api/control/repeat` | POST | PIN | `{ state: 'off'\|'context'\|'track' }` | `{ ok }` |
| `/api/control/queue` | POST | PIN | `{ uri, deviceId? }` | `{ ok }` |
| `/api/control/device` | POST | PIN | `{ deviceId, play? }` | `{ ok }` |

Bentuk respons seragam: `{ ok: boolean, data?: T, error?: { code, message } }`.

Route legacy `/api/play` dan `/api/pause` mempertahankan bentuk lama
(GET, query string, respons `{ message }`) demi shortcut harian pemilik.

## 6. Desain visual

### Token

```
--bg        #EFF1F5
--panel     rgba(255,255,255,.68)
--panel-brd rgba(255,255,255,.70)
--ink       #17171C
--ink-2     #6B6C76
--accent    #0FB39E
radius      28 / 20 / 14
shadow      0 24px 60px -20px rgba(20,20,40,.18)
```

### Backdrop

Album art lagu yang sedang diputar dipakai ulang sebagai blob latar:
`scale-125 blur-[120px] opacity-60`. Warna ruangan ikut berganti tiap lagu
tanpa aset tambahan.

### Susunan panel utama

```
+-----------------------------------------------------------+
| (O)  [ Cari lagu, artis...        ]   Statistik  * (av) [G]|
|-----------------------------------------------------------|
|  +-------------+   Nama Lagu                    Populer    |
|  |  album art  |   Artis . 2018 . 12 lagu       ooooo      |
|  +-------------+   | > 1  Lagu sekarang     4:05 |         |
|   x  |< (>) >| o   |   2  Lagu berikutnya   3:12 |         |
|                    |   3  ...               2:58 |         |
|-----------------------------------------------------------|
| [dev] MacBook Kantor   02:46 --o---------- 4:05   = ))     |
+-----------------------------------------------------------+
```

- Panel `max-w-[1180px]`, `backdrop-blur-2xl`, radius 28.
- Kartu playlist mengintip di tepi kiri dan kanan sebagai pemilih playlist.
- Slot rating pada referensi diisi *popularity* track (0–100 dipetakan ke 5 titik).
- Daftar track adalah antrian Spotify. Baris aktif memakai pill gelap `#17171C`.
- Tombol "Statistik" membuka panel geser berisi top artists, genres, tracks,
  dan pie chart lama yang di-restyle.
- Keadaan terkunci: tombol tetap terlihat penuh, badge gembok di pojok panel,
  klik membuka sheet PIN enam digit.
- Mobile: kolom menumpuk, transport dan progres menjadi bar tempel di bawah,
  playlist mengintip berubah menjadi carousel.
- Animasi memakai `react-spring` yang sudah ada. Tidak ada dependency animasi baru.
- Aksesibilitas: `aria-label` pada tombol ikon, slider dapat dioperasikan dengan
  panah kiri/kanan, focus ring jelas, kontras teks memenuhi AA.

## 7. Aliran data

- `/` sebagai server component mengambil `state`, `queue`, `devices`, dan status
  sesi untuk render awal.
- `usePlayer()` — polling `/api/player` tiap 3 detik dengan `AbortController`,
  berhenti saat tab tidak terlihat, refetch segera saat tab kembali fokus.
- `useProgress()` — ticker lokal 250ms menginterpolasi `progress_ms`, resync
  setiap kali polling masuk, berhenti saat `is_playing` bernilai false.
- `useControl()` — optimistic update, revalidate 800ms setelah aksi, kembalikan
  keadaan lama bila gagal.

## 8. Penanganan error

| Kejadian | Perilaku |
|---|---|
| 401 `PIN_REQUIRED` | Sheet PIN terbuka, aksi ditahan lalu diulang otomatis |
| 429 | Toast "coba lagi dalam N menit", input PIN dikunci |
| Tidak ada device aktif | Panel pemilih device |
| Refresh token mati | Banner + tautan ke `/setup/authorize` |
| Spotify 403 (bukan Premium) | Toast bahwa kontrol memerlukan Premium |

## 9. Perbaikan yang ikut dikerjakan

1. `next.config.mjs` tidak lagi meneruskan `SPOTIFY_CLIENT_SECRET` dan
   `SPOTIFY_REFRESH_TOKEN` ke blok `env` Next, sehingga tidak berisiko
   ter-inline ke bundle client. URL authorize dibangun di server.
2. `pause-track.ts`: argumen kedua `axios.put` adalah body, bukan config,
   sehingga `device_id` tidak pernah terkirim. Dibetulkan, dengan `device_id`
   hanya dikirim bila ada isinya agar perilaku tanpa parameter tetap sama.
3. `search.ts`: `splice` di dalam `forEach` atas array yang sama membuat
   sebagian artis terblokir lolos. Diganti `filter`.
4. Metadata `layout.tsx` tidak lagi "Create Next App".
5. `next/head` pada halaman player dihapus (tidak berfungsi di App Router).

## 10. Pengujian

Vitest ditambahkan sebagai dependency pengembangan:

1. `session.ts` — tanda tangan sah, rusak, dan kedaluwarsa.
2. `guard.ts` — tanpa cookie, cookie palsu, cookie sah.
3. `rate-limit.ts` — percobaan keenam ditolak, reset setelah jendela lewat.
4. `search` — artis yang diblokir benar-benar tersaring.
5. `useProgress` — interpolasi berhenti saat `is_playing` false.

Tampilan diverifikasi manual di browser.

## 11. Di luar cakupan v1

- Mode gelap.
- PIN per orang beserta catatan siapa mengubah apa.
- OAuth per pengunjung.
- Menyukai lagu (butuh scope `user-library-modify`).
