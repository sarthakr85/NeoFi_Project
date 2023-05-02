const { useContext } = require("react");
const WebSocket = require("ws");
const { default: CoinContext } = require("../context/CoinContext");

const { selectedCoin } = useContext(CoinContext);
console.log(selectedCoin);

const symbol = "btcusdt";
const endpoint = `wss://stream.binance.com:9443/ws/${symbol}@ticker`;

const ws = new WebSocket(endpoint);

ws.on("open", () => {
  console.log(`Connected to ${symbol} ticker WebSocket`);
});

ws.on("message", (data) => {
  const response = JSON.parse(data);
  const price = response.c;
  console.log(`Live ${symbol} price: ${price}`);
});

ws.on("close", () => {
  console.log(`Disconnected from ${symbol} ticker WebSocket`);
});

ws.on("error", (error) => {
  console.log("WebSocket error:", error);
});
