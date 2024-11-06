import { useState, useEffect } from "react";

const GestionCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [tituloCategoriaSearch, setTituloCategoriaSearch] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCategoria, setEditCategoria] = useState({
    id: "",
    titulo: "",
    imagen: null,
});

    const [newCategoria, setNewCategoria] = useState({
        titulo: "",
        imagen: null
    });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(4);

    // Función para obtener todas las categorías
    const fetchCategorias = async () => {
        try {
            const response = await fetch("http://localhost:3001/categoria/list-categorias", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
            setCategorias([]);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);    

    // Función de búsqueda
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3001/categoria/list-categorias?titulo=${tituloCategoriaSearch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = await response.json();
            setCategorias(data || []);
        } catch (error) {
            console.error("Error al buscar categorías", error);
        }
    };

    const handleReset = () => {
        setTituloCategoriaSearch('');
        fetchCategorias();
    };

    // Filtrar las categorías según el título
    const filteredCategorias = categorias.filter(categoria =>
        categoria.titulo.toLowerCase().includes(tituloCategoriaSearch.toLowerCase())
    );

    // Obtener las categorías de la página actual
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategorias.slice(indexOfFirstCategory, indexOfLastCategory);

    // Calcular el número de páginas
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCategorias.length / categoriesPerPage); i++) {
        pageNumbers.push(i);
    }

    // Cambiar la página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Función para borrar una categoría
    const handleDelete = async (titulo) => {
        try {
            const response = await fetch(`http://localhost:3001/categoria/borrarCategoria`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo })
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchCategorias();
            } else {
                alert(data.message || "Error al eliminar la categoría");
            }
        } catch (error) {
            console.error("Error al eliminar la categoría", error);
            alert("Error al eliminar la categoría");
        }
    };

    // Función para manejar el envío del formulario de creación
    const handleCreateCategoria = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('titulo', newCategoria.titulo);
        formData.append('imagen', newCategoria.imagen);
    
        try {
            const response = await fetch("http://localhost:3001/categoria/crearCategoria", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message);
                fetchCategorias();
                setShowCreateModal(false);
                setNewCategoria({ titulo: "", imagen: null });
            } else {
                alert(data.message || "Error al crear la categoría");
            }
        } catch (error) {
            console.error("Error al crear la categoría", error);
            alert("Error al crear la categoría");
        }
    };

    const handleEditCategoria = async (e) => {
        e.preventDefault();

        if (!editCategoria._id) {
            console.error("No se ha proporcionado un ID válido para la categoría.");
            alert("Error: ID no válido");
            return;
        }
    
        console.log('editCategoria:', editCategoria);
    
        const formData = new FormData();
        formData.append('titulo', editCategoria.titulo);
        formData.append('imagen', editCategoria.imagen);
    
        try {
            const response = await fetch(`http://localhost:3001/categoria/actualizarCategoria/${editCategoria._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message);
                fetchCategorias();
                setShowEditModal(false);
                setEditCategoria({ _id: "", titulo: "", imagen: null });
            } else {
                alert(data.message || "Error al actualizar la categoría");
            }
        } catch (error) {
            console.error("Error al editar la categoría", error);
            alert("Error al editar la categoría");
        }
    };
    
    

    const handleCreateModalOpen = () => {
        setShowCreateModal(true);
        setNewCategoria({ titulo: "", imagen: null });
    };

    return (
        <>
            <div className="container mt-5 p-4 border rounded">
                <h2>Búsqueda de Categorías</h2>
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="categoriaTitulo" className="form-label">Título</label>
                            <input
                                type="text"
                                className="form-control"
                                id="categoriaTitulo"
                                placeholder="Buscar por título"
                                value={tituloCategoriaSearch}
                                onChange={(e) => setTituloCategoriaSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end align-items-center">
                        <div className="d-flex">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleSearch}
                            >
                                Buscar
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning ms-2"
                                onClick={handleReset}
                            >
                                Limpiar
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary ms-2"
                                onClick={handleCreateModalOpen}
                            >
                                Crear Categoría
                            </button>
                        </div>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center">Título</th>
                            <th className="text-center">Cantidad de anuncios</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentCategories) && currentCategories.length > 0 ? (
                            currentCategories.map((categoria) => (
                                <tr key={categoria._id}>
                                    <td className="text-center">{categoria.titulo}</td>
                                    <td className="text-center">{categoria.numArticulos || 0}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => {
                                                setEditCategoria(categoria);  // Establece correctamente la categoría a editar
                                                setShowEditModal(true);  // Muestra el modal de edición
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(categoria.titulo)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No hay categorías disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Paginación */}
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        {pageNumbers.map((number) => (
                            <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(number)}>
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Modal para Crear Categoría */}
                <div
                    className={`modal fade ${showCreateModal ? 'show' : ''}`}
                    tabIndex="-1"
                    aria-labelledby="createCategoriaModal"
                    aria-hidden={!showCreateModal}
                    style={{ display: showCreateModal ? 'block' : 'none' }} // Asegura que el modal se muestre correctamente
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crear Categoría</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowCreateModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateCategoria}>
                                    <div className="mb-3">
                                        <label htmlFor="tituloCategoria" className="form-label">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            id="tituloCategoria"
                                            className="form-control"
                                            value={newCategoria.titulo}
                                            onChange={(e) =>
                                                setNewCategoria({
                                                    ...newCategoria,
                                                    titulo: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="imagenCategoria" className="form-label">
                                            Imagen
                                        </label>
                                        <input
                                            type="file"
                                            id="imagenCategoria"
                                            className="form-control"
                                            onChange={(e) =>
                                                setNewCategoria({
                                                    ...newCategoria,
                                                    imagen: e.target.files[0],
                                                })
                                            }
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Crear Categoría
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal para Editar Categoría */}
                    <div
                        className={`modal fade ${showEditModal ? 'show' : ''}`}
                        tabIndex="-1"
                        aria-labelledby="editCategoriaModal"
                        aria-hidden={!showEditModal}
                        style={{ display: showEditModal ? 'block' : 'none' }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Categoría</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowEditModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleEditCategoria}>
                                        <div className="mb-3">
                                            <label htmlFor="tituloCategoriaEdit" className="form-label">Título</label>
                                            <input
                                                type="text"
                                                id="tituloCategoriaEdit"
                                                className="form-control"
                                                value={editCategoria.titulo}
                                                onChange={(e) => setEditCategoria({ ...editCategoria, titulo: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="imagenCategoriaEdit" className="form-label">Imagen</label>
                                            <input
                                                type="file"
                                                id="imagenCategoriaEdit"
                                                className="form-control"
                                                onChange={(e) => setEditCategoria({ ...editCategoria, imagen: e.target.files[0] })}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Actualizar Categoría</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
};

export default GestionCategorias;
