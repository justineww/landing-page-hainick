const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ── Koneksi database ──────────────────────────────────────────────────────────
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

// ── Multer ────────────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ── Convert to .webp and delete original ─────────────────────────────────────
const convertToWebp = async (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const webpFilename =
    path.basename(normalizedPath, path.extname(normalizedPath)) + ".webp";
  const webpPath = path.join("public/uploads", webpFilename);
  const inputBuffer = fs.readFileSync(normalizedPath);
  await sharp(inputBuffer).webp({ quality: 80 }).toFile(webpPath);
  try {
    fs.unlinkSync(normalizedPath);
  } catch (err) {
    console.error("Failed to delete original file:", err.message);
  }
  return `/uploads/${webpFilename}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// LOAD (GET)
// ─────────────────────────────────────────────────────────────────────────────
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

app.get("/api/creators-photocard", (req, res) => {
  db.query(
    "SELECT * FROM creators_photocard ORDER BY id ASC",
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal mengambil data creators photocard" });
      res.status(200).json(result);
    },
  );
});

app.get("/api/creators-photocard-statistics", (req, res) => {
  db.query(
    "SELECT * FROM creators_photocard_statistics LIMIT 1",
    (err, result) => {
      if (err)
        return res.status(500).json({
          error: "Gagal mengambil data creators photocard statistics",
        });
      res.status(200).json(result);
    },
  );
});

app.get("/api/contact", (req, res) => {
  db.query("SELECT * FROM contact", (err, result) => {
    if (err)
      return res.status(500).json({ error: "Gagal mengambil data kontak" });
    res.status(200).json(result);
  });
});

// ── GET semua pesan dari contact_form ────────────────────────────────────────
app.get("/api/contact-form", (req, res) => {
  db.query("SELECT * FROM contact_form ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error("❌ Error fetch contact_form:", err);
      return res
        .status(500)
        .json({ error: "Gagal mengambil data contact form" });
    }
    res.status(200).json(result);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SEED — inisialisasi 20 row photocard + 1 row statistik (aman dipanggil ulang)
// ─────────────────────────────────────────────────────────────────────────────
app.post("/api/seed-creators-photocard", (req, res) => {
  const photoValues = Array.from({ length: 20 }, (_, i) => [i + 1, null]);
  const sqlPhoto = `INSERT IGNORE INTO creators_photocard (id, image_url) VALUES ?`;

  db.query(sqlPhoto, [photoValues], (err, resultPhoto) => {
    if (err) {
      console.error("❌ Seed creators_photocard gagal:", err);
      return res.status(500).json({
        error: "Gagal seed creators_photocard",
        detail: err.message,
      });
    }

    const sqlStats = `
      INSERT INTO creators_photocard_statistics (creators, brand, projects)
      SELECT '25', '100', '+78'
      WHERE NOT EXISTS (SELECT 1 FROM creators_photocard_statistics)
    `;

    db.query(sqlStats, (err2, resultStats) => {
      if (err2) {
        console.error("❌ Seed creators_photocard_statistics gagal:", err2);
        return res.status(500).json({
          error: "Gagal seed creators_photocard_statistics",
          detail: err2.message,
        });
      }

      return res.status(200).json({
        message: `Seed selesai! ${resultPhoto.affectedRows} row photocard dibuat, statistik: ${
          resultStats.affectedRows > 0
            ? "row default ditambahkan"
            : "sudah ada, dilewati"
        }.`,
        photocard_inserted: resultPhoto.affectedRows,
        stats_inserted: resultStats.affectedRows,
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE (POST)
// ─────────────────────────────────────────────────────────────────────────────

// ── Simpan pesan dari form kontak website ─────────────────────────────────────
app.post("/api/create-contact-form", (req, res) => {
  const { first_name, last_name, email, message } = req.body;

  if (!first_name || !String(first_name).trim())
    return res.status(400).json({ error: "First name harus diisi" });
  if (!last_name || !String(last_name).trim())
    return res.status(400).json({ error: "Last name harus diisi" });
  if (!email || !String(email).trim())
    return res.status(400).json({ error: "Email harus diisi" });
  if (!message || !String(message).trim())
    return res.status(400).json({ error: "Pesan harus diisi" });

  const sql = `
    INSERT INTO contact_form (first_name, last_name, email, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      String(first_name).trim(),
      String(last_name).trim(),
      String(email).trim(),
      String(message).trim(),
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error insert contact_form:", err);
        return res.status(500).json({ error: "Gagal menyimpan pesan" });
      }
      res.status(201).json({
        message: "Pesan berhasil dikirim!",
        id: result.insertId,
      });
    },
  );
});

app.post("/api/create-creators", upload.single("image"), async (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).json({ error: "Nama harus diisi" });

  const instagram = Number(req.body.followers_instagram) || 0;
  const tiktok = Number(req.body.followers_tiktok) || 0;
  const xFollowers = Number(req.body.followers_x) || 0;
  const urlIg = req.body.url_instagram || "";
  const urlTiktok = req.body.url_tiktok || "";
  const urlX = req.body.url_x || "";

  let image = null;
  if (req.file) image = await convertToWebp(req.file.path);

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

app.post(
  "/api/create-hainick-assets",
  upload.single("image"),
  async (req, res) => {
    const imageType = req.body.image_type;
    if (!imageType)
      return res.status(400).json({ error: "Tipe gambar harus diisi" });
    if (!req.file)
      return res.status(400).json({ error: "Gambar harus diunggah" });

    const image = await convertToWebp(req.file.path);
    db.query(
      "INSERT INTO website_assets (image_type, image_url) VALUES (?, ?)",
      [imageType, image],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal menambahkan hainick update" });
        res.status(201).json({
          message: "Hainick update berhasil ditambahkan",
          imagetype: imageType,
          imageUrl: image,
        });
      },
    );
  },
);

app.post(
  "/api/create-updates-section-image",
  upload.single("image"),
  async (req, res) => {
    const imageType = req.body.image_type;
    const description = req.body.description || null;
    const isActive =
      req.body.is_active !== undefined ? Number(req.body.is_active) : 0;

    if (!imageType)
      return res.status(400).json({ error: "Tipe gambar harus diisi" });
    if (!req.file)
      return res.status(400).json({ error: "Gambar harus diunggah" });

    const image = await convertToWebp(req.file.path);
    db.query(
      "INSERT INTO updates_section (image_type, image_url, description, is_active) VALUES (?, ?, ?, ?)",
      [imageType, image, description, isActive],
      (err, result) => {
        if (err) {
          console.error("❌ Error insert updates_section:", err);
          return res.status(500).json({
            error: "Gagal menambahkan updates section",
            detail: err.message,
          });
        }
        res.status(201).json({
          message: "Updates section berhasil ditambahkan",
          id: result.insertId,
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
      res.status(201).json({
        message: "Deskripsi updates section berhasil ditambahkan",
        id: result.insertId,
      });
    },
  );
});

app.post(
  "/api/create-testimonials",
  upload.single("image"),
  async (req, res) => {
    const name = req.body.name;
    const testimonial = req.body.testimonial;

    let image = null;
    if (req.file) image = await convertToWebp(req.file.path);

    db.query(
      "INSERT INTO testimonials (profile_image, testimonial, name) VALUES (?, ?, ?)",
      [image, testimonial, name],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal menambahkan testimonial" });
        res.status(201).json({
          message: "Testimonial berhasil ditambahkan",
          id: result.insertId,
        });
      },
    );
  },
);

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

app.post(
  "/api/create-creators-photocard",
  upload.single("image"),
  async (req, res) => {
    let image = null;
    if (req.file) image = await convertToWebp(req.file.path);

    db.query(
      "INSERT INTO creators_photocard (image_url) VALUES (?)",
      [image],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal menambahkan creators photocard" });
        res.status(201).json({
          message: "Creators photocard berhasil ditambahkan",
          id: result.insertId,
        });
      },
    );
  },
);

app.post("/api/create-creators-photocard-statistics", (req, res) => {
  const { creators, brand, projects } = req.body;
  db.query(
    "INSERT INTO creators_photocard_statistics (creators, brand, projects) VALUES (?, ?, ?)",
    [creators, brand, projects],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menambahkan creators photocard statistics" });
      res.status(201).json({
        message: "Creators photocard statistics berhasil ditambahkan",
        id: result.insertId,
      });
    },
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE (PUT)
// ─────────────────────────────────────────────────────────────────────────────
app.put(
  "/api/update-creators/:id",
  upload.single("image"),
  async (req, res) => {
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
      const profileImage = await convertToWebp(req.file.path);
      fields.push("profile_image = ?");
      values.push(profileImage);
    }

    if (fields.length === 0)
      return res.status(400).json({ error: "Tidak ada data yang diperbarui" });

    values.push(id);
    db.query(
      `UPDATE creators SET ${fields.join(", ")} WHERE id = ?`,
      values,
      (err) => {
        if (err) {
          console.error("❌ Error updating creator:", err);
          return res.status(500).json({ error: "Gagal memperbarui creator" });
        }
        res.status(200).json({ message: "Creator berhasil diperbarui" });
      },
    );
  },
);

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
  async (req, res) => {
    const imageType = req.params.image_type;
    if (!req.file)
      return res.status(400).json({ error: "Gambar harus diunggah" });

    const image = await convertToWebp(req.file.path);
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
  "/api/update-updates-section-image-by-id/:id",
  upload.single("image"),
  async (req, res) => {
    const id = req.params.id;
    if (!req.file)
      return res.status(400).json({ error: "Gambar harus diunggah" });

    const image = await convertToWebp(req.file.path);
    db.query(
      "UPDATE updates_section SET image_url = ? WHERE id = ?",
      [image, id],
      (err) => {
        if (err) {
          console.error("❌ Error update image by id:", err);
          return res
            .status(500)
            .json({ error: "Gagal memperbarui gambar updates section" });
        }
        res.status(200).json({
          message: "Gambar updates section berhasil diperbarui",
          imageUrl: image,
        });
      },
    );
  },
);

app.put(
  "/api/update-updates-section-image/:image_type",
  upload.single("image"),
  async (req, res) => {
    const imageType = req.params.image_type;
    if (!req.file)
      return res.status(400).json({ error: "Gambar harus diunggah" });

    const image = await convertToWebp(req.file.path);
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
  const { description, image_type, id } = req.body;
  if (!description)
    return res.status(400).json({ error: "Deskripsi harus diisi" });

  if (id) {
    db.query(
      "UPDATE updates_section SET description = ? WHERE id = ?",
      [description, id],
      (err) => {
        if (err) {
          console.error("❌ Error update description by id:", err);
          return res
            .status(500)
            .json({ error: "Gagal memperbarui deskripsi updates section" });
        }
        res
          .status(200)
          .json({ message: "Deskripsi updates section berhasil diperbarui" });
      },
    );
  } else if (image_type) {
    db.query(
      "UPDATE updates_section SET description = ? WHERE image_type = ?",
      [description, image_type],
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
  } else {
    return res.status(400).json({ error: "ID atau image_type harus diisi" });
  }
});

app.put("/api/update-updates-section-status/:id", (req, res) => {
  const id = req.params.id;
  const { is_active, image_type } = req.body;

  if (is_active === undefined || is_active === null)
    return res.status(400).json({ error: "is_active harus diisi" });

  db.query(
    "UPDATE updates_section SET is_active = ?, image_type = ? WHERE id = ?",
    [Number(is_active), image_type ?? null, id],
    (err) => {
      if (err) {
        console.error("❌ Error update status:", err);
        return res
          .status(500)
          .json({ error: "Gagal memperbarui status updates section" });
      }
      res
        .status(200)
        .json({ message: "Status updates section berhasil diperbarui" });
    },
  );
});

app.put(
  "/api/update-testimonials/:id",
  upload.single("image"),
  async (req, res) => {
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
      const profileImage = await convertToWebp(req.file.path);
      fields.push("profile_image = ?");
      values.push(profileImage);
    }

    if (fields.length === 0)
      return res.status(400).json({ error: "Tidak ada data yang diperbarui" });

    values.push(id);
    db.query(
      `UPDATE testimonials SET ${fields.join(", ")} WHERE id = ?`,
      values,
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal memperbarui testimonial" });
        res.status(200).json({ message: "Testimonial berhasil diperbarui" });
      },
    );
  },
);

app.put(
  "/api/update-creators-photocard/:id",
  upload.single("image"),
  async (req, res) => {
    const id = req.params.id;

    if (!req.file)
      return res.status(400).json({ error: "Gambar harus diunggah" });

    const image = await convertToWebp(req.file.path);

    db.query(
      "UPDATE creators_photocard SET image_url = ? WHERE id = ?",
      [image, id],
      (err, result) => {
        if (err) {
          console.error("❌ Error update creators photocard:", err);
          return res
            .status(500)
            .json({ error: "Gagal memperbarui creators photocard" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            error: `Row id=${id} tidak ditemukan di creators_photocard. Jalankan seed terlebih dahulu.`,
          });
        }
        res.status(200).json({
          message: "Creators photocard berhasil diperbarui",
          imageUrl: image,
        });
      },
    );
  },
);

app.put("/api/update-creators-photocard-statistics", (req, res) => {
  const { creators, brand, projects } = req.body;

  if (creators === undefined && brand === undefined && projects === undefined)
    return res.status(400).json({ error: "Tidak ada data yang dikirim" });

  const fields = [];
  const values = [];
  if (creators !== null && creators !== undefined) {
    fields.push("creators = ?");
    values.push(creators);
  }
  if (brand !== null && brand !== undefined) {
    fields.push("brand = ?");
    values.push(brand);
  }
  if (projects !== null && projects !== undefined) {
    fields.push("projects = ?");
    values.push(projects);
  }

  db.query(
    `UPDATE creators_photocard_statistics SET ${fields.join(", ")}`,
    values,
    (err, result) => {
      if (err) {
        console.error("❌ Error update statistik:", err);
        return res
          .status(500)
          .json({ error: "Gagal memperbarui creators photocard statistics" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          error:
            "Tidak ada row di creators_photocard_statistics. Jalankan seed terlebih dahulu.",
        });
      }
      res
        .status(200)
        .json({ message: "Creators photocard statistics berhasil diperbarui" });
    },
  );
});

app.put("/api/update-contact", upload.single("logo"), async (req, res) => {
  const { instagram, gmail, phone_number1, phone_number2 } = req.body;
  const fields = [];
  const values = [];

  if (req.file) {
    const logo = await convertToWebp(req.file.path);
    fields.push("logo = ?");
    values.push(logo);
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

  if (fields.length === 0)
    return res.status(400).json({ error: "Tidak ada data yang diperbarui" });

  db.query(`UPDATE contact SET ${fields.join(", ")}`, values, (err) => {
    if (err) return res.status(500).json({ error: "Gagal memperbarui kontak" });
    res.status(200).json({ message: "Kontak berhasil diperbarui" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────────────────────
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

app.delete("/api/delete-updates-section/:id", (req, res) => {
  db.query(
    "DELETE FROM updates_section WHERE id = ?",
    [req.params.id],
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

app.delete("/api/delete-creators-photocard/:id", (req, res) => {
  db.query(
    "DELETE FROM creators_photocard WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menghapus creators photocard" });
      res.status(200).json({ message: "Creators photocard berhasil dihapus" });
    },
  );
});

app.delete("/api/delete-creators-photocard-statistics", (req, res) => {
  db.query("DELETE FROM creators_photocard_statistics", (err) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Gagal menghapus creators photocard statistics" });
    res
      .status(200)
      .json({ message: "Creators photocard statistics berhasil dihapus" });
  });
});

app.delete("/api/delete-contact", (req, res) => {
  db.query("DELETE FROM contact", (err) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus kontak" });
    res.status(200).json({ message: "Kontak berhasil dihapus" });
  });
});

// ── Hapus satu pesan dari contact_form ───────────────────────────────────────
app.delete("/api/delete-contact-form/:id", (req, res) => {
  db.query(
    "DELETE FROM contact_form WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        console.error("❌ Error delete contact_form:", err);
        return res.status(500).json({ error: "Gagal menghapus pesan" });
      }
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Pesan tidak ditemukan" });
      res.status(200).json({ message: "Pesan berhasil dihapus" });
    },
  );
});

// ─────────────────────────────────────────────────────────────────────────────
app.listen(8000, () => {
  console.log("🚀 Server berjalan di http://localhost:8000");
});
