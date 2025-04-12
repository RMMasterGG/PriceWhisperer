import React from 'react';
import '../styles/ElementOfList.css';

const ElementOfList = ({ title, desc, date, isRead, onClick }) => {
	return (
		<li
			className={`notification-item ${isRead ? 'read' : 'unread'}`}
			onClick={onClick}
			style={{ textAlign: 'left' }}
		>
			<div className='notification-content'>
				<h5 className='notification-title'>{title}</h5>
				<p className='notification-desc'>{desc}</p>
				{date && <span className='notification-date'>{date}</span>}
			</div>
			{!isRead && <div className='unread-dot' />}
		</li>
	);
};

export default ElementOfList;
