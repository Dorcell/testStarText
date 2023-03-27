import {useState} from 'react';
import AuthService from '../../services/AuthService';
import {useNavigate} from "react-router-dom";

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        baseCurrency: 'usd'
    })

    function handleSubmit(e) {
        e.preventDefault()
        AuthService.signup(formData).then((response) => {
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
            <h1>Signup</h1>
            <form className='login-form' onSubmit={e => handleSubmit(e)}>
                <input type='text' placeholder='Username' value={formData.username} name='username' required={true}
                       onChange={e => handleChange(e)}></input>
                <input placeholder='Email' value={formData.email} name='email' type='email' required={true}
                       onChange={e => handleChange(e)}></input>
                <input placeholder='Password' value={formData.password} name='password' type='password' required={true}
                       onChange={e => handleChange(e)}></input>
                <button className='login-btn' type='submit'>Send</button>
                {error !== '' && (
                    <p className='error'>{error}</p>
                )}
            </form>
        </div>
    )
}

export default Signup