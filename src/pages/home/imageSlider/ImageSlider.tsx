import * as React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css";

interface IImageSliderProps {
    images: string[];
}

export const ImageSlider: React.FC<IImageSliderProps> = ({ images }) => {
    const settings = {
        centerMode: true,
        centerPadding: '20%', // Show 20% of adjacent images
        slidesToShow: 1,
        infinite: true,
        dots: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="slide">
                        <img src={image} alt={`Slide ${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};
