import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using deployer:", deployer.address);

  // Grab contracts
  const token = await ethers.getContractAt("Alph4Core", "0x5FbDB2315678afecb367f032d93F642f64180aa3", deployer);
  const jobFactory = await ethers.getContractAt("JobFactory", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", deployer);

  // 1️⃣ Mint tokens to deployer (hirer)
  const faucetAmount = ethers.parseUnits("1000", 18);
  const mintTx = await token.mintTo("0xdD2FD4581271e230360230F9337D5c0430Bf44C0", faucetAmount);
  await mintTx.wait();
  console.log("✅ Minted tokens to deployer");

  // 2️⃣ Approve JobFactory to spend tokens
  const approveTx = await token.approve(jobFactory.target, faucetAmount);
  await approveTx.wait();

  console.log("✅ Approved JobFactory to spend tokens");

  // 3️⃣ Create job
  const now = Math.floor(Date.now() / 1000);
  const deadline = now + 7 * 24 * 60 * 60; // 7 days in the future

  console.log("Current block.timestamp:", now);
  console.log("Calling createJob...");

  const tx = await jobFactory.createJob(
    "Wedding dress alteration",
    "http://somethinghere",
    ethers.parseUnits("200", 18), // budget
    deadline,
  );

  const receipt = await tx.wait();
  console.log("✅ Job created in tx:", receipt?.hash);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
