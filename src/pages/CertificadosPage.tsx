import { useEffect, useState } from 'react';
import { certificadosService, usuariosService, cursosService, trilhasService } from '../services';
import type { Certificado, Usuario, Curso, Trilha } from '../models';

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [form, setForm] = useState<Certificado>({ idUsuario: 0, idCurso: 0, codigoVerificacao: '', dataEmissao: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [ce, u, c, t] = await Promise.all([
      certificadosService.getAll() as Promise<Certificado[]>,
      usuariosService.getAll() as Promise<Usuario[]>,
      cursosService.getAll() as Promise<Curso[]>,
      trilhasService.getAll() as Promise<Trilha[]>,
    ]);
    setCertificados(ce); setUsuarios(u); setCursos(c); setTrilhas(t);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const names = ['idUsuario', 'idCurso', 'idTrilha'];
    const val = names.includes(e.target.name) ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const gerarCodigo = () => `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const handleSalvar = async () => {
    if (!form.idUsuario || !form.idCurso || !form.dataEmissao) return alert('Preencha todos os campos obrigatórios');
    setLoading(true);
    try {
      const payload = { ...form, codigoVerificacao: form.codigoVerificacao || gerarCodigo() };
      if (editId !== null) await certificadosService.update(editId, { ...payload, id: editId });
      else await certificadosService.create(payload);
      handleLimpar(); await load();
    } finally { setLoading(false); }
  };

  const handleLimpar = () => { setForm({ idUsuario: 0, idCurso: 0, codigoVerificacao: '', dataEmissao: '' }); setEditId(null); };
  const handleEdit = (c: Certificado) => { setForm(c); setEditId(c.id!); };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Excluir?')) return;
    await certificadosService.delete(id); await load();
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Certificados</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Novo certificado</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Usuário</label>
              <select className="form-select" name="idUsuario" value={form.idUsuario || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Curso</label>
              <select className="form-select" name="idCurso" value={form.idCurso || ''} onChange={handleChange}>
                <option value="">Selecione</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Trilha (opcional)</label>
              <select className="form-select" name="idTrilha" value={form.idTrilha || ''} onChange={handleChange}>
                <option value="">Nenhuma</option>
                {trilhas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Data de Emissão</label>
              <input className="form-control" type="date" name="dataEmissao" value={form.dataEmissao} onChange={handleChange} />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={handleSalvar} disabled={loading}>Emitir Certificado</button>
            <button className="btn btn-outline-secondary" onClick={handleLimpar}>Limpar</button>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr><th>#</th><th>USUÁRIO</th><th>CURSO</th><th>CÓDIGO</th><th>EMISSÃO</th><th>AÇÕES</th></tr>
            </thead>
            <tbody>
              {certificados.length === 0
                ? <tr><td colSpan={6} className="text-center text-muted fst-italic py-4">Nenhum certificado emitido</td></tr>
                : certificados.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{usuarios.find(u => u.id === c.idUsuario)?.nomeCompleto || c.idUsuario}</td>
                    <td>{cursos.find(cu => cu.id === c.idCurso)?.titulo || c.idCurso}</td>
                    <td><code>{c.codigoVerificacao}</code></td>
                    <td>{c.dataEmissao}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(c)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id!)}>Excluir</button>
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
