import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Index from './pages/index';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		axios
			.get('http://127.0.0.1:8000/api/me', { withCredentials: true })
			.then(() => setIsAuth(true))
			.catch(() => setIsAuth(false));
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Index />} />
					<Route path='/auth' element={<Auth />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
