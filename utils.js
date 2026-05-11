// 检查用户是否已登录
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(currentUser);
}

// 退出登录
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

// 获取今日日期字符串
function getTodayDateString() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 获取过去7天的日期
function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
            date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            display: `${date.getMonth() + 1}/${date.getDate()}`
        });
    }
    return days;
}

// 初始化退出登录按钮
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// 获取用户健康数据
function getUserHealthData(username) {
    const healthData = localStorage.getItem(`healthData_${username}`);
    return healthData ? JSON.parse(healthData) : {};
}

// 保存用户健康数据
function saveUserHealthData(username, data) {
    const existingData = getUserHealthData(username);
    const newData = { ...existingData, ...data };
    localStorage.setItem(`healthData_${username}`, JSON.stringify(newData));
}

// 获取用户健康目标
function getUserHealthGoals(username) {
    const goals = localStorage.getItem(`healthGoals_${username}`);
    return goals ? JSON.parse(goals) : {
        steps: 8000,
        water: 2000,
        sleep: 8,
        calorie: 1500
    };
}

// 保存用户健康目标
function saveUserHealthGoals(username, goals) {
    localStorage.setItem(`healthGoals_${username}`, JSON.stringify(goals));
}