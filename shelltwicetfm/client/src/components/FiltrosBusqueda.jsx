import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import style from '../styles/FiltrosBusqueda.module.css';

// eslint-disable-next-line react/prop-types
const FiltrosBusqueda = ({ onFilterChange }) => {
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onFilterChange({ precioMin, precioMax });
    };

    const handleReset = () => {
        setPrecioMin('');
        setPrecioMax('');
        onFilterChange({ precioMin: '', precioMax: '' });
    };

    return (
        <Form onSubmit={handleSubmit} className={style.filtros_form}>
            <Form.Group controlId="formPrecioMin">
                <Form.Label>Precio Mínimo</Form.Label>
                <Form.Control
                    type="number"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    placeholder="Mínimo"
                    className={style.inputFiltro}
                />
            </Form.Group>

            <Form.Group controlId="formPrecioMax" className="mt-3">
                <Form.Label>Precio Máximo</Form.Label>
                <Form.Control
                    type="number"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    placeholder="Máximo"
                    className={style.inputFiltro}
                />
            </Form.Group>

            <div className="mt-4 d-flex justify-content-between">
                <Button type="submit" variant="primary" className={`w-50 ${style.boton_aplicar}`}>
                    Filtrar
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className={`w-50 ms-3 ${style.boton_aplicar}`}
                    onClick={handleReset}
                >
                    Borrar
                </Button>
            </div>
        </Form>
    );
};

export default FiltrosBusqueda;
