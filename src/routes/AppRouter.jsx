import { Route, Routes } from "react-router-dom"
import BasePage from "../components/groups/dropdownGroups/DropCourse";
import Login from "../Login";
import HomePage from "../pages/HomePage";
import GroupsPage from "../pages/GroupsPage";
import ChatPage from "../pages/ChatPage";
import StudentPage from "../pages/StudentPage";
import ScheduleComponents from "../components/shedule/ScheduleComponents";
import TeachersPage from "../pages/TeachersPage";
import NewsPage from "../pages/NewsPage";
import StatementsPage from "../pages/StatementsPage";
import AdminPanelStep from "../pages/AdminPanelStep";
import ExamsPage from "../pages/ExamsPage";
import SchedulePage2 from "../pages/SchedulePage2";
import Encryption from "../components/encryption/Encryption";
import ScheduleExamsPage from "../pages/ScheduleExamsPage";


export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/students" element={<StudentPage />} />
            <Route path="/schedule" element={<ScheduleComponents />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/statements" element={<StatementsPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/schedule2" element={<SchedulePage2 />} />
            <Route path="/encryption" element={<Encryption />} />
            <Route path="/planningExams" element={<ScheduleExamsPage />} />
            <Route path="/itstep/university/users/admin" element={<AdminPanelStep />} />
        </Routes>
    )
}