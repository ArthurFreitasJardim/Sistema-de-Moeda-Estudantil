import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import RecoverPasswordPage from '../pages/RecoverPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import AllStudentsPage from '../pages/AllStudentsPage';
import AllTeachersPage from '../pages/AllTeachersPage';
import CoursesPage from '../pages/CoursesPage';
import PartnersPage from '../pages/PartnersPage';
import AllCouponsPage from '../pages/AllCouponsPage';
import RedeemPointsPage from '../pages/RedeemPointsPage';
import Instituicao from '../pages/InstituicaoPage'
import Dashboard from '../pages/DashboardPage.jsx';
import LandingPage from '../pages/LandingPage.jsx'
import RegisterProfessor from '../pages/RegisterProfessorPage.jsx';
import RegisterCourse from '../pages/RegisterCursoPage.jsx';
import RegisterEmpresa from '../pages/RegisterEmpresPage.jsx'

//import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/" element={<LandingPage />} />  
            <Route path="/:id" element={<DashboardPage />} />
            
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-professor" element={<RegisterProfessor />} />
            <Route path="/register-curso" element={<RegisterCourse />} />
            <Route path="/register-empresa" element={<RegisterEmpresa />} />

            <Route path="/instituicao" element={<Instituicao />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/" element={<LandingPage />} /> */}
            

            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={< ResetPasswordPage/>} />
            <Route path="/recover-password" element={< RecoverPasswordPage/>} />


            <Route path="/students" element={<AllStudentsPage />} />
            <Route path="/teachers" element={<AllTeachersPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/cupons" element={<AllCouponsPage />} />
            <Route path="/redeem-points" element={<RedeemPointsPage />} />

            {/* <Route path="/perfil/" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/cadastrar-voluntario" element={<PrivateRoute><CadastroVoluntario /></PrivateRoute>} />
            
            <Route path="/Calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
            <Route path="/Pets" element={<PrivateRoute><Pets /></PrivateRoute>} />
            <Route path="/PetPerfil/:id" element={<PrivateRoute><PetPerfil /></PrivateRoute>} />
            <Route path="/CadastroPet" element={<PrivateRoute><CadastroPet /></PrivateRoute>} />
            <Route path="/NovoFeedback" element={<PrivateRoute><NovoFeedback /></PrivateRoute>} />
            <Route path="/HistoricoAdocao" element={<PrivateRoute><HistoricoAdocao /></PrivateRoute>} />
            <Route path="/AnalisarFeedback" element={<PrivateRoute><AnalisarFeedback /></PrivateRoute>} />
            <Route path="/Tarefas" element={<PrivateRoute><Tarefas /></PrivateRoute>} /> */}
        </Routes>
    );
};

export default AppRoutes;