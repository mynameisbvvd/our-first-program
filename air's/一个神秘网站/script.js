// 显示用户权限
function displayUserRole(role) {
    const roleDisplay = document.getElementById('userRoleDisplay');
    const roleValue = document.getElementById('userRoleValue');
    
    // 移除所有角色类
    roleValue.classList.remove('admin', 'controller', 'user');
    
    // 添加对应的角色类和文本
    if (role === 'admin') {
        roleValue.classList.add('admin');
        roleValue.textContent = '管理员';
    } else if (role === 'controller') {
        roleValue.classList.add('controller');
        roleValue.textContent = '控制员';
    } else {
        roleValue.classList.add('user');
        roleValue.textContent = '普通用户';
    }
}

// 登录验证功能
// 初始化默认用户（如果不存在）
function initDefaultUser() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        users.push({
            username: 'admin',
            password: 'admin',
            approved: true,
            role: 'admin'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// 检查登录状态123
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginOverlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (isLoggedIn) {
        loginOverlay.style.display = 'none';
        mainContent.style.display = 'flex';
    } else {
        loginOverlay.style.display = 'flex';
        mainContent.style.display = 'none';
    }
}

// 表单切换功能
document.getElementById('showRegister').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
});

document.getElementById('showLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
});

// 登录表单处理
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 检查站点是否关闭（admin和controller角色不受影响）
        const isSiteClosed = localStorage.getItem('siteClosed') === 'true';
        if (isSiteClosed && user.role !== 'admin' && user.role !== 'controller') {
            loginError.textContent = '站点已关闭，仅管理员和控制员可登录！';
            return;
        }
        
        // 检查用户是否已被批准
        if (!user.approved) {
            loginError.textContent = '您的账号正在审核中，请等待管理员批准！';
            return;
        }
        
        // 登录成功
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', user.role || 'user');
        loginError.textContent = '';
        checkLoginStatus();
        startFireworks();
        
        // 显示用户权限
        displayUserRole(user.role || 'user');
        
        // 检查是否为管理员或控制员
        if (user.role === 'admin') {
            showAdminPanel();
        } else if (user.role === 'controller') {
            showControllerPanel();
        }
    } else {
        // 登录失败
        loginError.textContent = '用户名或密码错误！';
    }
});

// 注册表单处理
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const registerError = document.getElementById('registerError');
    
    // 验证输入
    if (!username) {
        registerError.textContent = '用户名不能为空！';
        return;
    }
    
    if (password.length < 3) {
        registerError.textContent = '密码长度至少为3位！';
        return;
    }
    
    if (password !== confirmPassword) {
        registerError.textContent = '两次输入的密码不一致！';
        return;
    }
    
    // 检查用户名是否已存在
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
        registerError.textContent = '用户名已存在！';
        return;
    }
    
    // 注册新用户（默认未批准，角色为普通用户）
    users.push({
        username: username,
        password: password,
        approved: false,
        role: 'user'
    });
    localStorage.setItem('users', JSON.stringify(users));
    
    // 注册成功，切换到登录表单
    registerError.textContent = '';
    document.getElementById('registerForm').reset();
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    
    // 自动填充用户名
    document.getElementById('username').value = username;
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
    
    // 显示成功提示
    alert('注册申请已提交！请等待管理员批准后登录。');
});

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    checkLoginStatus();
});

// 页面加载时初始化默认用户并检查登录状态
window.addEventListener('load', function() {
    initDefaultUser();
    checkLoginStatus();
    
    // 如果已登录，显示用户权限
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const userRole = localStorage.getItem('userRole') || 'user';
        displayUserRole(userRole);
        
        // 根据角色显示相应面板
        if (userRole === 'admin') {
            showAdminPanel();
        } else if (userRole === 'controller') {
            showControllerPanel();
        }
    }
});

// 新春祝福语数组
const blessings = [
    "祝您马年吉祥，马到成功，一马当先！",
    "新春快乐，阖家幸福，万事如意！",
    "金马迎春，福气满满，财源广进！",
    "马年行大运，心想事成，步步高升！",
    "新春佳节，喜气洋洋，福星高照！",
    "马蹄声声辞旧岁，瑞雪兆丰年！",
    "祝您马年身体健康，工作顺利，家庭美满！",
    "春风送暖入屠苏，新年好运到！",
    "马年新气象，事业蒸蒸日上！",
    "恭喜发财，红包拿来，好运连连！"
];

let currentBlessingIndex = 0;

// 祝福语切换功能
function showBlessing(index) {
    const blessingText = document.getElementById('blessingText');
    blessingText.style.animation = 'none';
    blessingText.offsetHeight; // 触发重排
    blessingText.style.animation = 'fadeIn 0.5s ease-in-out';
    blessingText.textContent = blessings[index];
}

document.getElementById('prevBtn').addEventListener('click', () => {
    currentBlessingIndex = (currentBlessingIndex - 1 + blessings.length) % blessings.length;
    showBlessing(currentBlessingIndex);
});

document.getElementById('nextBtn').addEventListener('click', () => {
    currentBlessingIndex = (currentBlessingIndex + 1) % blessings.length;
    showBlessing(currentBlessingIndex);
});

// 自动轮播祝福语
setInterval(() => {
    currentBlessingIndex = (currentBlessingIndex + 1) % blessings.length;
    showBlessing(currentBlessingIndex);
}, 5000);

// 倒计时功能
function updateCountdown() {
    // 2026年春节日期：2026年2月17日
    const springFestival = new Date('2026-02-17T00:00:00');
    const now = new Date();
    const diff = springFestival - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        // 春节已到
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// 每秒更新倒计时
updateCountdown();
setInterval(updateCountdown, 1000);

// 烟花效果
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.exploded = false;
        this.speed = Math.random() * 3 + 2;
        this.targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.1;
    }
    
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        }
        
        this.particles.forEach((particle, index) => {
            particle.update();
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    explode() {
        this.exploded = true;
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const velocity = Math.random() * 5 + 2;
            this.particles.push(new Particle(
                this.x,
                this.y,
                Math.cos(angle) * velocity,
                Math.sin(angle) * velocity,
                this.color
            ));
        }
    }
    
    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // 尾迹
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + 20);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        this.particles.forEach(particle => particle.draw());
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.alpha = 1;
        this.gravity = 0.05;
        this.friction = 0.99;
    }
    
    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.015;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

const colors = ['#FFD700', '#FF6B00', '#FF4500', '#FF0000', '#FFA500', '#FFFF00'];
let fireworks = [];

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(x, y, color));
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        
        if (firework.exploded && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animate);
}

// 定期创建烟花（仅在登录后）
let fireworkInterval = null;

function startFireworks() {
    if (!fireworkInterval) {
        fireworkInterval = setInterval(createFirework, 1500);
    }
}

function stopFireworks() {
    if (fireworkInterval) {
        clearInterval(fireworkInterval);
        fireworkInterval = null;
    }
}

// 启动动画
animate();

// 监听登录状态变化
window.addEventListener('storage', function(e) {
    if (e.key === 'isLoggedIn') {
        checkLoginStatus();
        if (e.newValue === 'true') {
            startFireworks();
        } else {
            stopFireworks();
        }
    }
});

// 初始化时检查登录状态并启动烟花
if (localStorage.getItem('isLoggedIn') === 'true') {
    startFireworks();
}

// 点击创建烟花（仅在登录后可用）
canvas.addEventListener('click', (e) => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const x = e.clientX;
        const y = canvas.height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const firework = new Firework(x, y, color);
        firework.targetY = e.clientY;
        fireworks.push(firework);
    }
});

// ==================== 管理员功能 ====================

// 显示管理员面板
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
        loadUserTable();
    }
}

// 加载用户表格
function loadUserTable() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tableBody = document.getElementById('userTableBody');
    
    tableBody.innerHTML = '';
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        
        // 用户名列
        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        row.appendChild(usernameCell);
        
        // 密码列（显示掩码）
        const passwordCell = document.createElement('td');
        passwordCell.textContent = '••••••';
        row.appendChild(passwordCell);
        
        // 角色列
        const roleCell = document.createElement('td');
        const roleBadge = document.createElement('span');
        roleBadge.className = 'role-badge';
        if (user.role === 'admin') {
            roleBadge.classList.add('admin');
            roleBadge.textContent = '管理员';
        } else if (user.role === 'controller') {
            roleBadge.classList.add('controller');
            roleBadge.textContent = '控制员';
        } else {
            roleBadge.classList.add('user');
            roleBadge.textContent = '用户';
        }
        roleCell.appendChild(roleBadge);
        row.appendChild(roleCell);
        
        // 状态列
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = 'status-badge';
        if (user.approved) {
            statusBadge.classList.add('approved');
            statusBadge.textContent = '已批准';
        } else {
            statusBadge.classList.add('pending');
            statusBadge.textContent = '待审核';
        }
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        
        // 操作列
        const actionCell = document.createElement('td');
        const currentUser = localStorage.getItem('username');
        
        if (user.username !== currentUser) {
            // 不能删除自己
            if (!user.approved) {
                // 待审核用户显示批准和拒绝按钮
                const approveBtn = document.createElement('button');
                approveBtn.className = 'admin-btn approve-btn';
                approveBtn.textContent = '批准';
                approveBtn.addEventListener('click', () => approveUser(index));
                actionCell.appendChild(approveBtn);
                
                const rejectBtn = document.createElement('button');
                rejectBtn.className = 'admin-btn reject-btn';
                rejectBtn.textContent = '拒绝';
                rejectBtn.addEventListener('click', () => rejectUser(index));
                actionCell.appendChild(rejectBtn);
            } else {
                // 已批准用户显示删除按钮
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'admin-btn delete-btn';
                deleteBtn.textContent = '删除';
                deleteBtn.addEventListener('click', () => deleteUser(index));
                actionCell.appendChild(deleteBtn);
            }
        } else {
            // 自己不能删除
            actionCell.textContent = '-';
        }
        row.appendChild(actionCell);
        
        tableBody.appendChild(row);
    });
}

// 添加用户
document.getElementById('adminAddBtn').addEventListener('click', function() {
    const username = document.getElementById('adminAddUsername').value.trim();
    const password = document.getElementById('adminAddPassword').value.trim();
    const roleSelect = document.getElementById('adminAddRole');
    const role = roleSelect ? roleSelect.value : 'user';
    
    // 验证输入
    if (!username) {
        alert('请输入用户名！');
        return;
    }
    
    if (!password) {
        alert('请输入密码！');
        return;
    }
    
    if (password.length < 3) {
        alert('密码长度至少为3位！');
        return;
    }
    
    // 检查用户名是否已存在
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.username === username)) {
        alert('用户名已存在！');
        return;
    }
    
    // 如果添加管理员，需要确认
    if (role === 'admin') {
        if (!confirm('警告：您正在创建管理员账号！管理员拥有完整权限，包括管理用户和控制站点。确定要继续吗？')) {
            return;
        }
    }
    
    // 添加用户（管理员添加的用户默认已批准）
    users.push({
        username: username,
        password: password,
        approved: true,
        role: role
    });
    localStorage.setItem('users', JSON.stringify(users));
    
    // 清空输入框并刷新表格
    document.getElementById('adminAddUsername').value = '';
    document.getElementById('adminAddPassword').value = '';
    if (roleSelect) {
        roleSelect.value = 'user';
    }
    loadUserTable();
    
    alert('用户添加成功！');
});

// 批准用户
function approveUser(index) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users[index];
    
    if (confirm(`确定要批准用户 "${user.username}" 吗？`)) {
        users[index].approved = true;
        localStorage.setItem('users', JSON.stringify(users));
        loadUserTable();
        alert('用户已批准，可以登录了！');
    }
}

// 拒绝用户
function rejectUser(index) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users[index];
    
    if (confirm(`确定要拒绝用户 "${user.username}" 吗？`)) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUserTable();
        alert('用户申请已拒绝！');
    }
}

// 删除用户
function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users[index];
    
    if (confirm(`确定要删除用户 "${user.username}" 吗？`)) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        loadUserTable();
        alert('用户删除成功！');
    }
}

// ==================== 一键关站功能 ====================

// 初始化站点控制状态
function initSiteControl() {
    const isSiteClosed = localStorage.getItem('siteClosed') === 'true';
    updateSiteControlUI(isSiteClosed);
}

// 更新站点控制界面
function updateSiteControlUI(isClosed) {
    const toggleBtn = document.getElementById('toggleSiteBtn');
    const statusText = document.getElementById('siteStatus');
    
    if (isClosed) {
        toggleBtn.textContent = '开启站点';
        toggleBtn.classList.add('active');
        statusText.textContent = '站点状态：关闭';
        statusText.classList.add('closed');
    } else {
        toggleBtn.textContent = '关闭站点';
        toggleBtn.classList.remove('active');
        statusText.textContent = '站点状态：开启';
        statusText.classList.remove('closed');
    }
}

// 更新控制员面板的站点控制界面
function updateControllerSiteControlUI(isClosed) {
    const toggleBtn = document.getElementById('controllerToggleSiteBtn');
    const statusText = document.getElementById('controllerSiteStatus');
    
    if (isClosed) {
        toggleBtn.textContent = '开启站点';
        toggleBtn.classList.add('active');
        statusText.textContent = '站点状态：关闭';
        statusText.classList.add('closed');
    } else {
        toggleBtn.textContent = '关闭站点';
        toggleBtn.classList.remove('active');
        statusText.textContent = '站点状态：开启';
        statusText.classList.remove('closed');
    }
}

// 切换站点状态
document.getElementById('toggleSiteBtn').addEventListener('click', function() {
    const isSiteClosed = localStorage.getItem('siteClosed') === 'true';
    const newStatus = !isSiteClosed;
    
    if (newStatus) {
        if (confirm('确定要关闭站点吗？关闭后除admin和控制员外的所有用户将无法登录！')) {
            localStorage.setItem('siteClosed', 'true');
            updateSiteControlUI(true);
            alert('站点已关闭！');
        }
    } else {
        if (confirm('确定要开启站点吗？开启后所有已批准用户均可登录！')) {
            localStorage.setItem('siteClosed', 'false');
            updateSiteControlUI(false);
            alert('站点已开启！');
        }
    }
});

// 控制员面板的站点控制按钮
document.getElementById('controllerToggleSiteBtn').addEventListener('click', function() {
    const isSiteClosed = localStorage.getItem('siteClosed') === 'true';
    const newStatus = !isSiteClosed;
    
    if (newStatus) {
        if (confirm('确定要关闭站点吗？关闭后除admin和控制员外的所有用户将无法登录！')) {
            localStorage.setItem('siteClosed', 'true');
            updateControllerSiteControlUI(true);
            alert('站点已关闭！');
        }
    } else {
        if (confirm('确定要开启站点吗？开启后所有已批准用户均可登录！')) {
            localStorage.setItem('siteClosed', 'false');
            updateControllerSiteControlUI(false);
            alert('站点已开启！');
        }
    }
});

// 在显示管理员面板时初始化站点控制
const originalShowAdminPanel = showAdminPanel;
showAdminPanel = function() {
    originalShowAdminPanel();
    initSiteControl();
};

// ==================== 控制员面板功能 ====================

// 显示控制员面板
function showControllerPanel() {
    const controllerPanel = document.getElementById('controllerPanel');
    if (controllerPanel) {
        controllerPanel.style.display = 'block';
        initControllerSiteControl();
    }
}

// 初始化控制员面板的站点控制状态
function initControllerSiteControl() {
    const isSiteClosed = localStorage.getItem('siteClosed') === 'true';
    updateControllerSiteControlUI(isClosed);
}

// 在显示控制员面板时初始化站点控制
const originalShowControllerPanel = showControllerPanel;
showControllerPanel = function() {
    originalShowControllerPanel();
    initControllerSiteControl();
};

// 退出登录时隐藏所有面板
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    
    // 隐藏管理员面板
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
    
    // 隐藏控制员面板
    const controllerPanel = document.getElementById('controllerPanel');
    if (controllerPanel) {
        controllerPanel.style.display = 'none';
    }
    
    checkLoginStatus();
});