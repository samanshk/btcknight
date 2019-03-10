pragma solidity ^0.5.0;

import '../lib/IERC1155.sol';

contract Marketplace {
    IERC1155 private _token;

    mapping (uint256 => uint256) price; //mapping from id of the token to its price

    constructor (IERC1155 token) public {
        require(address(token) != address(0));
        _token = token;

        price[1] = 100000000000000;
        price[2] = 200000000000000;
        price[3] = 300000000000000;        
    }

    function () external payable {
        buyToken(0);
    }

    function buyToken(uint256 tokenID) public payable {
        uint256 weiAmount = msg.value;
        require(weiAmount >= price[tokenID] && price[tokenID] != 0);

        _token.safeTransferFrom(address(this), msg.sender, tokenID, 1, "");
    }

    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4){
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
}