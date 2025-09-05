import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployHireX: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { log } = hre.deployments;
  const { ethers } = hre;

  log("🚀 Deploying HireX contracts...");

  // 1️⃣ Deploy Alph4Core token
  // const tokenDeployment = await deploy("Alph4Core", {
  //   from: deployer,
  //   args: [100_000_000], // cap
  //   log: true,
  //   autoMine: true,
  // });

  const token = await ethers.getContract<Contract>("Alph4Core", deployer);
  log("✅ Alph4Core deployed at:", token.target);

  // 2️⃣ Deploy ENSManager (non-upgradeable)
  // const ensDeployment = await deploy("ENSManager", {
  //   from: deployer,
  //   args: ["local"], // baseDomain
  //   log: true,
  //   autoMine: true,
  // });

  const ensManager = await ethers.getContract<Contract>("ENSManager", deployer);
  log("✅ ENSManager deployed at:", ensManager.target);

  // 3️⃣ Deploy Profile (non-upgradeable)
  // const profileDeployment = await deploy("Profile", {
  //   from: deployer,
  //   args: [
  //     token.target,
  //     ensManager.target,
  //     ethers.parseUnits("1000", 18), // faucetAmount
  //   ],
  //   log: true,
  //   autoMine: true,
  // });

  const profile = await ethers.getContract<Contract>("Profile", deployer);
  log("✅ Profile deployed at:", profile.target);

  // 4️⃣ Deploy JobFactory (non-upgradeable)
  // const jobFactoryDeployment = await deploy("JobFactory", {
  //   from: deployer,
  //   args: [token.target, profile.target],
  //   log: true,
  //   autoMine: true,
  // });

  const jobFactory = await ethers.getContract<Contract>("JobFactory", deployer);
  log("✅ JobFactory deployed at:", jobFactory.target);

  // 5️⃣ Deploy JobEscrow (non-upgradeable)
};

deployHireX.tags = ["HireX"];
export default deployHireX;
