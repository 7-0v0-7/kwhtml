document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const username = checkLoginStatus();
    if (!username) return;

    // 获取今日数据并填充表单
    const today = getTodayDateString();
    const healthData = getUserHealthData(username);
    const todayData = healthData[today] || {};
    
    document.getElementById('stepsInput').value = todayData.steps || '';
    document.getElementById('waterInput').value = todayData.water || '';
    document.getElementById('sleepInput').value = todayData.sleep || '';
    document.getElementById('calorieInput').value = todayData.calorie || '';
    document.getElementById('notesInput').value = todayData.notes || '';

    // 提交表单事件
    document.getElementById('healthRecordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const recordData = {
            steps: parseInt(document.getElementById('stepsInput').value) || 0,
            water: parseInt(document.getElementById('waterInput').value) || 0,
            sleep: parseFloat(document.getElementById('sleepInput').value) || 0,
            calorie: parseInt(document.getElementById('calorieInput').value) || 0,
            notes: document.getElementById('notesInput').value.trim(),
            updateTime: new Date().toLocaleString()
        };

        // 保存数据
        const saveData = {};
        saveData[today] = recordData;
        saveUserHealthData(username, saveData);

        // 提示成功
        alert('健康数据保存成功！');
        
        // 更新历史记录
        renderHistoryRecords(username);
    });

    // 初始化历史记录
    renderHistoryRecords(username);

    // 清空历史记录
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('确定要清空所有健康记录吗？此操作不可恢复！')) {
            localStorage.removeItem(`healthData_${username}`);
            renderHistoryRecords(username);
        }
    });
});

// 渲染历史记录
function renderHistoryRecords(username) {
    const healthData = getUserHealthData(username);
    const tableBody = document.getElementById('historyTableBody');
    tableBody.innerHTML = '';

    // 如果没有数据
    if (Object.keys(healthData).length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">暂无历史记录</td>
            </tr>
        `;
        return;
    }

    // 按日期排序
    const sortedDates = Object.keys(healthData).sort((a, b) => new Date(b) - new Date(a));

    // 生成记录行
    sortedDates.forEach(date => {
        const data = healthData[date];
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(new Date(date))}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${data.steps}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${data.water}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${data.sleep}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${data.calorie}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-primary hover:text-primary/80 mr-3 edit-record" data-date="${date}">
                    <i class="fa fa-edit mr-1"></i>编辑
                </button>
                <button class="text-red-500 hover:text-red-700 delete-record" data-date="${date}">
                    <i class="fa fa-trash mr-1"></i>删除
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 绑定编辑和删除事件
    bindRecordEvents(username);
}

// 绑定记录操作事件
function bindRecordEvents(username) {
    // 编辑记录
    document.querySelectorAll('.edit-record').forEach(btn => {
        btn.addEventListener('click', () => {
            const date = btn.getAttribute('data-date');
            const healthData = getUserHealthData(username);
            const record = healthData[date];
            
            // 填充表单
            document.getElementById('stepsInput').value = record.steps || '';
            document.getElementById('waterInput').value = record.water || '';
            document.getElementById('sleepInput').value = record.sleep || '';
            document.getElementById('calorieInput').value = record.calorie || '';
            document.getElementById('notesInput').value = record.notes || '';
            
            // 滚动到表单顶部
            document.getElementById('healthRecordForm').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // 删除记录
    document.querySelectorAll('.delete-record').forEach(btn => {
        btn.addEventListener('click', () => {
            const date = btn.getAttribute('data-date');
            if (confirm(`确定要删除${formatDate(new Date(date))}的记录吗？`)) {
                const healthData = getUserHealthData(username);
                delete healthData[date];
                saveUserHealthData(username, healthData);
                renderHistoryRecords(username);
            }
        });
    });
}