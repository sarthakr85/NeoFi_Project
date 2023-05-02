import Navbar from "./components/Navbar";
import { CoinProvider } from "./context/CoinContext";
import MainCoinDisplayBox from "./components/MainCoinDisplayBox";
import Modal from "./components/Modal";

function App() {
  return (
    <>
      <CoinProvider>
        <Navbar />
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md"></div>
            <MainCoinDisplayBox />
          </div>
        </div>
      </CoinProvider>
    </>
  );
}

export default App;
