import { useEffect, useState } from 'react';
import { cursosService, trilhasService } from '../services';
import type { Curso, Trilha } from '../models';

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [form, setForm] = useState<Curso>({ titulo: '', descricao: '', nivel: 'Iniciante', trilhaId: undefined });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [c, t] = await Promise.all([
      cursosService.getAll() as Promise<Curso[]>,
      trilhasService.getAll() as Promise<Trilha[]>,
    ]);
    setCursos(c);
    setTrilhas(t);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.titulo.trim()) return alert('Nome obrigatório');
    setLoading(true);
    try {
      const payload = { ...form, trilhaId: form.trilhaId ? Number(form.trilhaId) : undefined };
      if (editId !== null) {
        await cursosService.update(editId, { ...payload, id: editId });
      } else {
        await cursosService.create(payload);
      }
      handleLimpar();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm({ titulo: '', descricao: '', nivel: 'Iniciante', trilhaId: undefined });
    setEditId(null);
  };

  const handleEdit = (c: Curso) => { setForm(c); setEditId(c.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await cursosService.delete(id);
    await load();
  };

  const getTrilhaNome = (id?: number) => trilhas.find(t => t.id === id)?.titulo || '-';

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Cursos</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo curso</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nome Do Curso</label>
              <input className="form-control" name="titulo" placeholder="Digite o nome do curso" value={form.titulo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nível</label>
              <select className="form-select" name="nivel" value={form.nivel} onChange={handleChange}>
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Trilha</label>
              <select className="form-select" name="trilhaId" value={form.trilhaId || ''} onChange={handleChange}>
                <option value="">Selecione uma trilha</option>
                {trilhas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
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
                <th>DESCRIÇÃO</th>
                <th>TRILHA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {cursos.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhum curso cadastrado</td></tr>
              ) : (
                cursos.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.titulo}</td>
                    <td>{c.descricao}</td>
                    <td>{getTrilhaNome(c.trilhaId)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id!)}>Excluir</button>
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
