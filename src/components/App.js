import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import Navbar from "./Navbar";
import Main from "./Main";
import _isEmpty from "lodash/isEmpty";

const App = () => {
  const [accountData, setAccountData] = useState({
    accountNo: null,
    balance: null,
    tokenBalance: null,
  });
  const [token, setToken] = useState({});
  const [ethSwap, setEthSwap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState("null");

  useEffect(() => {
    // Connect your app to blockchin
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-ethereum browser detected. Please consider trying MetaMask"
        );
      }
    };

    // Load blockchain data
    const loadBlockchain = async () => {
      const web3 = window.web3;
      let tokenBalance = null;
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
        const balance = await web3.eth.getBalance(currentAccount);

        // Convert JSON SmartContracts to JS Version
        // load Token
        const networkId = await web3.eth.net.getId();
        const tokenData = Token.networks[networkId];
        if (tokenData) {
          const address = tokenData.address;
          // https://web3js.readthedocs.io/en/v1.7.0/web3-eth-contract.html#eth-contract
          const token = new web3.eth.Contract(Token.abi, address);
          setToken(token);
          tokenBalance = await token.methods.balanceOf(currentAccount).call();
          setAccountData({
            accountNo: currentAccount,
            balance,
            tokenBalance: tokenBalance ? tokenBalance.toString() : "0",
          });
        } else {
          window.alert("Token contract not deployed to dedected network");
        }

        // load EthSwap
        const ethSwapData = EthSwap.networks[networkId];
        if (ethSwapData) {
          const address = ethSwapData.address;
          // https://web3js.readthedocs.io/en/v1.7.0/web3-eth-contract.html#eth-contract
          const ethSwap = new web3.eth.Contract(EthSwap.abi, address);
          setEthSwap(ethSwap);
          setIsLoading(false);
        } else {
          window.alert("Ethswap contract not deployed to dedected network");
        }
      }
    };

    loadWeb3();
    loadBlockchain();
  }, []);

  const buyTokens = async (tokenAmount) => {
    setTransactionStatus("pending");
    if (!_isEmpty(ethSwap)) {
      const etherAmount = window.web3.utils.toWei(
        tokenAmount.toString(),
        "Ether"
      );

      ethSwap.methods
        .buyTokens()
        .send({ value: etherAmount, from: accountData.accountNo })
        .on("transactionHash", () => {
          setTransactionStatus("submitted");
        })
        .on("confirmation", () => {
          setTransactionStatus("completed");
        });
    } else {
      // Error
    }
  };

  const sellTokens = (ethAmount) => {
    setTransactionStatus("pending");
    if (!_isEmpty(token) && !_isEmpty(ethSwap)) {
      const tokenAmount = window.web3.utils.toWei(
        ethAmount.toString(),
        "Ether"
      );

      token.methods
        .approve(ethSwap._address, tokenAmount)
        .send({ from: accountData.accountNo })
        .on("transactionHash", (hash) => {
          ethSwap.methods
            .sellTokens(tokenAmount)
            .send({ from: accountData.accountNo })
            .on("transactionHash", () => {
              setTransactionStatus("submitted");
            })
            .on("confirmation", () => {
              setTransactionStatus("completed");
            });
        });
    }
  };

  useEffect(() => {
    const updateBalance = async () => {
      const web3 = window.web3;
      const balance = await web3.eth.getBalance(accountData.accountNo);
      const tokenBalance = await token.methods
        .balanceOf(accountData.accountNo)
        .call();
      console.log(balance);
      console.log(tokenBalance);
      setAccountData({
        ...accountData,
        balance,
        tokenBalance: tokenBalance.toString(),
      });
    };

    if (transactionStatus === "completed") {
      updateBalance();
    }
  }, [transactionStatus]);

  return (
    <div>
      <Navbar accountNo={accountData.accountNo} />
      <div className="container-fluid mt-5">
        <div className="row">
          {isLoading ? (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <Main
              ethBalance={accountData.balance}
              tokenBalance={accountData.tokenBalance}
              buyTokens={buyTokens}
              sellTokens={sellTokens}
            />
          )}
          {transactionStatus === "submitted" ? (
            <div class="alert alert-primary auto-fade-out" role="alert">
              Transaction is submitted and on its way
            </div>
          ) : transactionStatus === "completed" ? (
            <div class="alert alert-success auto-fade-out" role="alert">
              Congratulations! Transaction is completed
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
