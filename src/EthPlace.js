import colors from "./colors";
import contractABI from "./contractABI.js";
import { ethers } from "ethers";

const contractAddress = "0x544fAa8BC8417e8729EB4F5d6baD3C932645c635";
const gridDimensions =  { matrixSize: 100, matrixLineLength: 10000 };

const subscribeTileUpdate = (provider, onUpdate) =>
{
	const ether = new ethers.providers.Web3Provider(provider);
	const signer = ether.getSigner();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);

	contract.on("ChangeTile", (color, x, y) => 
	{
		x = x.toNumber();
		y = y.toNumber();
		let hexNumber = parseInt(color, 16);
		color = colors[hexNumber];

		onUpdate(x, y, color);		
	});
}

const placeTile = async (x, y, hexColor, provider) => {
	const ether = new ethers.providers.Web3Provider(provider);
	const signer = ether.getSigner();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);

	await contract.placeTile(x, y, hexColor);
}

const getAllTileColors = async (provider) => 
{

	const ether = new ethers.providers.Web3Provider(provider);
	const signer = ether.getSigner();
	const contract = new ethers.Contract(contractAddress, contractABI, signer);

	return await contract.getAllTileColors();
}

const parseMapData = (currentLine) => {
	let drawing = [];



	for (let j = 0; j < gridDimensions.matrixLineLength; j++)
	 {
		let y = parseInt(j / gridDimensions.matrixSize);
		let x = parseInt(j % gridDimensions.matrixSize);

		if (drawing[x] == null) {
			drawing[x] = [];
		}

		let hexNumber = parseInt(currentLine[j], 16);


		drawing[x][y] = { color: colors[hexNumber], x, y, id: x + y * 10000 };
	}


	return drawing;
};


export { contractABI, contractAddress, gridDimensions, parseMapData, getAllTileColors, subscribeTileUpdate, placeTile };
