import { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/CrearAnuncio.module.css';

const CrearAnuncio = ({ show, onClose }) => {
    const { userId } = useAuth();
    const [titulo, setTitulo] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [foto, setFoto] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [etiquetas, setEtiquetas] = useState([]);
    const [showExitoModal, setShowExitoModal] = useState(false);

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const response = await fetch('http://localhost:3001/categoria/list-categorias');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setCategorias(data);
                } else {
                    console.error('El formato de las categorías no es válido.');
                }
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        obtenerCategorias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
            console.error('No se puede crear el anuncio: el userId es indefinido.');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('precio', precio);
        formData.append('descripcion', descripcion);
        formData.append('ubicacion', ubicacion);
        formData.append('categoria', categoriaSeleccionada);
        formData.append('imagen', foto);
        formData.append('usuario_id', userId);
        formData.append('etiquetas', JSON.stringify(etiquetas.split(',').map(tag => tag.trim())));

        try {
            const response = await fetch('http://localhost:3001/articulo/crearArticulo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setShowExitoModal(true);

                setTitulo('');
                setPrecio('');
                setDescripcion('');
                setUbicacion('');
                setFoto(null);
                setCategoriaSeleccionada('');
                setEtiquetas('');

                console.log('Anuncio creado correctamente: '+data);
            } else {
                console.error('Error al crear el anuncio');
            }
        } catch (error) {
            console.error('Error en el envío:', error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Anuncio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitulo">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Título del artículo"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrecio" className="mt-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                placeholder="Precio"
                                required
                                min="0"
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescripcion" className="mt-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Descripción del artículo"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formUbicacion" className="mt-3">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                                placeholder="Ubicación del artículo"
                                required
                            />
                        </Form.Group>

                        {/* Añadir el nuevo campo para etiquetas */}
                        <Form.Group controlId="formEtiquetas" className="mt-3">
                            <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                            <Form.Control
                                type="text"
                                value={etiquetas}
                                onChange={(e) => setEtiquetas(e.target.value)}
                                placeholder="Etiquetas (ej: artículo seminuevo)"
                            />
                        </Form.Group>

                        <Form.Group controlId="formCategoria" className={`mt-3 ${styles.categoria_group}`}>
                            <Form.Label>Selecciona Categoría</Form.Label>
                            {categorias.length > 0 ? (
                                categorias.map((categoria) => (
                                    <Form.Check
                                        key={categoria._id}
                                        type="radio"
                                        label={categoria.titulo}
                                        value={categoria._id}
                                        name="categoria"
                                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                        className={styles.custom_radio_bootstrap}
                                        required
                                    />
                                ))
                            ) : (
                                <p>Cargando categorías...</p>
                            )}
                        </Form.Group>

                        <Form.Group controlId="formFoto" className="mt-3">
                            <Form.Label>Subir Foto</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setFoto(e.target.files[0])}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-4">
                            Publicar Anuncio
                        </Button>
                        <Button variant="secondary" className="mt-4 ms-2" onClick={onClose}>
                            Cancelar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de éxito */}
            <Modal show={showExitoModal} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Éxito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¡El anuncio ha sido creado correctamente!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {
                        setShowExitoModal(false);
                        onClose();
                    }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CrearAnuncio;
