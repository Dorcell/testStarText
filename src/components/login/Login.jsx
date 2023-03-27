import {useState} from 'react'
import AuthService from '../../services/AuthService';
import './Login.scss'
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        AuthService.login(formData).then((response) => {
            return response.json();
        }).then(function (data) {
            if (data.user && data.accessToken) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data)
            }
        }).catch(err => {
            setError(err)
        });
    }

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <h1>Login Form</h1>
            <form className='login-form' onSubmit={e => handleSubmit(e)}>
                <input placeholder='Email' value={formData.email} type='email' name='email' required={true}
                       onChange={e => handleChange(e)}></input>
                <input placeholder='Password' value={formData.password} type='password' name='password' required={true}
                       onChange={e => handleChange(e)}></input>
                <button className='login-btn' type='submit'>Login</button>
                {error !== '' && (
                    <p className='error'>{error}</p>
                )}
            </form>
        </div>
    )
}

export default Login