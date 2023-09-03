const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(cors());

// npm i mongoose  express multer cors path 

const mongoUrl = 'mongodb://localhost:27017/Files'; 

const FileDetailsSchema = new mongoose.Schema(
  {
    originalname: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'filedetails',
  }
);

const FileDetails = mongoose.model('filedetails', FileDetailsSchema);

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((e) => console.log(e));

// Define the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route for handling file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { originalname, filename } = req.file;

    const file = new FileDetails({
      originalname,
      filename,
    });

    await file.save();

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Route for getting all files
app.get('/get-files', async (req, res) => {
  try {
    const files = await FileDetails.find({}, '-_id originalname filename uploadedAt'); // Exclude _id field
    res.json({ status: 'ok', data: files });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => {
  console.log('Server Started');
});
