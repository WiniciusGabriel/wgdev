import { useEffect, useState } from 'react';
import { modulosService, cursosService } from '../services';
import type { Modulo, Curso } from '../models';

export default function ModulosPage() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [form, setForm] = useState<Modulo>({ titulo: '', descricao: '', ordem: 1, idCurso: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [m, c] = await Promise.all([
      modulosService.getAll() as Promise<Modulo[]>,
      cursosService.getAll() as Promise<Curso[]>,
    ]);
    setModulos(m);
    setCursos(c);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.name === 'ordem' || e.target.name === 'idCurso' ? Number(e.target.value) : e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.titulo.trim()) return alert('Nome obrigatório');
    if (!form.idCurso) return alert('Selecione um curso');
    setLoading(true);
    try {
      if (editId !== null) {
        await modulosService.update(editId, { ...form, id: editId });
      } else {
        await modulosService.create(form);
      }
      handleLimpar();
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setForm({ titulo: '', descricao: '', ordem: 1, idCurso: 0 });
    setEditId(null);
  };

  const handleEdit = (m: Modulo) => { setForm(m); setEditId(m.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await modulosService.delete(id);
    await load();
  };

  const getCursoNome = (id: number) => cursos.find(c => c.id === id)?.titulo || '-';

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Módulos</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo módulo</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-medium">Nome Do Módulo</label>
              <input className="form-control" name="titulo" placeholder="Digite o nome do módulo" value={form.titulo} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Digite a descrição" value={form.descricao || ''} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Ordem</label>
              <input className="form-control" type="number" name="ordem" min={1} value={form.ordem} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Curso</label>
              <select className="form-select" name="idCurso" value={form.idCurso || ''} onChange={handleChange}>
                <option value="">Nome do curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
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
                <th>NOME DO MÓDULO</th>
                <th>CURSO</th>
                <th>ORDEM</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {modulos.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhum módulo cadastrado</td></tr>
              ) : (
                modulos.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{m.titulo}</td>
                    <td>{getCursoNome(m.idCurso)}</td>
                    <td>{m.ordem}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id!)}>Excluir</button>
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
