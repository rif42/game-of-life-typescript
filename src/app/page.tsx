"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./styles.css";
import { create } from "domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [xMatrix, setxMatrix] = useState(5);
    const [yMatrix, setyMatrix] = useState(5);
    const [matrix, setMatrix] = useState<number[]>([]); // Initialize a 5x5 matrix with zeros
    const [bufferMatrix, setBufferMatrix] = useState<number[]>([]); // Initialize a 5x5 matrix with zeros
    const x = 5; // replace with your desired number of rows
    const y = 5; // replace with your desired number of columns
    const xnumber = useRef<HTMLInputElement>(null);
    const ynumber = useRef<HTMLInputElement>(null);

    function createMatrix(x: number, y: number) {
        setMatrix(new Array(x * y).fill(0));
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

    function handleMutate(index: number) {
        const newMatrix = [...matrix];
        if (newMatrix[index] === 1) newMatrix[index] = 0;
        else {
            newMatrix[index] = 1;
        }
        setMatrix(newMatrix);
    }

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
                <button style={{ height: "100%", marginLeft: "1em", padding: "0.5em" }} onClick={handleXYChange}>
                    Change Matrix Size
                </button>
                <button style={{ height: "100%", marginLeft: "1em", padding: "0.5em" }}>Generate Next</button>
                <button style={{ height: "100%", marginLeft: "1em", padding: "0.5em" }}>Stop Generating</button>
            </div>
            <div
                className='grid-container'
                style={{
                    gridTemplateColumns: `repeat(${xMatrix}, minmax(1px, 1fr))`,
                    gridTemplateRows: `repeat(${yMatrix}, minmax(1px, 1fr))`,
                }}>
                {matrix.map((value, index) =>
                    value === 1 ? (
                        <div key={index} className='alive' onClick={() => handleMutate(index)}></div>
                    ) : (
                        <div key={index} className='dead' onClick={() => handleMutate(index)}></div>
                    )
                )}
            </div>
        </>
    );
}
