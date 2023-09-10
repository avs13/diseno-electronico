import { Map } from "./pages/Map";
import LayoutApp from "./components/layout/LayoutApp";
import { History } from "./pages/History";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="/real-time" element={<Map />} />
        </Routes>
      </LayoutApp>
    </BrowserRouter>
  );
}

export default App;
