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

app.post("/absen", async (req, res) => {
  const { nama, nim } = req.body

  const { data, error } = await supabase
    .from("attendance")
    .insert([{ nama, nim }])

  if (error) {
    return res.status(500).json({ error })
  }

  res.json({ success: true, data })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server jalan di port", PORT)
})