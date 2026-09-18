/* =====================================================================
   FUNÇÃO CENTRAL DE WHATSAPP
   ---------------------------------------------------------------------
   Todo botão de WhatsApp do site passa por aqui. Nada de mensagem
   solta espalhada pelo código.

   Uso:
     SN.whatsapp.abrir('perfil', { renda:'R$ 3.500', regiao:'Zona Leste' })
     SN.whatsapp.link('empreendimento', { empreendimento:{...} })
   ===================================================================== */

window.SN = window.SN || {};

SN.whatsapp = (function () {
  'use strict';

  /* Rótulos amigáveis para as chaves coletadas nas ferramentas.
     A ordem deste objeto é a ordem em que as linhas aparecem na mensagem. */
  var ROTULOS = {
    renda:            'Renda familiar',
    entrada:          'Entrada disponível',
    fgts:             'Tenho FGTS',
    fgtsValor:        'Saldo de FGTS',
    primeiroImovel:   'Primeiro imóvel',
    possuiImovel:     'Possuo imóvel',
    estadoCivil:      'Estado civil',
    composicao:       'Composição de renda',
    composicaoQtd:    'Pessoas na composição',
    regiao:           'Região de interesse',
    dormitorios:      'Dormitórios',
    vaga:             'Vaga de garagem',
    lazer:            'Lazer importante',
    transporte:       'Perto de transporte',
    necessidades:     'Necessidades específicas',
    preferencia:      'Preferência de imóvel',
    empreendimento:   'Empreendimento',
    construtora:      'Construtora',
    bairro:           'Bairro',
    nome:             'Nome',
    telefone:         'Telefone',
    mensagem:         'Mensagem'
  };

  /* Abertura de cada tipo de mensagem. */
  var ABERTURAS = {
    geral:
      'Olá, Silvana! Vim pelo seu site e gostaria de conversar sobre a compra do meu imóvel.',
    perfil:
      'Olá, Silvana! Vim pelo seu site e quero analisar meu perfil para comprar meu imóvel pelo Minha Casa Minha Vida.',
    'quanto-posso-pagar':
      'Olá, Silvana! Usei a ferramenta "Quanto posso pagar" no seu site e gostaria de entender as opções para o meu caso.',
    quiz:
      'Olá, Silvana! Respondi o quiz do seu site para descobrir qual imóvel combina comigo.',
    subsidio:
      'Olá, Silvana! Vi a seção sobre subsídio no seu site e gostaria de saber se o meu perfil pode ter direito.',
    empreendimento:
      'Olá, Silvana! Vi um empreendimento no seu site e gostaria de receber mais informações.',
    filtros:
      'Olá, Silvana! Fiz uma busca no seu site e gostaria de ver as opções disponíveis.',
    'sem-resultado':
      'Olá, Silvana! Procurei no seu site com alguns critérios e não encontrei uma opção cadastrada. Você teria algo parecido?',
    financiamento:
      'Olá, Silvana! Vim pelo seu site e gostaria de entender como funciona o financiamento do meu imóvel.',
    contato:
      'Olá, Silvana! Vim pelo seu site e gostaria de falar com você.'
  };

  /* Fechamento de cada tipo. */
  var FECHAMENTOS = {
    perfil:              'Gostaria de conhecer as opções disponíveis para o meu perfil.',
    'quanto-posso-pagar':'Gostaria de entender o que é possível com essas informações.',
    quiz:                'Gostaria de conhecer as opções que combinam com o meu perfil.',
    empreendimento:      'Gostaria de saber as condições disponíveis.',
    filtros:             'Gostaria de conhecer essas opções.',
    'sem-resultado':     'Fico no aguardo, obrigado(a).',
    subsidio:            'Gostaria de entender o que se aplica ao meu caso.'
  };

  /* ---------- helpers ---------- */

  function limpo(v) {
    if (v === null || v === undefined) return '';
    if (Array.isArray(v)) return v.filter(Boolean).join(', ');
    return String(v).trim();
  }

  /* Monta as linhas "Rótulo: valor" respeitando a ordem de ROTULOS
     e ignorando tudo que veio vazio. */
  function linhas(dados) {
    var saida = [];
    Object.keys(ROTULOS).forEach(function (chave) {
      if (!(chave in dados)) return;
      var valor = limpo(dados[chave]);
      if (!valor) return;
      saida.push(ROTULOS[chave] + ': ' + valor);
    });
    /* chaves que não estão no dicionário entram no fim, sem perder informação */
    Object.keys(dados).forEach(function (chave) {
      if (chave in ROTULOS) return;
      var valor = limpo(dados[chave]);
      if (!valor) return;
      saida.push(chave + ': ' + valor);
    });
    return saida;
  }

  /* ---------- API pública ---------- */

  /**
   * Gera o texto completo da mensagem.
   * @param {string} contexto  chave de ABERTURAS
   * @param {object} dados     pares campo/valor já em formato de exibição
   */
  function gerarMensagem(contexto, dados) {
    dados = dados || {};
    var partes = [ABERTURAS[contexto] || ABERTURAS.geral];

    var corpo = linhas(dados);
    if (corpo.length) partes.push(corpo.join('\n'));

    var fim = FECHAMENTOS[contexto];
    if (fim) partes.push(fim);

    return partes.join('\n\n');
  }

  function link(contexto, dados) {
    var numero = (SN.config && SN.config.whatsapp) || '';
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(gerarMensagem(contexto, dados));
  }

  function abrir(contexto, dados) {
    window.open(link(contexto, dados), '_blank', 'noopener');
  }

  /* Monta os dados a partir de um empreendimento do catálogo,
     opcionalmente mesclando o perfil já respondido pelo visitante. */
  function dadosDoEmpreendimento(emp, perfil) {
    var d = {
      empreendimento: emp.nome,
      construtora: emp.construtora,
      bairro: emp.bairro + ' — ' + emp.cidade
    };
    if (perfil) {
      if (perfil.renda)          d.renda = perfil.renda;
      if (perfil.fgts)           d.fgts = perfil.fgts;
      if (perfil.primeiroImovel) d.primeiroImovel = perfil.primeiroImovel;
    }
    return d;
  }

  return {
    gerarMensagem: gerarMensagem,
    link: link,
    abrir: abrir,
    dadosDoEmpreendimento: dadosDoEmpreendimento
  };
})();
