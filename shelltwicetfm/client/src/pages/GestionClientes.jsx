import styles from '../styles/GestionClientes.module.css';
import { useEffect, useState } from 'react';

const GestionClientes = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usernameSearch, setUsernameSearch] = useState('');
    const [emailSearch, setEmailSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(4);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Función para obtener los usuarios
    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3001/users/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setUsuarios(data);
            setLoading(false);
        } catch (error) {
            setError('Error al cargar los usuarios');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleSearch = () => {
        const filteredUsers = usuarios.filter((usuario) => {
            const matchesUsername = usernameSearch ? usuario.username.toLowerCase().includes(usernameSearch.toLowerCase()) : true;
            const matchesEmail = emailSearch ? usuario.email.toLowerCase().includes(emailSearch.toLowerCase()) : true;
            return matchesUsername && matchesEmail;
        });
        setUsuarios(filteredUsers);
    };

    const handleReset = () => {
        setUsernameSearch('');
        setEmailSearch('');
        fetchUsuarios();
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                setUsuarios(usuarios.filter(usuario => usuario._id !== userId));
                setToastMessage('Usuario eliminado correctamente');
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
            } else {
                setToastMessage(data.message);
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            alert("Hubo un error al eliminar el usuario.");
        }
    };

    const handleChangeUserState = async (userId, newState) => {
        try {
            const response = await fetch(`http://localhost:3001/users/cambiarEstadoUsuario/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: newState }),
            });

            const data = await response.json();
            if (response.status === 200) {
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((usuario) =>
                        usuario._id === userId ? { ...usuario, estado: newState } : usuario
                    )
                );
                setToastMessage('Estado del usuario actualizado correctamente');
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
                setSelectedUser(null); // Cerrar el modal después de actualizar el estado
            } else {
                setToastMessage(data.message);
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
            alert("Hubo un error al actualizar el estado.");
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);

    // Cambiar página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="container mt-5 p-4 border rounded">
                <div className="row mb-4">
                    <div className="col">
                        <h2>Búsqueda clientes</h2>
                    </div>
                </div>

                {/* Fila de los filtros (inputs) */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Buscar por username"
                                value={usernameSearch}
                                onChange={(e) => setUsernameSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Buscar por email"
                                value={emailSearch}
                                onChange={(e) => setEmailSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <button
                            type="button"
                            className={`btn btn-success ${styles.boton_buscar}`}
                            onClick={handleSearch}
                        >
                            Buscar
                        </button>
                        <button
                            type="button"
                            className={`btn btn-warning ${styles.boton_buscar}`}
                            onClick={handleReset}
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="row mb-4">
                    <div className="col">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Id_usuario</th>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Anuncios publicados</th>
                                    <th>Estado</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((usuario) => (
                                    <tr key={usuario._id}>
                                        <td>{usuario._id}</td>
                                        <td>{usuario.name}</td>
                                        <td>{usuario.username}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.anuncios || 0}</td>
                                        <td>{usuario.estado}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setSelectedUser(usuario)}
                                            >
                                                Abrir
                                            </button>
                                            <button
                                                className="btn btn-danger ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(usuario._id);
                                                }}
                                            >
                                                Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Paginación */}
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: Math.ceil(usuarios.length / usersPerPage) }).map((_, index) => (
                                    <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className="page-link"
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Modal de detalles del usuario */}
                {selectedUser && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="userModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="userModalLabel">Detalles del usuario</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setSelectedUser(null)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Id_usuario:</strong> {selectedUser._id}</p>
                                    <p><strong>Name:</strong> {selectedUser.name}</p>
                                    <p><strong>Username:</strong> {selectedUser.username}</p>
                                    <p><strong>Email:</strong> {selectedUser.email}</p>
                                    <p><strong>Anuncios publicados:</strong> {selectedUser.anuncios || 0}</p>
                                    <p><strong>Estado:</strong> {selectedUser.estado}</p>
                                </div>
                                <div className="modal-footer">
                                    {selectedUser.estado === 'Activo' ? (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleChangeUserState(selectedUser._id, 'Inactivo')}
                                        >
                                            Desactivar
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            onClick={() => handleChangeUserState(selectedUser._id, 'Activo')}
                                        >
                                            Activar
                                        </button>
                                    )}
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast de Bootstrap */}
                {showToast && (
                    <div
                        className="toast show position-fixed bottom-0 end-0 m-3"
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                        style={{ zIndex: 1050 }}
                    >
                        <div className="toast-header">
                            <strong className="me-auto">Notificación</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div className="toast-body">
                            {toastMessage}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GestionClientes;
