// pages/DashboardPage.jsx
import { useState } from 'react';
import productApi from '../../API/GetProd';
import NotFound from '../products/NotFound';
import ProductsCard from '../products/ProductsCard';
import '../styles/Dashboard.css';
import '../styles/dropdown.css';
import NotificationDropdown from '../UI/Notification';
import ProfileDropdown from '../UI/ProfileDropdown';

const DashboardPage = () => {
	const [url, setUrl] = useState('');
	const [productsCount, setProductsCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [productsAbout, setProductsAbout] = useState([
		{ title: 'ds', shop: 'ozon', price: 32322, min: 323, dif: '5%' },
	]);

	const notify = [
		{ title: 'dsdsd', desc: 'dsdsds' },
		{ title: 'dsdsd', desc: 'dsdsds' },
		{ title: 'dsdsd', desc: 'dsdsds' },
	];

	// Функция для отправки URL на сервер
	const sendUrl = async () => {
		if (!url.trim()) {
			setError('Введите URL товара');
			return;
		}
		setIsLoading(true);
		setError(null);

		try {
			const products = await productApi.fetchParsedProducts({
				queryKey: ['parsed-products', url],
			});
			setProductsAbout(prev => [...prev, ...products]);
			setProductsCount(prev => prev + products.length);
			setUrl('');
		} catch (err) {
			setError(err.response?.data?.message || 'Ошибка при добавлении товара');
			console.error('Ошибка:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='main'>
			<header className='dash-head'>
				<div className='nav-container'>
					<div className='nav-content'>
						<div>
							<h1 className='logo'>PriceWhisperer</h1>
						</div>
						<div className='nav-buttons'>
							<NotificationDropdown value={notify} />
							<ProfileDropdown />
						</div>
					</div>
				</div>
			</header>
			<section className='dashboard'>
				<div className='follow-block'>
					<div className='follow-container'>
						<div>
							<h1>Отслеживание цен</h1>
							<p>Добавляйте товары и отслеживайте изменение их цен</p>
						</div>
						<div className='follow-input-block'>
							<div className='follow-desc'>
								<h1>Добавить товар для отслеживания</h1>
								<p>
									Вставьте ссылку на товар с Ozon, Wildberries или AliExpress
								</p>
							</div>
							<div className='follow-input'>
								<input
									type='text'
									placeholder='https//'
									value={url}
									onChange={e => setUrl(e.target.value)}
								/>
								<button
									className='addBtn'
									onClick={sendUrl}
									disabled={isLoading}
								>
									{isLoading ? 'Добавление...' : 'Добавить товар'}
								</button>
								{error && <p className='error-message'>{error}</p>}
							</div>
						</div>
					</div>
					<div className='user-stats'>
						<div className='stats-about'>
							<h1>Статистика</h1>
							<p>Обзор ваших отслеживаемых товаров</p>
						</div>
						<div className='card-block'>
							<div
								className='card'
								style={{ background: '#eff6ff', color: '#2563eb' }}
							>
								<h2>{productsCount}</h2>
								<p>Товаров</p>
							</div>
							<div
								className='card'
								style={{ background: '#f0fdf4', color: '#16a34a' }}
							>
								<h2>1</h2>
								<p>Уведомления</p>
							</div>
							<div
								className='card'
								style={{ background: '#faf5ff', color: '#9333ea' }}
							>
								<h2>1</h2>
								<p>Маркетплейса</p>
							</div>
							<div
								className='card'
								style={{ background: '#fffbeb', color: '#d97706' }}
							>
								<h2>1</h2>
								<p>Макс. скидка</p>
							</div>
						</div>
					</div>
				</div>
				<div
					className='track-items-container'
					style={{ marginTop: '60px', textAlign: 'left' }}
				>
					<h1>Отслеживаемые товары</h1>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3,1fr)',
							gap: '20px',
							marginTop: '20px',
						}}
					>
						{productsAbout.length !== 0 ? (
							productsAbout.map((product, index) => (
								<ProductsCard
									key={index}
									title={product.title}
									shop={product.shop || product.shopName}
									price={product.price}
									source={product.img}
								/>
							))
						) : (
							<NotFound />
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default DashboardPage;
