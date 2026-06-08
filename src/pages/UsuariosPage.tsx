import { useEffect, useState } from 'react';
import { usuariosService } from '../services';
import type { Usuario } from '../models';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<Usuario>({ nomeCompleto: '', email: '', perfil: 'Aluno' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await usuariosService.getAll() as Usuario[];
    setUsuarios(data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.nomeCompleto.trim()) return alert('Nome obrigatório');
    if (!form.email.trim()) return alert('E-mail obrigatório');
    setLoading(true);
    try {
      const payload = { ...form, dataCadastro: new Date().toISOString() };
      if (editId !== null) {
        await usuariosService.update(editId, { ...payload, id: editId });
      } else {
        await usuariosService.create(payload);
      }
      handleLimpar();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm({ nomeCompleto: '', email: '', perfil: 'Aluno' });
    setEditId(null);
  };

  const handleEdit = (u: Usuario) => { setForm(u); setEditId(u.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await usuariosService.delete(id);
    await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Usuários</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo usuário</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-medium">Nome</label>
              <input className="form-control" name="nomeCompleto" placeholder="Nome completo" value={form.nomeCompleto} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">E-Mail</label>
              <input className="form-control" type="email" name="email" placeholder="email@exemplo.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Perfil</label>
              <select className="form-select" name="perfil" value={form.perfil} onChange={handleChange}>
                <option>Aluno</option>
                <option>Instrutor</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={handleSalvar} disabled={loading}>Salvar</button>
            <button className="btn btn-outline-secondary" onClick={handleLimpar}>Limpar</button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 60 }}>#</th>
                <th>NOME</th>
                <th>E-MAIL</th>
                <th>PERFIL</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhum usuário cadastrado</td></tr>
              ) : (
                usuarios.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.nomeCompleto}</td>
                    <td>{u.email}</td>
                    <td>{u.perfil}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(u)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id!)}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
