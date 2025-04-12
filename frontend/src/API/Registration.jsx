import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const registerUser = async userData => {
	const response = await axios.post(
		'http://127.0.0.1:8000/api/register',
		userData
	);
	return response.data;
};

const RegisterForm = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		name: '',
	});

	const mutation = useMutation({
		mutationFn: registerUser,
		onSuccess: data => {
			alert('Регистрация успешна!');
			console.log('Ответ сервера:', data);
			// Перенаправление или обновление состояния
		},
		onError: error => {
			alert(`Ошибка: ${error.response?.data?.message || error.message}`);
		},
	});

	const handleSubmit = e => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type='text'
				name='name'
				value={formData.name}
				onChange={handleChange}
				placeholder='Имя'
				required
			/>
			<input
				type='email'
				name='email'
				value={formData.email}
				onChange={handleChange}
				placeholder='Email'
				required
			/>
			<input
				type='password'
				name='password'
				value={formData.password}
				onChange={handleChange}
				placeholder='Пароль'
				required
			/>
			<button type='submit' disabled={mutation.isPending}>
				{mutation.isPending ? 'Отправка...' : 'Зарегистрироваться'}
			</button>
		</form>
	);
};

export default RegisterForm;
