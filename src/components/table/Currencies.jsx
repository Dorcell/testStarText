import React, {useState} from 'react';
import Select from 'react-select';
import {useQuery} from 'react-query';
import CurrencyApiService from '../../services/CurrencyApiService';
import './Currencies.scss';
import currencyApiService from '../../services/CurrencyApiService';

const Currencies = () => {

    const [from, setFrom] = useState('usd');
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
        return currencyApiService.fetchRatios(from);
    }

    const {error, status, refetch} = useQuery(`ratios-from-${from}`, fetchRatios,
        {
            refetchOnWindowFocus: false,
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
            {status === 'error' && <p>{error}</p>}
            {status === 'success' && (
                <>
                    <div className='currency-selector' title={names[from]}>
                        <h3>From</h3>
                        <Select options={getOptions()}
                                isSearchable={true}
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