import React, { useState, useEffect } from "react";
import GridItem from "./GridItem";
import "../index.css";
import { useMoralis } from "react-moralis";
import { parseMapData, getAllTileColors, subscribeTileUpdate } from "../EthPlace";
import { Skeleton } from "@chakra-ui/react";

const Grid = ({ isDragging }) => {
	const { enableWeb3, provider } = useMoralis();
	const [dimensions, setDimensions] = useState(5);
	const [mapData, setMapData] = useState(null);
	const [listenerLive, setListenerLive] = useState(false);

	useEffect(() => {
		enableWeb3();
	}, []);

	useEffect(() => {
		const onTileUpdate = () => {
			setListenerLive(true);
			subscribeTileUpdate(provider, (x, y, color) => {
				console.log({ x, y, color });
				let currentMapData = mapData;
				currentMapData[x][y].color = color;
				setMapData([...currentMapData]);
			});
		};

		if (provider && mapData && !listenerLive) onTileUpdate();
	}, [provider, mapData, listenerLive]);
	
	useEffect(() => {
		const fetchGrid = async () => {
			let line = await getAllTileColors(provider);
			setMapData([...parseMapData(line)]);
		};

		if (provider && mapData == null) fetchGrid();
	}, [provider, mapData]);


	const onScroll = (e) => {
		let zoomIn = e.deltaY < 0;
		let value = zoomIn ? 1 : -1;

		let newValue = Math.max(0, Math.min(100, dimensions + value));
		setDimensions(newValue);
	};

	return (
		<div>
			<Skeleton isLoaded={mapData != null} style={{ width: `${dimensions * 100}px`, height: `${dimensions * 100}px` }}>
				{mapData && (
					<div
						onWheelCapture={onScroll}
						style={{
							flexDirection: "column",
							display: "flex",
							width: `${dimensions * mapData.length}px`,
							height: `${dimensions * mapData.length}px`,
						}}
					>
						{mapData.map((rowItem, index) => {
							return (
								<div className="GridRow" key={index}>
									{rowItem.map((item) => {
										return <GridItem key={item.id} color={item.color} x={item.x} y={item.y} isDragging={isDragging} />;
									})}
								</div>
							);
						})}
					</div>
				)}
			</Skeleton>
		</div>
	);
};

export default Grid;
