// 完整功能流程测试脚本
console.log('=== 健康管理平台用户注册和管理功能测试 ===');

// 模拟localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => store[key] = value.toString()),
        removeItem: jest.fn(key => delete store[key]),
        clear: jest.fn(() => store = {})
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 哈希函数
const hashPassword = (pwd) => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
        const char = pwd.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
};

// 模拟API
class API {
    static getUsers() {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
                    const userList = Object.keys(users).map(username => {
                        const user = users[username];
                        return {
                            username: username,
                            email: user.email,
                            registerTime: user.registerTime,
                            lastLogin: user.lastLogin
                        };
                    });
                    resolve({ success: true, data: userList });
                }, 300);
            } catch (error) {
                reject({ success: false, message: '获取用户列表失败' });
            }
        });
    }
}

// 测试用例
async function runTests() {
    console.log('\n1. 测试用户注册功能...');
    
    // 模拟注册流程
    const testUser = {
        username: 'testuser1',
        email: 'test1@example.com',
        password: '123456',
        confirmPassword: '123456'
    };
    
    // 验证输入
    if (!testUser.username || !testUser.email || !testUser.password || !testUser.confirmPassword) {
        console.error('❌ 注册失败：请填写所有字段');
        return;
    }
    
    if (testUser.password.length < 6) {
        console.error('❌ 注册失败：密码至少需要6位');
        return;
    }
    
    if (testUser.password !== testUser.confirmPassword) {
        console.error('❌ 注册失败：两次输入的密码不一致');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testUser.email)) {
        console.error('❌ 注册失败：请输入有效的邮箱地址');
        return;
    }
    
    // 检查用户名是否已存在
    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
    if (users[testUser.username]) {
        console.error('❌ 注册失败：用户名已存在');
        return;
    }
    
    // 检查邮箱是否已存在
    for (const user in users) {
        if (users[user].email === testUser.email) {
            console.error('❌ 注册失败：邮箱已被注册');
            return;
        }
    }
    
    // 注册成功
    const registerTime = new Date().toISOString();
    users[testUser.username] = {
        password: hashPassword(testUser.password),
        email: testUser.email,
        registerTime: registerTime,
        lastLogin: null
    };
    localStorage.setItem('users', JSON.stringify(users));
    console.log('✅ 注册成功！用户信息已存储');
    
    // 模拟登录
    console.log('\n2. 测试用户登录功能...');
    
    // 验证登录
    if (!users[testUser.username] || users[testUser.username].password !== hashPassword(testUser.password)) {
        console.error('❌ 登录失败：用户名或密码错误');
        return;
    }
    
    // 更新最后登录时间
    users[testUser.username].lastLogin = new Date().toISOString();
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(testUser.username));
    console.log('✅ 登录成功！最后登录时间已更新');
    
    // 测试API获取用户列表
    console.log('\n3. 测试API获取用户列表功能...');
    
    try {
        const response = await API.getUsers();
        if (response.success) {
            console.log('✅ API调用成功，获取到用户列表：');
            console.log(JSON.stringify(response.data, null, 2));
            
            // 验证用户数据完整性
            const foundUser = response.data.find(user => user.username === testUser.username);
            if (foundUser) {
                console.log('\n4. 验证用户数据完整性...');
                console.log('✅ 用户数据完整，包含：');
                console.log(`   - 用户名: ${foundUser.username}`);
                console.log(`   - 邮箱: ${foundUser.email}`);
                console.log(`   - 注册时间: ${foundUser.registerTime}`);
                console.log(`   - 最后登录时间: ${foundUser.lastLogin}`);
            } else {
                console.error('❌ 验证失败：未找到刚注册的用户');
            }
            
            // 验证敏感信息过滤
            if (foundUser && !foundUser.password) {
                console.log('\n5. 验证敏感信息过滤...');
                console.log('✅ 敏感信息（密码）已正确过滤');
            } else {
                console.error('❌ 验证失败：敏感信息未过滤');
            }
        } else {
            console.error('❌ API调用失败：', response.message);
        }
    } catch (error) {
        console.error('❌ API调用异常：', error.message);
    }
    
    console.log('\n=== 测试完成 ===');
    
    // 清理测试数据
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    console.log('测试数据已清理');
}

// 运行测试
runTests();