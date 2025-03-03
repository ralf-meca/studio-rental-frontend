import * as React from 'react';
import {useEffect, useRef} from "react"; // Make sure to include the CSS file

interface IScrollFadeInProps{
    children: React.ReactNode,
    isSecond?: boolean
}

const ScrollFadeIn : React.FC<IScrollFadeInProps> = ({children, isSecond = false}) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // Stop observing once it's visible
                    }
                });
            },
            { threshold: 0.1 } // Adjust threshold as needed
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    return (
        <div className={`scroll-fade-in${isSecond ? "-second" : ""}`} ref={elementRef}>
            {children}
        </div>
    );
};

export default ScrollFadeIn;
