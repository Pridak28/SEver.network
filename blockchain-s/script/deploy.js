const hre = require("hardhat");
const { parseUnits } = require("ethers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const initialSupply = parseUnits("15000", 18);
  const Token = await hre.ethers.getContractFactory("SeverToken");
  const token = await Token.deploy(initialSupply);
  await token.waitForDeployment();
  console.log("SeverToken deployed to:", token.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
