import { useEffect, useState } from 'react';
import { certificadosService, usuariosService, cursosService, trilhasService } from '../services';

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [trilhas, setTrilhas] = useState<any[]>([]);

  const [form, setForm] = useState<any>({ idUsuario: '', idCurso: '', idTrilha: '', dataEmissao: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [cert, usr, cur, tri] = await Promise.all([
        certificadosService.getAll(),
        usuariosService.getAll(),
        cursosService.getAll(),
        trilhasService.getAll()
      ]);
      setCertificados(cert || []);
      setUsuarios(usr || []);
      setCursos(cur || []);
      setTrilhas(tri || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    if (!form.idUsuario || !form.idCurso) return alert('Preencha os campos obrigatórios');
    setLoading(true);
    try {
      await certificadosService.create({
        ...form,
        usuarioId: form.idUsuario,
        cursoId: form.idCurso,
        trilhaId: form.idTrilha || null,
        codigo: 'CERT-' + Math.random().toString(36).substring(2, 11).toUpperCase()
      });
      setForm({ idUsuario: '', idCurso: '', idTrilha: '', dataEmissao: '' });
      await load();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Certificados</h2>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">Emitir Certificado</h6>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small fw-medium">Usuário</label>
              <select className="form-select" name="idUsuario" value={form.idUsuario} onChange={handleChange}>
                <option value="">Selecione</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto || u.nome}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Curso</label>
              <select className="form-select" name="idCurso" value={form.idCurso} onChange={handleChange}>
                <option value="">Selecione</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome || c.titulo}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Trilha</label>
              <select className="form-select" name="idTrilha" value={form.idTrilha} onChange={handleChange}>
                <option value="">Nenhuma</option>
                {trilhas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-medium">Data</label>
              <input className="form-control" type="date" name="dataEmissao" value={form.dataEmissao} onChange={handleChange} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSalvar} disabled={loading}>Emitir</button>
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
                <th>CÓDIGO</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((cert, i) => (
                <tr key={cert.id}>
                  <td>{i + 1}</td>
                  <td>{usuarios.find(u => String(u.id) === String(cert.idUsuario || cert.usuarioId))?.nomeCompleto || usuarios.find(u => String(u.id) === String(cert.idUsuario || cert.usuarioId))?.nome || '-'}</td>
                  <td>{cursos.find(c => String(c.id) === String(cert.idCurso || cert.cursoId))?.nome || cursos.find(c => String(c.id) === String(cert.idCurso || cert.cursoId))?.titulo || '-'}</td>
                  <td><code>{cert.codigo}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}