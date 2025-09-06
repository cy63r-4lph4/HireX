// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IProfile {
    function getProfile(
        address _user
    )
        external
        view
        returns (
            address user,
            string memory ensName,
            string memory metadataURI,
            bool exists,
            bool hasEFP,
            uint256 reputation
        );
}

contract JobFactory is Ownable {
    enum JobStatus {
        Open,
        Assigned,
        Completed,
        Cancelled
    }

    struct Job {
        uint256 id;
        address client;
        address worker;
        string title;
        string metadataURI;
        uint256 budget;
        uint256 deadline;
        JobStatus status;
    }

    IERC20 public coreToken;
    IProfile public profileContract;

    uint256 public jobCount;
    mapping(uint256 => Job) public jobs;

    event JobCreated(uint256 indexed jobId, address indexed client, uint256 budget);
    event JobAssigned(uint256 indexed jobId, address indexed worker);
    event JobCompleted(uint256 indexed jobId, address indexed worker);
    event JobCancelled(uint256 indexed jobId);

    constructor(address _coreToken, address _profileContract) Ownable(msg.sender) {
        coreToken = IERC20(_coreToken);
        profileContract = IProfile(_profileContract);
    }

    /// @notice Client posts a job with budget locked in escrow
    /// @param hirer the real client funding the job
    function createJob(
        address hirer,
        string calldata title,
        string calldata metadataURI,
        uint256 budget,
        uint256 deadline
    ) external {
        require(hirer != address(0), "Invalid hirer");
        require(budget > 0, "Invalid budget");
        require(deadline > block.timestamp, "Deadline must be future");

        require(coreToken.transferFrom(hirer, address(this), budget), "Funding failed");

        jobCount++;
        jobs[jobCount] = Job({
            id: jobCount,
            client: hirer,
            worker: address(0),
            title: title,
            metadataURI: metadataURI,
            budget: budget,
            deadline: deadline,
            status: JobStatus.Open
        });

        emit JobCreated(jobCount, hirer, budget);
    }

    /// @notice Worker accepts job
    function acceptJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "Job not open");
        require(job.client != msg.sender, "Client cannot take own job");

        (, , , bool exists, , ) = profileContract.getProfile(msg.sender);
        require(exists, "Worker must have profile");

        job.worker = msg.sender;
        job.status = JobStatus.Assigned;

        emit JobAssigned(jobId, msg.sender);
    }

    /// @notice Client marks job as completed → releases payment
    function completeJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Assigned, "Not assigned");
        require(job.client == msg.sender, "Only client can complete");

        job.status = JobStatus.Completed;
        address worker = job.worker;
        uint256 amount = job.budget;

        require(coreToken.transfer(worker, amount), "Payment failed");

        emit JobCompleted(jobId, worker);
    }

    /// @notice Client cancels before worker accepts
    function cancelJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "Job not open");
        require(job.client == msg.sender, "Only client can cancel");

        job.status = JobStatus.Cancelled;
        uint256 refund = job.budget;
        address client = job.client;

        require(coreToken.transfer(client, refund), "Refund failed");

        emit JobCancelled(jobId);
    }

    function getJob(uint256 jobId) external view returns (Job memory) {
        require(jobId > 0 && jobId <= jobCount, "Invalid jobId");
        return jobs[jobId];
    }

    function getAllJobs() external view returns (Job[] memory) {
        Job[] memory all = new Job[](jobCount);
        for (uint256 i = 1; i <= jobCount; i++) {
            all[i - 1] = jobs[i];
        }
        return all;
    }

    function getOpenJobs() external view returns (Job[] memory) {
        // count first
        uint256 count = 0;
        for (uint256 i = 1; i <= jobCount; i++) {
            if (jobs[i].status == JobStatus.Open) {
                count++;
            }
        }
        // fill array
        Job[] memory openJobs = new Job[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= jobCount; i++) {
            if (jobs[i].status == JobStatus.Open) {
                openJobs[index] = jobs[i];
                index++;
            }
        }
        return openJobs;
    }
}
