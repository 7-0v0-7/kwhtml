document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const username = checkLoginStatus();
    if (!username) return;

    // 获取当前目标
    const goals = getUserHealthGoals(username);
    
    // 初始化表单值
    document.getElementById('stepsGoal').value = goals.steps;
    document.getElementById('stepsGoalRange').value = goals.steps;
    document.getElementById('waterGoal').value = goals.water;
    document.getElementById('waterGoalRange').value = goals.water;
    document.getElementById('sleepGoal').value = goals.sleep;
    document.getElementById('sleepGoalRange').value = goals.sleep;
    document.getElementById('calorieGoal').value = goals.calorie;
    document.getElementById('calorieGoalRange').value = goals.calorie;

    // 绑定滑块和输入框联动
    bindRangeInput('steps');
    bindRangeInput('water');
    bindRangeInput('sleep');
    bindRangeInput('calorie');

    // 表单提交
    document.getElementById('healthGoalsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newGoals = {
            steps: parseInt(document.getElementById('stepsGoal').value) || 8000,
            water: parseInt(document.getElementById('waterGoal').value) || 2000,
            sleep: parseFloat(document.getElementById('sleepGoal').value) || 8,
            calorie: parseInt(document.getElementById('calorieGoal').value) || 1500
        };

        // 保存目标
        saveUserHealthGoals(username, newGoals);
        alert('健康目标设置成功！');
        
        // 跳转到仪表盘
        window.location.href = 'admin.html';
    });

    // 重置默认值
    document.getElementById('resetGoalsBtn').addEventListener('click', () => {
        const defaultGoals = {
            steps: 8000,
            water: 2000,
            sleep: 8,
            calorie: 1500
        };

        document.getElementById('stepsGoal').value = defaultGoals.steps;
        document.getElementById('stepsGoalRange').value = defaultGoals.steps;
        document.getElementById('waterGoal').value = defaultGoals.water;
        document.getElementById('waterGoalRange').value = defaultGoals.water;
        document.getElementById('sleepGoal').value = defaultGoals.sleep;
        document.getElementById('sleepGoalRange').value = defaultGoals.sleep;
        document.getElementById('calorieGoal').value = defaultGoals.calorie;
        document.getElementById('calorieGoalRange').value = defaultGoals.calorie;
    });
});

// 绑定滑块和输入框联动
function bindRangeInput(type) {
    const range = document.getElementById(`${type}GoalRange`);
    const input = document.getElementById(`${type}Goal`);

    range.addEventListener('input', () => {
        input.value = range.value;
    });

    input.addEventListener('input', () => {
        range.value = input.value;
    });
}