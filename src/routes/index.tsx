import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TrilhasPage from '../pages/TrilhasPage';
import CursosPage from '../pages/CursosPage';
import ModulosPage from '../pages/ModulosPage';
import AulasPage from '../pages/AulasPage';
import UsuariosPage from '../pages/UsuariosPage';
import CategoriasPage from '../pages/CategoriasPage';
import MatriculasPage from '../pages/MatriculasPage';
import PlanosPage from '../pages/PlanosPage';
import AssinaturasPage from '../pages/AssinaturasPage';
import PagamentosPage from '../pages/PagamentosPage';
import CertificadosPage from '../pages/CertificadosPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ backgroundColor: '#f3f4f6', minHeight: 'calc(100vh - 56px)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/trilhas" replace />} />
          <Route path="/trilhas" element={<TrilhasPage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/modulos" element={<ModulosPage />} />
          <Route path="/aulas" element={<AulasPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/matriculas" element={<MatriculasPage />} />
          <Route path="/planos" element={<PlanosPage />} />
          <Route path="/assinaturas" element={<AssinaturasPage />} />
          <Route path="/pagamentos" element={<PagamentosPage />} />
          <Route path="/certificados" element={<CertificadosPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
