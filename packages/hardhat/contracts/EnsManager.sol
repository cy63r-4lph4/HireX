// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Mock ENSManager for hackathon use — does not actually call ENS NameWrapper.
contract ENSManager is Ownable {
    bytes32 public parentNode;
    string public baseDomain;

    mapping(string => address) public subnameOwners;
    mapping(address => string) public addressToSubname;

    event SubnameRegistered(address indexed user, string subname);

    constructor(bytes32 _parentNode, string memory _baseDomain) Ownable(msg.sender) {
        parentNode = _parentNode;
        baseDomain = _baseDomain;
    }

    /** @notice Check if a subname is available */
    function isAvailable(string calldata name) public view returns (bool) {
        return subnameOwners[name] == address(0);
    }

    /** @notice Register a subname for a specific user (mock, no ENS interaction) */
    function registerSubname(address _user, string calldata name) external returns (string memory) {
        require(isAvailable(name), "Subname already taken");

        // Map ownership to the provided user, not msg.sender
        subnameOwners[name] = _user;
        addressToSubname[_user] = name;

        // Just return <name>.<baseDomain>, no ENS calls
        string memory fullName = string(abi.encodePacked(name, ".", baseDomain));

        emit SubnameRegistered(_user, fullName);
        return fullName;
    }

    /** @notice Get full ENS name for a user */
    function getFullName(address user) external view returns (string memory) {
        string memory name = addressToSubname[user];
        if (bytes(name).length == 0) return "";
        return string(abi.encodePacked(name, ".", baseDomain));
    }
}
