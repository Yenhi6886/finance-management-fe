import axios from 'axios';

const API_KEY = '6f6bf4b27db08413ef5d96ca';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

const currencyService = {
    getLatestRates: async () => {
        try {
            // Xây dựng URL đúng theo yêu cầu của API mới
            // Ví dụ: https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD
            const requestUrl = `${BASE_URL}/${API_KEY}/latest/USD`;

            // Không cần dùng params nữa, chỉ cần gọi thẳng đến URL đã xây dựng
            const response = await axios.get(requestUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching currency rates:', error);
            throw error;
        }
    },
};

export default currencyService;