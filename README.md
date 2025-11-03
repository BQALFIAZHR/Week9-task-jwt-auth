# Week9-task-jwt-auth: RESTful API Autentikasi JWT

Proyek ini adalah implementasi *back-end* sederhana yang menyediakan layanan autentikasi pengguna menggunakan **JSON Web Token (JWT)**, dibangun dengan **Node.js, Express, dan MySQL**. Tujuannya adalah untuk mengamankan *endpoint* API dengan memastikan hanya pengguna yang terotentikasi yang dapat mengakses data terproteksi.

## 1 Fitur Utama

* **Registrasi Pengguna (`/register`):** Membuat akun baru dengan pengamanan *password* menggunakan **bcrypt**.
* **Login Pengguna (`/login`):** Memverifikasi kredensial dan menghasilkan JWT untuk sesi pengguna.
* **Rute Terproteksi (`/profile`):** Membutuhkan JWT yang valid di *header* `Authorization` untuk mendapatkan akses.
* **Middleware Autentikasi:** Mekanisme untuk memvalidasi token pada setiap permintaan ke rute terproteksi.

### 2. Instalasi Dependensi

Semua dependensi proyek tercantum dalam `package.json`.

```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)

File **`.env`** menyimpan konfigurasi penting untuk server dan keamanan:

| Variabel | Deskripsi | Nilai  |
| :--- | :--- | :--- |
| `JWT_SECRET` | Kunci rahasia untuk menandatangani dan memverifikasi JWT. **Kunci ini harus diubah!** | `kunci_rahasia_super_aman_untuk_tugas` |
| `PORT` | Port di mana server Express akan berjalan. | `3000` |

### 4. Konfigurasi Database (MySQL)

Koneksi database diatur dalam `src/config/db.js`. Server dikonfigurasi untuk terhubung ke MySQL pada `localhost`, menggunakan user `root` dengan *password* kosong, dan menargetkan database `task_management_db`.

```javascript
// src/config/db.js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", 
  database: "task_management_db"
});

module.exports = db;
```

### 5. Menjalankan Server

Untuk menjalankan server Node.js:

```bash
npm start
# Server berjalan di http://localhost:3000
```
## 6. Detail Alur Autentikasi

### Register (`/api/auth/register`)
1.  Menerima `username` dan `password` dari *request body*.
2.  Memeriksa apakah `username` sudah ada di database (duplikasi).
3.  *Password* di-*hash* menggunakan **bcrypt** dengan faktor *salt* 10 (`bcrypt.hashSync(password, 10)`) untuk keamanan.
4.  Data pengguna baru disimpan ke database, dan mengembalikan respons **`201 Created`**.

### Login (`/api/auth/login`)
1.  Menerima `username` dan `password`.
2.  Membandingkan *password* yang dimasukkan dengan *hashed password* di database menggunakan `bcrypt.compareSync`. Jika salah, mengembalikan **`401 Unauthorized`**.
3.  Jika valid, membuat **JWT** dengan *payload* `{ id, username }`.
4.  Token ditandatangani dengan `JWT_SECRET` dan diatur kedaluwarsa dalam **1 jam** (`expiresIn: "1h"`).
5.  Mengembalikan respons **`200 OK`** yang berisi **JWT**.

### Middleware Autentikasi (`src/middleware/authMiddleware.js`)
* Middleware ini dieksekusi sebelum *handler* rute yang dilindungi (`/profile`).
* Bertanggung jawab untuk mengekstrak token dari *header* `Authorization` (format **`Bearer <token>`**).
* Memverifikasi token menggunakan `jwt.verify` dan `JWT_SECRET`.
* Jika token tidak valid/kedaluwarsa, mengembalikan **`403 Forbidden`**.
* Jika valid, ia melampirkan data pengguna yang terdekode ke `req.user` dan melanjutkan ke *handler* rute.

---

## 7. Hasil Pengujian Postman

### 1. Register Pengguna Baru

<img width="1288" height="905" alt="Cuplikan layar 2025-11-03 123353" src="https://github.com/user-attachments/assets/c07662cb-6881-493e-9608-849573a3af3d" />

* **Endpoint:** `POST /api/auth/register`
* **Status:** `201 Created`.
* **Respons:** Konfirmasi pendaftaran akun sukses untuk pengguna "aska".

### 2. Login Pengguna dan JWT Generation

<img width="1707" height="898" alt="Cuplikan layar 2025-11-03 123440" src="https://github.com/user-attachments/assets/a0011403-1207-4be1-bfcf-cc9de4e0e020" />

* **Endpoint:** `POST /api/auth/login`
* **Status:** `200 OK`.
* **Respons:** Mengembalikan token JWT yang akan digunakan sebagai kunci akses untuk rute terproteksi berikutnya.

### 3. Akses Rute Terproteksi (`/profile`)

<img width="1903" height="975" alt="Cuplikan layar 2025-11-03 123704" src="https://github.com/user-attachments/assets/b1156a23-6e9d-4131-b325-2089a9ea6734" />

* **Endpoint:** `GET /api/auth/profile`
* **Header:** Token JWT yang diperoleh dari login disertakan dalam *header* `Authorization` dengan format **`Bearer <Token>`**.
* **Status:** `200 OK`.
* **Respons:** Akses berhasil diberikan karena token valid. Respons mengembalikan data pengguna (`id: 1, username: "aska"`) yang diekstrak dari *payload* JWT oleh *middleware*.


