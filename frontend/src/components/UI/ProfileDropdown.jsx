import { User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

const ProfileDropdown = () => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef(null);
	const wrapperRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = e => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className='dropdown' ref={wrapperRef}>
			<button type='button' className='navBtn' onClick={() => setOpen(!open)}>
				<User />
			</button>

			<CSSTransition
				in={open}
				timeout={200}
				classNames='fade'
				unmountOnExit
				nodeRef={dropdownRef}
			>
				<div className='dropdown-menu'>
					<button className='dropdown-item'>Профиль</button>
					<button className='dropdown-item'>Настройки</button>
					<button className='dropdown-item'>Выход</button>
				</div>
			</CSSTransition>
		</div>
	);
};

export default ProfileDropdown;
