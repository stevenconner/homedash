const convertToUSD = (amount) => {
	return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export {
	convertToUSD,
};
