import api from './api';

export function createService<T>(resource: string) {
  return {
    getAll: () => api.get<T[]>(`/${resource}`).then(r => r.data),
    getById: (id: number) => api.get<T>(`/${resource}/${id}`).then(r => r.data),
    create: (data: T) => api.post<T>(`/${resource}`, data).then(r => r.data),
    update: (id: number, data: T) => api.put<T>(`/${resource}/${id}`, data).then(r => r.data),
    delete: (id: number) => api.delete(`/${resource}/${id}`).then(r => r.data),
  };
}

export const usuariosService = createService('usuarios');
export const categoriasService = createService('categorias');
export const cursosService = createService('cursos');
export const modulosService = createService('modulos');
export const aulasService = createService('aulas');
export const matriculasService = createService('matriculas');
export const progressoService = createService('progressoAulas');
export const avaliacoesService = createService('avaliacoes');
export const trilhasService = createService('trilhas');
export const trilhasCursosService = createService('trilhasCursos');
export const certificadosService = createService('certificados');
export const planosService = createService('planos');
export const assinaturasService = createService('assinaturas');
export const pagamentosService = createService('pagamentos');
