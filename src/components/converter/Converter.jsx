import React, {useState} from 'react';
import Select from 'react-select';
import {HiSwitchHorizontal} from 'react-icons/hi';
import {useQuery} from 'react-query';
import './Converter.scss';
import AuthService from '../../services/AuthService';
import CurrencyApiService from '../../services/CurrencyApiService';

const Converter = () => {

    const [from, setFrom] = useState(AuthService.getCurrentUser() ? AuthService.getCurrentUser().baseCurrency : 'usd');
    const [to, setTo] = useState('rub');
    const [amount, setAmount] = useState(0);
    const [ratios, setRatios] = useState([]);
    const [names, setNames] = useState([]);
    const [converted, setConverted] = useState(0);

    useQuery(`currenciesDescriptions`, CurrencyApiService.fetchNames,
        {
            staleTime: 10000,
            onSuccess: (res) => {
                setNames(res);
            }
        }
    );

    const fetchRatios = () => {
        return CurrencyApiService.fetchRatios(from);
    }

    const {error, status, refetch} = useQuery(`ratios-from-${from}`, fetchRatios,
        {
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                setConverted(amount * res[from][to]);
                setRatios(res[from]);
            }
        }
    );
    const getOptions = () => {
        if (typeof ratios === 'undefined' || ratios === null) {
            return [];
        }
        return Object.keys(ratios).map((item) => {
            return {
                value: item,
                label: item
            }
        });
    }

    const flip = () => {
        setFrom(to);
        setTo(from);
        // Не понял, зачем нужно было создавать ссылку
        // Даже если это была попытка скопировать элемент, то очень странная, может быть стоит почитать это:
        // https://learn.javascript.ru/object-copy
        refetch();
    }

    return (
        <div className='converter'>
            {status === 'error' && <p>{error}</p>}
            {status === 'success' && (
                <>
                    <div className='converter-form'>
                        <div className='converter-form__amount'>
                            <h3>Amount</h3>
                            <input type='number'
                                   className='converter-form__input'
                                   placeholder='Enter the amount'
                                   value={amount}
                                   onChange={(e) => {
                                       if (e.target.value.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                           setAmount(e.target.value);
                                           refetch();
                                       }
                                   }}/>
                        </div>
                        <div className='converter-form__from' title={names[from]}>
                            <h3>From</h3>
                            <Select options={getOptions()}
                                    isSearchable={true}
                                    onChange={(e) => {
                                        setFrom(e.value);
                                        refetch();
                                    }}
                                    value={from.value} placeholder={from}/>
                        </div>
                        <div className='converter-form__switch'>
                            <HiSwitchHorizontal size='30px' onClick={() => {
                                flip()
                            }}/>
                        </div>
                        <div className='converter-form__to' title={names[to]}>
                            <h3>To</h3>
                            <Select options={getOptions()}
                                    isSearchable={true}
                                    title={names[to]}
                                    onChange={(e) => {
                                        setTo(e.value);
                                        refetch();
                                    }}
                                    value={to.value} placeholder={to}/>
                        </div>
                    </div>
                    <div className='converter__result'>
                        <p>{amount + ' ' + from + ' = ' + converted.toFixed(2) + ' ' + to}</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default Converter;