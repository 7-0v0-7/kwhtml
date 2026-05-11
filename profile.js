document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const username = checkLoginStatus();
    if (!username) return;

    // 显示用户名
    document.getElementById('profileUsername').textContent = username;
    
    // 获取用户注册时间（模拟）
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const registerDate = new Date();
    document.getElementById('profileMemberSince').textContent = `注册时间：${formatDate(registerDate)}`;

    // 计算健康数据统计
    const healthData = getUserHealthData(username);
    const goals = getUserHealthGoals(username);
    
    // 记录天数
    const recordDays = Object.keys(healthData).length;
    document.getElementById('recordDays').textContent = recordDays;

    // 平均步数
    let totalSteps = 0;
    let totalCompletion = 0;
    let count = 0;
    
    Object.values(healthData).forEach(data => {
        if (data.steps) {
            totalSteps += data.steps;
            count++;
        }
        
        // 计算目标完成率
        const stepsCompletion = data.steps / goals.steps;
        const waterCompletion = data.water / goals.water;
        const sleepCompletion = data.sleep / goals.sleep;
        const calorieCompletion = data.calorie / goals.calorie;
        
        const avgCompletion = (stepsCompletion + waterCompletion + sleepCompletion + calorieCompletion) / 4;
        totalCompletion += avgCompletion;
    });

    const avgSteps = count > 0 ? Math.round(totalSteps / count) : 0;
    document.getElementById('avgSteps').textContent = avgSteps;

    // 目标完成率
    const goalCompletion = recordDays > 0 ? Math.min(100, Math.round((totalCompletion / recordDays) * 100)) : 0;
    document.getElementById('goalCompletion').textContent = `${goalCompletion}%`;

    // 加载用户资料
    const profile = JSON.parse(localStorage.getItem(`profile_${username}`) || '{}');
    document.getElementById('fullName').value = profile.fullName || '';
    document.getElementById('age').value = profile.age || '';
    document.getElementById('gender').value = profile.gender || '';
    document.getElementById('height').value = profile.height || '';
    document.getElementById('weight').value = profile.weight || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('medicalHistory').value = profile.medicalHistory || '';

    // 个人资料表单提交
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const profileData = {
            fullName: document.getElementById('fullName').value.trim(),
            age: parseInt(document.getElementById('age').value) || 0,
            gender: document.getElementById('gender').value,
            height: parseInt(document.getElementById('height').value) || 0,
            weight: parseFloat(document.getElementById('weight').value) || 0,
            phone: document.getElementById('phone').value.trim(),
            medicalHistory: document.getElementById('medicalHistory').value.trim()
        };
        
        // 保存资料
        localStorage.setItem(`profile_${username}`, JSON.stringify(profileData));
        alert('个人资料保存成功！');
    });

    // 修改密码表单提交
    document.getElementById('passwordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        // 验证输入
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            alert('请填写所有密码字段');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('新密码至少需要6位');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            alert('两次输入的新密码不一致');
            return;
        }
        
        // 验证旧密码
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[username] !== oldPassword) {
            alert('当前密码错误');
            return;
        }
        
        // 更新密码
        users[username] = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // 清空表单
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        
        alert('密码修改成功！');
    });
});