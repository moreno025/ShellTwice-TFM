import style from '../../styles/Main.module.css';
import Carousel from "../CarouselLayout";
import CategoriaList from "../CategoriaList";

const Main = () => {
    return (
        <>
        <div className={style.main_container}>
            <Carousel />
            <CategoriaList />
        </div>
        </>
    );
};

export default Main;