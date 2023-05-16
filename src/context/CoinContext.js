import { createContext, useEffect, useRef, useReducer } from "react";
import { binanceCryptoIcons } from "binance-icons";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const coinReducer = (state, action) => {
    switch (action.type) {
      case "SET_INITIAL_STATE":
        return {
          ...state,
          coins: action.payload.coins,
          exchangeRate: action.payload.exchangeRate,
          isLoading: action.payload.isLoading,
        };
      case "SET_IS_MODAL_OPEN":
        return {
          ...state,
          isModalOpen: action.payload,
        };
      case "SET_SELECTED_COIN":
        return {
          ...state,
          selectedCoin: action.payload,
        };
      case "SET_PRICE":
        return {
          ...state,
          price: action.payload,
        };
      default:
        throw new Error("No Action");
    }
  };

  const [state, dispatch] = useReducer(coinReducer, {
    coins: [],
    isLoading: true,
    isModalOpen: false,
    selectedCoin: null,
    price: null,
    exchangeRate: 81.74,
  });

  const clientRef = useRef(null);

  const getExchangeInfo = async () => {
    try {
      //Get Coin info(coinSymbol) from binance API
      const response = await axios.get(
        `https://api.binance.com/api/v3/exchangeInfo`
      );

      const allCoins = response.data.symbols;
      //Filter the coins so we only have ones with USDT
      const usdtCoins = allCoins.filter((coin) => coin.quoteAsset === "USDT");

      //Modify the coins and get the coin Icon from binance-icons Api
      const tempCoins = usdtCoins.reduce((acc, coin) => {
        const { symbol } = coin;
        const name = symbol.slice(0, -4).toLowerCase();
        const hasCoinIcon = binanceCryptoIcons.has(name);
        if (hasCoinIcon) {
          const coinIcon = binanceCryptoIcons.get(name);
          acc.push({ name, symbol, coinIcon });
        }
        return acc;
      }, []);

      const exchangeRateResponse = await axios.get(
        `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_EXCHANGE_RATE_API_ID}&symbols=INR`
      );

      //Push all the coins info into state

      dispatch({
        type: "SET_INITIAL_STATE",
        payload: {
          coins: tempCoins,

          exchangeRate: exchangeRateResponse.data.rates.INR,
          isLoading: false,
        },
      });

      dispatch({
        type: "SET_SELECTED_COIN",
        payload: tempCoins[1],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleWebSocketMessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.s === state.selectedCoin.symbol) {
      const usdPrice = parseFloat(data.c);
      const inrPrice = usdPrice * state.exchangeRate;

      dispatch({ type: "SET_PRICE", payload: inrPrice.toFixed(3) });
    }
  };

  const subscribeToWebSocket = (symbol) => {
    if (clientRef.current) {
      // Close existing connection before creating a new one
      clientRef.current.close();
    }

    const client = new W3CWebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
    );

    client.onopen = () => {};

    client.onmessage = (message) => {
      handleWebSocketMessage(message);
    };

    clientRef.current = client;
  };

  useEffect(() => {
    getExchangeInfo();
  }, []);

  useEffect(() => {
    if (state.selectedCoin) {
      subscribeToWebSocket(state.selectedCoin.symbol);
    }
  }, [state.selectedCoin]);

  const openModal = () => {
    dispatch({ type: "SET_IS_MODAL_OPEN", payload: true });
  };

  const closeModal = () => {
    dispatch({ type: "SET_IS_MODAL_OPEN", payload: false });
  };

  return (
    <CoinContext.Provider
      value={{
        openModal,
        closeModal,
        state,
        dispatch,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContext;
