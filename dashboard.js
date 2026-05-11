document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const username = checkLoginStatus();
    if (!username) return;

    // 显示用户名和当前日期
    document.getElementById('usernameDisplay').textContent = username;
    document.getElementById('currentDate').textContent = formatDate(new Date());

    // 获取健康目标
    const goals = getUserHealthGoals(username);
    
    // 获取今日数据
    const today = getTodayDateString();
    const healthData = getUserHealthData(username);
    const todayData = healthData[today] || {
        steps: 0,
        water: 0,
        sleep: 0,
        calorie: 0
    };

    // 更新数据卡片
    updateDataCards(todayData, goals);

    // 初始化图表
    initCharts(username, goals);
});

// 更新数据卡片
function updateDataCards(data, goals) {
    // 步数
    document.getElementById('todaySteps').textContent = data.steps;
    document.getElementById('stepsTargetText').textContent = `目标：${goals.steps} 步`;
    const stepsPercent = Math.min(100, (data.steps / goals.steps) * 100);
    document.getElementById('stepsProgress').style.width = `${stepsPercent}%`;

    // 饮水量
    document.getElementById('todayWater').textContent = `${data.water} ml`;
    document.getElementById('waterTargetText').textContent = `目标：${goals.water} ml`;
    const waterPercent = Math.min(100, (data.water / goals.water) * 100);
    document.getElementById('waterProgress').style.width = `${waterPercent}%`;

    // 睡眠时间
    document.getElementById('yesterdaySleep').textContent = `${data.sleep} 小时`;
    document.getElementById('sleepTargetText').textContent = `目标：${goals.sleep} 小时`;
    const sleepPercent = Math.min(100, (data.sleep / goals.sleep) * 100);
    document.getElementById('sleepProgress').style.width = `${sleepPercent}%`;

    // 卡路里
    document.getElementById('todayCalorie').textContent = `${data.calorie} 千卡`;
    document.getElementById('calorieTargetText').textContent = `目标：${goals.calorie} 千卡`;
    const caloriePercent = Math.min(100, (data.calorie / goals.calorie) * 100);
    document.getElementById('calorieProgress').style.width = `${caloriePercent}%`;
}

// 初始化图表
function initCharts(username, goals) {
    const last7Days = getLast7Days();
    const healthData = getUserHealthData(username);

    // 准备步数图表数据
    const stepsLabels = last7Days.map(day => day.display);
    const stepsData = last7Days.map(day => healthData[day.date]?.steps || 0);
    const stepsTargetLine = Array(7).fill(goals.steps);

    // 步数趋势图
    const stepsChartCtx = document.getElementById('stepsChart');
    if (stepsChartCtx) {
        new Chart(stepsChartCtx, {
            type: 'line',
            data: {
                labels: stepsLabels,
                datasets: [
                    {
                        label: '实际步数',
                        data: stepsData,
                        borderColor: '#16A34A',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: '目标步数',
                        data: stepsTargetLine,
                        borderColor: '#F59E0B',
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 健康数据汇总图
    const healthSummaryChartCtx = document.getElementById('healthSummaryChart');
    if (healthSummaryChartCtx) {
        new Chart(healthSummaryChartCtx, {
            type: 'radar',
            data: {
                labels: ['步数', '饮水量', '睡眠时间', '卡路里消耗'],
                datasets: [
                    {
                        label: '今日完成度(%)',
                        data: [
                            Math.min(100, (healthData[getTodayDateString()]?.steps || 0) / goals.steps * 100),
                            Math.min(100, (healthData[getTodayDateString()]?.water || 0) / goals.water * 100),
                            Math.min(100, (healthData[getTodayDateString()]?.sleep || 0) / goals.sleep * 100),
                            Math.min(100, (healthData[getTodayDateString()]?.calorie || 0) / goals.calorie * 100)
                        ],
                        backgroundColor: 'rgba(22, 163, 74, 0.2)',
                        borderColor: '#16A34A',
                        pointBackgroundColor: '#16A34A'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}