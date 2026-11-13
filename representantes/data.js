// =====================================================================
//  CONSELHO DE REPRESENTANTES — edite APENAS este ficheiro para mudar o site.
//  Tudo o que está entre [colchetes] é texto de exemplo a substituir.
//  Fotos: coloque em representantes/fotos/ e use "fotos/nome.jpg" (quadradas ~600px).
// =====================================================================
window.SITE = {
  lista: "A",                              // letra da lista
  nomeLista: "[Nome da Lista]",
  orgao: "Conselho de Representantes",
  instituicao: "FCUP",
  ano: "2026",
  cor: "#c8553d",                          // cor de destaque (hex)

  hero: {
    titulo: "[Uma Faculdade]",
    destaque: "[que nos representa.]",
    lead: "[Uma frase de apresentação da lista: quem somos e o que propomos para o Conselho de Representantes da Faculdade de Ciências da Universidade do Porto.]",
  },

  prioridades: {
    titulo: "[Três compromissos para o próximo mandato]",
    intro: "[Breve introdução às prioridades.]",
    itens: [
      { titulo: "[Governação participada]", texto: "[Descrição curta da prioridade.]" },
      { titulo: "[Transparência]", texto: "[Descrição curta da prioridade.]" },
      { titulo: "[Comunidade]", texto: "[Descrição curta da prioridade.]" },
    ],
  },

  manifesto: {
    citacao: "[Uma frase forte que resuma o manifesto.]",
    paragrafos: [
      "[Primeiro parágrafo do manifesto.]",
      "[Segundo parágrafo do manifesto.]",
    ],
    compromissos: ["[Compromisso 1]", "[Compromisso 2]", "[Compromisso 3]"],
    pdf: "",
  },

  candidatos: {
    titulo: "[Os nossos candidatos]",
    intro: "[Nomes pela ordem do boletim de voto. Clique num candidato para ver a biografia.]",
    grupos: [
      {
        titulo: "Efetivos",
        membros: [
          { nome: "[Nome Apelido]", categoria: "[Professora Associada]", departamento: "[DCC]", foto: "", bio: "[Biografia curta.]" },
          { nome: "[Nome Apelido]", categoria: "[Professor Auxiliar]", departamento: "[DM]" },
          { nome: "[Nome Apelido]", categoria: "[Investigadora]", departamento: "[DQB]" },
        ],
      },
      {
        titulo: "Suplentes",
        membros: [
          { nome: "[Nome Apelido]", categoria: "[Professor Auxiliar]", departamento: "[DF]" },
        ],
      },
    ],
  },

  eleicao: {
    titulo: "Como e quando votar",
    intro: "[Informação sobre o ato eleitoral.]",
    data: "2026-12-01T09:00:00",
    dataTexto: "[1 de dezembro de 2026]",
    factos: [
      { k: "Data", v: "[1 dez 2026]", p: "[Horário]" },
      { k: "Local", v: "[Voto eletrónico / Sala]", p: "[Detalhes]" },
      { k: "Quem vota", v: "[Corpo eleitoral]", p: "[Detalhes]" },
    ],
    documentos: [
      { titulo: "[Regulamento eleitoral]", url: "#" },
    ],
  },

  contacto: {
    titulo: "Fale connosco",
    texto: "[Dúvidas, sugestões ou contributos para o programa.]",
    email: "",
    form: "",
  },
};
