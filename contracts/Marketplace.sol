// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./SpaceCoin.sol";
import "./NFT.sol";
import "hardhat/console.sol";

contract Marketplace is NFT {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public mytoken;
    address public mynft;
    address payable public marketplaceOwner;
    uint256 private price;
    bool private _initializedMarketplace;
    event Received(address caller, uint amount, string message);

    function initializedMarketplace(address _mytoken, address _mynft) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if(!_initializedMarketplace){
            mytoken = _mytoken;
            mynft = _mynft;
            marketplaceOwner = payable(msg.sender);
            price = 2*10**18;
            _initializedMarketplace = true; 

            _grantRole(ADMIN_ROLE, msg.sender);
            _grantRole(PAUSER_ROLE, msg.sender);
            _grantRole(MINTER_ROLE, msg.sender);
            _grantRole(UPGRADER_ROLE, msg.sender);
        }
    }

    function pause() public override onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public override onlyRole(PAUSER_ROLE) {
        _unpause();
    }

   
    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override 
    {}

    function setPrice(uint256 _price) public onlyRole(ADMIN_ROLE) returns (bool) {
        require(_price >= 0 , "NFT price invalid");
        price = _price*10**18;
        return true;
    }

    function getPrice() public view returns(uint256) {
        return price;
    }

    function buyNFT(uint256 amount, string memory cid) public {
        console.log("myToken", amount);
        require(amount == price,"nft price is error");
       
        SpaceCoin(mytoken).transferFrom(msg.sender, address(this), amount);
        safeMint(msg.sender, cid);
        
    }

    //get the Marketplace platform token balances
    function getBalance() public view onlyRole(ADMIN_ROLE) returns(uint){
        return SpaceCoin(mytoken).balanceOf(address(this));
    }

    receive() external payable{
        emit Received(msg.sender, msg.value, "Receive was called");
    }
    
    function withdraw(uint _amount) external {
        require(msg.sender == marketplaceOwner,"Not owner");
        SpaceCoin(mytoken).approve(address(this), _amount);
        SpaceCoin(mytoken).transferFrom(address(this), msg.sender, _amount);
    }

}