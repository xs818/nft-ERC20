import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("test the smart contract", function () {
  
  let spaceCoin: Contract;
  let nft: Contract;
  let marketplace: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  this.beforeAll(async () => {

    const SpaceCoinFactory = await ethers.getContractFactory("SpaceCoin");

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    spaceCoin = await upgrades.deployProxy(SpaceCoinFactory);

    console.log("SpaceCoin deployed to:", spaceCoin.address);

    const NftFactory = await ethers.getContractFactory("NFT");
    nft = await upgrades.deployProxy(NftFactory);

    console.log("NFT deployed to:", nft.address);


    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await upgrades.deployProxy(MarketplaceFactory);
  
    console.log("Marketplace deployed to:",marketplace.address);
    
    await marketplace.initializedMarketplace(spaceCoin.address,nft.address);

  })

  this.beforeEach(async () => {
    

  })

  

   describe("SpaceCoin", function () {
    it("balances", async function () {
    
      const spaceCoinBalance= await spaceCoin.balanceOf(owner.address);
      console.log("SpaceCoin totalSupply:", await spaceCoin.totalSupply());
      console.log("owner balances", spaceCoinBalance.toString());

      await spaceCoin.transfer(addr1.address, 2000);
      const addr1Balance = await spaceCoin.balanceOf(addr1.address);
      console.log("addr1Balance:", addr1Balance.toString());

    });
    it("approve", async function () {
      const price = ethers.utils.parseEther('5')
      const spaceCoinApprove = await spaceCoin.approve(marketplace.address, price);
      console.log("approve", spaceCoinApprove);

    });

   })

   describe("NFT", function () {
    it("test the NFT owner", async function () {
      
    });
    

   })

   describe("Marketplace", function () {

    it("test the price", async function () {
      const price = await marketplace.getPrice()
      console.log("price", price);

      await marketplace.setPrice(5);

      console.log("set price", (await marketplace.getPrice()).toString());
    })

    it("test the buyNFT", async function () {
      const price = ethers.utils.parseEther('5')
      
      const result = await marketplace.buyNFT(price, "bafybeihsubqwnry7c6sdtauyzcj2r2b5glb3pohzpzvcpwpgbb7kwwawja");
      console.log("result:", result);

      const nftOwner = await marketplace.ownerOf(0);
      console.log(nftOwner)

      const url = await marketplace.tokenURI(0);
      console.log("url:", url);
    })

    it("test the sellNFT", async function () {

    })

   })


})



