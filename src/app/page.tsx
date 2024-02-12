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
        const xValue: number = xnumber.current ? parseInt(xnumber.current.value) : 1;
        const yValue: number = ynumber.current ? parseInt(ynumber.current.value) : 1;
        setxMatrix(xValue > 1 ? xValue : 1);
        setyMatrix(yValue > 1 ? yValue : 1);
        createMatrix(xValue, yValue);
    }

    function handleMutate(matrix_index: number) {
        const newMatrix: number[] = [...matrix];
        if (newMatrix[matrix_index] === 1) newMatrix[matrix_index] = 0;
        else {
            newMatrix[matrix_index] = 1;
        }
        setMatrix(newMatrix);
        // console.log(checkValidIndexes(matrix_index));
    }

    function generateNext(matrix_index: number) {
        const valid_matrix: number[] = checkValidIndexes(matrix_index);
        const buffer_matrix: number[] = [];
        const edge_matrix: number[] = [];
        matrix.forEach((val, index) => {
            if (index === matrix_index) {
                console.log("Left", isLeftEdgeMatrix(index));
                console.log("Right", isRightEdgeMatrix(index));
                console.log("Top", isTopEdgeMatrix(index));
                console.log("Bottom", isBottomEdgeMatrix(index));
            }
        });
    }

    function checkValidIndexes(matrix_index: number): number[] {
        const valid_indexes: number[] = [];
        const remove_indexes: number[] = [];
        for (let i = -1; i < 2; i++) {
            valid_indexes.push(matrix_index - i - xMatrix);
            valid_indexes.push(matrix_index - i);
            valid_indexes.push(matrix_index - i + xMatrix);
        }

        if (isLeftEdgeMatrix(matrix_index) == true) {
            valid_indexes.push(matrix_index - 1 - xMatrix);
            valid_indexes.push(matrix_index - 1);
            valid_indexes.push(matrix_index - 1 + xMatrix);
        }

        if (isTopEdgeMatrix(matrix_index) == true) {
            valid_indexes.push(matrix_index - 1 - xMatrix);
            valid_indexes.push(matrix_index - xMatrix);
            valid_indexes.push(matrix_index + 1 - xMatrix);
        }

        if (isLeftEdgeMatrix(matrix_index) == true) {
            valid_indexes.push(matrix_index + 1 - xMatrix);
            valid_indexes.push(matrix_index + 1);
            valid_indexes.push(matrix_index + 1 + xMatrix);
        }

        if (isBottomEdgeMatrix(matrix_index) == true) {
            valid_indexes.push(matrix_index - 1 + xMatrix);
            valid_indexes.push(matrix_index - xMatrix);
            valid_indexes.push(matrix_index + 1 + xMatrix);
        }

        let final_index = valid_indexes.filter(
            (item) => !remove_indexes.includes(item) && item >= 0 && item != matrix_index
        );
        final_index = final_index.filter((item, index) => final_index.indexOf(item) === index);
        return final_index;
    }

    function isLeftEdgeMatrix(matrix_index: number) {
        if (matrix_index % xMatrix) {
            return false;
        } else {
            return true;
        }
    }

    function isRightEdgeMatrix(matrix_index: number) {
        if ((matrix_index + 1) % xMatrix) {
            return false;
        } else {
            return true;
        }
    }

    function isTopEdgeMatrix(matrix_index: number) {
        if (matrix_index - xMatrix < 0) {
            return true;
        } else {
            return false;
        }
    }

    function isBottomEdgeMatrix(matrix_index: number) {
        if (matrix_index + xMatrix >= xMatrix * yMatrix) {
            return true;
        } else {
            return false;
        }
    }

    // useEffect(() => {
    //     console.log(`xMatrix: ${xMatrix}, yMatrix: ${yMatrix}`);
    //     console.log(`Matrix : ${matrix}`);
    // }, [xMatrix, yMatrix, matrix]);

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
