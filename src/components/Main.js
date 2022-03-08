import React, { useState } from "react";
import SellForm from "./SellForm";
import BuyForm from "./BuyForm";

const Main = ({ ethBalance, tokenBalance, token, ethSwap, account }) => {
  const [currentForm, setCurrentForm] = useState("buy");

  return (
    <main role="main" className="col-lg-12 d-flex text-center">
      <div className="content mr-auto ml-auto">
        <div id="content" className="mt-3">
          <div className="d-flex justify-content-between mb-3">
            <button
              className="btn btn-light"
              onClick={() => setCurrentForm("buy")}
            >
              Buy
            </button>
            <span className="text-muted">&lt; &nbsp; &gt;</span>
            <button
              className="btn btn-light"
              onClick={() => setCurrentForm("sell")}
            >
              Sell
            </button>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              {currentForm === "buy" ? (
                <BuyForm
                  ethBalance={ethBalance}
                  tokenBalance={tokenBalance}
                  ethSwap={ethSwap}
                />
              ) : (
                <SellForm
                  ethBalance={ethBalance}
                  tokenBalance={tokenBalance}
                  ethSwap={ethSwap}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
