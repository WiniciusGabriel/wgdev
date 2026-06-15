import { useEffect, useState } from 'react';
import { matriculasService, usuariosService, cursosService } from '../services';

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);

  const [form, setForm] = useState<any>({ idUsuario: '', idCurso: '', dataMatricula: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [mat, usr, cur] = await Promise.all([
        matriculasService.getAll(),
        usuariosService.getAll(),
        cursosService.getAll()
      ]);
      setMatriculas(mat || []);
      setUsuarios(usr || []);
      setCursos(cur || []);
    } catch (error) {
      console.error("Erro ao carregar matrículas:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.idUsuario) return alert('Selecione um usuário');
    if (!form.idCurso) return alert('Selecione um curso');

    setLoading(true);
    try {
      await matriculasService.create({
        idUsuario: form.idUsuario,
        usuarioId: form.idUsuario,
        idCurso: form.idCurso,
        cursoId: form.idCurso,
        dataMatricula: form.dataMatricula || new Date().toISOString().split('T')[0]
      });
      setForm({ idUsuario: '', idCurso: '', dataMatricula: '' });
      await load();
    } catch (error) {
      console.error("Erro ao salvar matrícula:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir matrícula?')) return;
    try {
      await matriculasService.delete(id);
      await load();
    } catch (error) {
      console.error("Erro ao eliminar matrícula:", error);
    }
  };

  const getUsuarioNome = (mat: any) => {
    const idBuscar = mat.idUsuario || mat.usuarioId;
    const usuario = usuarios.find(u => String(u.id) === String(idBuscar));
    return usuario ? (usuario.nomeCompleto || usuario.nome) : 'Usuário não encontrado';
  };

  const getCursoNome = (mat: any) => {
    const idBuscar = mat.idCurso || mat.cursoId;
    const curso = cursos.find(c => String(c.id) === String(idBuscar));
    return curso ? curso.nome : 'Curso não encontrado';
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Matrículas</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova Matrícula</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-medium">Usuário</label>
              <select className="form-select" name="idUsuario" value={form.idUsuario} onChange={handleChange}>
                <option value="">Selecione um usuário</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto || u.nome}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Curso</label>
              <select className="form-select" name="idCurso" value={form.idCurso} onChange={handleChange}>
                <option value="">Selecione um curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Data de Matrícula</label>
              <input className="form-control" type="date" name="dataMatricula" value={form.dataMatricula} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSalvar} disabled={loading}>Salvar</button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>USUÁRIO</th>
                <th>CURSO</th>
                <th>DATA DE MATRÍCULA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted fst-italic py-4">Nenhuma matrícula cadastrada</td></tr>
              ) : (
                matriculas.map((mat, i) => (
                  <tr key={mat.id}>
                    <td>{i + 1}</td>
                    <td className="fw-medium">{getUsuarioNome(mat)}</td>
                    <td>{getCursoNome(mat)}</td>
                    <td>{mat.dataMatricula || '-'}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mat.id)}>Excluir</button></td>
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