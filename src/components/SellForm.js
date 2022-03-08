import React, { useState } from "react";
import tokenLogo from "../logo.png";
import ethLogo from "../eth-logo.png";

const SellForm = ({ tokenBalance, ethBalance, token, ethSwap, account }) => {
  const [value, setValue] = useState({
    input: 0,
    output: 0,
  });
  const [formLoading, setFormLoading] = useState(false);

  const sellTokens = () => {
    const tokenAmount = window.web3.utils.toWei(
      value.input.toString(),
      "Ether"
    );

    token
      .approve(ethSwap.address, tokenAmount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        ethSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setFormLoading(false);
          });
      });
  };
  const onClickFormSubmit = (event) => {
    event.preventDefault();
    setFormLoading(true);
    sellTokens();
  };
  return (
    <form className="mb-3" onSubmit={(event) => onClickFormSubmit(event)}>
      <div>
        <label className="float-left">
          <b>Input</b>
        </label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(tokenBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          onChange={(event) =>
            setValue({
              input: event.target.value,
              output: event.target.value / 100,
            })
          }
          className="form-control form-control-lg"
          placeholder="0"
          required
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={tokenLogo} height="32" alt="" />
            &nbsp; DApp
          </div>
        </div>
      </div>
      <div>
        <label className="float-left">
          <b>Output</b>
        </label>
        <span className="float-right text-muted">
          Balance: {window.web3.utils.fromWei(ethBalance, "Ether")}
        </span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="0"
          value={value.output}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ethLogo} height="32" alt="" />
            &nbsp;&nbsp;&nbsp; ETH
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">100 DApp = 1 ETH</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        SWAP!
      </button>
    </form>
  );
};

export default SellForm;
