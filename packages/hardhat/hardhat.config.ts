import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import generateTsAbis from "./scripts/generateTsAbis";

// ✅ Private key (Hardhat default account if not set)
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// ✅ Etherscan key
const etherscanApiKey = process.env.ETHERSCAN_V2_API_KEY || "";

// ✅ Alchemy RPC key
const providerApiKey = process.env.ALCHEMY_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: { default: 0 },
  },
  networks: {
    sepolia: {
      url: providerApiKey ? `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}` : "",
      accounts: [deployerPrivateKey],
    },
    baseMainnet: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
    },
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  verify: {
    etherscan: {
      apiKey: etherscanApiKey,
    },
  },
  sourcify: { enabled: false },
};

// Extend the deploy task to also generate TypeScript ABIs
task("deploy").setAction(async (args, hre, runSuper) => {
  await runSuper(args);
  await generateTsAbis(hre);
});

export default config;
