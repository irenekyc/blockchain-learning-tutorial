import { toWei } from "web3-utils";

// Import smart contract
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// config Chai library
require("chai")
  .use(require("chai-as-promised"))
  .should();

const tokens = (n) => {
  return toWei(n, "ether");
};

contract("EthSwap", ([deployer, investor]) => {
  let token, ethSwap;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    await token.transfer(ethSwap.address, tokens("1000000"));
  });
  // First Test - on the smart contracts deployment
  describe("Token deployment", async () => {
    it("token has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });

    // Test if the transfer function works
    it("contract has tokens", async () => {
      const balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance, tokens("1000000"));
    });
  });

  // Test the buytokens function
  describe("EthSwap buy token function", async () => {
    it("Allow user to instantly purchase tokens from ethSwap for a fixed price", async () => {
      let result = await ethSwap.buyTokens({
        from: investor,
        value: tokens("1"),
      });

      // check investor balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      // check ethSwap balance after purchase
      let ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("999900"));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1"));

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });

  // Test the sellTokens function
  describe("EthSwap sell token function", async () => {
    it("Allow user to instantly sell tokens from ethSwap for a fixed price", async () => {
      await token.approve(ethSwap.address, tokens("100"), { from: investor });
      let result = await ethSwap.sellTokens(tokens("100"), { from: investor });
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));

      // check ethSwap balance after purchase
      let ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1000000"));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("0"));

      // Check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
    });
  });
});
