"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./styles.css";
import { create } from "domain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [xMatrix, setxMatrix] = useState<number>(5);
    const [yMatrix, setyMatrix] = useState<number>(5);
    const [matrix, setMatrix] = useState<number[]>([]); // Initialize a 5x5 matrix with zeros
    // const [bufferMatrix, setBufferMatrix] = useState<number[]>([]);
    const x = 5; // replace with your desired number of rows
    const y = 5; // replace with your desired number of columns
    const xnumber = useRef<HTMLInputElement>(null);
    const ynumber = useRef<HTMLInputElement>(null);
    const [generations, setGenerations] = useState(0);
    const [generationState, setGenerationState]= useState(0)
    // 0 reset, 1 pause, 2 play 

    function createMatrix(x: number, y: number) {
        setGenerationState(0)
        setGenerations(0)
        setMatrix(new Array(x * y).fill(0));
    }
    // const handleUpdate = () => {
    //     forceUpdate(n => n + 1); // increment state to force render
    //   };

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

    useEffect(() => {
        while (generationState === 2) {
            const intervalId = setInterval(generateNext, 1000); // run every second
            return () => {
                clearInterval(intervalId); // clear interval on component unmount
            };
        }
    });

    function generateNext() {
        const buffer_matrix: number[] = matrix;
        matrix.forEach((val, index) => {
            console.log(index);
            const valid_matrix: number[] = checkValidIndexes(index);
            // console.log(valid_matrix)
            let alive: number = 0;
            let dead: number = 0;
            valid_matrix.forEach((valid_val, valid_index) => {
                // console.log(index, valid_val,"\n")
                if (index != valid_val) {
                    if (matrix[valid_val] === 1) {
                        alive++;
                    } else {
                        dead++;
                    }
                }
            });
            // console.log("alive", alive);
            // console.log("dead", dead);

            // actual game of life rules below
            if (matrix[index] === 1) {
                console.log("cell is alive");
                if (alive < 2) {
                    // underpopulation
                    buffer_matrix[index] = 0;
                }
                if (alive === 2 || alive === 3) {
                    // lives on
                    buffer_matrix[index] = 1;
                }
                if (alive > 3) {
                    // overpopulation
                    buffer_matrix[index] = 0;
                }
            } else if (matrix[index] === 0) {
                if (alive === 3) {
                    // comes alive by reproduction
                    buffer_matrix[index] = 1;
                }
            }
        });
        setMatrix(buffer_matrix);
        console.log("done");
        setGenerations(generations + 1);
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
            remove_indexes.push(matrix_index - 1 - xMatrix);
            remove_indexes.push(matrix_index - 1);
            remove_indexes.push(matrix_index - 1 + xMatrix);
        }

        if (isTopEdgeMatrix(matrix_index) == true) {
            remove_indexes.push(matrix_index - 1 - xMatrix);
            remove_indexes.push(matrix_index - xMatrix);
            remove_indexes.push(matrix_index + 1 - xMatrix);
        }

        if (isRightEdgeMatrix(matrix_index) == true) {
            remove_indexes.push(matrix_index + 1 - xMatrix);
            remove_indexes.push(matrix_index + 1);
            remove_indexes.push(matrix_index + 1 + xMatrix);
        }

        if (isBottomEdgeMatrix(matrix_index) == true) {
            remove_indexes.push(matrix_index - 1 + xMatrix);
            remove_indexes.push(matrix_index - xMatrix);
            remove_indexes.push(matrix_index + 1 + xMatrix);
        }

        let final_indexes = valid_indexes.filter(
            (item) => !remove_indexes.includes(item) && item >= 0 && item != matrix_index
        );
        final_indexes = final_indexes.filter((item, index) => final_indexes.indexOf(item) === index);
        return final_indexes;
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
            <ToastContainer position="top-center" autoClose={1500} />
            <div className='generations-container'>Generations : {generations}</div>
            <div className='control-container'>
                <div className='flex-col'>
                    <div className='flex-row'>
                        <div style={{ padding: "0.25em" }}>length</div>
                        <input type='number' ref={xnumber}></input>
                    </div>
                    <div className='flex-row'>
                        <div style={{ padding: "0.25em" }}>height</div>
                        <input type='number' ref={ynumber}></input>
                    </div>
                </div>
                <button className='control-buttons' onClick={handleXYChange}>
                    Change Matrix Size
                </button>
                <button
                    className='control-buttons'
                    onClick={() => {
                        setGenerationState(2);
                    }}>
                    Generate Next
                </button>
                <button
                    className='control-buttons'
                    onClick={() => {
                        setGenerationState(1);
                    }}>
                    Stop Generating
                </button>
                <button
                    className='control-buttons'
                    onClick={() => {
                        createMatrix(xMatrix, yMatrix);
                    }}>
                    Reset Matrix
                </button>
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
