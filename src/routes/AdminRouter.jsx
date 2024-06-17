import { Route, Routes } from "react-router-dom"
import AdminPanelStep from "../pages/AdminPanelStep";


export default function AdminRouter() {
    return (
        <Routes>
            <Route path="/itstep/university/users/admin" element={<AdminPanelStep />} />
        </Routes>
    )
}