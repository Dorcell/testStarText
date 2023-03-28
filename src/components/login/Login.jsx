import {useState} from 'react'
import AuthService from '../../services/AuthService';
import './Login.scss'
import {useNavigate} from "react-router-dom";
import {useMutation} from "react-query";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const sendLogin = async () => {
        const res = await AuthService.login(formData);
        return res.json();
    }

    const mutation = useMutation({
        mutationFn: sendLogin,
        onSuccess: (data) => {
            console.log(data.user);
            if (typeof data.user === 'object') {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
                setError(data);
            }
        },
        onError: (err) => {
            setError(err)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    }

    function handleChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return (
        <div>
            <h1>Login Form</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <input placeholder='Email' value={formData.email} type='email' name='email' required={true}
                       onChange={handleChange}></input>
                <input placeholder='Password' value={formData.password} type='password' name='password' required={true}
                       onChange={handleChange}></input>
                <button className='login-btn' type='submit'>Login</button>
                {error !== '' && (
                    <p className='error'>{error}</p>
                )}
            </form>
        </div>
    )
}

export default Login