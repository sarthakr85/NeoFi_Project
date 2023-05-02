import { createContext, useState, useEffect, useRef } from "react";
import { binanceCryptoIcons } from "binance-icons";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState();
  const [price, setPrice] = useState();
  const [exchangeRate, setExchangeRate] = useState(81.74);

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
      setExchangeRate(exchangeRateResponse.data.rates.INR);

      //Push all the coins info into state
      setSelectedCoin(tempCoins[1]);
      setCoins(tempCoins);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWebSocketMessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.s === selectedCoin.symbol) {
      const usdPrice = parseFloat(data.c);
      const inrPrice = usdPrice * exchangeRate;
      setPrice(inrPrice.toFixed(3));
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
    if (selectedCoin) {
      subscribeToWebSocket(selectedCoin.symbol);
    }
  }, [selectedCoin]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CoinContext.Provider
      value={{
        coins,
        isLoading,
        isModalOpen,
        openModal,
        closeModal,
        selectedCoin,
        setSelectedCoin,
        price,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContext;
