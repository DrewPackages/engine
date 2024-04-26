// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {

    constructor(string memory name, string memory symbol, uint256 _totalSupply) ERC20(name, symbol) {
        _mint(_msgSender(), _totalSupply);
    }
}
