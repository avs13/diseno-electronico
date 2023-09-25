import { Map } from "./pages/Map";
import LayoutApp from "./components/layout/LayoutApp";
import { History } from "./pages/History";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <LayoutApp>
        <Routes>
          
          <Route path="/history" element={<History />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/real-time" element={<Map />} />
          <Route
        path="*"
        element={<Navigate to="/real-time" replace />}
    /> 
        </Routes>
      </LayoutApp>
    </BrowserRouter>
  );
}

export default App;
