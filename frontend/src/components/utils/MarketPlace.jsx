export const getMarketplaceColor = marketplace => {
	switch (marketplace.toLowerCase()) {
		case 'ozon':
			return '#2563eb';
		case 'wildberries':
			return 'purple';
		case 'aliexpress':
			return 'orange';
		default:
			return 'gray';
	}
};
