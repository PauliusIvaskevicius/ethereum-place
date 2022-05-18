import React, { useEffect, useState } from "react";
import { CompactPicker } from "react-color";
import colors from "../colors";
import { placeTile } from "../EthPlace";
import "../index.css";
import { useMoralis } from "react-moralis";

const GridItem = ({ color, x, y, isDragging }) => {
	const [isColorPicker, setIsColorPicker] = useState(false);
	const [stateColor, setStateColor] = useState(color);
	const { provider } = useMoralis();

	useEffect(() => {
		setStateColor(color);
	}, [color]);

	const decimalToHex = (d, padding) => {
		var hex = Number(d).toString(16);
		padding = typeof padding === "undefined" || padding === null ? (padding = 2) : padding;

		while (hex.length < padding) {
			hex = "0" + hex;
		}

		return hex;
	};

	const onHandleClick = (e) => {
		if (!isDragging) {
			setIsColorPicker(!isColorPicker);
		}
	};

	const onHandleClose = (e) => {};

	const onColorChange = (e) => {
		const onColor = async () => {
			let hexNumber = `0x${decimalToHex(colors.indexOf(e.hex), 2)}`;
			await placeTile(x, y, hexNumber, provider);
			setStateColor(e.hex);
		};

		onColor();
	};

	const onColorPickerClose = (e) => {};

	return (
		<div className="GridItem" onClick={onHandleClick} style={{ backgroundColor: stateColor }}>
			{isColorPicker ? (
				<div className="GridItemPopover">
					<div className="GridItemCover" onClick={onHandleClose} />
					<CompactPicker color={color} colors={colors} onChange={onColorChange} onChangeComplete={onColorPickerClose} />
				</div>
			) : null}
		</div>
	);
};

export default GridItem;
