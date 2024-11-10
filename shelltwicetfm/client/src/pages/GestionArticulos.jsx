import { useState, useEffect } from 'react';
import styles from '../styles/GestionArticulos.module.css';

const GestionArticulos = () => {
    const [articulos, setArticulos] = useState([]);
    const [estadoArticuloSearch, setEstadoArticuloSearch] = useState('');
    const [precioArticuloSearch, setPrecioArticuloSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [articulosPerPage] = useState(5);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState(""); 

    const fetchArticulos = async () => {
        try {
            const response = await fetch("http://localhost:3001/articulo/todos", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Artículos obtenidos:', data);
            setArticulos(data || []);
        } catch (error) {
            console.error("Error al cargar los artículos:", error);
            setArticulos([]);
        }
    };

    useEffect(() => {
        fetchArticulos();
    }, []);

    // Filtrar los artículos según los valores de estado y precio
    const filteredArticulos = articulos.filter((articulo) => {
        const matchesEstado = estadoArticuloSearch ? articulo.estado.toLowerCase().includes(estadoArticuloSearch.toLowerCase()) : true;
        
        // Filtrar los artículos por precio exacto
        const matchesPrecio = precioArticuloSearch ? articulo.precio === parseFloat(precioArticuloSearch) : true;
        
        return matchesEstado && matchesPrecio;
    });

    // Paginación: calcular los artículos que se mostrarán en la página actual
    const indexOfLastArticulo = currentPage * articulosPerPage;
    const indexOfFirstArticulo = indexOfLastArticulo - articulosPerPage;
    const currentArticulos = filteredArticulos.slice(indexOfFirstArticulo, indexOfLastArticulo);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredArticulos.length / articulosPerPage);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/articulo/borrarArticulo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
    
            if (response.ok) {
                // Si la eliminación es exitosa, muestra el toast con un mensaje de éxito
                setToastMessage("Artículo eliminado correctamente.");
                setShowToast(true);
    
                // Filtrar el artículo eliminado de la lista
                setArticulos(articulos.filter(articulo => articulo._id !== id));
                console.log("Artículo eliminado correctamente.");
            } else {
                const errorData = await response.json();
                setToastMessage(`Error: ${errorData.message}`);
                setShowToast(true);
                throw new Error(errorData.message || 'Error al borrar el artículo');
            }
        } catch (error) {
            console.error("Error al eliminar el artículo:", error);
            setToastMessage("Error al eliminar el artículo.");
            setShowToast(true);
        }
    };

    return (
        <div className="container mt-5 p-4 border rounded">
            <h2>Búsqueda de Artículos</h2>
            <div className="row mb-4">
                {/* Columna para el campo "Estado" */}
                <div className="col-md-3 col-12 mb-3">
                    <div className="mb-3">
                        <label htmlFor="estadoArticulo" className="form-label">Estado</label>
                        <input
                            type="text"
                            className={`form-control ${styles.input}`}
                            id="estadoArticulo"
                            placeholder="Buscar por estado"
                            value={estadoArticuloSearch}
                            onChange={(e) => setEstadoArticuloSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Columna para el campo "Precio" */}
                <div className="col-md-3 col-12 mb-3">
                    <div className="mb-3">
                        <label htmlFor="precioArticulo" className="form-label">Precio</label>
                        <input
                            type="number"
                            className={`form-control ${styles.input}`}
                            id="precioArticulo"
                            placeholder="Buscar por precio"
                            value={precioArticuloSearch}
                            onChange={(e) => setPrecioArticuloSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Fila con los botones */}
                <div className="col-12 d-flex justify-content-start mb-3">
                    <button
                        type="button"
                        className="btn btn-success me-2"
                    >
                        Buscar
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => {
                            setEstadoArticuloSearch('');
                            setPrecioArticuloSearch('');
                            setCurrentPage(1);
                        }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Tabla para mostrar los artículos */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="text-center">ID Artículo</th>
                        <th className="text-center">Título</th>
                        <th className="text-center">Precio</th>
                        <th className="text-center">Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(currentArticulos) && currentArticulos.length > 0 ? (
                        currentArticulos.map((articulo) => (
                            <tr key={articulo._id}>
                                <td className="text-center">{articulo._id}</td>
                                <td className="text-center">{articulo.titulo}</td>
                                <td className="text-center">{articulo.precio}</td>
                                <td className="text-center">{articulo.estado}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(articulo._id)}
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No hay artículos disponibles.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginación */}
            <nav>
                <ul className="pagination justify-content-center">
                    {[...Array(totalPages)].map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Toast de Bootstrap que aparece cuando se elimina un artículo */}
            {showToast && (
                <div className="toast align-items-center text-white bg-success border-0" style={{ position: 'fixed', top: '20px', right: '20px' }} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {toastMessage}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)} aria-label="Close"></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionArticulos;
