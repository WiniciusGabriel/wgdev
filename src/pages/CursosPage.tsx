import { useEffect, useState } from 'react';
import { cursosService, trilhasService } from '../services';

export default function CursosPage() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [trilhas, setTrilhas] = useState<any[]>([]);
  
  const [form, setForm] = useState<any>({ nome: '', descricao: '', nivel: 'Iniciante', idTrilha: '' });
  const [editId, setEditId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [cur, tri] = await Promise.all([
        cursosService.getAll(),
        trilhasService.getAll()
      ]);
      setCursos(cur || []);
      setTrilhas(tri || []);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.nome || !form.nome.trim()) return alert('Nome do curso obrigatório');
    setLoading(true);
    try {
      const payload = { 
        ...form, 
        idTrilha: form.idTrilha,
        trilhaId: form.idTrilha 
      };
      if (editId !== null) {
        await cursosService.update(editId, payload);
      } else {
        await cursosService.create(payload);
      }
      handleLimpar();
      await load();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (c: any) => {
    setForm({
      nome: c.nome,
      descricao: c.descricao || '',
      nivel: c.nivel || 'Iniciante',
      idTrilha: c.idTrilha || c.trilhaId || ''
    });
    setEditId(c.id);
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir curso?')) return;
    try {
      await cursosService.delete(id);
      await load();
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
    }
  };

  const handleLimpar = () => {
    setForm({ nome: '', descricao: '', nivel: 'Iniciante', idTrilha: '' });
    setEditId(null);
  };

  const getTrilhaNome = (curso: any) => {
    const idBuscar = curso.idTrilha || curso.trilhaId;
    const trilha = trilhas.find(t => String(t.id) === String(idBuscar));
    return trilha ? trilha.nome : 'Trilha não encontrada';
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Cursos</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">{editId ? 'Editar curso' : 'Novo curso'}</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nome Do Curso</label>
              <input className="form-control" name="nome" placeholder="Digite o nome do curso" value={form.nome} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nível</label>
              <select className="form-select" name="nivel" value={form.nivel} onChange={handleChange}>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Trilha</label>
              <select className="form-select" name="idTrilha" value={form.idTrilha} onChange={handleChange}>
                <option value="">Selecione uma trilha</option>
                {trilhas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
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
                    <td className="fw-medium">{c.nome}</td>
                    <td>{c.descricao || '-'}</td>
                    <td>{getTrilhaNome(c)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>Excluir</button>
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