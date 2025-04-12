import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

const AuthForm = () => {
	const [activeTab, setActiveTab] = useState('login');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const validateForm = () => {
		const newErrors = {};

		if (activeTab === 'register') {
			// Валидация имени
			if (formData.name.length < 3) {
				newErrors.name = 'Имя должно содержать минимум 3 символа';
			}

			// Валидация пароля
			if (formData.password.length < 8) {
				newErrors.password = 'Пароль должен содержать минимум 8 символов';
			}

			// Валидация подтверждения пароля
			if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = 'Пароли не совпадают';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Очищаем ошибку при изменении поля
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }));
		}
	};

	const loginMutation = useMutation({
		mutationFn: () =>
			axios.post('http://127.0.0.1:8000/api/login', {
				email: formData.email,
				password: formData.password,
			}),
		onSuccess: () => {
			navigate('/dashboard');
		},
		onError: error => {
			alert(error.response?.data?.message || 'Ошибка входа');
		},
	});

	const registerMutation = useMutation({
		mutationFn: () =>
			axios.post('http://127.0.0.1:8000/api/register', {
				name: formData.name,
				email: formData.email,
				password: formData.password,
			}),
		onSuccess: () => {
			navigate('/dashboard');
		},
		onError: error => {
			alert(error.response?.data?.message || 'Ошибка регистрации');
		},
	});

	const handleSubmit = e => {
		e.preventDefault();

		if (activeTab === 'login') {
			loginMutation.mutate();
		} else {
			// Проверяем валидацию перед отправкой
			if (!validateForm()) {
				return;
			}
			registerMutation.mutate();
		}
	};

	const inputProps = name => ({
		name,
		className: `form-input ${errors[name] ? 'error' : ''}`,
		value: formData[name],
		onChange: handleInputChange,
		required: true,
	});

	return (
		<div className='auth-card'>
			<div className='tabs-container'>
				<div className='tabs-header'>
					<button
						className={`tab-trigger ${activeTab === 'login' ? 'active' : ''}`}
						onClick={() => setActiveTab('login')}
					>
						Вход
					</button>
					<button
						className={`tab-trigger ${
							activeTab === 'register' ? 'active' : ''
						}`}
						onClick={() => setActiveTab('register')}
					>
						Регистрация
					</button>
				</div>

				<form onSubmit={handleSubmit} className='auth-form'>
					<div className='form-header'>
						<h2 className='form-title'>
							{activeTab === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт'}
						</h2>
						<p className='form-description'>
							{activeTab === 'login'
								? 'Введите свои данные, чтобы получить доступ к отслеживанию цен.'
								: 'Зарегистрируйтесь, чтобы начать отслеживать цены на товары.'}
						</p>
					</div>

					<div className='form-content'>
						{activeTab === 'register' && (
							<div className='form-group'>
								<label htmlFor='name' className='form-label'>
									Имя
								</label>
								<input
									id='name'
									type='text'
									placeholder='Ваше имя (минимум 3 символа)'
									{...inputProps('name')}
								/>
								{errors.name && (
									<span className='error-message'>{errors.name}</span>
								)}
							</div>
						)}

						<div className='form-group'>
							<label htmlFor='email' className='form-label'>
								Email
							</label>
							<input
								id='email'
								type='email'
								placeholder='name@example.com'
								{...inputProps('email')}
							/>
						</div>

						<div className='form-group'>
							<div className='password-header'>
								<label htmlFor='password' className='form-label'>
									Пароль
								</label>
								{activeTab === 'login' && (
									<button type='button' className='forgot-password'>
										Забыли пароль?
									</button>
								)}
							</div>
							<input
								id='password'
								type='password'
								placeholder={
									activeTab === 'register' ? 'Минимум 8 символов' : ''
								}
								{...inputProps('password')}
							/>
							{errors.password && (
								<span className='error-message'>{errors.password}</span>
							)}
						</div>

						{activeTab === 'register' && (
							<div className='form-group'>
								<label htmlFor='confirmPassword' className='form-label'>
									Подтвердите пароль
								</label>
								<input
									id='confirmPassword'
									type='password'
									{...inputProps('confirmPassword')}
								/>
								{errors.confirmPassword && (
									<span className='error-message'>
										{errors.confirmPassword}
									</span>
								)}
							</div>
						)}
					</div>

					<div className='form-footer'>
						<button
							className='submit-button'
							type='submit'
							disabled={
								activeTab === 'login'
									? loginMutation.isPending
									: registerMutation.isPending
							}
						>
							{activeTab === 'login'
								? loginMutation.isPending
									? 'Вход...'
									: 'Войти'
								: registerMutation.isPending
								? 'Регистрация...'
								: 'Зарегистрироваться'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AuthForm;
