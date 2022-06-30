// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);

   //deploy SpaceCoin
  const SpaceCoinFactory = await ethers.getContractFactory("SpaceCoin");

  const spaceCoin = await upgrades.deployProxy(SpaceCoinFactory);

  console.log("SpaceCoin deployed to:", spaceCoin.address);

  // deploy NFT contract
  const NftFactory = await ethers.getContractFactory("NFT");
  const nft = await upgrades.deployProxy(NftFactory);

  console.log("NFT deployed to:", nft.address);


  // deploy Marketplace contract
  const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
  const marketplace = await upgrades.deployProxy(MarketplaceFactory);

  console.log("Marketplace deployed to:",marketplace.address);

  
  await marketplace.initializedMarketplace(spaceCoin.address, nft.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
