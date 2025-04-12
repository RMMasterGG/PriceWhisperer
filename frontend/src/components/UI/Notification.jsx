import { Bell } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../styles/notify.css';
import ElementOfList from './ElementOfList';

const NotificationDropdown = ({ notifications = [] }) => {
	// Исправлено получение пропсов
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);
	const wrapperRef = useRef(null);

	notifications = [
		{ id: 1, title: 'dsadasdsa', description: 'dsdasdsadasdsa' },
		{ id: 1, title: 'dsadasdsa', description: 'dsdasdsadasdsa' },
		{ id: 1, title: 'dsadasdsa', description: 'dsdasdsadasdsa' },
	];

	useEffect(() => {
		const handleClickOutside = e => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='notification-dropdown' ref={wrapperRef}>
			<button
				type='button'
				className='notification-button'
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-label='Уведомления'
			>
				<Bell size={20} />
				{notifications.length > 0 && (
					<span className='notification-badge'>{notifications.length}</span>
				)}
			</button>

			<CSSTransition
				in={isOpen}
				timeout={200}
				classNames='notification-dropdown'
				unmountOnExit
				nodeRef={dropdownRef}
			>
				<div className='notification-dropdown-menu' ref={dropdownRef}>
					<div className='notification-header'>
						<h3>Уведомления</h3>
						{notifications.length === 0 && (
							<p className='empty-notifications'>Нет новых уведомлений</p>
						)}
					</div>
					{notifications.length > 0 && (
						<ul className='notification-list'>
							{notifications.map(notification => (
								<ElementOfList
									key={notification.id} // Лучше использовать уникальный id вместо индекса
									title={notification.title}
									desc={notification.description}
									date={notification.date}
									isRead={false}
									// onClick={() => markAsRead(notificationId)}
								/>
							))}
						</ul>
					)}
				</div>
			</CSSTransition>
		</div>
	);
};

export default NotificationDropdown;
