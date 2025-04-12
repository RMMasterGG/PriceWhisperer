const NotFound = () => {
	return (
		<div
			style={{
				border: '1px dashed rgb(212, 212, 212)',
				width: '100%',
				padding: '40px',
			}}
		>
			<strong style={{ fontSize: '18px' }}>Нет отслеживаемых товаров</strong>
			<p style={{ fontSize: '16px' }}>
				Добавьте товары для отслеживания, вставив ссылки на них выше
			</p>
		</div>
	);
};

export default NotFound;
