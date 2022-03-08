import React from "react";
import Identicon from "identicon.js";

const Navbar = ({ accountNo }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <span
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        rel="noopener noreferrer"
      >
        EthSwap
      </span>
      {accountNo && (
        <div>
          <span className="text-secondary">
            <small id="account">{accountNo}</small>
          </span>
          <img
            className="ml-2"
            width="30"
            height="30"
            src={`data:image/png;base64, ${new Identicon(
              accountNo,
              30
            ).toString()}`}
            alt=""
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
