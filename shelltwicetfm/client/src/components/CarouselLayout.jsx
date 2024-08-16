import Carousel from 'react-bootstrap/Carousel';
import nike from '../assets/nike2.jpg';
import rolex from '../assets/rolex.jpg';
import chanel from '../assets/chanel.jpg';
import style from '../styles/Carousel.module.css';

function CarouselLayout() {
    return (
        <Carousel>
            <Carousel.Item interval={4000}>
                <img className={`d-block w-100 ${style.carousel_image}`} src={nike} alt="Nike" />
                <Carousel.Caption>
                    <div className={style.caption_container}>
                        <p className={style.carousel_caption}>Descubre nuestros productos</p>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={4000}>
                <img className={`d-block w-100 ${style.carousel_image}`} src={rolex} alt="Ciudad" />
            </Carousel.Item>
            <Carousel.Item interval={4000}>
                <img className={`d-block w-100 ${style.carousel_image}`} src={chanel} alt="Ciudad" />
            </Carousel.Item>
        </Carousel>
    );
}

export default CarouselLayout;
