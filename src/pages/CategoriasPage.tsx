import { useEffect, useState } from 'react';
import { categoriasService } from '../services';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nome: '', descricao: '' });
  const [editId, setEditId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await categoriasService.getAll();
      setCategorias(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSalvar = async () => {
    if (!form.nome || !form.nome.trim()) return alert('Nome obrigatório');
    setLoading(true);
    try {
      if (editId !== null) {
        await categoriasService.update(editId as any, { ...form, id: editId });
      } else {
        await categoriasService.create(form);
      }
      handleLimpar(); 
      await load();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => { 
    setForm({ nome: '', descricao: '' }); 
    setEditId(null); 
  };

  const handleEdit = (c: any) => { 
    setForm(c); 
    setEditId(c.id); 
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Excluir esta categoria?')) return;
    try {
      await categoriasService.delete(id as any); 
      await load();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  return (
    <div className="container-fluid px-5 py-4">
      <h2 className="mb-4 fw-semibold">Categorias</h2>
      
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">{editId !== null ? 'Editar categoria' : 'Nova categoria'}</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Nome</label>
              <input className="form-control" name="nome" placeholder="Nome da categoria" value={form.nome} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Descrição</label>
              <input className="form-control" name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
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
                <th style={{ width: 60 }}>#</th>
                <th>NOME</th>
                <th>DESCRIÇÃO</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted fst-italic py-4">Nenhuma categoria cadastrada</td></tr>
              ) : (
                categorias.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td className="fw-medium">{c.nome}</td>
                    <td>{c.descricao || '-'}</td>
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