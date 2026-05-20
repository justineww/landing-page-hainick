const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hainick_admin",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal menyambung ke database:", err);
  } else {
    console.log("✅ Mantap! Berhasil menyambung ke database hainick_admin!");
  }
});

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ── Login ─────────────────────────────────────────────────────────────────────
app.get("/api/login", (req, res) => {
  const { username, password } = req.query;
  const sql = "SELECT * FROM login WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err)
      return res.status(500).json({ error: "Gagal mengambil data login" });
    if (result.length === 0)
      return res.status(401).json({ error: "Username atau password salah!" });
    return res.status(200).json({ message: "Login berhasil!" });
  });
});

// ── Load ──────────────────────────────────────────────────────────────────────
app.get("/api/creators", (req, res) => {
  db.query("SELECT * FROM creators", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Gagal mengambil data creator" });
    res.status(200).json(result);
  });
});

app.get("/api/hainick-assets", (req, res) => {
  db.query("SELECT * FROM website_assets", (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Gagal mengambil data hainick update" });
    res.status(200).json(result);
  });
});

app.get("/api/updates-section", (req, res) => {
  db.query("SELECT * FROM updates_section", (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Gagal mengambil data updates section" });
    res.status(200).json(result);
  });
});

app.get("/api/testimonials", (req, res) => {
  db.query("SELECT * FROM testimonials", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Gagal mengambil data testimoni" });
    res.status(200).json(result);
  });
});

app.get("/api/contacts", (req, res) => {
  db.query("SELECT * FROM contacts", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Gagal mengambil data kontak" });
    res.status(200).json(result);
  });
});

// ── Create ────────────────────────────────────────────────────────────────────
app.post("/api/create-creators", upload.single("image"), (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).json({ error: "Nama harus diisi" });

  const instagram = Number(req.body.followers_instagram) || 0;
  const tiktok = Number(req.body.followers_tiktok) || 0;
  const xFollowers = Number(req.body.followers_x) || 0;
  const urlIg = req.body.url_instagram || "";
  const urlTiktok = req.body.url_tiktok || "";
  const urlX = req.body.url_x || "";
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const roles = req.body.roles
    ? req.body.roles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
        .join(",")
    : "";

  const sql = `
    INSERT INTO creators
      (name, profile_image, followers_tiktok, followers_ig, followers_x, url_instagram, url_tiktok, url_x, roles)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, image, tiktok, instagram, xFollowers, urlIg, urlTiktok, urlX, roles],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting creator:", err);
        return res.status(500).json({ error: "Gagal menambahkan creator" });
      }
      res
        .status(201)
        .json({ message: "Creator berhasil ditambahkan", id: result.insertId });
    },
  );
});

app.post("/api/create-hainick-assets", upload.single("image"), (req, res) => {
  const imageType = req.body.image_type;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!imageType)
    return res.status(400).json({ error: "Tipe gambar harus diisi" });
  if (!image) return res.status(400).json({ error: "Gambar harus diunggah" });

  db.query(
    "INSERT INTO website_assets (image_type, image_url) VALUES (?, ?)",
    [imageType, image],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menambahkan hainick update" });
      res
        .status(201)
        .json({
          message: "Hainick update berhasil ditambahkan",
          imagetype: imageType,
          imageUrl: image,
        });
    },
  );
});

app.post(
  "/api/create-updates-section-image",
  upload.single("image"),
  (req, res) => {
    const imageType = req.body.image_type;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageType)
      return res.status(400).json({ error: "Tipe gambar harus diisi" });
    if (!image) return res.status(400).json({ error: "Gambar harus diunggah" });

    db.query(
      "INSERT INTO updates_section (image_type, image_url) VALUES (?, ?)",
      [imageType, image],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal menambahkan updates section" });
        res
          .status(201)
          .json({
            message: "Updates section berhasil ditambahkan",
            imagetype: imageType,
            imageUrl: image,
          });
      },
    );
  },
);

app.post("/api/create-updates-section-description", (req, res) => {
  const { description } = req.body;
  db.query(
    "INSERT INTO updates_section (description) VALUES (?)",
    [description],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menambahkan deskripsi updates section" });
      res
        .status(201)
        .json({
          message: "Deskripsi updates section berhasil ditambahkan",
          id: result.insertId,
        });
    },
  );
});

app.post("/api/create-testimonials", upload.single("image"), (req, res) => {
  const name = req.body.name;
  const testimonial = req.body.testimonial;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO testimonials (profile_image, testimonial, name) VALUES (?, ?, ?)",
    [image, testimonial, name],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Gagal menambahkan testimonial" });
      res
        .status(201)
        .json({
          message: "Testimonial berhasil ditambahkan",
          id: result.insertId,
        });
    },
  );
});

app.post("/api/create-role", (req, res) => {
  const { newRole } = req.body;

  db.query("SHOW COLUMNS FROM creators LIKE 'roles'", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Failed getting SET values" });

    const values = result[0].Type.replace("set(", "")
      .replace(")", "")
      .replaceAll("'", "")
      .split(",");

    if (values.includes(newRole))
      return res.json({ message: "Role already exists" });

    values.push(newRole);
    const updatedSet = values.map((v) => `'${v}'`).join(",");

    db.query(`ALTER TABLE creators MODIFY roles SET(${updatedSet})`, (err2) => {
      if (err2) return res.status(500).json({ error: "Failed updating SET" });
      res.json({ message: "Role added successfully" });
    });
  });
});

// ── Update ────────────────────────────────────────────────────────────────────

// FIX UTAMA: Semua field di-update dalam SATU query, bukan query terpisah
app.put("/api/update-creators/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;

  const name = req.body.name;
  const instagram = Number(req.body.followers_instagram) || 0;
  const tiktok = Number(req.body.followers_tiktok) || 0;
  const xFollowers = Number(req.body.followers_x) || 0;
  const urlIg = req.body.url_instagram || "";
  const urlTiktok = req.body.url_tiktok || "";
  const urlX = req.body.url_x || "";
  const roles = req.body.roles
    ? req.body.roles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
        .join(",")
    : "";

  // Bangun SET clause secara dinamis
  const fields = [];
  const values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }
  fields.push("followers_ig = ?");
  values.push(instagram);
  fields.push("followers_tiktok = ?");
  values.push(tiktok);
  fields.push("followers_x = ?");
  values.push(xFollowers);
  if (urlIg) {
    fields.push("url_instagram = ?");
    values.push(urlIg);
  }
  if (urlTiktok) {
    fields.push("url_tiktok = ?");
    values.push(urlTiktok);
  }
  if (urlX) {
    fields.push("url_x = ?");
    values.push(urlX);
  }
  if (roles) {
    fields.push("roles = ?");
    values.push(roles);
  }
  if (req.file) {
    fields.push("profile_image = ?");
    values.push(`/uploads/${req.file.filename}`);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Tidak ada data yang diperbarui" });
  }

  values.push(id);
  const sql = `UPDATE creators SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ Error updating creator:", err);
      return res.status(500).json({ error: "Gagal memperbarui creator" });
    }
    res.status(200).json({ message: "Creator berhasil diperbarui" });
  });
});

app.put("/api/remove-role/:id", (req, res) => {
  const id = req.params.id;
  const roleToRemove = req.body.role;

  db.query("SELECT roles FROM creators WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Gagal mengambil roles" });

    const roleArray = result[0].roles
      ? result[0].roles.split(",").filter((r) => r !== roleToRemove)
      : [];
    const updatedRoles = roleArray.join(",");

    db.query(
      "UPDATE creators SET roles = ? WHERE id = ?",
      [updatedRoles, id],
      (err2) => {
        if (err2)
          return res.status(500).json({ error: "Gagal menghapus role" });
        res.json({ message: "Role removed" });
      },
    );
  });
});

app.put(
  "/api/update-hainick-assets/:image_type",
  upload.single("image"),
  (req, res) => {
    const imageType = req.params.image_type;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) return res.status(400).json({ error: "Gambar harus diunggah" });

    db.query(
      "UPDATE website_assets SET image_url = ? WHERE image_type = ?",
      [image, imageType],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal memperbarui aset website" });
        res.status(200).json({ message: "Gambar website berhasil diperbarui" });
      },
    );
  },
);

app.put(
  "/api/update-updates-section-image/:image_type",
  upload.single("image"),
  (req, res) => {
    const imageType = req.params.image_type;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) return res.status(400).json({ error: "Gambar harus diunggah" });

    db.query(
      "UPDATE updates_section SET image_url = ? WHERE image_type = ?",
      [image, imageType],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal memperbarui gambar updates section" });
        res
          .status(200)
          .json({ message: "Gambar updates section berhasil diperbarui" });
      },
    );
  },
);

app.put("/api/update-updates-section-description", (req, res) => {
  const { description } = req.body;
  if (!description)
    return res.status(400).json({ error: "Deskripsi harus diisi" });

  db.query(
    "UPDATE updates_section SET description = ?",
    [description],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal memperbarui deskripsi updates section" });
      res
        .status(200)
        .json({ message: "Deskripsi updates section berhasil diperbarui" });
    },
  );
});

// FIX: update-testimonials juga digabung jadi satu query
app.put("/api/update-testimonials/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const testimonial = req.body.testimonial;

  const fields = [];
  const values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }
  if (testimonial) {
    fields.push("testimonial = ?");
    values.push(testimonial);
  }
  if (req.file) {
    fields.push("profile_image = ?");
    values.push(`/uploads/${req.file.filename}`);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Tidak ada data yang diperbarui" });
  }

  values.push(id);
  db.query(
    `UPDATE testimonials SET ${fields.join(", ")} WHERE id = ?`,
    values,
    (err) => {
      if (err)
        return res.status(500).json({ error: "Gagal memperbarui testimonial" });
      res.status(200).json({ message: "Testimonial berhasil diperbarui" });
    },
  );
});

// FIX: update-contacts juga digabung jadi satu query
app.put("/api/update-contacts", upload.single("logo"), (req, res) => {
  const { instagram, gmail, phone_number1, phone_number2 } = req.body;

  const fields = [];
  const values = [];

  if (req.file) {
    fields.push("logo = ?");
    values.push(`/uploads/${req.file.filename}`);
  }
  if (instagram) {
    fields.push("instagram = ?");
    values.push(instagram);
  }
  if (gmail) {
    fields.push("gmail = ?");
    values.push(gmail);
  }
  if (phone_number1) {
    fields.push("phone_number1 = ?");
    values.push(phone_number1);
  }
  if (phone_number2) {
    fields.push("phone_number2 = ?");
    values.push(phone_number2);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Tidak ada data yang diperbarui" });
  }

  db.query(`UPDATE contacts SET ${fields.join(", ")}`, values, (err) => {
    if (err) return res.status(500).json({ error: "Gagal memperbarui kontak" });
    res.status(200).json({ message: "Kontak berhasil diperbarui" });
  });
});

// ── Delete ────────────────────────────────────────────────────────────────────
app.delete("/api/delete-creators/:id", (req, res) => {
  db.query("DELETE FROM creators WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus creator" });
    res.status(200).json({ message: "Creator berhasil dihapus" });
  });
});

app.delete("/api/delete-hainick-assets/:image_type", (req, res) => {
  db.query(
    "DELETE FROM website_assets WHERE image_type = ?",
    [req.params.image_type],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menghapus hainick update" });
      res.status(200).json({ message: "Hainick update berhasil dihapus" });
    },
  );
});

app.delete("/api/delete-updates-section/:image_type", (req, res) => {
  db.query(
    "DELETE FROM updates_section WHERE image_type = ?",
    [req.params.image_type],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menghapus update section" });
      res.status(200).json({ message: "Update section berhasil dihapus" });
    },
  );
});

app.delete("/api/delete-updates-section-description", (req, res) => {
  db.query(
    "DELETE FROM updates_section WHERE description IS NOT NULL",
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menghapus deskripsi update section" });
      res
        .status(200)
        .json({ message: "Deskripsi update section berhasil dihapus" });
    },
  );
});

app.delete("/api/delete-testimonials/:id", (req, res) => {
  db.query("DELETE FROM testimonials WHERE id = ?", [req.params.id], (err) => {
    if (err)
      return res.status(500).json({ error: "Gagal menghapus testimonial" });
    res.status(200).json({ message: "Testimonial berhasil dihapus" });
  });
});

app.delete("/api/delete-contacts", (req, res) => {
  db.query("DELETE FROM contacts", (err) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus kontak" });
    res.status(200).json({ message: "Kontak berhasil dihapus" });
  });
});

app.listen(8000, () => {
  console.log("🚀 Server berjalan di http://localhost:8000");
});
