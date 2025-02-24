import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/homePage";
import FormList from "./pages/ListGuitar";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/List" element={<FormList />} />
        </Routes>
    );
}

export default App;
