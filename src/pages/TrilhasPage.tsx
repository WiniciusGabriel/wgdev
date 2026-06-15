import { useEffect, useState } from 'react';
import { trilhasService } from '../services';

export default function TrilhasPage() {
  const [trilhas, setTrilhas] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nome: '', descricao: '', inicio: '', termino: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await trilhasService.getAll();
      setTrilhas(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.nome) return alert('Insira o nome da trilha');
    setLoading(true);
    try {
      await trilhasService.create(form);
      setForm({ nome: '', descricao: '', inicio: '', termino: '' });
      await load();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Trilhas</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova Trilha</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nome</label>
              <input className="form-control" type="text" name="nome" value={form.nome} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Início</label>
              <input className="form-control" type="date" name="inicio" value={form.inicio} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Término</label>
              <input className="form-control" type="date" name="termino" value={form.termino} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label className="form-label small fw-medium">Descrição</label>
              <textarea className="form-control" name="descricao" value={form.descricao} onChange={handleChange} rows={2} />
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
                <th>NOME</th>
                <th>DESCRIÇÃO</th>
                <th>PERÍODO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {trilhas.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td className="fw-medium">{t.nome}</td>
                  <td>{t.descricao || '-'}</td>
                  <td>{t.inicio && t.termino ? `${t.inicio} até ${t.termino}` : '-'}</td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={() => trilhasService.delete(t.id).then(load)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}