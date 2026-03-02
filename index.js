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
