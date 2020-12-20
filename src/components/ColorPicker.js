import React, { useState, useEffect } from 'react'
import randomColor from 'randomcolor'

export default function ColorPicker({ colors = [], activeColor, setActiveColor }) {
	if (!colors.length) return null
	
	return (
		<fieldset className="color-picker">
			{colors.map((color, i) => (
				<label key={i}>
				<input
					name="color"
					type="radio"
					value={color.value}
					checked={activeColor.value === color.value}
					onChange={() => setActiveColor(color)}
				/>
				<span style={{ background: color.value }} />
			</label>
			))}
		</fieldset>
	)
}
