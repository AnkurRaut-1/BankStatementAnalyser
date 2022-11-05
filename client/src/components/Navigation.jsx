import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import "./styles.css";

export default function Navigation() {
  return (
    <div className="container-fluid">
      <Router>
        {/* <HeaderNav/> */}
        <Routes>
          <Route exact path="/" element={<Login />}></Route>
          <Route exact path="/home" element={<Home />}></Route>
        </Routes>
        {/* <Footer/> */}
        
      </Router>

    </div>
  );
}