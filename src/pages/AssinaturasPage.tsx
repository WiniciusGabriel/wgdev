import { useEffect, useState } from 'react';
import { assinaturasService, usuariosService, planosService } from '../services';

export default function AssinaturasPage() {
  const [assinaturas, setAssinaturas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [planos, setPlanos] = useState<any[]>([]);

  const [form, setForm] = useState<any>({ idUsuario: '', idPlano: '', dataInicio: '', dataFim: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [ass, usr, pla] = await Promise.all([
        assinaturasService.getAll(),
        usuariosService.getAll(),
        planosService.getAll()
      ]);
      setAssinaturas(ass || []);
      setUsuarios(usr || []);
      setPlanos(pla || []);
    } catch (error) {
      console.error("Erro ao carregar assinaturas:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.idUsuario) return alert('Selecione um usuário');
    if (!form.idPlano) return alert('Selecione um plano');

    setLoading(true);
    try {
      await assinaturasService.create({
        idUsuario: form.idUsuario,
        usuarioId: form.idUsuario,
        idPlano: form.idPlano,
        planoId: form.idPlano,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim
      });
      setForm({ idUsuario: '', idPlano: '', dataInicio: '', dataFim: '' });
      await load();
    } catch (error) {
      console.error("Erro ao salvar assinatura:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir assinatura?')) return;
    try {
      await assinaturasService.delete(id);
      await load();
    } catch (error) {
      console.error("Erro ao eliminar assinatura:", error);
    }
  };

  const getUsuarioNome = (ass: any) => {
    const idBuscar = ass.idUsuario || ass.usuarioId;
    const usuario = usuarios.find(u => String(u.id) === String(idBuscar));
    return usuario ? (usuario.nomeCompleto || usuario.nome) : 'Usuário não encontrado';
  };

  const getPlanoNome = (ass: any) => {
    const idBuscar = ass.idPlano || ass.planoId;
    const plano = planos.find(p => String(p.id) === String(idBuscar));
    return plano ? plano.nome : 'Plano não encontrado';
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Assinaturas</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Nova Assinatura</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Usuário</label>
              <select className="form-select" name="idUsuario" value={form.idUsuario} onChange={handleChange}>
                <option value="">Selecione um usuário</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto || u.nome}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Plano</label>
              <select className="form-select" name="idPlano" value={form.idPlano} onChange={handleChange}>
                <option value="">Selecione um plano</option>
                {planos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Início</label>
              <input className="form-control" type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Fim</label>
              <input className="form-control" type="date" name="dataFim" value={form.dataFim} onChange={handleChange} />
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
                <th>PLANO</th>
                <th>INÍCIO</th>
                <th>FIM</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {assinaturas.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted fst-italic py-4">Nenhuma assinatura cadastrada</td></tr>
              ) : (
                assinaturas.map((ass, i) => (
                  <tr key={ass.id}>
                    <td>{i + 1}</td>
                    <td className="fw-medium">{getUsuarioNome(ass)}</td>
                    <td>{getPlanoNome(ass)}</td>
                    <td>{ass.dataInicio || '-'}</td>
                    <td>{ass.dataFim || '-'}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ass.id)}>Excluir</button></td>
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