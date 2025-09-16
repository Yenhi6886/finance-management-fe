export const formatCurrency = (amount, currency = 'VND', settings) => {
    try {
        if (typeof amount !== 'number') {
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                return '';
            }
            amount = parsedAmount;
        }

        const currencyFormatValue = settings?.currencyFormat || 'DOT_SEPARATOR';
        const isDotSeparator = currencyFormatValue.toUpperCase() === 'DOT_SEPARATOR';
        const locale = isDotSeparator ? 'vi-VN' : 'en-US';

        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        }

        const formattedNumber = new Intl.NumberFormat(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

        return `₫${formattedNumber}`;

    } catch (error) {
        console.error("Error formatting currency:", error);
        return `${amount} ${currency}`;
    }
};

export const formatDate = (dateString, settings) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }

        const dateFormat = settings?.dateFormat || 'DD_MM_YYYY';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        switch (dateFormat) {
            case 'YYYY_MM_DD':
                return `${year}/${month}/${day}`;
            case 'MM_DD_YYYY':
                return `${month}/${day}/${year}`;
            case 'DD_MM_YYYY':
            default:
                return `${day}/${month}/${year}`;
        }
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
};

export const formatNumber = (number, settings) => {
    if (typeof number !== 'number') {
        const parsedNumber = parseFloat(number);
        if (isNaN(parsedNumber)) {
            return '';
        }
        number = parsedNumber;
    }
    const currencyFormatValue = settings?.currencyFormat || 'DOT_SEPARATOR';
    const isDotSeparator = currencyFormatValue.toUpperCase() === 'DOT_SEPARATOR';
    const locale = isDotSeparator ? 'vi-VN' : 'en-US';
    return number.toLocaleString(locale);
}