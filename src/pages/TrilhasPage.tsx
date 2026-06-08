import { useEffect, useState } from 'react';
import { trilhasService } from '../services';
import type { Trilha } from '../models';

export default function TrilhasPage() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [form, setForm] = useState<Trilha>({ titulo: '', descricao: '', dataInicio: '', dataTermino: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await trilhasService.getAll() as Trilha[];
    setTrilhas(data);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.titulo.trim()) return alert('Nome obrigatório');
    setLoading(true);
    try {
      if (editId !== null) {
        await trilhasService.update(editId, { ...form, id: editId });
      } else {
        await trilhasService.create(form);
      }
      handleLimpar();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm({ titulo: '', descricao: '', dataInicio: '', dataTermino: '' });
    setEditId(null);
  };

  const handleEdit = (t: Trilha) => {
    setForm(t);
    setEditId(t.id!);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir esta trilha?')) return;
    await trilhasService.delete(id);
    await load();
  };

  const calcDuracao = (t: Trilha) => {
    if (!t.dataInicio || !t.dataTermino) return '-';
    const d1 = new Date(t.dataInicio);
    const d2 = new Date(t.dataTermino);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} dias` : '-';
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Trilhas</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova trilha</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nome</label>
              <input className="form-control" name="titulo" placeholder="Nome da trilha" value={form.titulo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Início</label>
              <input className="form-control" type="date" name="dataInicio" value={form.dataInicio || ''} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Término</label>
              <input className="form-control" type="date" name="dataTermino" value={form.dataTermino || ''} onChange={handleChange} />
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
                <th>DESCRIÇÃO</th>
                <th>DURAÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {trilhas.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhuma trilha cadastrada</td></tr>
              ) : (
                trilhas.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>{t.titulo}</td>
                    <td>{t.descricao}</td>
                    <td>{calcDuracao(t)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(t)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.id!)}>Excluir</button>
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
