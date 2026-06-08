import { useEffect, useState } from 'react';
import { assinaturasService, usuariosService, planosService } from '../services';
import type { Assinatura, Usuario, Plano } from '../models';

export default function AssinaturasPage() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [form, setForm] = useState<Assinatura>({ idUsuario: 0, idPlano: 0, dataInicio: '', dataFim: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [a, u, p] = await Promise.all([
      assinaturasService.getAll() as Promise<Assinatura[]>,
      usuariosService.getAll() as Promise<Usuario[]>,
      planosService.getAll() as Promise<Plano[]>,
    ]);
    setAssinaturas(a); setUsuarios(u); setPlanos(p);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'idUsuario' || e.target.name === 'idPlano' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSalvar = async () => {
    if (!form.idUsuario || !form.idPlano || !form.dataInicio || !form.dataFim) return alert('Preencha todos os campos');
    setLoading(true);
    try {
      if (editId !== null) await assinaturasService.update(editId, { ...form, id: editId });
      else await assinaturasService.create(form);
      handleLimpar(); await load();
    } finally { setLoading(false); }
  };

  const handleLimpar = () => { setForm({ idUsuario: 0, idPlano: 0, dataInicio: '', dataFim: '' }); setEditId(null); };
  const handleEdit = (a: Assinatura) => { setForm(a); setEditId(a.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await assinaturasService.delete(id); await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Assinaturas</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova assinatura</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Usuário</label>
              <select className="form-select" name="idUsuario" value={form.idUsuario || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Plano</label>
              <select className="form-select" name="idPlano" value={form.idPlano || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                {planos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Data Início</label>
              <input className="form-control" type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Data Fim</label>
              <input className="form-control" type="date" name="dataFim" value={form.dataFim} onChange={handleChange} />
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
              <tr><th>#</th><th>USUÁRIO</th><th>PLANO</th><th>INÍCIO</th><th>FIM</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {assinaturas.length === 0
                ? <tr><td colSpan={6} className="text-center text-muted fst-italic py-4">Nenhuma assinatura cadastrada</td></tr>
                : assinaturas.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{usuarios.find(u => u.id === a.idUsuario)?.nomeCompleto || a.idUsuario}</td>
                    <td>{planos.find(p => p.id === a.idPlano)?.nome || a.idPlano}</td>
                    <td>{a.dataInicio}</td><td>{a.dataFim}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(a)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id!)}>Excluir</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
