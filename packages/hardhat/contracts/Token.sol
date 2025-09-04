// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Alph4Core is ERC20Capped {
    address public owner;

    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event Minted(address indexed to, uint256 amount);

    constructor(uint256 cap) ERC20("Alph4 Core", unicode"CØRE") ERC20Capped(cap * (10 ** decimals())) {
        require(cap >= 50_000_000, "Cap must be at least 50 million tokens");
        owner = msg.sender;
        _mint(owner, 50_000_000 * (10 ** decimals()));
        emit Minted(owner, 50_000_000 * (10 ** decimals()));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function mint(uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= cap(), "Cap exceeded");
        _mint(owner, amount);
        emit Minted(owner, amount);
    }

    function mintTo(address recipient, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= cap(), "Cap exceeded");
        _mint(recipient, amount);
        emit Minted(recipient, amount);
    }
}
