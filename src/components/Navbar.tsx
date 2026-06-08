import { NavLink } from 'react-router-dom';

const mainLinks = [
  { to: '/trilhas', label: 'Trilhas' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/modulos', label: 'Módulos' },
  { to: '/aulas', label: 'Aulas' },
  { to: '/usuarios', label: 'Usuários' },
];

const extraLinks = [
  { to: '/categorias', label: 'Categorias' },
  { to: '/matriculas', label: 'Matrículas' },
  { to: '/planos', label: 'Planos' },
  { to: '/assinaturas', label: 'Assinaturas' },
  { to: '/pagamentos', label: 'Pagamentos' },
  { to: '/certificados', label: 'Certificados' },
];

export default function Navbar() {
  return (
    <>
      <nav style={{ backgroundColor: '#1a1a2e', padding: '0 24px', display: 'flex', alignItems: 'center', minHeight: 50 }}>
        <span style={{ color: '#a855f7', fontWeight: 700, fontSize: '1.15rem', marginRight: 32 }}>
          WGDEV
        </span>
        <div style={{ display: 'flex', gap: 0 }}>
          {mainLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: '#3b82f6',
                fontWeight: 500,
                fontSize: '0.93rem',
                padding: '14px 16px',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #1d4ed8' : '2px solid transparent',
                display: 'block',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
      <nav style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', display: 'flex', alignItems: 'center', minHeight: 38 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {extraLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                color: isActive ? '#1d4ed8' : '#6b7280',
                fontWeight: 500,
                fontSize: '0.82rem',
                padding: '8px 14px',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #1d4ed8' : '2px solid transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
