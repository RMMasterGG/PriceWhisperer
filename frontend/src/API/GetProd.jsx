// API/GetProd.jsx
import axios from 'axios';

// API функции для работы с товарами
const productApi = {
	fetchParsedProducts: async ({ queryKey }) => {
		const [, url] = queryKey;

		const { data } = await axios.post(
			'http://127.0.0.1:8000/api/parsing',
			{ url },
			{
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		// Преобразуем данные к нужному формату
		return data.map(item => ({
			id: item.id || Math.random().toString(36).substring(2, 9),
			title: item.title || 'Без названия',
			url: item.url || '#',
			shopName: item.shopname || 'Неизвестный магазин',
			price: item.price || 'Цена не указана',
			img: item.img || '/placeholder-image.jpg',
		}));
	},
};

export default productApi;
