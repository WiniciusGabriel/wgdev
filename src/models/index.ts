export interface Usuario {
  id?: number;
  nomeCompleto: string;
  email: string;
  senhaHash?: string;
  dataCadastro?: string;
  perfil: 'Aluno' | 'Instrutor' | 'Admin';
}

export interface Categoria {
  id?: number;
  nome: string;
  descricao: string;
}

export interface Curso {
  id?: number;
  titulo: string;
  descricao: string;
  idInstrutor?: number;
  idCategoria?: number;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  dataPublicacao?: string;
  totalAulas?: number;
  totalHoras?: number;
  trilhaId?: number;
}

export interface Modulo {
  id?: number;
  idCurso: number;
  titulo: string;
  descricao?: string;
  ordem: number;
}

export interface Aula {
  id?: number;
  idModulo: number;
  titulo: string;
  tipoConteudo?: string;
  urlConteudo?: string;
  duracaoMinutos: number;
  ordem?: number;
}

export interface Matricula {
  id?: number;
  idUsuario: number;
  idCurso: number;
  dataMatricula: string;
  dataConclusao?: string;
}

export interface ProgressoAula {
  id?: number;
  idUsuario: number;
  idAula: number;
  dataConclusao?: string;
  status: string;
}

export interface Avaliacao {
  id?: number;
  idUsuario: number;
  idCurso: number;
  nota: number;
  comentario?: string;
  dataAvaliacao: string;
}

export interface Trilha {
  id?: number;
  titulo: string;
  descricao: string;
  dataInicio?: string;
  dataTermino?: string;
}

export interface TrilhaCurso {
  id?: number;
  idTrilha: number;
  idCurso: number;
  ordem: number;
}

export interface Certificado {
  id?: number;
  idUsuario: number;
  idCurso: number;
  idTrilha?: number;
  codigoVerificacao: string;
  dataEmissao: string;
}

export interface Plano {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMeses: number;
}

export interface Assinatura {
  id?: number;
  idUsuario: number;
  idPlano: number;
  dataInicio: string;
  dataFim: string;
}

export interface Pagamento {
  id?: number;
  idAssinatura: number;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}
