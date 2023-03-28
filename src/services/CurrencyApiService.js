const API_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies'
// Такой же вопрос
// Почему решила использовать для авторизации стороннюю либу?
const fetchRatios = async (from) => {
    const res = await fetch(`${API_URL}/${from}.json`);
    return res.json();
};

const fetchNames = async () => {
    const res = await fetch(`${API_URL}.json`);
    return res.json();
};

const CurrencyApiService = {
    fetchRatios,
    fetchNames,
};

export default CurrencyApiService;