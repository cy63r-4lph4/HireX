// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract JobEscrow is ReentrancyGuard {
    enum JobStatus {
        Created,
        Funded,
        Completed,
        Released,
        Cancelled
    }

    address public hirer;
    address public worker;
    uint256 public amount;
    IERC20 public coreToken;
    JobStatus public status;

    event JobInitialized(address indexed hirer, address indexed worker, uint256 amount);
    event JobFunded(address indexed hirer, uint256 amount);
    event JobCompleted(address indexed worker);
    event PaymentReleased(address indexed worker, uint256 amount);
    event JobCancelled(address indexed hirer, uint256 refund);

    modifier onlyHirer() {
        require(msg.sender == hirer, "Only hirer");
        _;
    }

    modifier onlyWorker() {
        require(msg.sender == worker, "Only worker");
        _;
    }

    constructor(address _hirer, address _worker, uint256 _amount, address _coreToken) {
        require(_hirer != address(0), "Invalid hirer");
        require(_worker != address(0), "Invalid worker");
        require(_amount > 0, "Invalid amount");

        hirer = _hirer;
        worker = _worker;
        amount = _amount;
        coreToken = IERC20(_coreToken);
        status = JobStatus.Created;

        emit JobInitialized(_hirer, _worker, _amount);
    }

    function fundJob() external onlyHirer nonReentrant {
        require(status == JobStatus.Created, "Job not in created state");
        require(coreToken.transferFrom(hirer, address(this), amount), "Funding failed");

        status = JobStatus.Funded;
        emit JobFunded(hirer, amount);
    }

    function markCompleted() external onlyWorker {
        require(status == JobStatus.Funded, "Job not funded");
        status = JobStatus.Completed;
        emit JobCompleted(worker);
    }

    function releasePayment() external onlyHirer nonReentrant {
        require(status == JobStatus.Completed, "Job not completed");
        status = JobStatus.Released;

        require(coreToken.transfer(worker, amount), "Payment failed");
        emit PaymentReleased(worker, amount);
    }

    function cancelJob() external onlyHirer nonReentrant {
        require(status == JobStatus.Funded || status == JobStatus.Created, "Job not cancellable");

        JobStatus prev = status;
        status = JobStatus.Cancelled;

        if (prev == JobStatus.Funded) {
            require(coreToken.transfer(hirer, amount), "Refund failed");
            emit JobCancelled(hirer, amount);
        } else {
            emit JobCancelled(hirer, 0);
        }
    }
}
