// =====================================================================
//  CONSELHO CIENTÍFICO — edite APENAS este ficheiro para mudar o site.
//  Tudo o que está entre [colchetes] é texto de exemplo a substituir.
//  Fotos: coloque em cientifico/fotos/ e use "fotos/nome.jpg" (quadradas ~600px).
// =====================================================================
window.SITE = {
  lista: "A",                              // letra da lista
  nomeLista: "[Nome da Lista]",
  orgao: "Conselho Científico",
  instituicao: "FCUP",
  ano: "2026",
  cor: "#1f6f8b",                          // cor de destaque (hex)

  hero: {
    titulo: "[Ciência com]",
    destaque: "[ambição e rigor.]",
    lead: "[Uma frase de apresentação da lista: quem somos e o que propomos para o Conselho Científico da Faculdade de Ciências da Universidade do Porto.]",
  },

  prioridades: {
    titulo: "[Três compromissos para o próximo mandato]",
    intro: "[Breve introdução às prioridades.]",
    itens: [
      { titulo: "[Investigação]", texto: "[Descrição curta da prioridade.]" },
      { titulo: "[Carreiras]", texto: "[Descrição curta da prioridade.]" },
      { titulo: "[Ensino e formação avançada]", texto: "[Descrição curta da prioridade.]" },
    ],
  },

  manifesto: {
    citacao: "[Uma frase forte que resuma o manifesto.]",
    paragrafos: [
      "[Primeiro parágrafo do manifesto.]",
      "[Segundo parágrafo do manifesto.]",
    ],
    compromissos: ["[Compromisso 1]", "[Compromisso 2]", "[Compromisso 3]"],
    pdf: "",                               // ex.: "manifesto.pdf" (deixe vazio para esconder)
  },

  candidatos: {
    titulo: "[Os nossos candidatos]",
    intro: "[Nomes pela ordem do boletim de voto. Clique num candidato para ver a biografia.]",
    // Um grupo por secção (ex.: Efetivos / Suplentes, ou por corpo eleitoral).
    // Campos opcionais: foto, departamento, unidade, bio (texto ou lista de parágrafos), link.
    grupos: [
      {
        titulo: "Efetivos",
        membros: [
          { nome: "[Nome Apelido]", categoria: "[Professor Catedrático]", departamento: "[DCC]", foto: "", bio: "[Biografia curta.]" },
          { nome: "[Nome Apelido]", categoria: "[Professora Associada]", departamento: "[DM]" },
          { nome: "[Nome Apelido]", categoria: "[Investigador Principal]", departamento: "[DQB]" },
          { nome: "[Nome Apelido]", categoria: "[Professor Auxiliar]", departamento: "[DF]" },
        ],
      },
      {
        titulo: "Suplentes",
        membros: [
          { nome: "[Nome Apelido]", categoria: "[Professora Auxiliar]", departamento: "[DB]" },
          { nome: "[Nome Apelido]", categoria: "[Investigador Auxiliar]", departamento: "[DGAOT]" },
        ],
      },
    ],
  },

  eleicao: {
    titulo: "Como e quando votar",
    intro: "[Informação sobre o ato eleitoral.]",
    data: "2026-12-01T09:00:00",           // usado na contagem decrescente (ISO)
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
    email: "",                             // ex.: "lista.a@exemplo.pt"
    form: "",                              // ex.: link para Google Forms
  },
};
