import React, {useState} from 'react';
import Select from 'react-select';
import {useQuery} from 'react-query';
import CurrencyApiService from '../../services/CurrencyApiService';
import AuthService from '../../services/AuthService';
import './Currencies.scss';

const Currencies = () => {

    const [from, setFrom] = useState(AuthService.getCurrentUser()?.baseCurrency ?? 'usd');
    //  Лаконичнее использовать оператор нулевого слияния
    // https://learn.javascript.ru/nullish-coalescing-operator
    const [ratios, setRatios] = useState([]);
    const [names, setNames] = useState([]);

    useQuery(`currenciesDescriptions`, CurrencyApiService.fetchNames,
        // Кста, интересная деталь, а зачем ты подгружаешь этот список, если ты его нигде не используешь? Валюты на странице отображаются по коду, а не по их названию. На странице конвертера тож самое.
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

    const {error, status, refetch} = useQuery(['ratios', from], fetchRatios,
        // Так проще потом по ключу будет искать нужный запрос
        {
            refetchOnWindowFocus: false,
            onSuccess: (res) => {
                setRatios(res[from]);
            }
        }
    );
    // Network неправильный. Сначала делается запрос с предыдущей валютой, а только потом на ту, которую ты выбрал. Итого на выбор из селекта одной валюты берётся два запроса. Это грубая ошибка.

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

    return (
        <div className='currencies'>
            {status === 'error' && <p>{error}</p>}
            {status === 'success' && (
                <>
                    <div className='currency-selector' title={names[from]}>
                        <h3>From</h3>
                        <Select options={getOptions()}
                                isSearchable={true}
                                className="selector"
                                onChange={(e) => {
                                    setFrom(e.value);
                                    refetch();
                                }}
                            value={from.value} placeholder={from}/>
                    </div>
                    <div className='converter__ratio-table'>
                        <table className='table'>
                            <thead>
                            <tr>
                                <th>
                                    Code
                                </th>
                                <th>
                                    value for {from}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(ratios).map((currencyCode) => {
                                return (
                                    <tr key={currencyCode}>
                                        <td title={names[currencyCode]}>
                                            {currencyCode}
                                        </td>
                                        <td>
                                            {(parseFloat(ratios[currencyCode])).toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default Currencies;