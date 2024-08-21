import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Articulos from './pages/Articulos';
import ArticuloDetails from './pages/ArticuloDetails';
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
					<Route path="/articulo/:id" element={<ArticuloDetails />} />
				</Routes>
			</BrowserRouter>
		</>
    )
}

export default App
