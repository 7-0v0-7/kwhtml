// ------------------- 扩展 API：第三方设备集成 -------------------

// 1. 绑定手环/设备
app.post('/api/device/bind', async (req, res) => {
  try {
    const { userId, deviceName, accessToken } = req.body;
    const device = new Device({
      userId, deviceName, accessToken, isBound: true
    });
    await device.save();
    res.json({ success: true, message: '设备绑定成功', device });
  } catch (err) {
    res.status(400).json({ success: false, message: '绑定失败：' + err.message });
  }
});

// 2. 获取用户绑定的设备
app.get('/api/device/my-device/:userId', async (req, res) => {
  try {
    const device = await Device.findOne({ userId: req.params.userId, isBound: true });
    res.json({ success: true, device });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// 3. 模拟从手环 API 获取数据（可替换为真实小米/华为/苹果健康接口）
app.get('/api/device/sync/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // ===================== 【模拟第三方手环 API 返回数据】 =====================
    // 真实环境：替换成 axios 请求小米/华为/Keep 官方接口
    const mockDeviceData = {
      steps: Math.floor(Math.random() * 10000) + 3000,
      heartRate: Math.floor(Math.random() * 40) + 60,
      sleepHours: (Math.random() * 4 + 4).toFixed(1),
      calories: Math.floor(Math.random() * 500 + 1000),
      bloodOxygen: Math.floor(Math.random() * 5 + 95)
    };

    // 保存到同步记录
    const syncData = new DeviceHealth({
      userId,
      deviceType: '手环',
      ...mockDeviceData,
      rawData: mockDeviceData
    });
    await syncData.save();

    res.json({
      success: true,
      message: '同步成功',
      data: syncData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '同步失败：' + err.message });
  }
});

// 4. 获取设备同步历史
app.get('/api/device/sync-history/:userId', async (req, res) => {
  try {
    const history = await DeviceHealth.find({ userId: req.params.userId }).sort({ syncTime: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});