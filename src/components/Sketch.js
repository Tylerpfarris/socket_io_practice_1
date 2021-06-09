import React, { useEffect, useRef } from 'react';
import P5 from 'p5';
import io from 'socket.io-client';
const socket = io('https://salty-chamber-55261.herokuapp.com/');

export const SketchComponent = () => {
    const color = randomColor();
    const strokeWidth = 25;
    const canvasRef = useRef();

    const randomColor = () => {
        let hexColor = '#';
        for(let i = 0; i < 6; i++) {
            const random = Math.random();
            const bit = (random * 16) | 0;
            hexColor += bit.toString(16);
        }
        return hexColor;
    };

    useEffect(() => {
        const myp5 = new P5(Sketch, canvasRef.current);
        return myp5;
    }, []);

   
    const Sketch = (p) => {
        p.setup = () => {
            p.createCanvas(2000, 2000);
            p.background(color);
            
            socket.on('mouse response', data => {
                p.stroke(data.color);
                p.strokeWeight(data.strokeWidth);
                p.line(data.x, data.y, data.px, data.py);
            });
        };

        p.mouseDragged = () => {
            p.stroke(color);
            p.strokeWeight(4);
            p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
            sendMouse(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        }; 
        function sendMouse(x, y, pX, pY) {
            const data = {
                x,
                y,
                px: pX,
                py: pY,
                color,
                strokeWidth,
            };
            socket.emit('transmit mouse', data);   
        }
    };
    return (
        <div ref={canvasRef}></div>
    );
};
