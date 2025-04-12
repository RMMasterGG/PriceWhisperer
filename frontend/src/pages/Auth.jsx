import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import './styles/AuthPage.css';

const Auth = ({ onLogin }) => {
	const navigate = useNavigate();

	const handleLogin = async (email, password) => {
		try {
			const response = await axios.post(
				'http://127.0.0.1:8000/api/login',
				{ email, password },
				{ withCredentials: true }
			);

			if (response.status === 200) {
				onLogin(); // Обновляем isAuth в App
				navigate('/dashboard'); // Редирект
			}
		} catch (error) {
			console.error('Ошибка входа:', error);
			alert('Неверный email или пароль');
		}
	};

	return (
		<div className='auth-page'>
			<AuthForm onLogin={handleLogin} />
		</div>
	);
};

export default Auth;
