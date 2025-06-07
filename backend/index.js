const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcrypt');
const app = express();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("'uploads' directory created.");
}

app.use(cors());
app.use(express.json());

const Admin = require('./models/Admin');
const adminRoutes = require('./routes/adminRoutes');
const skillsRouter = require('./routes/skills');
const projectRoutes = require('./routes/projects');
const experienceRoutes = require('./routes/experienceRoutes');
const contactRoutes = require('./routes/contacts');

app.use('/uploads', express.static(uploadsDir));

app.use('/api/admin', adminRoutes);
app.use('/api/skills', skillsRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/contacts', contactRoutes);



async function createDefaultAdmin() {
const defaultUsername = process.env.ADMIN_USERNAME;
const defaultPassword = process.env.ADMIN_PASSWORD;


  const existingAdmin = await Admin.findOne({ username: defaultUsername });
  if (existingAdmin) {
    console.log("Default admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const admin = new Admin({
    username: defaultUsername,
    password: hashedPassword,
  });

  await admin.save();
  console.log("Default admin created");
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected");
  createDefaultAdmin();
})
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
