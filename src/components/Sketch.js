// https://cors-anywhere.herokuapp.com/
//https://salty-chamber-55261.herokuapp.com/
//http://localhost:8000
import React, { useEffect, useRef } from 'react';
import P5 from 'p5';
import io from 'socket.io-client';
const socket = io('https://salty-chamber-55261.herokuapp.com/',
    {
        withCredentials: true,
        transportOptions: {
            polling: {
                extraHeaders: {
                    'Access-Control-Allow-Origin': 'http://modest-hoover-a49330.netlify.app',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
                    'Access-Control-Allow-Headers': 'req-header',
                    'Access-Control-Allow-Credentials': true
                }
            }
        }
    }
);


// // Start the socket connection


// // Callback function



export const SketchComponent = () => {
    // const colorRef = useRef(null);
    // const lineWeightRef = useRef(null);
    const color = '#FF0000'; 
    const strokeWidth = 4;
    // const myRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        // myRef.current = io();
        const myp5 = new P5(Sketch, canvasRef.current);

       
        return myp5;
    
    }, []);

   
    const Sketch = (p) => {
        p.setup = () => {
            p.createCanvas(800, 800);
            p.background(255, 255, 255);
            
            socket.on('mouse response', data => {
                p.stroke(data.color);
                p.strokeWeight(data.strokeWidth);
                p.line(data.x, data.y, data.px, data.py);
            });

        };

        p.mouseDragged = () => {
            p.stroke('#FF0000');
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
            console.log(socket.emit('transmit mouse', data));
      
        }


    };
    return (
        <div ref={canvasRef}></div>

    );
};
