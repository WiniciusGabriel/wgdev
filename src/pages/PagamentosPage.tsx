import { useEffect, useState } from 'react';
import { pagamentosService, assinaturasService } from '../services';
import type { Pagamento, Assinatura } from '../models';

const METODOS = ['Cartão de Crédito', 'Cartão de Débito', 'PIX', 'Boleto'];

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [form, setForm] = useState<Pagamento>({ idAssinatura: 0, valorPago: 0, dataPagamento: '', metodoPagamento: METODOS[0], idTransacaoGateway: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [p, a] = await Promise.all([
      pagamentosService.getAll() as Promise<Pagamento[]>,
      assinaturasService.getAll() as Promise<Assinatura[]>,
    ]);
    setPagamentos(p); setAssinaturas(a);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === 'idAssinatura' || e.target.name === 'valorPago' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const gerarTxId = () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const handleSalvar = async () => {
    if (!form.idAssinatura || !form.dataPagamento || !form.valorPago) return alert('Preencha todos os campos');
    setLoading(true);
    try {
      const payload = { ...form, idTransacaoGateway: form.idTransacaoGateway || gerarTxId() };
      if (editId !== null) await pagamentosService.update(editId, { ...payload, id: editId });
      else await pagamentosService.create(payload);
      handleLimpar(); await load();
    } finally { setLoading(false); }
  };

  const handleLimpar = () => { setForm({ idAssinatura: 0, valorPago: 0, dataPagamento: '', metodoPagamento: METODOS[0], idTransacaoGateway: '' }); setEditId(null); };
  const handleEdit = (p: Pagamento) => { setForm(p); setEditId(p.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await pagamentosService.delete(id); await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Pagamentos</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo pagamento</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Assinatura</label>
              <select className="form-select" name="idAssinatura" value={form.idAssinatura || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                {assinaturas.map(a => <option key={a.id} value={a.id}>Assinatura #{a.id}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Valor Pago (R$)</label>
              <input className="form-control" type="number" name="valorPago" min={0} step={0.01} value={form.valorPago} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Data Pagamento</label>
              <input className="form-control" type="date" name="dataPagamento" value={form.dataPagamento} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Método de Pagamento</label>
              <select className="form-select" name="metodoPagamento" value={form.metodoPagamento} onChange={handleChange}>
                {METODOS.map(m => <option key={m}>{m}</option>)}
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
              <tr><th>#</th><th>ASSINATURA</th><th>VALOR</th><th>DATA</th><th>MÉTODO</th><th>TX ID</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {pagamentos.length === 0
                ? <tr><td colSpan={7} className="text-center text-muted fst-italic py-4">Nenhum pagamento cadastrado</td></tr>
                : pagamentos.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>#{p.idAssinatura}</td>
                    <td>R$ {Number(p.valorPago).toFixed(2)}</td>
                    <td>{p.dataPagamento}</td>
                    <td>{p.metodoPagamento}</td>
                    <td><small className="text-muted">{p.idTransacaoGateway}</small></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id!)}>Excluir</button>
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
