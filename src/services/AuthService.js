const SERVER_URL = 'http://localhost:3000';
const signup = (formData) => {
    // Почему решила использовать для авторизации стороннюю либу?
    return fetch(`${SERVER_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
};

const login = (formData) => {
    return fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    });
};

const getUserInfo = async (userId) => {
    const res = await fetch(`${SERVER_URL}/users/${userId}`, {
        method: 'GET',
    });
    return res.json();
};

const updateUserInfo = (userData) => {
    return fetch(`${SERVER_URL}/users/${userData.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    });
};


const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
const setUserData = (data) => {
    localStorage.setItem('user', JSON.stringify(data));
};

const authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return {Authorization: 'Bearer ' + user.accessToken};
    } else {
        return {};
    }
}

const AuthService = {
    signup,
    login,
    logout,
    getCurrentUser,
    authHeader,
    getUserInfo,
    updateUserInfo,
    setUserData
};

export default AuthService;