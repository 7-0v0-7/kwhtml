// 用户列表API接口
// 模拟后端API，从localStorage获取用户数据

// 配置CORS
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

// 处理OPTIONS请求
if (request.method === 'OPTIONS') {
    respond(204, null, headers);
} else if (request.method === 'GET') {
    // 获取所有用户数据
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
    
    respond(200, JSON.stringify({ success: true, data: userList }), headers);
} else {
    respond(405, JSON.stringify({ success: false, message: 'Method not allowed' }), headers);
}

// 响应函数
function respond(status, body, headers) {
    const responseHeaders = new Headers();
    for (const key in headers) {
        responseHeaders.append(key, headers[key]);
    }
    
    return new Response(body, {
        status: status,
        headers: responseHeaders
    });
}