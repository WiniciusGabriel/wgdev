import { useEffect, useState } from 'react';
import { modulosService, cursosService } from '../services';

export default function ModulosPage() {
  const [modulos, setModulos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  
  const [form, setForm] = useState<any>({ nome: '', descricao: '', ordem: 1, idCurso: '' });
  const [editId, setEditId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [mod, cur] = await Promise.all([
        modulosService.getAll(),
        cursosService.getAll()
      ]);
      setModulos(mod || []);
      setCursos(cur || []);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.nome || !form.nome.trim()) return alert('Nome do módulo obrigatório');
    setLoading(true);
    try {
      const payload = { 
        ...form, 
        idCurso: form.idCurso,
        cursoId: form.idCurso 
      };
      if (editId !== null) {
        await modulosService.update(editId, payload);
      } else {
        await modulosService.create(payload);
      }
      handleLimpar();
      await load();
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m: any) => {
    setForm({
      nome: m.nome,
      descricao: m.descricao || '',
      ordem: m.ordem || 1,
      idCurso: m.idCurso || m.cursoId || ''
    });
    setEditId(m.id);
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir módulo?')) return;
    try {
      await modulosService.delete(id);
      await load();
    } catch (error) {
      console.error("Erro ao deletar módulo:", error);
    }
  };

  const handleLimpar = () => {
    setForm({ nome: '', descricao: '', ordem: 1, idCurso: '' });
    setEditId(null);
  };

  const getCursoNome = (modulo: any) => {
    const idBuscar = modulo.idCurso || modulo.cursoId;
    const curso = cursos.find(c => String(c.id) === String(idBuscar));
    return curso ? curso.nome : 'Curso não encontrado';
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Módulos</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">{editId ? 'Editar módulo' : 'Novo módulo'}</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-medium">Nome Do Módulo</label>
              <input className="form-control" name="nome" placeholder="Digite o nome do módulo" value={form.nome} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Digite a descrição" value={form.descricao} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-medium">Ordem</label>
              <input className="form-control" type="number" name="ordem" value={form.ordem} onChange={handleChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-medium">Curso</label>
              <select className="form-select" name="idCurso" value={form.idCurso} onChange={handleChange}>
                <option value="">Selecione um curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
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
                <th>#</th>
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
                    <td className="fw-medium">{m.nome}</td>
                    <td>{getCursoNome(m)}</td>
                    <td>{m.ordem}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}>Excluir</button>
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