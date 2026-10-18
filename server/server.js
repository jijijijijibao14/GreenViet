require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret === 'replace_this_with_a_long_random_secret') {
  throw new Error('Set a unique JWT_SECRET in server/.env before starting the API.');
}

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '4mb' }));

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);
const passportSchema = new mongoose.Schema({
  displayName: { type: String, required: true, trim: true, maxlength: 40 },
  template: { type: Number, default: 0 },
  imageData: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  public: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
const reportSchema = new mongoose.Schema({
  name: String,
  email: String,
  type: { type: String, default: 'Liên hệ' },
  message: { type: String, required: true, maxlength: 1500 },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);
const Passport = mongoose.model('Passport', passportSchema);
const Report = mongoose.model('Report', reportSchema);

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Vui lòng đăng nhập.' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' });
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(png|jpe?g|webp)$/.test(file.mimetype)),
});

app.get('/api/health', (_req, res) => res.json({ message: 'GreenViet API đang hoạt động' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const body = req.body || {};
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ họ tên, email và mật khẩu.' });
    }
    if (name.length > 50)
      return res.status(400).json({ message: 'Họ tên không được vượt quá 50 ký tự.' });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ.' });
    }
    if (password.length < 8)
      return res.status(400).json({ message: 'Mật khẩu cần ít nhất 8 ký tự.' });
    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Mật khẩu không được vượt quá 72 byte.' });
    }
    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email đã được đăng ký.' });
    const user = await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
    });
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Email đã được đăng ký.' });
    console.error('Register failed:', e.message);
    res.status(500).json({ message: 'Không thể tạo tài khoản.' });
  }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const body = req.body || {};
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu chưa chính xác.' });
    }
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error('Login failed:', e.message);
    res.status(500).json({ message: 'Không thể đăng nhập.' });
  }
});
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email');
    if (!user) return res.status(401).json({ message: 'Tài khoản không còn tồn tại.' });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error('Session verification failed:', e.message);
    res.status(500).json({ message: 'Không thể xác minh phiên đăng nhập.' });
  }
});
app.get('/api/passports', async (_req, res) => {
  try {
    res.json(
      await Passport.find({ public: true })
        .sort({ createdAt: -1 })
        .limit(24)
        .select('displayName template createdAt'),
    );
  } catch (e) {
    res.status(500).json({ message: 'Không tải được sổ khách quý.', error: e.message });
  }
});
app.post('/api/passports', auth, async (req, res) => {
  try {
    const { displayName, template = 0, imageData = '', isPublic = true } = req.body;
    if (!displayName?.trim()) return res.status(400).json({ message: 'Hãy nhập tên hiển thị.' });
    if (imageData && !/^data:image\/(png|jpeg|jpg|webp);base64,/.test(imageData))
      return res.status(400).json({ message: 'Ảnh không hợp lệ.' });
    const item = await Passport.create({
      displayName: displayName.trim(),
      template: Number(template) || 0,
      imageData,
      userId: req.user.id,
      public: Boolean(isPublic),
    });
    res.status(201).json({
      message: 'Đã lưu hộ chiếu!',
      passport: { id: item._id, displayName: item.displayName },
    });
  } catch (e) {
    res.status(500).json({ message: 'Không thể lưu hộ chiếu.', error: e.message });
  }
});
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: 'Vui lòng chọn ảnh PNG, JPG hoặc WEBP tối đa 2 MB.' });
  res.json({
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    dataUrl: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
  });
});
app.post('/api/reports', async (req, res) => {
  try {
    const { name = '', email = '', type = 'Liên hệ', message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Vui lòng nhập nội dung.' });
    await Report.create({ name, email, type, message: message.trim() });
    res.status(201).json({ message: 'Cảm ơn bạn. Thông tin đã được gửi.' });
  } catch (e) {
    res.status(500).json({ message: 'Gửi thông tin thất bại.', error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenviet_sontra')
  .then(() =>
    app.listen(PORT, () => console.log(`GreenViet API chạy tại http://localhost:${PORT}`)),
  )
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
