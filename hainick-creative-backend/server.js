const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { log } = require("console");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// TAMBAHAN: Membuat folder uploads bisa diakses oleh React untuk menampilkan gambar
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Konfigurasi koneksi ke database
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

// TAMBAHAN: Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });






// Load Functions
app.get("/api/creators", (req, res) => {
  const sql = 'SELECT * FROM creators';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching creators:", err);
      return res.status(500).json({ error: "Gagal mengambil data creator" });
    }
    res.status(200).json(result);
  });
});

app.get("/api/hainick-assets", (req, res) => {
  const sql = 'SELECT * FROM website_assets';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching hainick update:", err);
      return res.status(500).json({ error: "Gagal mengambil data hainick update" });
    }
    res.status(200).json(result);
  });
});

app.get("/api/updates-section", (req, res) => {
  const sql = 'SELECT * FROM updates_section';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching updates section:", err);
      return res.status(500).json({ error: "Gagal mengambil data updates section" });
    }
    res.status(200).json(result);
  });
});

app.get("/api/testimonials", (req, res) => {
  const sql = 'SELECT * FROM testimonials';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching testimonials:", err);
      return res.status(500).json({ error: "Gagal mengambil data testimoni" });
    }
    res.status(200).json(result);
  });
});

app.get("/api/contacts", (req, res) => {
  const sql = 'SELECT * FROM contacts';
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error fetching contacts:", err);
      return res.status(500).json({ error: "Gagal mengambil data kontak" });
    }
    res.status(200).json(result);
  });
});






// Create Functions
app.post("/api/create-creators", upload.single("image"), (req, res) => {

  const name = req.body.name;

  const instagram = Number(req.body.followers_instagram) || 0;
  const tiktok = Number(req.body.followers_tiktok) || 0;
  const xFollowers = Number(req.body.followers_x) || 0;

  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const roles = req.body.roles ? req.body.roles.split(",").map(role => role.trim()) : [];

  const sql = "INSERT INTO creators (name, profile_image, followers_tiktok, followers_ig, followers_x, roles) VALUES (?, ?, ?, ?, ?, ?)";

  
  db.query(sql, [name, image, tiktok, instagram, xFollowers, roles.join(",")], (err, result) => {
    if (err) {
      console.error("❌ Error inserting creator:", err);
      return res.status(500).json({ error: "Gagal menambahkan creator" });
    }


    res.status(201).json({ message: "Creator berhasil ditambahkan", id: result.insertId });
  });
});


app.post("/api/create-hainick-assets", upload.single("image"), (req, res) => {

  const imageType = req.body.image_type;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO website_assets (image_type, image_url) VALUES (?, ?)";

  db.query(sql, [imageType, image], (err, result) => {
    if (err) {
      console.error("❌ Error inserting hainick update:", err);
      return res.status(500).json({ error: "Gagal menambahkan hainick update" });
    }

    if(imageType === null || imageType === undefined){
      return res.status(400).json({ error: "Tipe gambar harus diisi" });
    } else if (!image) {
      return res.status(400).json({ error: "Gambar harus diunggah" });
    }

    res.status(201).json({ message: "Hainick update berhasil ditambahkan", imagetype: imageType, imageUrl: image });
  });
});

app.post("/api/create-updates-section-image", upload.single("image"), (req, res) => {

  const imageType = req.body.image_type;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO updates_section (image_type, image_url) VALUES (?, ?)";

  db.query(sql, [imageType, image], (err, result) => {
    if (err) {
      console.error("❌ Error inserting updates section:", err);
      return res.status(500).json({ error: "Gagal menambahkan updates section" });
    }

    if(imageType === null || imageType === undefined){
      return res.status(400).json({ error: "Tipe gambar harus diisi" });
    } else if (!image) {
      return res.status(400).json({ error: "Gambar harus diunggah" });
    }

    res.status(201).json({ message: "Updates section berhasil ditambahkan", imagetype: imageType, imageUrl: image });
  });
});

app.post("/api/create-updates-section-description", (req, res) => {
  const description = req.body.description;

  const sql = "INSERT INTO updates_section (description) VALUES (?)";
  db.query(sql, [description], (err, result) => {
    if (err) {
      console.error("❌ Error inserting updates section description:", err);
      return res.status(500).json({ error: "Gagal menambahkan deskripsi updates section" });
    }
    res.status(201).json({ message: "Deskripsi updates section berhasil ditambahkan", id: result.insertId });
  });
});


app.post("/api/create-testimonials", upload.single("image"), (req, res) => {

  const id = req.params.id;
  const name = req.body.name;
  const testimonial = req.body.testimonial;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO testimonials (id, profile_image, testimonial, name) VALUES (?, ?, ?, ?)";
  db.query(sql, [id, image, testimonial, name], (err, result) => {
    if (err) {
      console.error("❌ Error inserting testimonial:", err);
      return res.status(500).json({ error: "Gagal menambahkan testimonial" });
    }
    res.status(201).json({ message: "Testimonial berhasil ditambahkan", id: result.insertId });
  });
});

  app.post("/api/create-role", (req,res)=>{

  const newRole = req.body.newRole;

  const sql = `
    SHOW COLUMNS
    FROM creators
    LIKE 'roles'
  `;


  db.query(sql,(err,result)=>{

    if(err){

      console.error(err);

      return res.status(500).json({

        error:"Failed getting SET values"

      });

    }

    const setString =
      result[0].Type;


    const values = setString
      .replace("set(","")
      .replace(")","")
      .replaceAll("'","")
      .split(",");


    if(values.includes(newRole)){

      return res.json({

        message:"Role already exists"

      });

    }


    values.push(newRole);


    const updatedSet = values

      .map(v => `'${v}'`)
      .join(",");


    const alterSQL = `

      ALTER TABLE creators

      MODIFY roles

      SET(${updatedSet})

    `;



    db.query(alterSQL,(err2,result2)=>{

      if(err2){

        console.error(err2);

        return res.status(500).json({

          error:"Failed updating SET"

        });

      }

      res.json({
        message:"Role added successfully"
      });
    });
  });
});







// Update Functions
app.put("/api/update-creators/:id", upload.single("image"), (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const instagram = Number(req.body.followers_instagram) || 0;
  const tiktok = Number(req.body.followers_tiktok) || 0;
  const xFollowers = Number(req.body.followers_x) || 0;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const roles = req.body.roles ? req.body.roles.split(",").map(role => role.trim()) : [];

  if(id === null || id === undefined){
    return res.status(400).json({ error: "ID harus ada" });
  }
  if(name !== null){
    const sql = "UPDATE creators SET name = ? WHERE id = ?"
    db.query(sql, [name, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating creator name:", err);
        return res.status(500).json({ error: "Gagal memperbarui nama creator" });
      }
      res.status(200).json({ message: "Nama creator berhasil diperbarui" });
    });
  } if(instagram !== null){
    const sql = "UPDATE creators SET followers_ig = ? WHERE id = ?"
    db.query(sql, [instagram, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating creator Instagram followers:", err);
        return res.status(500).json({ error: "Gagal memperbarui followers Instagram creator" });
      }
      res.status(200).json({ message: "Followers Instagram creator berhasil diperbarui" });
    });
  } if(tiktok !== null){
    const sql = "UPDATE creators SET followers_tiktok = ? WHERE id = ?"
    db.query(sql, [tiktok, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating creator TikTok followers:", err);
        return res.status(500).json({ error: "Gagal memperbarui followers TikTok creator" });
      }
      res.status(200).json({ message: "Followers TikTok creator berhasil diperbarui" });
    });

  } if(xFollowers !== null){
    const sql = "UPDATE creators SET followers_x = ? WHERE id = ?"
    db.query(sql, [xFollowers, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating creator X followers:", err);
        return res.status(500).json({ error: "Gagal memperbarui followers X creator" });
      }
      res.status(200).json({ message: "Followers X creator berhasil diperbarui" });
    });

  } if(image !== null){
    const sql = "UPDATE creators SET profile_image = ? WHERE id = ?"
    db.query(sql, [image, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating creator profile image:", err);
        return res.status(500).json({ error: "Gagal memperbarui gambar profil creator" });
      }
      res.status(200).json({ message: "Gambar profil creator berhasil diperbarui" });
    })
  }
    if(roles.length > 0){

      const newRole =
        req.body.role;


      const getSQL = `
        SELECT roles
        FROM creators
        WHERE id = ?
      `;



      db.query(getSQL,[id],(err,result)=>{

        if(err){
          return res.json(err);
        }


        let roleArray =
          result[0].roles
          ? result[0].roles.split(",")
          : [];


        if(roleArray.includes(newRole)){

          return res.json({

            message:"Role already exists"

          });

        }


        roleArray.push(newRole);



        const updatedRoles =
          roleArray.join(",");


        const updateSQL = `
          UPDATE creators
          SET roles = ?
          WHERE id = ?
        `;

        db.query(

          updateSQL,

          [updatedRoles,id],

          (err2,result2)=>{

            if(err2){
              return res.json(err2);
            }

            res.json({

              message:"Role added"

            });

          }

        );

      });
}
});


app.put("/api/remove-role/:id",(req,res)=>{

  const id = req.params.id;

  const roleToRemove =
    req.body.role;


  const getSQL = `
    SELECT roles
    FROM creators
    WHERE id = ?
  `;



  db.query(getSQL,[id],(err,result)=>{

    if(err){
      return res.json(err);
    }



    const currentRoles =
      result[0].roles;



    let roleArray =
      currentRoles.split(",");



    roleArray =
      roleArray.filter(

        role => role !== roleToRemove

      );


    const updatedRoles =
      roleArray.join(",");


    const updateSQL = `
      UPDATE creators
      SET roles = ?
      WHERE id = ?
    `;



    db.query(

      updateSQL,

      [updatedRoles,id],

      (err2,result2)=>{

        if(err2){
          return res.json(err2);
        }

        res.json({

          message:"Role removed"

        });

      }

    );

  });

});


app.put("/api/update-hainick-assets/:image_type", upload.single("image"), (req, res) => {

  const imageType = req.params.image_type;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if(imageType !== null || image !== null){
    const sql = "UPDATE website_assets SET image_url= ? WHERE image_type = ?"
    db.query(sql, [image, imageType], (err, result) => {
      if (err) {
        console.error("❌ Error updating website asset:", err);
        return res.status(500).json({ error: "Gagal memperbarui aset website" });
      }
      res.status(200).json({ message: "Gambar website berhasil diperbarui" });
    });
  }
});


app.put("/api/update-updates-section-image/:image_type", upload.single("image"), (req, res) => {

  const imageType = req.params.image_type;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if(imageType !== null || image !== null){
    const sql = "UPDATE updates_section SET image_url= ? WHERE image_type = ?"
    db.query(sql, [image, imageType], (err, result) => {
      if (err) {
        console.error("❌ Error updating updates section image:", err);
        return res.status(500).json({ error: "Gagal memperbarui gambar updates section" });
      }
      res.status(200).json({ message: "Gambar updates section berhasil diperbarui" });
    });
  }
});

app.put("/api/update-updates-section-description", (req, res) => {
  const description = req.body.description;

  if(description !== null){
    const sql = "UPDATE updates_section SET description= ?"
    db.query(sql, [description], (err, result) => {
      if (err) {
        console.error("❌ Error updating updates section description:", err);
        return res.status(500).json({ error: "Gagal memperbarui deskripsi updates section" });
      }
      res.status(200).json({ message: "Deskripsi updates section berhasil diperbarui" });
    });
  }
});

app.put("/api/update-testimonials/:id", upload.single("image"), (req, res) => {

  const id = req.params.id;
  const name = req.body.name;
  const testimonial = req.body.testimonial;
  const image = req.file ? `/uploads/${req.file.filename}` : null;


  if(name !== null){
    const sql = "UPDATE testimonials SET name = ? WHERE id = ?"
    db.query(sql, [name, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating testimonial name:", err);
        return res.status(500).json({ error: "Gagal memperbarui nama testimonial" });
      }
      res.status(200).json({ message: "Nama testimonial berhasil diperbarui" });
    });
  }
  if(testimonial !== null){
    const sql = "UPDATE testimonials SET testimonial = ? WHERE id = ?"
    db.query(sql, [testimonial, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating testimonial content:", err);
        return res.status(500).json({ error: "Gagal memperbarui isi testimonial" });
      }
      res.status(200).json({ message: "Isi testimonial berhasil diperbarui" });
    });
  }
  if(image !== null){
    const sql = "UPDATE testimonials SET image = ? WHERE id = ?"
    db.query(sql, [image, id], (err, result) => {
      if (err) {
        console.error("❌ Error updating testimonial image:", err);
        return res.status(500).json({ error: "Gagal memperbarui gambar testimonial" });
      }
      res.status(200).json({ message: "Gambar testimonial berhasil diperbarui" });
    });
  }
});

app.put("/api/update-contacts", (req, res) => {
  const logo = req.file ? `/uploads/${req.file.filename}` : null;
  const instagram = req.body.instagram;
  const gmail = req.body.gmail;
  const phone_number1 = req.body.phone_number1;
  const phone_number2 = req.body.phone_number2;

  if(logo !== null){
    const sql = "UPDATE contacts SET logo = ?"
    db.query(sql, [logo], (err, result) => {
      if (err) {
        console.error("❌ Error updating contact logo:", err);
        return res.status(500).json({ error: "Gagal memperbarui logo kontak" });
      }
      res.status(200).json({ message: "Logo kontak berhasil diperbarui" });
    });
  }
  if(instagram !== null){
    const sql = "UPDATE contacts SET instagram = ?"
    db.query(sql, [instagram], (err, result) => {
      if (err) {
        console.error("❌ Error updating contact instagram:", err);
        return res.status(500).json({ error: "Gagal memperbarui instagram kontak" });
      }
      res.status(200).json({ message: "Instagram kontak berhasil diperbarui" });
    });
  }
  if(gmail !== null){
    const sql = "UPDATE contacts SET gmail = ?"
    db.query(sql, [gmail], (err, result) => {
      if (err) {
        console.error("❌ Error updating contact gmail:", err);
        return res.status(500).json({ error: "Gagal memperbarui gmail kontak" });
      }
      res.status(200).json({ message: "Gmail kontak berhasil diperbarui" });
    });
  }
  if(phone_number1 !== null){
    const sql = "UPDATE contacts SET phone_number1 = ?"
    db.query(sql, [phone_number1], (err, result) => {
      if (err) {
        console.error("❌ Error updating contact phone number 1:", err);
        return res.status(500).json({ error: "Gagal memperbarui nomor telepon 1 kontak" });
      }
      res.status(200).json({ message: "Nomor telepon 1 kontak berhasil diperbarui" });
    });
  }
  if(phone_number2 !== null){
    const sql = "UPDATE contacts SET phone_number2 = ?"
    db.query(sql, [phone_number2], (err, result) => {
      if (err) {
        console.error("❌ Error updating contact phone number 2:", err);
        return res.status(500).json({ error: "Gagal memperbarui nomor telepon 2 kontak" });
      }
      res.status(200).json({ message: "Nomor telepon 2 kontak berhasil diperbarui" });
    });
  }
});






// Delete Function
app.delete("/api/delete-creators/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM creators WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting creator:", err);
      return res.status(500).json({ error: "Gagal menghapus creator" });
    }
    res.status(200).json({ message: "Creator berhasil dihapus" });
  });
});

app.delete("/api/delete-hainick-assets/:image_type", (req, res) => {
  const imageType = req.params.image_type;
  const sql = "DELETE FROM website_assets WHERE image_type = ?";
  db.query(sql, [imageType], (err, result) => {
    if (err) {
      console.error("❌ Error deleting hainick update:", err);
      return res.status(500).json({ error: "Gagal menghapus hainick update" });
    }
    res.status(200).json({ message: "Hainick update berhasil dihapus" });
  });
});

app.delete("/api/delete-updates-section/:image_type", (req, res) => {
  const imageType = req.params.image_type;
  const sql = "DELETE FROM updates_section WHERE image_type = ?";
  db.query(sql, [imageType], (err, result) => {
    if (err) {
      console.error("❌ Error deleting update section:", err);
      return res.status(500).json({ error: "Gagal menghapus update section" });
    }
    res.status(200).json({ message: "Update section berhasil dihapus" });
  });
});

app.delete("/api/delete-updates-section-description", (req, res) => {
  const sql = "DELETE FROM updates_section WHERE description IS NOT NULL";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error deleting update section description:", err);
      return res.status(500).json({ error: "Gagal menghapus deskripsi update section" });
    }
    res.status(200).json({ message: "Deskripsi update section berhasil dihapus" });
  });
});

app.delete("/api/delete-testimonials/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM testimonials WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting testimonial:", err);
      return res.status(500).json({ error: "Gagal menghapus testimonial" });
    }
    res.status(200).json({ message: "Testimonial berhasil dihapus" });
  });
});

app.delete("/api/delete-contacts", (req, res) => {
  const sql = "DELETE FROM contacts";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error deleting contact:", err);
      return res.status(500).json({ error: "Gagal menghapus kontak" });
    }
    res.status(200).json({ message: "Kontak berhasil dihapus" });
  });
});


app.listen(3000, () => {
  console.log("🚀 Server berjalan di http://localhost:3000");
});