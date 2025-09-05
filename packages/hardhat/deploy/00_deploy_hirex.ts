// import { HardhatRuntimeEnvironment } from "hardhat/types";
// import { DeployFunction } from "hardhat-deploy/types";
// import namehash from "eth-ens-namehash";

// const deployHireX: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const { deployer } = await hre.getNamedAccounts();
//   const { deploy, log } = hre.deployments;
//   const { ethers } = hre;

//   log("🚀 Deploying HireX contracts...");

//   // 1️⃣ Deploy Alph4Core token
//   const tokenDeployment = await deploy("Alph4Core", {
//     from: deployer,
//     args: [100_000_000], // cap
//     log: true,
//     autoMine: true,
//   });
//   log(`✅ Alph4Core deployed at: ${tokenDeployment.address}`);

//   // 2️⃣ Deploy ENSManager
//   const parentDomain = "hirex.eth";
//   const parentNode = namehash.hash(parentDomain);
//   const nameWrapperAddress = "0xd42Cb8E3C9F2B842123F56428D37aA7943d39956"; // update with correct NameWrapper
//   const baseDomain = parentDomain;

//   const ensDeployment = await deploy("ENSManager", {
//     from: deployer,
//     args: [nameWrapperAddress, parentNode, baseDomain],
//     log: true,
//     autoMine: true,
//   });
//   log(`✅ ENSManager deployed at: ${ensDeployment.address}`);

//   // 3️⃣ Deploy Profile
//   const faucetAmount = ethers.parseUnits("1000", 18);

//   const profileDeployment = await deploy("Profile", {
//     from: deployer,
//     args: [
//       tokenDeployment.address,
//       ensDeployment.address,
//       faucetAmount,
//     ],
//     log: true,
//     autoMine: true,
//   });
//   log(`✅ Profile deployed at: ${profileDeployment.address}`);

//   // 4️⃣ Deploy JobFactory
//   const jobFactoryDeployment = await deploy("JobFactory", {
//     from: deployer,
//     args: [tokenDeployment.address, profileDeployment.address],
//     log: true,
//     autoMine: true,
//   });
//   log(`✅ JobFactory deployed at: ${jobFactoryDeployment.address}`);

// };

// deployHireX.tags = ["HireX"];
// export default deployHireX;
