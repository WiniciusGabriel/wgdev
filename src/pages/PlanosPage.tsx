import { useEffect, useState } from 'react';
import { planosService } from '../services';

export default function PlanosPage() {
  const [planos, setPlanos] = useState<any[]>([]);
  // CORREÇÃO 1: Iniciamos os campos numéricos vazios ou tratados como string para o input não travar o 0
  const [form, setForm] = useState<any>({ nome: '', descricao: '', preco: '', duracao: '' });
  const [editingId, setEditingId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await planosService.getAll();
      setPlanos(data || []);
    } catch (error) {
      console.error("Erro ao carregar planos:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.nome.trim()) return alert('Insira o nome do plano');
    
    // CORREÇÃO 2: Converte os valores para número apenas na hora de salvar, usando 0 como padrão se estiver vazio
    const dadosParaSalvar = {
      ...form,
      preco: Number(form.preco) || 0,
      duracao: Number(form.duracao) || 0
    };

    setLoading(true);
    try {
      if (editingId) {
        await planosService.update(editingId, dadosParaSalvar);
        setEditingId(null);
      } else {
        await planosService.create(dadosParaSalvar);
      }
      setForm({ nome: '', descricao: '', preco: '', duracao: '' });
      await load();
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (plano: any) => {
    setEditingId(plano.id);
    setForm({
      nome: plano.nome,
      descricao: plano.descricao,
      preco: String(plano.preco),
      duracao: String(plano.duracao)
    });
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir este plano?')) return;
    await planosService.delete(id);
    await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Planos</h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">{editingId ? 'Editar Plano' : 'Novo plano'}</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Nome</label>
              <input className="form-control" type="text" name="nome" placeholder="Nome do plano" value={form.nome} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" type="text" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Preço (R$)</label>
              <input 
                className="form-control" 
                type="number" 
                name="preco" 
                placeholder="Ex: 99" 
                value={form.preco} 
                onChange={handleChange}
                onFocus={(e) => e.target.value === '0' && setForm({ ...form, preco: '' })} // Limpa o 0 ao clicar!
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Duração (Meses)</label>
              <input 
                className="form-control" 
                type="number" 
                name="duracao" 
                placeholder="Ex: 12" 
                value={form.duracao} 
                onChange={handleChange}
                onFocus={(e) => e.target.value === '0' && setForm({ ...form, duracao: '' })} // Limpa o 0 ao clicar!
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={handleSalvar} disabled={loading}>
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            {editingId && (
              <button className="btn btn-light" onClick={() => { setEditingId(null); setForm({ nome: '', descricao: '', preco: '', duracao: '' }); }}>
                Cancelar
              </button>
            )}
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
                <th>PREÇO</th>
                <th>DURAÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {planos.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted fst-italic py-4">Nenhum plano cadastrado</td></tr>
              ) : (
                planos.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.nome}</td>
                    <td>{p.descricao}</td>
                    <td>R$ {Number(p.preco).toFixed(2)}</td>
                    <td>{p.duracao} mês(es)</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditar(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Excluir</button>
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