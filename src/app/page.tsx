"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./styles.css";
import { create } from "domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [xMatrix, setxMatrix] = useState(5);
    const [yMatrix, setyMatrix] = useState(5);
    const [matrix, setMatrix] = useState<number[][]>([]); // Initialize a 5x5 matrix with zeros
    const [bufferMatrix, setBufferMatrix] = useState<number[][]>([]); // Initialize a 5x5 matrix with zeros
    const x = 5; // replace with your desired number of rows
    const y = 5; // replace with your desired number of columns
    const xnumber = useRef<HTMLInputElement>(null);
    const ynumber = useRef<HTMLInputElement>(null);

    function createMatrix(x: number, y: number) {
        const matrix: number[][] = [];
        for (let i = 0; i < x; i++) {
            matrix[i] = new Array(y).fill(0); // Initialize each row with zeros
        }
        setMatrix(matrix);
    }

    function handleResize() {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
    }

    function handleXYChange() {
        // check if value is divisible by 2
        if (xnumber.current && ynumber.current) {
            if (parseInt(xnumber.current.value) % 2 !== 0 || parseInt(ynumber.current.value) % 2 !== 0) {
                toast.error("Please enter a number divisible by 2");
                return;
            }
        }
        toast.success("Matrix Changed");
        const xValue = xnumber.current ? parseInt(xnumber.current.value) : 1;
        const yValue = ynumber.current ? parseInt(ynumber.current.value) : 1;
        setxMatrix(xValue > 1 ? xValue : 1);
        setyMatrix(yValue > 1 ? yValue : 1);
        createMatrix(xValue, yValue);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        console.log(`xMatrix: ${xMatrix}, yMatrix: ${yMatrix}`);
        console.log(`Matrix : ${matrix}`);
    }, [xMatrix, yMatrix, matrix]);

    return (
        <>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    position: "absolute",
                    justifySelf: "center",
                    flexDirection: "row",
                    padding: "1em",
                    height: "5em",
                    alignItems: "center",
                    borderRadius: "0.5em",
                    border: "1px solid red",
                    zIndex: 100,
                }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ padding: "0.25em" }}>length</div>
                        <input type='number' ref={xnumber}></input>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={{ padding: "0.25em" }}>height</div>
                        <input type='number' ref={ynumber}></input>
                    </div>
                </div>
                <button style={{ height: "100%", margin: "1em", padding: "0.5em" }} onClick={handleXYChange}>
                    Generate Next
                </button>
                <button style={{ height: "100%", padding: "0.5em" }}>Stop Generating</button>
            </div>
            <div
                className='grid-container'
                style={{ gridTemplateColumns: `repeat(${xMatrix}, 1fr)`, gridTemplateRows: `repeat(${yMatrix}, 1fr)` }}>
                {Array.from({ length: xMatrix * yMatrix }).map((_, index) => (
                    <div key={index} className='grid-item' onClick={()=>console.log(index+1)}>
                        Item {index + 1}
                    </div>
                ))}
            </div>
        </>
    );
}
