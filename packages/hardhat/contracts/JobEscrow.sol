// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract JobEscrow {
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
        hirer = _hirer;
        worker = _worker;
        amount = _amount;
        coreToken = IERC20(_coreToken);
        status = JobStatus.Created;

        emit JobInitialized(_hirer, _worker, _amount);
    }

    function fundJob() external onlyHirer {
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

    function releasePayment() external onlyHirer {
        require(status == JobStatus.Completed, "Job not completed");
        status = JobStatus.Released;

        require(coreToken.transfer(worker, amount), "Payment failed");
        emit PaymentReleased(worker, amount);
    }

    function cancelJob() external onlyHirer {
        require(status == JobStatus.Funded || status == JobStatus.Created, "Job not cancellable");

        status = JobStatus.Cancelled;
        if (status == JobStatus.Funded) {
            require(coreToken.transfer(hirer, amount), "Refund failed");
        }
        emit JobCancelled(hirer, amount);
    }
}
