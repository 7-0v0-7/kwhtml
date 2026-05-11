// ===================== 扩展：第三方健康设备（手环）同步 =====================

// 绑定设备
document.getElementById('bindDeviceBtn').addEventListener('click', async () => {
  if (!currentUserId) return alert('请先登录');

  try {
    const res = await fetch('/api/device/bind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUserId,
        deviceName: '小米手环',
        accessToken: 'mock_token_' + Date.now()
      })
    });
    const data = await res.json();
    alert(data.message);
    loadDeviceStatus();
  } catch (err) {
    alert('绑定失败');
  }
});

// 一键同步手环数据
document.getElementById('syncDataBtn').addEventListener('click', async () => {
  if (!currentUserId) return alert('请先登录');

  try {
    const res = await fetch(`/api/device/sync/${currentUserId}`);
    const data = await res.json();

    if (data.success) {
      document.getElementById('syncResult').style.display = 'block';
      document.getElementById('syncSteps').textContent = data.data.steps;
      document.getElementById('syncHeart').textContent = data.data.heartRate;
      document.getElementById('syncSleep').textContent = data.data.sleepHours;
      document.getElementById('syncCal').textContent = data.data.calories;
      document.getElementById('syncOxygen').textContent = data.data.bloodOxygen;

      loadSyncHistory();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('同步失败');
  }
});

// 加载设备绑定状态
async function loadDeviceStatus() {
  if (!currentUserId) return;
  const res = await fetch(`/api/device/my-device/${currentUserId}`);
  const data = await res.json();
  if (data.device) {
    document.getElementById('deviceStatus').textContent = '✅ 已绑定';
    document.getElementById('deviceStatus').style.color = '#28a745';
  }
}

// 加载同步历史
async function loadSyncHistory() {
  if (!currentUserId) return;
  const res = await fetch(`/api/device/sync-history/${currentUserId}`);
  const data = await res.json();

  const html = data.history.map(item => `
    <div class="history-item">
      ${new Date(item.syncTime).toLocaleString()}｜
      步数 ${item.steps}｜心率 ${item.heartRate}｜睡眠 ${item.sleepHours}h
    </div>
  `).join('');

  document.getElementById('historyList').innerHTML = html;
}

// 页面加载时自动获取
loadDeviceStatus();
loadSyncHistory();