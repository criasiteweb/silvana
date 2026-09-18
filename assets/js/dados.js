/* =====================================================================
   DADOS DO SITE — Silvana Novaes / SN IMOB
   ---------------------------------------------------------------------
   TUDO QUE MUDA COM O TEMPO ESTÁ NESTE ARQUIVO.
   Para adicionar, editar ou remover um empreendimento, mexa só aqui.
   Nenhum número ou informação deve ser escrito direto no HTML.

   REGRA: não preencher nada que não esteja confirmado.
   Campo sem confirmação = null. O site mostra "Consultar" sozinho.
   ===================================================================== */

window.SN = window.SN || {};

/* ---------------------------------------------------------------------
   1. CONTATO E IDENTIDADE
   ------------------------------------------------------------------ */
SN.config = {
  nome:        'Silvana Novaes',
  profissao:   'Corretora de Imóveis',

  // CRECI ainda não informado. Trocar pelo número real quando a Silvana passar.
  creci:       '[INSERIR CRECI]',

  whatsapp:    '5511985695991',          // só dígitos, com 55
  whatsappVisivel: '(11) 98569-5991',

  instagram:    'silvananovaescorretora',
  instagramUrl: 'https://www.instagram.com/silvananovaescorretora/',
  facebookUrl:  'https://www.facebook.com/share/1Dpp9tgstc/',

  // Aparece no rodapé. Só preencher com data real de revisão do conteúdo.
  conteudoAtualizadoEm: '18/09/2026'
};

/* ---------------------------------------------------------------------
   2. REGIÕES DE ATUAÇÃO
   Base informada pela Silvana. Não acrescentar região sem confirmação.
   ------------------------------------------------------------------ */
SN.regioes = [
  { id: 'abc',        nome: 'ABC' },
  { id: 'zona-leste', nome: 'Zona Leste' },
  { id: 'zona-sul',   nome: 'Zona Sul' },
  { id: 'sao-paulo',  nome: 'São Paulo' }
];

/* ---------------------------------------------------------------------
   3. ITENS DE LAZER USADOS NOS FILTROS
   ------------------------------------------------------------------ */
SN.lazer = [
  { id: 'piscina',      nome: 'Piscina' },
  { id: 'academia',     nome: 'Academia' },
  { id: 'salao-festas', nome: 'Salão de festas' },
  { id: 'playground',   nome: 'Playground' },
  { id: 'churrasqueira',nome: 'Churrasqueira' },
  { id: 'coworking',    nome: 'Coworking' },
  { id: 'area-verde',   nome: 'Área verde' }
];

/* ---------------------------------------------------------------------
   4. MINHA CASA MINHA VIDA
   FONTE OFICIAL: Portaria MCID nº 333, de 30 de março de 2026,
   publicada no Diário Oficial da União em 01/04/2026, Edição 62,
   Seção 1, Página 47 — Ministério das Cidades.

   Os valores abaixo são transcrição literal da portaria.
   NÃO acrescentar subsídio, taxa de juros ou teto de valor de imóvel
   aqui sem uma fonte oficial que confirme.
   ------------------------------------------------------------------ */
SN.mcmv = {
  atualizadoEm: '01/04/2026',
  fonteNome: 'Portaria MCID nº 333, de 30/03/2026 (DOU 01/04/2026)',
  fonteUrl:  'https://www.gov.br/cidades/pt-br/acesso-a-informacao/institucional/base-juridica/portarias/2026/PORTARIAMCIDN333DE30DEMARODE2026PORTARIAMCIDN333DE30DEMARODE2026DOUImprensaNacional.pdf',

  tetoUrbanoTexto: 'R$ 13.000,00',
  tetoUrbanoValor: 13000,

  faixas: [
    { id: 1, nome: 'Faixa Urbano 1', limiteTexto: 'Renda bruta familiar mensal até R$ 3.200,00',                    min: 0,       max: 3200 },
    { id: 2, nome: 'Faixa Urbano 2', limiteTexto: 'Renda bruta familiar mensal de R$ 3.200,01 até R$ 5.000,00',     min: 3200.01, max: 5000 },
    { id: 3, nome: 'Faixa Urbano 3', limiteTexto: 'Renda bruta familiar mensal de R$ 5.000,01 até R$ 9.600,00',     min: 5000.01, max: 9600 }
  ],

  // A portaria fixa o teto geral do programa em R$ 13.000,00 de renda mensal.
  observacaoTeto: 'A mesma portaria define que o programa atende famílias em áreas urbanas com renda bruta familiar mensal de até R$ 13.000,00.',

  // O que realmente define o enquadramento. Nada aqui é promessa.
  fatores: [
    'Renda bruta familiar e como ela é comprovada',
    'Localização e características do empreendimento',
    'Composição de renda com outra pessoa',
    'Saldo de FGTS disponível',
    'Ser ou não o primeiro imóvel',
    'Regras vigentes do programa na data da contratação',
    'Análise de crédito feita pela instituição financeira'
  ],

  aviso: 'As informações desta página seguem a portaria citada e servem como orientação inicial. Enquadramento, condições e valores dependem de análise de crédito e das regras vigentes na data da contratação. Esta página não representa aprovação de financiamento.'
};

/* ---------------------------------------------------------------------
   5. ETAPAS DO FINANCIAMENTO
   ------------------------------------------------------------------ */
SN.processo = [
  { n: '01', titulo: 'Entenda seu perfil',          texto: 'Conversamos sobre o seu momento, o que você procura e o que é possível hoje.' },
  { n: '02', titulo: 'Analise sua renda',           texto: 'Olhamos a renda bruta familiar e como ela pode ser comprovada.' },
  { n: '03', titulo: 'Verifique as possibilidades', texto: 'Vemos composição de renda, FGTS e quais caminhos fazem sentido para você.' },
  { n: '04', titulo: 'Escolha o imóvel',            texto: 'Selecionamos empreendimentos compatíveis com a sua região e o seu perfil.' },
  { n: '05', titulo: 'Analise o financiamento',     texto: 'A instituição financeira faz a análise de crédito e apresenta as condições.' },
  { n: '06', titulo: 'Avance para os próximos passos', texto: 'Documentação, assinatura e acompanhamento até a entrega das chaves.' }
];

/* ---------------------------------------------------------------------
   6. CONSTRUTORAS
   Estas são as construtoras do segmento em que a Silvana atua.
   `parceriaConfirmada` fica false até ela confirmar a relação comercial.
   O site NÃO afirma representação oficial enquanto for false.
   ------------------------------------------------------------------ */
SN.construtoras = [
  { nome: 'MRV',          parceriaConfirmada: false },
  { nome: 'Direcional',   parceriaConfirmada: false },
  { nome: 'Cury',         parceriaConfirmada: false },
  { nome: 'Plano&Plano',  parceriaConfirmada: false }
];

/* =====================================================================
   7. EMPREENDIMENTOS
   ---------------------------------------------------------------------
   COMO CADASTRAR UM EMPREENDIMENTO:

   {
     id:          'identificador-unico',
     nome:        'Nome do empreendimento',
     construtora: 'Cury',
     bairro:      'Penha',
     cidade:      'São Paulo',
     regiao:      'zona-leste',              // id em SN.regioes
     dormitorios: [1, 2],                    // números confirmados
     studio:      false,                     // true se tiver studio
     tipoTexto:   '2 dorms. com ou sem vaga',// texto exato do material oficial
     vaga:        'sim' | 'nao' | 'opcional' | null,   // null = não confirmado
     status:      'Lançamento' | 'Em obras' | 'Pronto para morar',
     lazer:       ['churrasqueira','academia'],        // ids de SN.lazer
     destaques:   ['Churrasqueira','Fitness'],         // texto livre do material
     preco:       null,                      // null => "Consulte as condições atuais"
     financiamento: null,                    // só preencher se confirmado
     imagens:     [],                        // ex.: ['meu-empreendimento-1.jpg']
     fonte:       'https://...',             // de onde a informação veio
     validadoPelaSilvana: false,
     atualizadoEm:'18/09/2026'
   }

   AS IMAGENS ficam em: assets/img/empreendimentos/
   Basta jogar os arquivos lá e escrever o nome em `imagens`.
   Enquanto `imagens` estiver vazio, o card mostra um espaço reservado.

   IMPORTANTE: os cadastros abaixo vieram dos sites OFICIAIS das
   construtoras (campo `fonte`). Os dados são reais, mas ainda NÃO foi
   confirmado com a Silvana quais destes ela de fato trabalha — por isso
   `validadoPelaSilvana: false`. Nenhum preço foi preenchido porque
   nenhum estava confirmado.
   ===================================================================== */
SN.empreendimentos = [

  /* ---------- CURY — ZONA LESTE ---------- */
  {
    id: 'dez-belenzinho', nome: 'Dez Belenzinho', construtora: 'Cury',
    bairro: 'Belém', cidade: 'São Paulo', regiao: 'zona-leste',
    dormitorios: [2], studio: true,
    tipoTexto: 'Studio e 2 dorms. com opção de suíte e terraço',
    vaga: null, status: 'Em obras',
    lazer: ['piscina', 'academia'],
    destaques: ['Piscinas', 'Mini quadra', 'Fitness externo', 'Bicicletário'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/zona-leste',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'unico-penha', nome: 'Único Penha', construtora: 'Cury',
    bairro: 'Penha', cidade: 'São Paulo', regiao: 'zona-leste',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms. com ou sem vaga',
    vaga: 'opcional', status: 'Pronto para morar',
    lazer: ['churrasqueira', 'academia', 'coworking'],
    destaques: ['Churrasqueira', 'Fitness', 'Espaço office', 'Área comum'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/zona-leste',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'urban-mooca-2', nome: 'Urban Mooca 2', construtora: 'Cury',
    bairro: 'Mooca', cidade: 'São Paulo', regiao: 'zona-leste',
    dormitorios: [1], studio: false,
    tipoTexto: '1 dorm.',
    vaga: null, status: 'Pronto para morar',
    lazer: ['coworking'],
    destaques: ['Espaço home office', 'Coworking', 'Lavanderia', 'Espaço pet'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/zona-leste',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },

  /* ---------- CURY — ZONA SUL ---------- */
  {
    id: 'guido-parque-nacoes-unidas', nome: 'Guido Parque Nações Unidas', construtora: 'Cury',
    bairro: 'Santo Amaro', cidade: 'São Paulo', regiao: 'zona-sul',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms. com opção de terraço',
    vaga: null, status: 'Em obras',
    lazer: ['piscina', 'churrasqueira'],
    destaques: ['Piscinas', 'Churrasqueira', 'Pet care', 'Espaço beleza'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/zona-sul',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'alto-granja-julieta', nome: 'Alto Granja Julieta', construtora: 'Cury',
    bairro: 'Chácara Santo Antônio', cidade: 'São Paulo', regiao: 'zona-sul',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms. com opção de varanda',
    vaga: null, status: 'Lançamento',
    lazer: ['piscina'],
    destaques: ['Redário', 'Piscinas', 'Espaço gourmet', 'Rooftop'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/zona-sul',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'my-sacoma', nome: 'My Sacomã', construtora: 'Cury',
    bairro: 'Sacomã', cidade: 'São Paulo', regiao: 'zona-sul',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms. com opção de terraço',
    vaga: null, status: 'Em obras',
    lazer: ['salao-festas', 'academia'],
    destaques: ['Salão de festas', 'Fitness', 'Praça', 'Lounge de jogos'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/zona-sul',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },

  /* ---------- CURY — ABC ---------- */
  {
    id: 'dez-jardim', nome: 'Dez Jardim', construtora: 'Cury',
    bairro: 'Santo André', cidade: 'Santo André', regiao: 'abc',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms.',
    vaga: null, status: 'Pronto para morar',
    lazer: ['piscina', 'salao-festas'],
    destaques: ['Piscina', 'Salão de festas', 'Cine open air', 'Bar praia'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/santo-andre',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'tutto-jardim', nome: 'Tutto Jardim', construtora: 'Cury',
    bairro: 'Santo André', cidade: 'Santo André', regiao: 'abc',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms.',
    vaga: null, status: 'Pronto para morar',
    lazer: ['churrasqueira', 'salao-festas'],
    destaques: ['Quadra', 'Sauna', 'Churrasqueira', 'Salão de festas'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/santo-andre',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'unico-santo-andre', nome: 'Único Santo André', construtora: 'Cury',
    bairro: 'Santo André', cidade: 'Santo André', regiao: 'abc',
    dormitorios: [2], studio: false,
    tipoTexto: '2 dorms.',
    vaga: null, status: 'Pronto para morar',
    lazer: ['churrasqueira'],
    destaques: ['Churrasqueira', 'Sport bar', 'Beach tennis', 'Praça do fogo'],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://cury.net/regiao/SP/santo-andre',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },

  /* ---------- PLANO&PLANO ----------
     A página oficial não lista os itens de lazer, então o campo `lazer`
     ficou vazio de propósito. Preencher só com material oficial. */
  {
    id: 'plano-bosque-do-carmo', nome: 'Plano&Bosque do Carmo', construtora: 'Plano&Plano',
    bairro: 'Parque do Carmo', cidade: 'São Paulo', regiao: 'zona-leste',
    dormitorios: [2], studio: false, tipoTexto: '2 dorms.',
    vaga: null, status: 'Em obras', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'meu-plano-itaquera', nome: 'Meu Plano&Itaquera', construtora: 'Plano&Plano',
    bairro: 'Itaquera', cidade: 'São Paulo', regiao: 'zona-leste',
    dormitorios: [2], studio: false, tipoTexto: '2 dorms.',
    vaga: null, status: 'Em obras', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'plano-mais-penha', nome: 'Plano&Mais Penha', construtora: 'Plano&Plano',
    bairro: 'Penha', cidade: 'São Paulo', regiao: 'zona-leste',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Lançamento', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'plano-raizes-das-merces', nome: 'Plano&Raízes das Mercês', construtora: 'Plano&Plano',
    bairro: 'Vila das Mercês', cidade: 'São Paulo', regiao: 'zona-sul',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Lançamento', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'plano-park-santo-amaro', nome: 'Plano&Park Santo Amaro', construtora: 'Plano&Plano',
    bairro: 'Santo Amaro', cidade: 'São Paulo', regiao: 'zona-sul',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Lançamento', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'mundo-park', nome: 'Mundo Park', construtora: 'Plano&Plano',
    bairro: 'Campo Grande', cidade: 'São Paulo', regiao: 'zona-sul',
    dormitorios: [2], studio: false, tipoTexto: '2 dorms.',
    vaga: null, status: 'Em obras', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'start-joy', nome: 'Start Joy', construtora: 'Plano&Plano',
    bairro: 'São Bernardo do Campo', cidade: 'São Bernardo do Campo', regiao: 'abc',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Em obras', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'plano-mais-barra-funda', nome: 'Plano&Mais Barra Funda', construtora: 'Plano&Plano',
    bairro: 'Barra Funda', cidade: 'São Paulo', regiao: 'sao-paulo',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Lançamento', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'centro-santa-cecilia', nome: 'Centro&Santa Cecília', construtora: 'Plano&Plano',
    bairro: 'Campos Elíseos', cidade: 'São Paulo', regiao: 'sao-paulo',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Em obras', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  },
  {
    id: 'plano-mais-morumbi', nome: 'Plano&Mais Morumbi', construtora: 'Plano&Plano',
    bairro: 'Morumbi', cidade: 'São Paulo', regiao: 'sao-paulo',
    dormitorios: [1, 2], studio: false, tipoTexto: '1 e 2 dorms.',
    vaga: null, status: 'Pronto para morar', lazer: [], destaques: [],
    preco: null, financiamento: null, imagens: [],
    fonte: 'https://www.planoeplano.com.br/imoveis',
    validadoPelaSilvana: false, atualizadoEm: '18/09/2026'
  }
];

/* ---------------------------------------------------------------------
   8. PERGUNTAS FREQUENTES
   ------------------------------------------------------------------ */
SN.faq = [
  { p: 'Preciso ter entrada?',
    r: 'Depende do imóvel, do seu perfil e das condições da instituição financeira na data da contratação. Existem casos com entrada facilitada e casos em que o FGTS ajuda a compor esse valor. É uma das primeiras coisas que eu verifico com você.' },

  { p: 'Posso usar o FGTS?',
    r: 'O FGTS pode ser utilizado em operações de financiamento habitacional desde que você atenda às regras vigentes do fundo e da instituição financeira. Eu verifico com você se o seu caso se encaixa antes de seguir.' },

  { p: 'Posso comprar pelo Minha Casa Minha Vida?',
    r: 'O programa atende famílias dentro das faixas de renda definidas pelo Ministério das Cidades. A possibilidade de enquadramento depende da sua renda bruta familiar, do empreendimento, da composição de renda e da análise de crédito. Na seção Minha Casa Minha Vida deste site estão as faixas oficiais vigentes.' },

  { p: 'Posso compor renda com outra pessoa?',
    r: 'A composição de renda é permitida em muitas operações e pode mudar o seu enquadramento. As regras de quem pode compor e como isso é analisado variam conforme a instituição financeira e o programa. Me conte a sua situação que eu verifico.' },

  { p: 'Quem já possui imóvel pode comprar?',
    r: 'Alguns programas habitacionais têm exigências específicas sobre já possuir imóvel. Isso precisa ser verificado caso a caso, porque muda conforme o programa e as regras vigentes. Não é uma resposta única para todo mundo.' },

  { p: 'Como funciona a análise de crédito?',
    r: 'Quem faz a análise é a instituição financeira, não eu. Ela avalia renda, documentação, histórico de crédito e o imóvel escolhido. O meu papel é te preparar para essa etapa com a documentação correta e o imóvel adequado ao seu perfil.' },

  { p: 'Posso escolher a região?',
    r: 'Sim. Eu atendo ABC, Zona Leste, Zona Sul e São Paulo. Na seção Encontre seu imóvel você filtra por região, dormitórios, vaga e itens de lazer.' },

  { p: 'Como descubro quais imóveis combinam com a minha renda?',
    r: 'Use a ferramenta Analisar meu perfil aqui do site. Você responde algumas perguntas e as informações chegam organizadas para mim pelo WhatsApp. A partir daí eu verifico as opções compatíveis e te retorno.' },

  { p: 'Preciso ir até um escritório?',
    r: 'Não necessariamente. Boa parte do atendimento inicial acontece por WhatsApp. Visitas a decorado e plantão de vendas a gente combina conforme o empreendimento e a sua disponibilidade.' },

  { p: 'A aprovação é garantida?',
    r: 'Não. Nenhum corretor pode garantir aprovação de financiamento. A decisão é da instituição financeira, depois da análise de crédito. O que eu faço é te orientar para chegar nessa análise da melhor forma possível.' }
];
