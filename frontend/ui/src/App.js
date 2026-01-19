import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>🛒 E-Shopping App</h1>

        {/* Navigation Bar */}
        <nav>
          <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
          <Link to="/catalog" style={{ marginRight: "15px" }}>Catalog</Link>
          <Link to="/cart" style={{ marginRight: "15px" }}>Cart</Link>
          <Link to="/orders">Orders</Link>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
