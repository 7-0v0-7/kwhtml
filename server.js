require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 托管前端静态文件

// 连接MongoDB数据库
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err));

// 1. 用户模型
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// 密码加密（保存前）
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 验证密码方法
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

// 2. 健康数据模型
const HealthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: { type: Number }, // 体重(kg)
  bloodPressure: { type: String }, // 血压(如"120/80")
  steps: { type: Number }, // 步数
  calories: { type: Number }, // 卡路里消耗
  notes: { type: String } // 健康备注
});

const HealthData = mongoose.model('HealthData', HealthDataSchema);

// ------------------- API接口 -------------------
// 1. 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ success: true, message: '注册成功' });
  } catch (err) {
    res.status(400).json({ success: false, message: '注册失败：' + err.message });
  }
});

// 2. 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: '用户不存在' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: '密码错误' });
    
    // 生成JWT令牌
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: '登录失败：' + err.message });
  }
});

// 3. 添加健康数据
app.post('/api/health-data', async (req, res) => {
  try {
    const { userId, weight, bloodPressure, steps, calories, notes } = req.body;
    const healthData = new HealthData({
      userId,
      weight,
      bloodPressure,
      steps,
      calories,
      notes
    });
    await healthData.save();
    res.status(201).json({ success: true, data: healthData });
  } catch (err) {
    res.status(400).json({ success: false, message: '添加失败：' + err.message });
  }
});

// 4. 获取用户健康数据
app.get('/api/health-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const healthData = await HealthData.find({ userId }).sort({ date: -1 });
    res.json({ success: true, data: healthData });
  } catch (err) {
    res.status(500).json({ success: false, message: '获取失败：' + err.message });
  }
});

// 5. 删除健康数据
app.delete('/api/health-data/:id', async (req, res) => {
  try {
    await HealthData.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '删除失败：' + err.message });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
// -------------------------- 新增：设备绑定模型 --------------------------
const DeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceType: { type: String, default: '手环' }, // 手环/手表/体脂秤
  deviceName: { type: String, default: '小米手环' },
  accessToken: { type: String }, // 设备授权令牌
  isBound: { type: Boolean, default: true },
  bindTime: { type: Date, default: Date.now }
});
const Device = mongoose.model('Device', DeviceSchema);

// -------------------------- 新增：设备同步健康数据模型 --------------------------
const DeviceHealthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceType: { type: String },
  syncTime: { type: Date, default: Date.now },
  steps: { type: Number },       // 步数
  heartRate: { type: Number },  // 心率
  sleepHours: { type: Number }, // 睡眠时长(小时)
  calories: { type: Number },   // 卡路里
  bloodOxygen: { type: Number },// 血氧
  rawData: { type: Object }     // 原始设备数据
});
const DeviceHealth = mongoose.model('DeviceHealth', DeviceHealthSchema);
//如何接入真实手环 API（小米 / 华为 / Keep）
//你只需要修改 server.js 里的模拟接口：
//示例：接入小米运动健康开放平台
//javascript
//运行
//const axios = require('axios');
//app.get('/api/device/sync/:userId', async (req, res) => {
 // const { userId } = req.params;
  // 真实小米 API
  //const result = await axios.get('https://open.mi.com/health/step', {
    params: { access_token: 用户的小米token }
  //});
  // 保存并返回
//});