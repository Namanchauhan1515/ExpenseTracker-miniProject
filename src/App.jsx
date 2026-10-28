import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Expenses from "./pages/Expenses/Expenses";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRiute";

function App(){

return(
<Routes>
    <Route path ="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>

    <Route path="/dashboard" element={
        <ProtectedRoute>
             <Dashboard/>
        </ProtectedRoute>
       
        }/>
    <Route path="/expenses" element={<Expenses/>}/>

    <Route path="/" element={<Login/>}/>

</Routes>
)
}
export default App