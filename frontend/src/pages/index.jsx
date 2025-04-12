import {
	ArrowRight,
	BadgePercent,
	Bell,
	LineChart,
	Percent,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './styles/index.css';

const Index = () => {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<header className='header'>
				<div className='header-container'>
					<div className='logo-container'>
						<span className='logo'>PriceWhisperer</span>
					</div>
					<div>
						<button className='button' onClick={() => navigate('/auth')}>
							Войти
						</button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className='hero'>
				<div className='hero-container'>
					<div className='hero-content'>
						<div className='hero-text'>
							<h1 className='hero-title' style={{ fontSize: '48px' }}>
								Отслеживайте цены и экономьте на покупках
							</h1>
							<p className='hero-description'>
								PriceWhisperer поможет вам отслеживать изменения цен на
								маркетплейсах, сравнивать товары и получать уведомления о
								скидках.
							</p>
							<div className='hero-buttons'>
								<button
									className='button primary-button'
									onClick={() => navigate('/auth')}
								>
									Начать бесплатно
									<span className='icon'>
										<ArrowRight
											style={{
												height: '16px',
												width: '16px',
												marginTop: '5px',
											}}
										/>
									</span>
								</button>
							</div>
						</div>
						<div className='hero-features'>
							<div className='features-card'>
								<div className='feature-item'>
									<div className='feature-icon-container'>
										<span className='feature-icon'>
											<LineChart />
										</span>
									</div>
									<div>
										<h3 className='feature-title'>История цен</h3>
										<p className='feature-description'>
											Отслеживайте изменения цен во времени
										</p>
									</div>
								</div>
								<div className='feature-item'>
									<div className='feature-icon-container'>
										<span className='feature-icon'>
											<BadgePercent />
										</span>
									</div>
									<div>
										<h3 className='feature-title'>Скидки и акции</h3>
										<p className='feature-description'>
											Узнавайте о лучших предложениях
										</p>
									</div>
								</div>
								<div className='feature-item'>
									<div className='feature-icon-container'>
										<span className='feature-icon'>
											{' '}
											<Bell />
										</span>
									</div>
									<div>
										<h3 className='feature-title'>Уведомления</h3>
										<p className='feature-description'>
											Получайте оповещения о снижении цен
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='features'>
				<div className='features-container'>
					<h2 className='section-title'>
						Как PriceWhisperer помогает экономить
					</h2>
					<div className='features-grid'>
						<div className='feature-card'>
							<div className='card-icon blue'>
								<span>
									<LineChart />
								</span>
							</div>
							<h3 className='card-title'>Отслеживание цен</h3>
							<p className='card-description'>
								Добавляйте товары с маркетплейсов и следите за изменением их
								стоимости в реальном времени.
							</p>
						</div>
						<div className='feature-card'>
							<div className='card-icon green'>
								<span>
									<Percent />
								</span>
							</div>
							<h3 className='card-title'>Сравнение товаров</h3>
							<p className='card-description'>
								Легко сравнивайте аналогичные товары с разных площадок, чтобы
								выбрать лучшее предложение.
							</p>
						</div>
						<div className='feature-card'>
							<div className='card-icon amber'>
								<span>
									<Bell />
								</span>
							</div>
							<h3 className='card-title'>Умные уведомления</h3>
							<p className='card-description'>
								Получайте оповещения о снижении цены и появлении скидок на
								отслеживаемые товары.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='cta'>
				<div className='cta-container'>
					<h2 className='section-title'>Начните экономить прямо сейчас</h2>
					<p className='cta-description'>
						Присоединяйтесь к тысячам пользователей, которые уже экономят на
						покупках с помощью PriceWhisperer.
					</p>
					<button
						className='button cta-button'
						onClick={() => navigate('/auth')}
					>
						Начать бесплатно
					</button>
				</div>
			</section>

			{/* Footer */}
			<footer className='footer'>
				<div className='footer-container'>
					<div className='footer-content'>
						<div>
							<span className='footer-logo'>PriceWhisperer</span>
						</div>
						<div className='footer-copyright'>
							© 2025 PriceWhisperer. Все права защищены.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Index;
