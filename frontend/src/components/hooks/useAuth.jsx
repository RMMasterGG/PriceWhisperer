import { useContext } from 'react';

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

// В AuthProvider добавьте методы:
const register = async (name, email, password) => {
	try {
		const response = await fetch('http://localhost:8000/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Registration failed');
		}

		return await response.json();
	} catch (error) {
		throw new Error(error.message);
	}
};

const login = async (email, password) => {
	try {
		const response = await fetch('http://localhost:8000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Login failed');
		}

		const data = await response.json();
		localStorage.setItem('token', data.token);
		setUser({ email });
	} catch (error) {
		throw new Error(error.message);
	}
};
