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
    titulo: "Os nossos candidatos",
    intro: "Nomes pela ordem do boletim de voto. Mandatário: Joaquim Carlos Gomes Esteves da Silva (Professor Catedrático, DGAOT). Clique num candidato para ver a biografia. Informação recolhida do SIGARRA da FCUP.",
    // Campos: nome, categoria, unidade (sigla do departamento, usada no filtro),
    // departamento (nome completo), foto, bio (texto ou lista de parágrafos), link.
    grupos: [
      {
        titulo: "Efetivos",
        membros: [
          { nome: "Luís Manuel das Neves Belchior Faia dos Santos", categoria: "Professor Catedrático", unidade: "DQB", departamento: "Departamento de Química e Bioquímica", foto: "fotos/202781.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=202781",
            bio: "Professor Catedrático no Departamento de Química e Bioquímica da FCUP, onde desenvolve atividade de docência e investigação. É Diretor do CIQUP – Centro de Investigação em Química da Universidade do Porto e membro do Conselho Científico da FCUP." },
          { nome: "Rolando da Silva Martins", categoria: "Professor Auxiliar", unidade: "DCC", departamento: "Departamento de Ciência de Computadores", foto: "fotos/571189.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=571189",
            bio: ["Professor Auxiliar no Departamento de Ciência de Computadores da FCUP, com investigação centrada em sistemas distribuídos seguros e infraestruturas de suporte à privacidade. Foi membro do Intel Science and Technology Center e do Parallel Data Lab da Carnegie Mellon University.",
                  "É membro do Conselho Científico da FCUP, vice-diretor do C3P – Centro de Cibersegurança e Privacidade da U.Porto e vice-chair do IEEE CS Portugal Chapter. Fundou a SafeHelm, spin-off da U.Porto dedicada a infraestruturas computacionais seguras."] },
          { nome: "Orfeu Bertolami Neto", categoria: "Professor Catedrático", unidade: "DFA", departamento: "Departamento de Física e Astronomia", foto: "fotos/485238.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=485238",
            bio: "Físico teórico que trabalha em cosmologia, física das astropartículas, gravitação clássica e quântica, física fundamental no espaço e ciência do Sistema Terrestre. É membro do Conselho de Representantes da FCUP e da Comissão Científica Restrita do Departamento de Física e Astronomia." },
          { nome: "Luís Miguel Soares Ribeiro Leite da Cunha", categoria: "Professor Associado", unidade: "DGAOT", departamento: "Departamento de Geociências, Ambiente e Ordenamento do Território", foto: "fotos/405494.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=405494",
            bio: "Professor Associado no DGAOT e investigador integrado do GreenUPorto – Centro de Investigação em Produção Agroalimentar Sustentável, onde coordena o grupo de Perceção do Consumidor e Análise Sensorial. Dirige o Mestrado em Ciências do Consumo e Nutrição e é membro da Comissão de Ética e da Comissão Executiva do Departamento." },
          { nome: "José Ferreira Alves", categoria: "Professor Catedrático", unidade: "DM", departamento: "Departamento de Matemática", foto: "fotos/203285.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=203285",
            bio: ["Professor Catedrático no Departamento de Matemática da FCUP, doutorado pelo IMPA (Rio de Janeiro) e membro integrado do Centro de Matemática da U.Porto. Foi Diretor do Departamento de Matemática entre 2020 e 2025 e é membro correspondente da Academia das Ciências de Lisboa desde 2022.",
                  "Autor de mais de cinquenta artigos científicos e de dois livros em Sistemas Dinâmicos e Teoria Ergódica, orientou dez teses de doutoramento e oito pós-doutoramentos."] },
          { nome: "Alexandre Martins Campos de Lima", categoria: "Professor Associado", unidade: "DGAOT", departamento: "Departamento de Geociências, Ambiente e Ordenamento do Território", foto: "fotos/239074.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=239074",
            bio: "Professor Associado no DGAOT, com atividade em prospeção geológica, geoconservação e geoquímica. Dirige o Mestrado em Geologia e é subdiretor do Programa Doutoral em Geociências." },
          { nome: "Paulo Vicente da Silva Marques", categoria: "Professor Catedrático", unidade: "DFA", departamento: "Departamento de Física e Astronomia", foto: "fotos/249128.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=249128",
            bio: "Professor Catedrático no Departamento de Física e Astronomia, de que é Subdiretor. É Pró-Diretor da FCUP para os Alumni, membro do Conselho Científico e subdiretor do Programa Doutoral em Física." },
          { nome: "Ana Rita Pires Gaio", categoria: "Professora Auxiliar", unidade: "DM", departamento: "Departamento de Matemática", foto: "", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=232080",
            bio: "Professora Auxiliar no Departamento de Matemática e investigadora integrada do CMUP. Foi vice-diretora do Departamento e diretora da Licenciatura em Matemática Aplicada. Trabalha em modelos de regressão, aprendizagem estatística e bioestatística, com larga experiência em consultoria em Epidemiologia e Saúde Pública." },
          { nome: "Manuel Eduardo Carvalho Duarte Correia", categoria: "Professor Associado", unidade: "DCC", departamento: "Departamento de Ciência de Computadores", foto: "", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=238695",
            bio: "Professor Associado com Agregação no Departamento de Ciência de Computadores e membro integrado do INESC TEC, onde é responsável pela área de segurança informática no grupo CRACS. Foi Pró-Reitor da U.Porto para as Infraestruturas Tecnológicas e Segurança dos Sistemas de Informação (2018–2021). É membro da Comissão Executiva do DCC." },
        ],
      },
      {
        titulo: "Suplentes",
        membros: [
          { nome: "José Luís Campos de Oliveira Santos", categoria: "Professor Catedrático", unidade: "DFA", departamento: "Departamento de Física e Astronomia", foto: "fotos/202659.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=202659",
            bio: "Professor Catedrático no Departamento de Física e Astronomia. Dirige o Observatório Astronómico Prof. Manuel de Barros, é codiretor do Programa Doutoral em Engenharia Física e membro da Comissão Científica Restrita do Departamento." },
          { nome: "Jorge Miguel Milhazes de Freitas", categoria: "Professor Catedrático", unidade: "DM", departamento: "Departamento de Matemática", foto: "fotos/240448.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=240448",
            bio: "Professor Catedrático no Departamento de Matemática. É Diretor do Programa Doutoral em Matemática (interuniversitário) e membro do Conselho de Representantes da FCUP." },
          { nome: "Alexandra Maria Neves Gaspar", categoria: "Investigadora Auxiliar", unidade: "DQB", departamento: "Departamento de Química e Bioquímica", foto: "fotos/555941.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=555941",
            bio: "Investigadora Auxiliar no Departamento de Química e Bioquímica da FCUP." },
          { nome: "José Alberto Álvares Pereira Gonçalves", categoria: "Professor Auxiliar", unidade: "DGAOT", departamento: "Departamento de Geociências, Ambiente e Ordenamento do Território", foto: "fotos/236853.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=236853",
            bio: "Professor Auxiliar no DGAOT, com atividade em topografia e engenharia geoespacial. Dirige a Licenciatura em Engenharia Geoespacial e o Mestrado em Deteção Remota." },
          { nome: "António José Guerner Dias", categoria: "Professor Auxiliar", unidade: "DGAOT", departamento: "Departamento de Geociências, Ambiente e Ordenamento do Território", foto: "fotos/203278.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=203278",
            bio: "Professor Auxiliar no DGAOT. É membro da Comissão Executiva do Departamento, da Comissão de Sustentabilidade Ambiental e da Comissão de Acompanhamento do Mestrado em Ciências e Tecnologia do Ambiente." },
          { nome: "Carlos Manuel de Melo Pereira", categoria: "Professor Associado", unidade: "DQB", departamento: "Departamento de Química e Bioquímica", foto: "fotos/202806.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=202806",
            bio: "Professor Associado no Departamento de Química e Bioquímica. Dirige o Mestrado em Métodos Avançados e Acreditação em Análise Química e preside à Comissão Científica do Curso de Estudos Avançados em Projeto Científico e Tecnológico." },
          { nome: "Alexandre Lopes de Magalhães", categoria: "Professor Auxiliar", unidade: "DQB", departamento: "Departamento de Química e Bioquímica", foto: "fotos/202640.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=202640",
            bio: "Professor Auxiliar no Departamento de Química e Bioquímica, especialista em Química Computacional e membro do Laboratório Associado REQUIMTE/LAQV. Investiga a modelação de sistemas químicos confinados em fulerenos e o armazenamento e difusão molecular em sólidos cristalinos." },
          { nome: "Sílvio Marques de Almeida Gama", categoria: "Professor Associado", unidade: "DM", departamento: "Departamento de Matemática", foto: "fotos/210334.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=210334",
            bio: "Professor Associado no Departamento de Matemática. Dirige o Programa Doutoral em Matemática Aplicada, é subdiretor da Licenciatura em Matemática Aplicada e membro da Comissão Científica Restrita do Departamento." },
          { nome: "Eduardo Jorge Figueira Marques", categoria: "Professor Associado", unidade: "DQB", departamento: "Departamento de Química e Bioquímica", foto: "fotos/248004.jpg", link: "https://sigarra.up.pt/fcup/pt/func_geral.formview?p_codigo=248004",
            bio: "Professor Associado com Agregação no Departamento de Química e Bioquímica e membro do Conselho Científico da FCUP. Dirige o Programa Doutoral em Química e o Mestrado em Ciência e Tecnologia de Nanomateriais, e lidera no CIQUP o grupo de Surfactantes, Colóides e Nanomateriais Moles. Publicou mais de 120 artigos e foi professor visitante no MIT, em Roma, Lund, Santiago de Compostela e Poznań." },
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
      { k: "Mandatário", v: "Joaquim Carlos Gomes Esteves da Silva", p: "Professor Catedrático · DGAOT" },
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
