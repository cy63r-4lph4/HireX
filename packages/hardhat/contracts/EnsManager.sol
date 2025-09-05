// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface INameWrapper {
    function setSubnodeOwner(
        bytes32 parentNode,
        string calldata label,
        address owner,
        uint32 fuses,
        uint64 expiry
    ) external returns (bytes32);
}

contract ENSManager is Ownable(msg.sender) {
    INameWrapper public nameWrapper;
    bytes32 public parentNode;
    string public baseDomain;

    mapping(string => address) public subnameOwners;
    mapping(address => string) public addressToSubname;

    event SubnameRegistered(address indexed user, string subname);

    constructor(address _nameWrapper, bytes32 _parentNode, string memory _baseDomain) {
        nameWrapper = INameWrapper(_nameWrapper);
        parentNode = _parentNode;
        baseDomain = _baseDomain;
    }

    /** @notice Check if a subname is available */
    function isAvailable(string calldata name) public view returns (bool) {
        return subnameOwners[name] == address(0);
    }

    /** @notice Register a free subname under your parent domain */
    function registerSubname(string calldata name) external returns (string memory) {
        require(isAvailable(name), "Subname already taken");

        // Map ownership
        subnameOwners[name] = msg.sender;
        addressToSubname[msg.sender] = name;

        // Set fuses for a "forever" subname
        uint32 fuses = 65536; // CAN_EXTEND_EXPIRY burned
        uint64 expiry = type(uint64).max;

        // Call NameWrapper to create the actual ENS subname
        nameWrapper.setSubnodeOwner(parentNode, name, msg.sender, fuses, expiry);

        string memory fullName = string(abi.encodePacked(name, ".", baseDomain));
        emit SubnameRegistered(msg.sender, fullName);
        return fullName;
    }

    /** @notice Get full ENS name for a user */
    function getFullName(address user) external view returns (string memory) {
        string memory name = addressToSubname[user];
        if (bytes(name).length == 0) return "";
        return string(abi.encodePacked(name, ".", baseDomain));
    }
}
