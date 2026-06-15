import { useEffect, useState } from 'react';
import { pagamentosService, assinaturasService, usuariosService, planosService } from '../services';

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);

  const [form, setForm] = useState<any>({ idAssinatura: '', valorPago: '', dataPagamento: '', metodoPagamento: 'Cartão de Crédito' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [pag, ass, usr, pla] = await Promise.all([
        pagamentosService.getAll(),
        assinaturasService.getAll(),
        usuariosService.getAll(),
        planosService.getAll()
      ]);
      setPagamentos(pag || []);
      setAssinaturas(ass || []);
      setUsuarios(usr || []);
      setPlanos(pla || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'idAssinatura') {
      const assSel = assinaturas.find(a => String(a.id) === String(value));
      if (assSel) {
        const idPlanoBuscar = assSel.idPlano || assSel.planoId;
        const plano = planos.find(p => String(p.id) === String(idPlanoBuscar));
        setForm({ ...form, idAssinatura: value, valorPago: plano ? plano.preco : '' });
        return;
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleSalvar = async () => {
    if (!form.idAssinatura) return alert('Selecione uma assinatura');
    setLoading(true);
    try {
      // Salva tanto como valorPago quanto como valor para nunca dar traço na tabela
      await pagamentosService.create({
        ...form,
        idAssinatura: form.idAssinatura,
        assinaturaId: form.idAssinatura,
        valor: Number(form.valorPago),
        valorPago: Number(form.valorPago)
      });
      setForm({ idAssinatura: '', valorPago: '', dataPagamento: '', metodoPagamento: 'Cartão de Crédito' });
      await load();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAssinaturaLabel = (idAssinatura: any) => {
    const ass = assinaturas.find(a => String(a.id) === String(idAssinatura));
    if (!ass) return 'Assinatura não encontrada';

    const usrId = ass.idUsuario || ass.usuarioId;
    const plnId = ass.idPlano || ass.planoId;

    const usuario = usuarios.find(u => String(u.id) === String(usrId));
    const plano = planos.find(p => String(p.id) === String(plnId));

    return `${usuario ? (usuario.nomeCompleto || usuario.nome) : 'Usuário'} - ${plano ? plano.nome : 'Plano'}`;
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Pagamentos</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo Pagamento</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Assinatura</label>
              <select className="form-select" name="idAssinatura" value={form.idAssinatura} onChange={handleChange}>
                <option value="">Selecione uma assinatura</option>
                {assinaturas.map(a => <option key={a.id} value={a.id}>{getAssinaturaLabel(a.id)}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Valor Pago (R$)</label>
              <input className="form-control" type="number" name="valorPago" value={form.valorPago} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Data</label>
              <input className="form-control" type="date" name="dataPagamento" value={form.dataPagamento} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Método</label>
              <select className="form-select" name="metodoPagamento" value={form.metodoPagamento} onChange={handleChange}>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Pix">Pix</option>
                <option value="Boleto">Boleto</option>
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
                <th>ASSINATURA</th>
                <th>VALOR</th>
                <th>DATA</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pag, i) => (
                <tr key={pag.id}>
                  <td>{i + 1}</td>
                  <td>{getAssinaturaLabel(pag.idAssinatura || pag.assinaturaId)}</td>
                  <td>R$ {Number(pag.valorPago || pag.valor || 0).toFixed(2)}</td>
                  <td>{pag.dataPagamento}</td>
                  <td><button className="btn btn-sm btn-outline-danger" onClick={() => pagamentosService.delete(pag.id).then(load)}>Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}