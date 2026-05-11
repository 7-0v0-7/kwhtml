document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已登录
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'admin.html';
    }

    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toRegister = document.getElementById('toRegister');
    const toLogin = document.getElementById('toLogin');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const submitLogin = document.getElementById('submitLogin');
    const submitRegister = document.getElementById('submitRegister');

    // 切换到注册表单
    function showRegisterForm() {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }

    // 切换到登录表单
    function showLoginForm() {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }

    // 绑定切换事件
    toRegister.addEventListener('click', showRegisterForm);
    toLogin.addEventListener('click', showLoginForm);
    registerBtn.addEventListener('click', showRegisterForm);
    loginBtn.addEventListener('click', showLoginForm);

    // 登录验证
        submitLogin.addEventListener('click', () => {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!username || !password) {
                alert('请输入用户名和密码');
                return;
            }

            // 从localStorage获取用户数据
            const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
            
            // 使用简单的哈希函数模拟密码加密（与注册时使用的相同）
            const hashPassword = (pwd) => {
                let hash = 0;
                for (let i = 0; i < pwd.length; i++) {
                    const char = pwd.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return hash.toString(16);
            };
            
            if (!users[username] || users[username].password !== hashPassword(password)) {
                alert('用户名或密码错误');
                return;
            }

            // 更新最后登录时间
            users[username].lastLogin = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));

            // 登录成功
            localStorage.setItem('currentUser', JSON.stringify(username));
            window.location.href = 'index.html';
        });

    // 注册验证
        submitRegister.addEventListener('click', () => {
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

            // 验证输入
            if (!username || !email || !password || !confirmPassword) {
                alert('请填写所有字段');
                return;
            }

            if (password.length < 6) {
                alert('密码至少需要6位');
                return;
            }

            if (password !== confirmPassword) {
                alert('两次输入的密码不一致');
                return;
            }

            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的邮箱地址');
                return;
            }

            // 检查用户名是否已存在
            const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
            if (users[username]) {
                alert('用户名已存在');
                return;
            }

            // 检查邮箱是否已存在
            for (const user in users) {
                if (users[user].email === email) {
                    alert('邮箱已被注册');
                    return;
                }
            }

            // 注册成功，存储完整用户信息（密码进行简单哈希处理）
            const registerTime = new Date().toISOString();
            // 使用简单的哈希函数模拟密码加密（实际应用中应使用更安全的加密算法）
            const hashPassword = (pwd) => {
                let hash = 0;
                for (let i = 0; i < pwd.length; i++) {
                    const char = pwd.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return hash.toString(16);
            };
            users[username] = {
                password: hashPassword(password),
                email: email,
                registerTime: registerTime,
                lastLogin: null
            };
            localStorage.setItem('users', JSON.stringify(users));
            alert('注册成功，请登录');
            showLoginForm();
            
            // 清空表单
            document.getElementById('regUsername').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
        });
});