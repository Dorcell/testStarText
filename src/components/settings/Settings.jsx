import React, {useState} from 'react';
import Select from 'react-select';
import {useQuery} from 'react-query';
import CurrencyApiService from '../../services/CurrencyApiService';
import './Settings.scss';
import AuthService from '../../services/AuthService';

const Settings = () => {

    const [from, setFrom] = useState('usd');
    const [names, setNames] = useState([]);
    const [responseError, setResponseError] = useState('');

    const fetchUserInfo = () => {
        return AuthService.getUserInfo(AuthService.getCurrentUser().id);
    }
    // При выборе опции из селекта пользователь подгружается 3!!!! раза
    // Это не говоря о том, что пользователь грузится при первом фокусе на селекте
    // Опять же, не было никакого контекста на это, может пользователь должен проверяться при каждом чихе,
    // но тогда зачем ты ниже используешь протухание кэша 10000мс, а здесь не используешь? Непонятно.
    // Ну кста, почему здесь не используется useQuery тож непонятно.

    const updateUserCurrency = (fromCurrency) => {
        const userData = AuthService.getCurrentUser();
        userData.baseCurrency = fromCurrency;
        delete userData.password;
        AuthService.updateUserInfo(userData).then((response) => {
            return response.json();
        }).then(function (data) {
            if (typeof data !== 'object') {
                setResponseError(data);
            } else {
                setFrom(data.baseCurrency);
                refetch();
            }
        }).catch(err => {
            setResponseError(err)
        });
    }

    useQuery(`currenciesDescriptions`, CurrencyApiService.fetchNames,
        {
            staleTime: 10000,
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                setNames(res);
            }
        }
    );

    const getOptions = () => {
        return Object.keys(names).map((item) => {
            return {
                value: item,
                label: item
            }
        });
    }

    const {error, status, refetch} = useQuery(`user-info-from-${from}`, fetchUserInfo,
        {
            onSuccess: (res) => {
                setFrom(res.baseCurrency);
                AuthService.setUserData(res);
            }
        }
    );

    return (
        <div className='settings'>
            {status === 'error' && <p>{error}</p>}
            {/* Такая обработка ошибки приведёт к такому
                Objects are not valid as a React child (found: [object Error]).
                (Собственно, я этого и добился, когда просто удалил данные из localStorage)
            */}
            {status === 'success' && (
                <>
                    {AuthService.getCurrentUser() && (
                        <div className='settings-form' title={names[from]}>
                            <h3>Basic from currency</h3>
                            <Select options={getOptions()}
                                    className='settings-form__select'
                                    isSearchable={true}
                                    onChange={(e) => {
                                        updateUserCurrency(e.value);
                                    }}
                                    value={from.value} placeholder={from}/>
                            <p className='error'>{responseError}</p>
                        </div>
                    )}
                    {!AuthService.getCurrentUser() && (
                        <div className='settins__empty'>
                            <h3>Log in to edit settings</h3>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Settings;