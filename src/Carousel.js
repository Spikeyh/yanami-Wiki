import React, { useState, useEffect } from 'react';
import './Carousel.css';

const images = [
    {
      cover: 'yanamianna.png',
      alt: 'Image 1',
      text: 'This is the first image',
    },
    {
      cover: 'image2.jpg',
      alt: 'Image 2',
      text: 'This is the second image',
    },
    {
      cover: 'image3.jpg',
      alt: 'Image 3',
      text: 'This is the third image',
    },
  ];

export default function Carousel({images}) {
    const[currentIndex,setCurrentIndex]=useState(0);
    const[isHovered,setIsHovered]=useState(false);

    useEffect(()=>{
        const interval=setInterval(()=>{
            if(!isHovered){
                setCurrentIndex((prevIndex)=>(prevIndex+1)%images.length);
            }
        },3000);
        return ()=>clearInterval(interval);
    },[isHovered,images.length]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img src={image.cover} alt={image.alt} className="carousel-image" />
            <div className="overlay">
              <p>{image.text}</p>
            </div>
          </div>
        ))}
        <div className="carousel-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    );
}