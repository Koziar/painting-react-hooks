import React, { useCallback, useEffect, useRef, useState } from 'react';
import randomColor from 'randomcolor';
import Name from './Name';
import Canvas from './Canvas'
import ColorPicker from './ColorPicker'
import RefreshButton from './RefreshButton'
import useWindowSize from './WindowSize';

export default function Paint() {
	const [colors, setColors] = useState([]);
	const [activeColor, setActiveColor] = useState({
		name: '',
		value: null
	});
	
	const getColors = useCallback(() => {
		const baseColor = randomColor().slice(1);
		fetch(`https://www.thecolorapi.com/scheme?hex=${baseColor}&count=8&mode=analogic`)
		.then(res => res.json())
    	.then(res => {
			setColors(res.colors.map(color => ({
				name: color.name.value,
				value: color.hex.value
			})));
			setActiveColor({
				name: res.colors[0].name.value,
				value: res.colors[0].hex.value
			});
		});
	}, []);
	useEffect(getColors, []);

	const headerRef = useRef({ offsetHeight: 0 });

	const [visible, setVisible] = useState(false);
	const timeoutId = useRef();
	const [windowWidth, windowHeight] = useWindowSize(() => {
		setVisible(true);
		clearTimeout(timeoutId.current);
		timeoutId.current = setTimeout(() => setVisible(false), 500);
	});

	return (
		<div>
			<header ref={headerRef} style={{ borderTop: `10px solid ${activeColor.value}` }}>
				<div>
					<Name />
				</div>
				<div style={{ marginTop: 10 }}>
					<ColorPicker
						colors={colors}
						activeColor={activeColor}
						setActiveColor={setActiveColor}
					/>
					<RefreshButton cb={getColors} />
				</div>
			</header>
			{activeColor && (
				<Canvas
					color={activeColor}
					height={window.innerHeight - headerRef.current.offsetHeight}
				/>
			)}
			<div className={`window-size ${visible ? '' : 'hidden'}`}>
				{windowWidth} x {windowHeight}
			</div>
		</div>
	);
}
