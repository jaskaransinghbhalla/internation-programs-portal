import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import State from "./contexts/State";

// Components
import Home from "./pages/1_Home/01_Home.jsx";
import SignUpProfessor from "./pages/2_SignUp/01_SignUpProfessor.jsx";
import ProfessorHome from "./pages/3_DashboardProfessor/01_HomeProfessor";
import StudentHome from "./pages/4_DashboardStudent/01_HomeStudent";
import SignUpStudent from "./pages/2_SignUp/02_SignUpStudent.jsx";
import AddIntern from "./pages/3_DashboardProfessor/05_AddIntern";
import InternProf from "./pages/3_DashboardProfessor/08_Internship";
import InternStudent from "./pages/4_DashboardStudent/07_Internship";
import UpdateIntern from "./pages/3_DashboardProfessor/07_UpdateIntern";
import InternInfo from "./pages/4_DashboardStudent/11_InternInfo";
import StudentProfile from "./pages/4_DashboardStudent/12_Profile";
import ProfessorProfile from "./pages/3_DashboardProfessor/11_Profile";

// import Information_2 from './pages/4_DashboardStudent/06_Information';
// import StuApplied from './pages/4_DashboardStudent/08_StuApplied';

// import Cookies from 'universal-cookie';
// import jwt from 'jwt-decode'
// const cookies = new Cookies();
// const checkUser () => {
// }
// const decoded = jwt(tokens.access);
// let usr = "";
// (decoded.usertype === "PROFESSOR" ? navigate('/dashboard/professor') : navigate('/dashboard/student'))
// {/* <Route path="/dashboard/professor" element={cookies.get('access') ? <ProfessorHome /> : <Navigate to="/" />} /> */}
function App() {
  return (
    <State>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup/student" element={<SignUpStudent />} />
          <Route path="/signup/professor" element={<SignUpProfessor />} />
          <Route path="/dashboard/student" element={<StudentHome />} />
          <Route path="/dashboard/professor" element={<ProfessorHome />} />
          <Route path="/professor/internship/:id" element={<InternProf />} />
          <Route path="/student/internship/:id" element={<InternStudent />} />
          <Route
            path="/dashboard/professor/intern/add"
            element={<AddIntern />}
          />
          <Route
            path="/professor/internship/update/:id"
            element={<UpdateIntern />}
          />
          <Route
            path="/dashboard/student/applications"
            element={<InternInfo />}
          />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/professor/profile" element={<ProfessorProfile />} />
        </Routes>
      </Router>
    </State>
  );
}
export default App;
