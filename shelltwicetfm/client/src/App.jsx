import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Articulos from './pages/Articulos';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/categorias/:titulo" element={<Articulos />} />
				</Routes>
			</BrowserRouter>
		</>
    )
}

export default App
