import { BrowserRouter, Routes, Route } from "react-router-dom";



//pages & components
import Home from './pages/Home'
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {

  return (
    <div className="App">
      <BrowserRouter> 
        <Navbar/>
         <div className="page">
            <Routes>
              <Route
                 path="/" element={<Home/>}
              />
              <Route
                 path="/dashboard"element={<Dashboard/>}
              />
            </Routes>
         </div>
      </BrowserRouter>
    </div>
  );
}

export default App
