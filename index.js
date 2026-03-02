const express = require("express")
const cors = require("cors")
const { createClient } = require("@supabase/supabase-js")

const app = express()
app.use(cors())
app.use(express.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.get("/", (req, res) => {
  res.send("Backend Absen Aktif 🚀")
})

// ===================
// ABSEN ANGGOTA
// ===================
app.post("/absen", async (req, res) => {
  const { nama, nim, prodi, kode } = req.body

  const { data, error } = await supabase
    .from("attendance")
    .insert([{ nama, nim, prodi, kode }])

  if (error) {
    return res.status(500).json({ error })
  }

  res.json({ success: true, data })
})

// ===================
// ADMIN KHUSUS
// ===================
const admins = [
  { email: "muzamil123@ikmabk.com", password: "muzamil123" },
  { email: "ervin123@ikmabk.com", password: "ervin123" },
  { email: "prista123@ikmabk.com", password: "prista123" }
]

app.post("/login-admin", (req, res) => {
  const { email, password } = req.body

  const admin = admins.find(a => a.email === email && a.password === password)

  if(admin){
    res.json({ message: "Login berhasil" })
  } else {
    res.status(401).json({ message: "Email atau password salah" })
  }
})

// ===================
// PORT
// ===================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server jalan di port", PORT)
})
// ===== AMBIL SEMUA ABSEN =====
app.get("/get-absen", async (req, res) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .order("created_at", { ascending: false })

  if(error){
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
})
// ===== AMBIL DATA ABSEN =====
async function loadAbsen() {
  try {
    const res = await fetch(BASE_URL + "/get-absen") // endpoint backend baru
    const data = await res.json()

    const tbody = document.querySelector("#absenTable tbody")
    tbody.innerHTML = ""

    data.forEach(item => {
      const tr = document.createElement("tr")
      tr.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.nim}</td>
        <td>${item.prodi || ""}</td>
        <td>${item.kode || ""}</td>
        <td>${item.created_at || ""}</td>
      `
      tbody.appendChild(tr)
    })

  } catch(err) {
    alert("Gagal memuat data absensi")
  }
}

// Panggil loadAbsen setelah login admin berhasil
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
      loadAbsen() // langsung load daftar absensi
    }else{
      alert(data.message || "Email atau password salah")
    }

  }catch(err){
    alert("Server tidak merespon!")
  }
}
