import { useEffect, useState } from 'react';
import { aulasService, modulosService } from '../services';
import type { Aula, Modulo } from '../models';

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [form, setForm] = useState<Aula>({ titulo: '', idModulo: 0, duracaoMinutos: 0, urlConteudo: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [a, m] = await Promise.all([
      aulasService.getAll() as Promise<Aula[]>,
      modulosService.getAll() as Promise<Modulo[]>,
    ]);
    setAulas(a);
    setModulos(m);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'idModulo' || e.target.name === 'duracaoMinutos' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSalvar = async () => {
    if (!form.titulo.trim()) return alert('Título obrigatório');
    if (!form.idModulo) return alert('Selecione um módulo');
    setLoading(true);
    try {
      if (editId !== null) {
        await aulasService.update(editId, { ...form, id: editId });
      } else {
        await aulasService.create(form);
      }
      handleLimpar();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm({ titulo: '', idModulo: 0, duracaoMinutos: 0, urlConteudo: '' });
    setEditId(null);
  };

  const handleEdit = (a: Aula) => { setForm(a); setEditId(a.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await aulasService.delete(id);
    await load();
  };

  const getModuloNome = (id: number) => modulos.find(m => m.id === id)?.titulo || '-';

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Aulas</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova aula</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Titulo Da Aula</label>
              <input className="form-control" name="titulo" placeholder="Digite o título da aula" value={form.titulo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Módulo</label>
              <select className="form-select" name="idModulo" value={form.idModulo || ''} onChange={handleChange}>
                <option value="">Nome do módulo</option>
                {modulos.map(m => <option key={m.id} value={m.id}>{m.titulo}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Duração (Min)</label>
              <input className="form-control" type="number" name="duracaoMinutos" min={0} value={form.duracaoMinutos} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Link Da Aula</label>
              <input className="form-control" name="urlConteudo" placeholder="https://..." value={form.urlConteudo || ''} onChange={handleChange} />
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
                <th>TÍTULO</th>
                <th>MÓDULO</th>
                <th>DURAÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {aulas.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhuma aula cadastrada</td></tr>
              ) : (
                aulas.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{a.titulo}</td>
                    <td>{getModuloNome(a.idModulo)}</td>
                    <td>{a.duracaoMinutos} min</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(a)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id!)}>Excluir</button>
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
