import React, { useState, Fragment, useEffect } from 'react'
import Controller from './Controller'
import Header from './Header/Header'
import './Displayer.css'

const COLOR_PRIMARY = "#3b5998"; // blue
const COLOR_SWAPPING = "#990000";
const COLOR_ITERATING = "#4e71ba"; // light blue
const COLOR_WAITING = "orange";
const COLOR_PIVOT = "#ff1065"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Displayer() {
    const [arr, setArr] = useState([])
    const [speed, setSpeed] = useState(50)
    const [size, setSize] = useState(30)

    function resetArr() {
        const containerArr = []
        for (let i = 0; i < size; i++) {
            containerArr.push(Math.floor(Math.random() * 85) + 1) // 1->55
        }
        setArr(containerArr)
    }

    function speedChange(e) {
        let newSpeed = Math.floor(e.target.value)
        setSpeed(newSpeed)
    }

    function sizeChange(e) {
        let newSize = Math.floor(e.target.value)
        setSize(newSize)
    }

    useEffect(() => resetArr(), [size])

    async function aniIterating(arr) {
        for (let i = 0; i < arr.length; i++) {
            cols[arr[[i]]].style.backgroundColor = COLOR_ITERATING
        }
        await sleep((80 - speed) * 3)
    }

    function removeAnimation(arr) { 
        for (let i = 0; i < arr.length; i++) {
            cols[arr[i]].style.backgroundColor = COLOR_PRIMARY
        }
    }

    function aniWaiting(myArr) {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_WAITING;
        }
    }

    function aniPivot(myArr) {
        for (let i = 0; i < myArr.length; i++) {
            cols[myArr[i]].style.backgroundColor = COLOR_PIVOT;
        }
    }

    const cols = document.getElementsByClassName('column')

    async function animationSwap(a, b) {
        cols[a].style.backgroundColor = COLOR_SWAPPING
        cols[b].style.backgroundColor = COLOR_SWAPPING

        await sleep((80 - speed) * 3)

        let tempHeight = cols[a].style.height;
        cols[a].style.height = cols[b].style.height;
        cols[b].style.height = tempHeight;

        let tempInner = cols[a].innerHTML;
        cols[a].innerHTML = cols[b].innerHTML;
        cols[b].innerHTML = tempInner;

        await sleep((80 - speed) * 3);
        await aniIterating([a, b]);
        removeAnimation([a, b]);
    }

    function toggleSort() {
        const buttons = document.getElementsByClassName('btn')
        const sliders = document.getElementsByTagName('input')
        for (const el of buttons) {
            el.disabled = !el.disabled
        }
        for (const el of sliders) {
            el.disabled = !el.disabled
        }
    }

    // ALGORITHMS
    async function bubbleSort() {
        toggleSort()
        let tempArr = [...arr]
        for (let i = 0; i < size - 1; i++) {
            let isSwapped = false
            for (let j = 0; j < size - i - 1; j++) {
                await aniIterating([j, j+1]) // changing colors
                if (tempArr[j] > tempArr[j+1]) {
                    let a = tempArr[j]
                    tempArr[j] = tempArr[j+1]
                    tempArr[j+1] = a
                    await animationSwap(j, j+1) // change colors and swap height
                    isSwapped = true
                }
                removeAnimation([j, j+1])
            }
            if (!isSwapped) break
        }
        toggleSort()
        setArr(tempArr)
    }

    async function selectionSort() {
        toggleSort()
        let tempArr = [...arr]
        for (let i = 0; i < size - 1; i++) {
            let minIndex = i + 1
            aniWaiting([minIndex])
            for (let j = i+1; j < size; j++) {
                await aniIterating([i, j])
                removeAnimation([j])
                aniWaiting([minIndex])
                if (tempArr[j] < tempArr[minIndex]) {
                    removeAnimation([minIndex])
                    minIndex = j
                    aniWaiting([minIndex])
                }
            }
            if (tempArr[minIndex] < tempArr[i]) {
                let a = tempArr[minIndex]
                tempArr[minIndex] = tempArr[i]
                tempArr[i] = a
                await animationSwap(minIndex, i)
                removeAnimation([minIndex, i])
            }
            removeAnimation([i])
            removeAnimation([i+1])
        }
        toggleSort()
        setArr(tempArr)
    }

    async function partition(arr, low, high) {
        let pivot = arr[high]
        aniPivot([high])
        let i = low - 1
        aniWaiting([i+1])
        for (let j = low; j <= high - 1; j++) {
            await aniIterating([j])
            aniWaiting([i+1])
            if (arr[j] < pivot) {
                removeAnimation([i+1])
                i += 1
                let temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
                await animationSwap(i, j)
                aniWaiting([i + 1])
            }
            if (j !== i+1) {
                removeAnimation([j])
            }
        }
        let temp = arr[i+1]
        arr[i+1] = arr[high]
        arr[high] = temp
        await sleep((80 - speed) * 5)
        await animationSwap(i+1, high)
        return (i+1)
    }

    async function quickSort(arr, low, high) {
        if (low < high) {
            let pIdx = await partition(arr, low, high)
            await quickSort(arr, low, pIdx-1)
            await quickSort(arr,pIdx+1, high)
        }
    }

    async function callQuickSort() {
        toggleSort()
        let tempArr = [...arr]
        await quickSort(tempArr, 0, tempArr.length-1)
        toggleSort()
        setArr(tempArr)
    }

    async function insertSort() {
        toggleSort()
        let tempArr = [...arr]
        let array = tempArr;
        for (let i = 0; i < size; i++) {
            let j = i;
            let temp = array[j];
            while (j > 0 && temp < array[j - 1]) {
                array[j] = array[j - 1];
                j -= 1;
                await animationSwap(j, j+1)
            }
            array[j] = temp;
            removeAnimation([j, j+1])
        }
        toggleSort()
        setArr(tempArr)
    }

    return (
        <Fragment>
            <Header />
            <div className="container">
                <div className="columns">
                    {
                        (arr).map((el, id) => {
                            return (
                                <div key={id} className="column" style={{height:`${el}%`}}></div>
                            )
                        })
                    }
                </div>
                <Controller 
                    reset={resetArr}
                    ss={selectionSort}
                    bs={bubbleSort}
                    qs={callQuickSort}
                    is={insertSort}
                    speed={speed}
                    changeSpeed={speedChange}
                    size={size}
                    changeSize={sizeChange}
                />
            </div>
        </Fragment>
    )
}
