import { useEffect, useState } from 'react';
import { matriculasService, usuariosService, cursosService } from '../services';
import type { Matricula, Usuario, Curso } from '../models';

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [form, setForm] = useState<Matricula>({ idUsuario: 0, idCurso: 0, dataMatricula: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [m, u, c] = await Promise.all([
      matriculasService.getAll() as Promise<Matricula[]>,
      usuariosService.getAll() as Promise<Usuario[]>,
      cursosService.getAll() as Promise<Curso[]>,
    ]);
    setMatriculas(m); setUsuarios(u); setCursos(c);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'idUsuario' || e.target.name === 'idCurso' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSalvar = async () => {
    if (!form.idUsuario || !form.idCurso || !form.dataMatricula) return alert('Preencha todos os campos');
    setLoading(true);
    try {
      if (editId !== null) await matriculasService.update(editId, { ...form, id: editId });
      else await matriculasService.create(form);
      handleLimpar(); await load();
    } finally { setLoading(false); }
  };

  const handleLimpar = () => { setForm({ idUsuario: 0, idCurso: 0, dataMatricula: '' }); setEditId(null); };
  const handleEdit = (m: Matricula) => { setForm(m); setEditId(m.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await matriculasService.delete(id); await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Matrículas</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova matrícula</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-medium">Usuário</label>
              <select className="form-select" name="idUsuario" value={form.idUsuario || ''} onChange={handleChange}>
                <option value="">Selecione um usuário</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Curso</label>
              <select className="form-select" name="idCurso" value={form.idCurso || ''} onChange={handleChange}>
                <option value="">Selecione um curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Data de Matrícula</label>
              <input className="form-control" type="date" name="dataMatricula" value={form.dataMatricula} onChange={handleChange} />
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
              <tr><th>#</th><th>USUÁRIO</th><th>CURSO</th><th>DATA MATRÍCULA</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {matriculas.length === 0
                ? <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhuma matrícula cadastrada</td></tr>
                : matriculas.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{usuarios.find(u => u.id === m.idUsuario)?.nomeCompleto || m.idUsuario}</td>
                    <td>{cursos.find(c => c.id === m.idCurso)?.titulo || m.idCurso}</td>
                    <td>{m.dataMatricula}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id!)}>Excluir</button>
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
