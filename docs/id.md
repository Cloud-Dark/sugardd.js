
#  Dokumentasi Lengkap sugardd.js

Selamat datang di panduan lengkap untuk `sugardd.js`. Di sini Anda akan menemukan semua yang perlu Anda ketahui, mulai dari fitur dasar hingga skenario penggunaan tingkat lanjut.

## Daftar Isi

- [Mengapa sugardd.js?](#mengapa-sugarddjs)
- [✨ Fitur Lengkap](#-fitur-lengkap)
  - [1. Tampilan Pohon Proyek yang Intuitif](#1-tampilan-pohon-proyek-yang-intuitif)
  - [2. Tampilan Konten File secara Inline](#2-tampilan-konten-file-secara-inline)
  - [3. Mesin Filter Canggih](#3-mesin-filter-canggih)
  - [4. Statistik Komprehensif](#4-statistik-komprehensif)
  - [5. Berbagai Format Ekspor](#5-berbagai-format-ekspor)
  - [6. Mode Server Interaktif](#6-mode-server-interaktif)
- [📖 Penggunaan & Contoh](#-penggunaan--contoh)
  - [Opsi Baris Perintah (CLI)](#opsi-baris-perintah-cli)
  - [Skenario Praktis](#skenario-praktis)

## Mengapa sugardd.js?

Baik Anda baru memulai proyek baru, mempersiapkan tinjauan kode, atau membuat dokumentasi, `sugardd.js` memberi Anda gambaran lengkap dalam hitungan detik. Ini menghilangkan kebutuhan untuk menjelajahi folder secara manual dan menyediakan ringkasan tingkat tinggi yang dapat dianalisis dari seluruh basis kode Anda.

## ✨ Fitur Lengkap

### 1. Tampilan Pohon Proyek yang Intuitif

Visualisasikan seluruh struktur proyek Anda dalam format pohon yang bersih, penuh warna, dan mudah dipahami langsung di terminal Anda.

-   **Fungsi:** Menampilkan direktori dan file dalam hierarki bersarang.
-   **Manfaat:** Memahami tata letak proyek dengan cepat tanpa membuka file explorer atau IDE.
-   **Kustomisasi:** Sesuaikan kedalaman tampilan, filter berdasarkan ekstensi file, atau fokus pada direktori tertentu.
-   **Alias Singkat:** Gunakan `-d` untuk direktori, `-bl` untuk blacklist, `-wl` untuk whitelist, dan lainnya.

**Contoh:**
```bash
sugardd
```

return 

```bash
🍬 Menganalisis struktur proyek...
📁 proyek-keren-saya
    ├── 📁 src
    │   └── 📄 index.js
    ├── 📄 package.json
    └── 📄 README.md
```

### 2. Tampilan Konten File secara Inline

Lebih dari sekadar struktur. `sugardd.js` dapat langsung menampilkan konten file Anda di dalam tampilan pohon, memberikan Anda konteks instan.

-   **Fungsi:** Mencetak konten file berbasis teks langsung di bawah namanya.
-   **Manfaat:** Membaca file konfigurasi, memeriksa skrip utilitas kecil, atau meninjau dokumentasi tanpa pernah meninggalkan terminal Anda.

**Contoh (ini adalah perilaku default):**
```bash
sugardd
```

return

```bash
...
├── 📄 package.json
│   ┌──────────────────────────────────────────────────┐
│   │ {
│   │   "name": "proyek-keren-saya",
│   │   "version": "1.0.0"
│   │ }
│   └──────────────────────────────────────────────────┘
└── 📄 README.md
    ┌──────────────────────────────────────────────────┐
    │ # Proyek Keren Saya
    │ 
    │ Selamat datang di readme!
    └──────────────────────────────────────────────────┘
```
> **Tip:** Gunakan `--no-content` untuk pemindaian yang lebih cepat jika Anda hanya memerlukan struktur file.

### 3. Mesin Filter Canggih

Fokus hanya pada hal yang penting. Mesin filter yang kuat memungkinkan Anda menyertakan atau mengecualikan file dan folder berdasarkan nama atau ekstensi.

-   **Fungsi:** Menyediakan opsi `whitelist` dan `blacklist` untuk folder, file, dan ekstensi file.
-   **Manfaat:** Mengisolasi bagian tertentu dari aplikasi Anda (misalnya, hanya menampilkan kode sumber), mengabaikan direktori yang tidak relevan (`node_modules`), atau menemukan semua file dengan tipe tertentu.

**Contoh 1: Mengabaikan folder umum**
```bash
sugardd --blacklist node_modules,.git,dist,build
```

**Contoh 2: Menampilkan HANYA file JavaScript dan CSS**
```bash
sugardd --whitelist-ext .js,.css
# atau gunakan alias singkatnya
sugardd -wle js,css
```

**Contoh 3: Menampilkan semua file sumber tetapi mengecualikan file tes**
```bash
sugardd -d ./src --blacklist-ext .test.js,.spec.js
# atau gunakan alias singkatnya
sugardd -d ./src -ble .test.js,.spec.js
```

### 4. Statistik Komprehensif

Dapatkan ringkasan kuantitatif tingkat tinggi dari proyek Anda dengan flag `--stats`.

-   **Fungsi:** Menghitung total file, direktori, ukuran proyek, distribusi tipe file, file terbesar, dan file terpanjang.
-   **Manfaat:** Sempurna untuk audit kode, melacak pertumbuhan proyek, dan mengidentifikasi file besar yang berpotensi bermasalah.

**Contoh:**
```bash
sugardd --stats --no-content
```
return

```bash
...
🍭 sugardd.js - Your Project's Sweetest Explorer
Visualize your codebase with beautiful, structured diagrams.

🍬 Analyzing project structure...

📊 Statistik Proyek
----------------------
📁 Direktori: 4
📄 Total File: 6
💾 Ukuran Total: 65.17 KB
🐘 File Terbesar: package-lock.json (33.48 KB)

🎨 Tipe File:
  - .js: 2
  - .md: 2
  - .json: 2
----------------------

📁 sugardd.js
    ├── 📁 bin
    │   └── 📄 main.js
    ├── 📁 docs
    │   └── 📄 id.md
    ├── 📁 src
    │   └── 📄 sugardd.js
    ├── 📄 package-lock.json
    ├── 📄 package.json
    └── 📄 README.md
```

### 5. Berbagai Format Ekspor

Hasilkan laporan dan artefak yang dapat dibagikan untuk dokumentasi, tinjauan kode, atau penggunaan terprogram.

-   **Fungsi:** Menyimpan analisis lengkap ke file dalam format JSON, Markdown, HTML, atau TXT.
-   **Manfaat:** Membuat catatan permanen, berintegrasi dengan pipeline CI/CD, atau menghosting laporan analisis statis.

**Contoh:**
```bash
# Hasilkan file Markdown detail untuk repositori Anda
sugardd --stats --output LAPORAN_PROYEK.md

# Buat laporan HTML mandiri yang dapat dilihat
sugardd --stats --output analisis.html

# Dapatkan output JSON yang dapat dibaca mesin
sugardd --no-content --format json --output manifest.json
```

### 6. Mode Server Interaktif

Jalankan `sugardd.js` sebagai server REST API ringan untuk meminta informasi proyek secara dinamis.

-   **Fungsi:** Memulai server Express yang menyediakan data proyek melalui endpoint API.
-   **Manfaat:** Memungkinkan alat dan skrip lain untuk secara terprogram mengakses struktur file dan statistik tanpa memindai ulang sistem file setiap saat.

**Contoh:**
```bash
# Mulai server pada port default 3000
sugardd --server

# Jalankan pada port kustom
sugardd -s -p 8080
```
**Endpoint API:**
-   `GET /scan`: Mengembalikan seluruh struktur proyek dan statistik sebagai JSON.
    -   Anda dapat meneruskan opsi CLI apa pun sebagai parameter kueri!
    -   Contoh: `curl "http://localhost:3000/scan?whitelistExt=.js"`

## 📖 Penggunaan & Contoh

### Opsi Baris Perintah (CLI)

| Opsi | Alias | Deskripsi | Default |
| --- | --- | --- | --- |
| `--directory <path>` | `-d` | Direktori target yang akan dianalisis. | Direktori saat ini |
| `--blacklist <folders>` | `-bl` | Folder yang akan dikecualikan (dipisah koma). | `node_modules,.git`|
| `--whitelist <folders>` | `-wl` | Hanya folder ini yang akan disertakan. | `null` |
| `--blacklist-files <files>`| `-bf` | File yang akan dikecualikan (dipisah koma). | `.DS_Store` |
| `--whitelist-files <files>`| `-wf` | Hanya file ini yang akan disertakan. | `null` |
| `--whitelist-ext <exts>` | `-wle` | Hanya sertakan file dengan ekstensi ini. | `null` |
| `--blacklist-ext <exts>` | `-ble` | Kecualikan file dengan ekstensi ini. | `null` |
| `--server` | `-s` | Jalankan sebagai server Express. | `false` |
| `--port <number>` | `-p` | Port untuk server. | `3000` |
| `--format <type>` | `-f` | Format output (`tree`, `json`, `detailed`). | `tree` |
| `--output <file>` | `-o` | Simpan output ke file (`.json`, `.md`, `.html`, `.txt`).| `null` |
| `--stats` | | Tampilkan statistik proyek yang komprehensif. | `false` |
| `--no-content` | | Abaikan konten file untuk pemindaian lebih cepat. | `false` |
| `--max-depth <depth>` | | Kedalaman direktori maksimum untuk dipindai. | `10` |
| `--include-hidden` | | Sertakan file dan folder tersembunyi (diawali `.`). | `false` |

### Skenario Praktis

**Skenario 1: Memulai Proyek JavaScript Baru**
Anda ingin memahami struktur kode sumber dan dependensinya.
```bash
sugardd -d ./proyek-baru --wle js,json --bl node_modules,dist --stats
```
Perintah ini memberi Anda pohon file `.js` dan `.json` saja, mengabaikan `node_modules`, dan mencetak ringkasan statistik.

**Skenario 2: Membuat Dokumentasi Proyek**
Anda perlu membuat file Markdown yang mendokumentasikan seluruh struktur dan statistik proyek.
```bash
sugardd --stats --output docs/TinjauanProyek.md
```
Ini akan membuat file Markdown yang indah, sempurna untuk disertakan dalam dokumentasi repositori Anda.

**Skenario 3: Menemukan Semua File Konfigurasi**
Anda perlu melihat konten dari semua file `.json` dan `.yaml`.
```bash
sugardd --wle json,yaml,yml --no-stats
```

**Skenario 4: Membuat Manifes File untuk Proses Build**
Anda memerlukan array JSON dari semua file sumber untuk diteruskan ke alat build.
```bash
sugardd -d ./src --format json --no-content --output manifest.json
```
