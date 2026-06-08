import { useEffect, useState } from 'react';
import { planosService } from '../services';
import type { Plano } from '../models';

export default function PlanosPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [form, setForm] = useState<Plano>({ nome: '', descricao: '', preco: 0, duracaoMeses: 1 });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => { const data = await planosService.getAll() as Plano[]; setPlanos(data); };
  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.name === 'preco' || e.target.name === 'duracaoMeses' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSalvar = async () => {
    if (!form.nome.trim()) return alert('Nome obrigatório');
    setLoading(true);
    try {
      if (editId !== null) await planosService.update(editId, { ...form, id: editId });
      else await planosService.create(form);
      handleLimpar(); await load();
    } finally { setLoading(false); }
  };

  const handleLimpar = () => { setForm({ nome: '', descricao: '', preco: 0, duracaoMeses: 1 }); setEditId(null); };
  const handleEdit = (p: Plano) => { setForm(p); setEditId(p.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await planosService.delete(id); await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Planos</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo plano</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Nome</label>
              <input className="form-control" name="nome" placeholder="Nome do plano" value={form.nome} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Preço (R$)</label>
              <input className="form-control" type="number" name="preco" min={0} step={0.01} value={form.preco} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Duração (Meses)</label>
              <input className="form-control" type="number" name="duracaoMeses" min={1} value={form.duracaoMeses} onChange={handleChange} />
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
              <tr><th>#</th><th>NOME</th><th>DESCRIÇÃO</th><th>PREÇO</th><th>DURAÇÃO</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {planos.length === 0
                ? <tr><td colSpan={6} className="text-center text-muted fst-italic py-4">Nenhum plano cadastrado</td></tr>
                : planos.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td><td>{p.nome}</td><td>{p.descricao}</td>
                    <td>R$ {Number(p.preco).toFixed(2)}</td><td>{p.duracaoMeses} mês(es)</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id!)}>Excluir</button>
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
