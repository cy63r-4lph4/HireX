// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IENSManager {
    function registerSubname(address _user, string calldata preferredName) external returns (string memory);
}

interface IEFP {
    function getCredentials(address user) external view returns (bytes memory);
    function issueCredential(address user, string calldata credential) external;
}

contract Profile is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    struct UserProfile {
        address user;
        string ensName;
        string metadataURI;
        bool exists;
        bool hasEFP; // ✅ New: EFP flag
        uint256 reputation; // ✅ Simple reputation score
    }

    CountersUpgradeable.Counter private _profileIds;
    mapping(address => UserProfile) public profiles;

    IERC20 public coreToken;
    IENSManager public ensManager;
    IEFP public efp; // ✅ EFP contract

    uint256 public faucetAmount;

    event ProfileCreated(address indexed user, string ensName, string metadataURI, bool hasEFP);
    event ReputationUpdated(address indexed user, uint256 newScore);
    event EFPCredentialIssued(address indexed user, string credential);

    /// @notice initializer instead of constructor for proxy deployment
    function initialize(
        address _coreToken,
        address _ensManager,
        address _efp,
        uint256 _faucetAmount
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        coreToken = IERC20(_coreToken);
        ensManager = IENSManager(_ensManager);
        efp = IEFP(_efp);
        faucetAmount = _faucetAmount;
    }

    function createProfile(
        address _user,
        string calldata preferredName,
        string calldata metadataURI
    ) external nonReentrant {
        require(!profiles[_user].exists, "Profile already exists");

        // Register ENS subname
        string memory ensName = ensManager.registerSubname(_user, preferredName);

        // Check if user already has EFP credentials
        bool efpVerified = false;
        try efp.getCredentials(_user) returns (bytes memory creds) {
            if (creds.length > 0) {
                efpVerified = true;
            }
        } catch {
            efpVerified = false;
        }

        // Save profile
        profiles[_user] = UserProfile({
            user: _user,
            ensName: ensName,
            metadataURI: metadataURI,
            exists: true,
            hasEFP: efpVerified,
            reputation: efpVerified ? 10 : 0 // ✅ Reward EFP users with base reputation
        });

        // Airdrop CØRE tokens
        require(coreToken.transfer(_user, faucetAmount), "Airdrop failed");

        _profileIds.increment();
        emit ProfileCreated(_user, ensName, metadataURI, efpVerified);
    }

    function updateMetadata(address _user, string calldata newMetadataURI) external {
        require(profiles[_user].exists, "Profile not found");
        require(msg.sender == _user || msg.sender == owner(), "Not authorized");

        profiles[_user].metadataURI = newMetadataURI;
    }

    function addReputation(address _user, uint256 amount) external onlyOwner {
        require(profiles[_user].exists, "Profile not found");
        profiles[_user].reputation += amount;
        emit ReputationUpdated(_user, profiles[_user].reputation);
    }

    function issueHireXCredential(address _user, string calldata credential) external onlyOwner {
        require(profiles[_user].exists, "Profile not found");
        efp.issueCredential(_user, credential);
        profiles[_user].hasEFP = true; // ✅ Mark user as verified after issuing
        emit EFPCredentialIssued(_user, credential);
    }

    function getProfile(address _user) external view returns (UserProfile memory) {
        return profiles[_user];
    }
}
