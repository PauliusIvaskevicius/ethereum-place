// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7.0;

/** @title Ethereum Place. 
  * @author twitter @codemaxwell
  */
contract EthPlace
{
    /** @dev Grid size */
    uint256 constant public MATRIX_SIZE = 100;
    uint256 constant public MATRIX_LINE_LENGTH = 10000;

    /** @dev Required fee for placing a tile */
    uint256 public transactionFee; 

    /** @dev Grid of tileColors */ 
    bytes1[MATRIX_LINE_LENGTH] public tileColors;

    /** @dev Grid of tileOwners */ 
    address[MATRIX_LINE_LENGTH] public tileOwners;

    /** @dev List of administrators */
    mapping (address=>bool) private admin;

    /** @dev Event for notifying change of status of a tile */
    event ChangeTile(bytes1 indexed color, uint256 indexed x, uint256 indexed y);

    constructor() public
    {
        transactionFee = 0; 
        admin[msg.sender] = true;
    }


    /** @dev Places a tile on the grid.
      * @param x X coordinate on the grid.
      * @param y Y coordinate on the grid.
      * @param color color hex value.
      */
    function placeTile(uint256 x, uint256 y, bytes1 color) public payable
    {
        require(x < MATRIX_SIZE && y < MATRIX_SIZE, "Invalid coordinates!");
        require(msg.value >= transactionFee, "Invalid ethereum value in transaction!");

        (uint256 number) = calculateCoordinateLocation(x, y);


        tileColors[number] = color;
        tileOwners[number] = msg.sender;

        emit ChangeTile(color, x, y);
    }

    /** @dev Places a tile on the grid without transaction fee requirement for admin only.
      * @param x X coordinate on the grid.
      * @param y Y coordinate on the grid.
      * @param color color hex value.
      */
    function resetTile(uint256 x, uint256 y, bytes1 color) public isAdmin
    {
        require(x < MATRIX_SIZE && y < MATRIX_SIZE, "Invalid coordinates!");

        uint256 number = calculateCoordinateLocation(x, y);

        tileColors[number] = color;
        tileOwners[number] = msg.sender;

        emit ChangeTile(color, x, y);
    }


    /** @dev Calculates the location of 2d coordinate on 1d array */
    function calculateCoordinateLocation(uint256 x, uint256 y) public pure returns(uint256 number)
    {
        uint256 index = x + MATRIX_SIZE * y;
        return index;
    }

    /** @dev Gets tile at provided coordinates.
      * @param x X coordinate.
      * @param y Y coordinate.
      */
    function getTileColor(uint256 x, uint256 y) public view returns(bytes1)
    {
        uint256 number = calculateCoordinateLocation(x, y);

        return tileColors[number];
    }

     /** @dev Changes tile placement fee.
      * @param fee new fee value.
      */
    function changeFee(uint256 fee) public isAdmin
    {
        transactionFee = fee;
    }

    /** @dev Get all tileColors */
    function getAllTileColors() public view returns(bytes1[MATRIX_LINE_LENGTH] memory)
    {
        return tileColors;
    }

    /** @dev Transfers collected fees to sender address. */
    function retrieveFunds() public isAdmin
    {
        payable(msg.sender).transfer(address(this).balance);
    }


    fallback() external payable {}

    modifier isAdmin(){
        require(admin[msg.sender]);
        _;
    }
}