import React from 'react'

export default function Controller({ reset, ss, bs, qs, speed, changeSpeed, size, changeSize }) {
    return (
        <div className="controller">
            <button className="btn" onClick={reset}>Genereate Array</button>
            <button className="btn" onClick={bs}>Bubble Sort</button>
            <button className="btn" onClick={ss}>Selection Sort</button>
            <button className="btn" onClick={qs}>Quicks Sort</button>
            <div className="slider">
                <input type="range" id="speed" name="speed" min="0" max="75" step="any"
                    value={speed}
                    onChange={e => changeSpeed(e)}/>
                <label htmlFor="speed">Speed</label>
            </div>
            <div className="slider">
                <input type="range" id="size" name="size" min="4" max="40" step="1"
                    value={size}
                    onChange={e => changeSize(e)}/>
                <label htmlFor="size">Size</label>
            </div>
        </div>
    )
}