import { useEffect, useState } from 'react';
import { aulasService, modulosService } from '../services';

export default function AulasPage() {
  const [aulas, setAulas] = useState<any[]>([]);
  const [modulos, setModulos] = useState<any[]>([]);

  const [form, setForm] = useState<any>({ titulo: '', duracao: '', idModulo: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [aul, mod] = await Promise.all([
        aulasService.getAll(),
        modulosService.getAll()
      ]);
      setAulas(aul || []);
      setModulos(mod || []);
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.titulo || !form.titulo.trim()) return alert('Título obrigatório');
    if (!form.idModulo) return alert('Selecione um módulo');

    setLoading(true);
    try {
      await aulasService.create({
        titulo: form.titulo,
        duracao: form.duracao,
        idModulo: form.idModulo,
        moduloId: form.idModulo
      });
      setForm({ titulo: '', duracao: '', idModulo: '' });
      await load();
    } catch (error) {
      console.error("Erro ao salvar aula:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir aula?')) return;
    try {
      await aulasService.delete(id);
      await load();
    } catch (error) {
      console.error("Erro ao deletar aula:", error);
    }
  };

  const getModuloNome = (aula: any) => {
    const idBuscar = aula.idModulo || aula.moduloId;
    const modulo = modulos.find(m => String(m.id) === String(idBuscar));
    return modulo ? modulo.nome : 'Módulo não encontrado';
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Aulas</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova aula</h6>
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label small fw-medium">Título Da Aula</label>
              <input className="form-control" name="titulo" placeholder="Digite o título da aula" value={form.titulo} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Duração (Min)</label>
              <input className="form-control" name="duracao" placeholder="Ex: 15" value={form.duracao} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-medium">Módulo</label>
              <select className="form-select" name="idModulo" value={form.idModulo} onChange={handleChange}>
                <option value="">Selecione um módulo</option>
                {modulos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
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
                aulas.map((aula, i) => (
                  <tr key={aula.id}>
                    <td>{i + 1}</td>
                    <td className="fw-medium">{aula.titulo}</td>
                    <td>{getModuloNome(aula)}</td>
                    <td>{aula.duracao ? `${aula.duracao} min` : '-'}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(aula.id)}>Excluir</button></td>
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