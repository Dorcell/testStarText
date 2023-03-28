import React, {useState} from 'react';
import Select from 'react-select';
import {useQuery} from 'react-query';
import CurrencyApiService from '../../services/CurrencyApiService';
import AuthService from '../../services/AuthService';
import './Currencies.scss';

const Currencies = () => {

    const [from, setFrom] = useState(AuthService.getCurrentUser()?.baseCurrency ?? 'usd');
    const [ratios, setRatios] = useState([]);
    const [names, setNames] = useState([]);

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

    const ratiosQuery = useQuery(['ratios', from], fetchRatios,
        {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            onSuccess: (res) => {
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

    return (
        <div className='currencies'>
            {ratiosQuery.status === 'loading' && <div className='container'><div className='loading'></div></div> }
            {ratiosQuery.status === 'error' && <p>{ratiosQuery.error}</p>}
            {ratiosQuery.status === 'success' && (
                <>
                    <div className='currency-selector' title={names[from]}>
                        <h3>From</h3>
                        <Select options={getOptions()}
                                isSearchable={true}
                                className="selector"
                                onChange={(e) => {
                                    setFrom(e.value);
                                }}
                                value={from.value} placeholder={from}/>
                    </div>
                    <div className='converter__ratio-table'>
                        <table className='table'>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Code</th>
                                <th>value for 1 {from}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(ratios).map((currencyCode) => {
                                return (
                                    <tr key={currencyCode}>
                                        <td>
                                            {names[currencyCode]}
                                        </td>
                                        <td title={names[currencyCode]}>
                                            {currencyCode}
                                        </td>
                                        <td>
                                            {(parseFloat(ratios[currencyCode])).toFixed(4)}
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