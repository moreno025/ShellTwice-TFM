import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Articulos from './pages/Articulos';
import ArticuloDetails from './pages/ArticuloDetails';
import Resultados from './pages/Resultados';
import Profile from './pages/Profile';
import GestionAdmin from './pages/GestionAdmin';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const AdminRoute = ({ children }) => {
    const { rol } = useAuth();
    console.log('el rol vale: ', rol);

    if (rol === null || rol.isNaN) {
        return null;
    }

    return rol === 0 ? children : <Navigate to="/" />;
};


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
					<Route path="/resultados" element={<Resultados />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/admin" element={<AdminRoute><GestionAdmin /></AdminRoute>} />
				</Routes>
			</BrowserRouter>
		</>
    );
}

export default App;
