// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SalutCrestin is ERC20 {
    constructor(uint256 initialSupply) ERC20("SalutCrestin", "SLC") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Returns the balance of a specified address.
     * @param account The address to query the balance for.
     * @return The current balance of the account.
     */
    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }
}
