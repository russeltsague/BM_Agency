import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  images: string[];
  interval?: number; // milliseconds
}

const HeroSection: React.FC<HeroSectionProps> = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <section className="hero-section">
      <div className="hero-image-container">
        <Image
          src={images[currentIndex]}
          alt={`Hero image ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          priority={true}
        />
      </div>
      {/* Add any overlay text or buttons here */}
    </section>
  );
};

export default HeroSection;

/*
Usage example:

import HeroSection from '../components/HeroSection';

const images = [
  '/image1.jpg',
  '/image2.jpg',
  '/image3.jpg'
];

export default function Home() {
  return <HeroSection images={images} interval={4000} />;
}
*/
