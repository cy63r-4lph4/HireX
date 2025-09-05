// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IENSManager {
    function registerSubname(address _user, string calldata preferredName) external returns (string memory);
}

contract Profile is Ownable {
    struct UserProfile {
        address user;
        string ensName;
        string metadataURI;
        bool exists;
        bool hasEFP;
        string credentialHash;
        uint256 reputation;
    }

    uint256 private _profileIds; // replaced CountersUpgradeable
    mapping(address => UserProfile) public profiles;

    IERC20 public coreToken;
    IENSManager public ensManager;
    uint256 public faucetAmount;

    event ProfileCreated(address indexed user, string ensName, string metadataURI, bool hasEFP, string credentialHash);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event MetadataUpdated(address indexed user, string newURI);

    constructor(address _coreToken, address _ensManager, uint256 _faucetAmount) Ownable(msg.sender) {
        coreToken = IERC20(_coreToken);
        ensManager = IENSManager(_ensManager);
        faucetAmount = _faucetAmount;
    }

    function createProfile(
        address _user,
        string calldata preferredName,
        string calldata metadataURI,
        bool _hasEFP,
        string calldata credentialHash
    ) external {
        require(!profiles[_user].exists, "Profile already exists");

        string memory ensName = ensManager.registerSubname(_user, preferredName);

        profiles[_user] = UserProfile({
            user: _user,
            ensName: ensName,
            metadataURI: metadataURI,
            exists: true,
            hasEFP: _hasEFP,
            credentialHash: credentialHash,
            reputation: _hasEFP ? 10 : 0
        });

        _profileIds++; // increment manually

        // external transfer after state update
        require(coreToken.transfer(_user, faucetAmount), "Airdrop failed");

        emit ProfileCreated(_user, ensName, metadataURI, _hasEFP, credentialHash);
    }

    function updateMetadata(address _user, string calldata newMetadataURI) external {
        require(profiles[_user].exists, "Profile not found");
        require(msg.sender == _user || msg.sender == owner(), "Not authorized");

        profiles[_user].metadataURI = newMetadataURI;
        emit MetadataUpdated(_user, newMetadataURI);
    }

    function addReputation(address _user, uint256 amount) external onlyOwner {
        require(profiles[_user].exists, "Profile not found");
        profiles[_user].reputation += amount;
        emit ReputationUpdated(_user, profiles[_user].reputation);
    }

    function getProfile(address _user) external view returns (UserProfile memory) {
        return profiles[_user];
    }

    function profileCount() external view returns (uint256) {
        return _profileIds;
    }
}
