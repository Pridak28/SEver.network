// contracts/SeverToken.sol
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SeverToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Sever N", "SN") {
        _mint(msg.sender, initialSupply);
    }
}