import Delivery from "./components/Delivery";
import History from "./components/History";
import Location from "./components/Locations";
import "./App.css";

function App() {
  return (
    <>
      <main className="App_wrapper">
        <Location />
        <Delivery />
        <History />
      </main>
    </>
  );
}

export default App;
