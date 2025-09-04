// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ENSManager is Initializable, OwnableUpgradeable {
    string public baseDomain;

    mapping(string => address) public subnameOwners;
    mapping(address => string) public addressToSubname;

    event SubnameRegistered(address indexed user, string subname);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory _baseDomain) public initializer {
        __Ownable_init(msg.sender);
        baseDomain = _baseDomain;
    }

    function isAvailable(string calldata name) public view returns (bool) {
        return subnameOwners[name] == address(0);
    }

    function registerSubname(address _user, string calldata name) external onlyOwner returns (string memory) {
        require(isAvailable(name), "Name already taken");

        subnameOwners[name] = _user;
        addressToSubname[_user] = name;

        string memory fullName = string(abi.encodePacked(name, ".", baseDomain));

        emit SubnameRegistered(_user, fullName);
        return fullName;
    }

    function getFullName(address _user) external view returns (string memory) {
        string memory name = addressToSubname[_user];
        if (bytes(name).length == 0) return "";
        return string(abi.encodePacked(name, ".", baseDomain));
    }
}
