// 模拟API接口，用于获取用户数据
class API {
    // 获取用户列表
    static getUsers() {
        return new Promise((resolve, reject) => {
            try {
                // 模拟网络延迟
                setTimeout(() => {
                    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
                    
                    // 转换为数组格式并过滤敏感信息
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
    
    // 获取单个用户信息
    static getUser(username) {
        return new Promise((resolve, reject) => {
            try {
                // 模拟网络延迟
                setTimeout(() => {
                    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
                    
                    if (users[username]) {
                        const user = users[username];
                        resolve({ 
                            success: true, 
                            data: {
                                username: username,
                                email: user.email,
                                registerTime: user.registerTime,
                                lastLogin: user.lastLogin
                            }
                        });
                    } else {
                        resolve({ success: false, message: '用户不存在' });
                    }
                }, 200);
            } catch (error) {
                reject({ success: false, message: '获取用户信息失败' });
            }
        });
    }
    
    // 添加新用户
    static addUser(userData) {
        return new Promise((resolve, reject) => {
            try {
                // 模拟网络延迟
                setTimeout(() => {
                    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
                    
                    // 检查用户名是否已存在
                    if (users[userData.username]) {
                        resolve({ success: false, message: '用户名已存在' });
                        return;
                    }
                    
                    // 检查邮箱是否已存在
                    for (const username in users) {
                        if (users[username].email === userData.email) {
                            resolve({ success: false, message: '邮箱已被注册' });
                            return;
                        }
                    }
                    
                    // 添加新用户
                    users[userData.username] = {
                        password: userData.password,
                        email: userData.email,
                        registerTime: new Date().toISOString(),
                        lastLogin: null
                    };
                    
                    localStorage.setItem('users', JSON.stringify(users));
                    resolve({ success: true, message: '用户添加成功' });
                }, 400);
            } catch (error) {
                reject({ success: false, message: '添加用户失败' });
            }
        });
    }
    
    // 更新用户信息
    static updateUser(username, userData) {
        return new Promise((resolve, reject) => {
            try {
                // 模拟网络延迟
                setTimeout(() => {
                    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
                    
                    if (!users[username]) {
                        resolve({ success: false, message: '用户不存在' });
                        return;
                    }
                    
                    // 更新用户信息
                    users[username] = {
                        ...users[username],
                        ...userData
                    };
                    
                    localStorage.setItem('users', JSON.stringify(users));
                    resolve({ success: true, message: '用户信息更新成功' });
                }, 300);
            } catch (error) {
                reject({ success: false, message: '更新用户信息失败' });
            }
        });
    }
    
    // 删除用户
    static deleteUser(username) {
        return new Promise((resolve, reject) => {
            try {
                // 模拟网络延迟
                setTimeout(() => {
                    const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : {};
                    
                    if (!users[username]) {
                        resolve({ success: false, message: '用户不存在' });
                        return;
                    }
                    
                    // 删除用户
                    delete users[username];
                    localStorage.setItem('users', JSON.stringify(users));
                    resolve({ success: true, message: '用户删除成功' });
                }, 200);
            } catch (error) {
                reject({ success: false, message: '删除用户失败' });
            }
        });
    }
}