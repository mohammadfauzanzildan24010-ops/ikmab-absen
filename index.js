<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Absen Organisasi</title>

<!-- QR & Scanner -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://unpkg.com/html5-qrcode"></script>

<style>
body{
  font-family:Poppins,sans-serif;
  background:#f1f5f9;
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
}
.container{
  background:#fff;
  padding:30px;
  width:100%;
  max-width:400px;
  border-radius:12px;
  box-shadow:0 5px 15px rgba(0,0,0,0.1);
}
h2{text-align:center;margin-bottom:15px;}
input, select{width:100%;padding:10px;margin-bottom:10px;border-radius:8px;border:1px solid #ddd;}
button{width:100%;padding:10px;border:none;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer;}
button:hover{opacity:0.9;}
.hidden{display:none;}
#reader{width:100%;}
#qrcode{text-align:center;margin-top:15px;}
.link{text-align:center;margin-top:10px;cursor:pointer;color:#2563eb;}
</style>
</head>
<body>

<div class="container">

<!-- PILIH ROLE -->
<div id="rolePage">
  <h2>Login Sebagai</h2>
  <button onclick="showAnggota()">Anggota</button><br><br>
  <button onclick="showAdmin()">Admin</button>
</div>

<!-- ANGGOTA -->
<div id="anggotaPage" class="hidden">
  <h2>Data Anggota</h2>
  <input type="text" id="nama" placeholder="Nama Lengkap">
  <input type="text" id="nim" placeholder="NIM">
  <input type="text" id="prodi" placeholder="Program Studi">
  <button onclick="masukScan()">Masuk Scan</button>
  <div class="link" onclick="location.reload()">Kembali</div>
</div>

<!-- SCAN QR -->
<div id="scanPage" class="hidden">
  <h2>Scan QR Absen</h2>
  <div id="reader"></div>
  <div class="link" onclick="location.reload()">Logout</div>
</div>

<!-- LOGIN ADMIN -->
<div id="adminPage" class="hidden">
  <h2>Login Admin</h2>
  <input type="email" id="adminEmail" placeholder="Email Admin">
  <input type="password" id="adminPass" placeholder="Password">
  <button onclick="loginAdmin()">Login</button>
  <div class="link" onclick="location.reload()">Kembali</div>
</div>

<!-- DASHBOARD ADMIN -->
<div id="adminDash" class="hidden">
  <h2>Buat QR Absen</h2>
  <input type="text" id="kodeAbsen" placeholder="Contoh: Rapat-01">
  <button onclick="buatQR()">Generate QR</button>
  <div id="qrcode"></div>
  <div class="link" onclick="location.reload()">Logout</div>
</div>

</div>

<script>
const BASE_URL = "https://ikmab-absen-production.up.railway.app"

// ===== NAVIGATION =====
function showAnggota(){
  rolePage.classList.add("hidden");
  anggotaPage.classList.remove("hidden");
}
function showAdmin(){
  rolePage.classList.add("hidden");
  adminPage.classList.remove("hidden");
}

// ===== ANGGOTA SCAN =====
function masukScan(){
  const nama = document.getElementById("nama").value
  const nim = document.getElementById("nim").value
  const prodi = document.getElementById("prodi").value

  if(!nama || !nim || !prodi){
    alert("Lengkapi semua data!")
    return
  }

  anggotaPage.classList.add("hidden")
  scanPage.classList.remove("hidden")

  const html5QrCode = new Html5Qrcode("reader")
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (qrCodeMessage) => {
      try{
        const res = await fetch(BASE_URL + "/absen", {
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ nama, nim, prodi, kode: qrCodeMessage })
        })
        const data = await res.json()
        alert(data.message || "Absen berhasil!")
      }catch(err){
        alert("Gagal mengirim ke server!")
      }
      html5QrCode.stop()
    }
  )
}

// ===== LOGIN ADMIN =====
async function loginAdmin(){
  const email = document.getElementById("adminEmail").value
  const password = document.getElementById("adminPass").value

  if(!email || !password){
    alert("Isi email dan password!")
    return
  }

  try{
    const res = await fetch(BASE_URL + "/login-admin", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()

    if(res.ok){
      adminPage.classList.add("hidden")
      adminDash.classList.remove("hidden")
    }else{
      alert(data.message || "Email atau password salah")
    }

  }catch(err){
    alert("Server tidak merespon!")
  }
}

// ===== BUAT QR ADMIN =====
async function buatQR(){
  const kode = document.getElementById("kodeAbsen").value
  if(!kode){
    alert("Masukkan kode absen!")
    return
  }

  try{
    await fetch(BASE_URL + "/buat-qr", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ kode })
    })
  }catch(err){
    alert("Gagal simpan kode ke server!")
  }

  document.getElementById("qrcode").innerHTML = ""
  new QRCode(document.getElementById("qrcode"), { text:kode, width:200, height:200 })
}
</script>

</body>
</html>
