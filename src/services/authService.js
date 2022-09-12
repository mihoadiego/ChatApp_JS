import API from './api'

const AuthService = {
    register: (data) => {
        return API.post('/register', data)
            .then(result=> {
                setHeadersAndStorage(result.data);
                return result.data;
            })
            .catch(err=>{
                console.log('auth Service error while registering', err);
                throw err;
            })
    },
    login: (data) => {
        return API.post('/login', data)
            .then(result=> {
                setHeadersAndStorage(result.data);
                return result.data;
            })
            .catch(err=> {
                console.log('auth Service error while Loging', err)
                throw err
            })
    },
    updateProfile: (data) => {
        // here, we need to modify our headers otherwise the files type wont be managed correctly neither here nor in the backend API!
        const headers = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
        return API.post('/users/update', data, headers)
            .then(result=> {
                localStorage.setItem('user', JSON.stringify(result.data))
                return result.data;
            })
            .catch(err=>{
                console.log('auth Service error while updating', err);
                throw err;
            })
    },
    logout: () => {
        API.defaults.headers['Authorization'] = '';
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    },
}


const setHeadersAndStorage =({user, token})=>{
    API.defaults.headers['Authorization'] = `Bearer ${token}`
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
}
export default AuthService;