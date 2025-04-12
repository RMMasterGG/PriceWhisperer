import { Bell, BellOff, LineChart, Trash } from 'lucide-react';
import { useState } from 'react';
import ReactModal from 'react-modal';
import MiniPriceChart from '../graphics/MiniPriceChart';
import '../styles/ProductsCard.css';
import { getMarketplaceColor } from '../utils/MarketPlace';

const ProductsCard = ({ title, shop, source, price, min, diff, onDelete }) => {
	const [isNotifying, setIsNotifying] = useState(true);
	// const [showChart, setShowChart] = useState(false);

	const [isOpen, setIsOpen] = useState(false);

	const marketplaceColorClass = getMarketplaceColor(shop);

	const toggleNotifications = () => {
		setIsNotifying(!isNotifying);
	};

	const handleDelete = () => {
		onDelete(title);
	};

	return (
		<div className='card-wrapper'>
			<div className='card-container'>
				{/* Верхняя синяя полоса с закруглёнными углами */}
				<div
					className='blue-top-border'
					style={{ background: marketplaceColorClass }}
				></div>

				<div className='header'>
					<div className='title'>
						<h3>Товар {title} с Ozon</h3>
						<span>{shop}</span>
					</div>
					<a href='{link}' className='product-link'>
						Открыть на сайте
					</a>
				</div>

				<div className='product-image'>
					<img src={source} alt='img' />
				</div>

				<div className='card-price'>
					<p className='price'>{price} ₽</p>
					<div className='card-btn'>
						<button onClick={() => setIsOpen(true)}>
							<LineChart size={15} />
						</button>
						<button size='icon' onClick={toggleNotifications}>
							{isNotifying ? (
								<Bell size='15px' style={{ color: 'blue' }} />
							) : (
								<BellOff size='15px' style={{ color: 'red' }} />
							)}
						</button>
						<button>
							<Trash
								size={15}
								style={{ color: 'red' }}
								onClick={handleDelete}
							/>
						</button>
					</div>
					<ReactModal
						isOpen={isOpen}
						onRequestClose={() => setIsOpen(false)}
						style={{
							content: {
								top: '50%',
								left: '50%',
								right: 'auto',
								bottom: 'auto',
								marginRight: '-50%',
								transform: 'translate(-50%, -50%)',
								width: '1000px',
							},
							overlay: {
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
							},
						}}
					>
						<h1
							style={{
								fontFamily: 'sans-serif',
								textAlign: 'center',
								marginBottom: '20px',
							}}
						>
							График цены
						</h1>
						<MiniPriceChart />
					</ReactModal>
				</div>

				{/* Горизонтальная линия с отступами */}
				<hr className='custom-hr' />

				<div className='total-amount'>
					<div className='minimal-price'>
						<p>Минимальная цена:</p>
						<p>{min}</p>
					</div>
					<div className='difference-per-month'>
						<p>Изменение за месяц:</p>
						<p>{diff}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductsCard;
