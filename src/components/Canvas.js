import React, { useEffect, useRef, useState } from 'react'
import useWindowSize from './WindowSize';

export default function Canvas(props) {
	const [drawing, setDrawing] = useState(false);
	const [[canvasWidth, canvasHeight], setCanvasSize] = useState([window.innerWidth, window.innerHeight]);
	const [windowWidth, windowHeight] = useWindowSize(() => {
		setCanvasSize([windowWidth, windowHeight]);
	});
	const canvasRef = useRef();
	const ctx = useRef();

	useEffect(() => {
		ctx.current = canvasRef.current.getContext('2d');
	}, []);

	const handleMouseMove = (event) => {
		// actual coordinates
		const coords = [
			event.clientX - canvasRef.current.offsetLeft,
			event.clientY - canvasRef.current.offsetTop
		]

		if (drawing) { 
			ctx.current.lineTo(...coords)
			ctx.current.stroke()
		}

		if (props.handleMouseMove) {
			props.handleMouseMove(...coords)
		}
	};

	const startDrawing = (event) => {
		ctx.current.lineJoin = 'round';
		ctx.current.lineCap = 'round';
		ctx.current.lineWidth = 10;
		ctx.current.strokeStyle = props.color.value;
		ctx.current.beginPath();
		// actual coordinates
		ctx.current.moveTo(
			event.clientX - canvasRef.current.offsetLeft,
			event.clientY - canvasRef.current.offsetTop
		);

		setDrawing(true);
	};

	const stopDrawing = () => {
		ctx.current.closePath();
		setDrawing(false);
	};

	return (
		<React.Fragment>
			<canvas
				ref={canvasRef}
				width={props.width || canvasWidth}
				height={props.height || canvasHeight}
				onMouseDown={startDrawing}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				onMouseMove={handleMouseMove}
			/>
		</React.Fragment>
	)
}
