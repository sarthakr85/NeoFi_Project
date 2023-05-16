import { BsSearch } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { BiCheck } from "react-icons/bi";
import { useContext, useState } from "react";
import CoinContext from "../context/CoinContext";

function Modal() {
  const { closeModal, state, dispatch } = useContext(CoinContext);
  const [coinName, setCoinName] = useState("");
  const [showCoins, setShowCoins] = useState(state.coins);

  const onChange = (e) => {
    const value = e.target.value;
    setCoinName(value);

    const filteredCoins = state.coins.filter((coin) => {
      return coin.name.includes(e.target.value.toLowerCase());
    });

    setShowCoins(filteredCoins);
  };

  const onClick = (coin) => {
    // setSelectedCoin(coin);
    dispatch({ type: "SET_SELECTED_COIN", payload: coin });
    closeModal();
  };

  return (
    <>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={closeModal}>
          <MdClose />
        </button>
        <div className="modal-search-bar-container">
          <BsSearch className="modal-search-bar-icon" />
          <input
            type="text"
            placeholder="Search Chains"
            className="modal-search-bar"
            value={coinName}
            onChange={onChange}
          />
        </div>

        <div className="modal-coins-container">
          {showCoins.map((coin, index) => (
            <div
              onClick={() => {
                onClick(coin);
              }}
              key={index}
              className={
                coin.name === state.selectedCoin.name
                  ? "modal-coin-display selected-coin"
                  : "modal-coin-display"
              }
            >
              <img
                className="modal-coin-icon"
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  coin.coinIcon
                )}`}
              />
              <span className="modal-coin-text">{coin.name.toUpperCase()}</span>
              {coin.name === state.selectedCoin.name ? (
                <span>
                  <BiCheck size="1.8rem" className="modal-coin-selected-tick" />
                </span>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default Modal;
