import axios from 'axios';

const API_KEY = '6f6bf4b27db08413ef5d96ca';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

const currencyService = {
    getLatestRates: async () => {
        try {
            // Build correct URL according to the new API requirements
            // Example: https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD
            const requestUrl = `${BASE_URL}/${API_KEY}/latest/USD`;

            // No need to use params anymore, just call directly to the built URL
            const response = await axios.get(requestUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching currency rates:', error);
            throw error;
        }
    },
};

export default currencyService;