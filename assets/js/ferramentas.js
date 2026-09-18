/* =====================================================================
   FERRAMENTAS INTERATIVAS
   1. Analisar meu perfil
   2. Quanto posso pagar
   3. Qual imóvel combina comigo (quiz)

   Todas usam o mesmo motor de etapas e terminam em SN.whatsapp.
   Nenhuma delas afirma aprovação nem inventa cálculo.
   ===================================================================== */

window.SN = window.SN || {};

(function () {
  'use strict';

  var doc = document;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- moeda ---------- */
  function formatarMoeda(digitos) {
    var n = (parseInt(digitos, 10) || 0) / 100;
    /* \u00a0 (espaço não-separável) vira espaço normal para a mensagem
       do WhatsApp sair limpa. */
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/\u00a0/g, ' ');
  }
  function valorNumerico(texto) {
    var d = String(texto || '').replace(/\D/g, '');
    return (parseInt(d, 10) || 0) / 100;
  }
  function aplicarMascaraMoeda(input) {
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '').slice(0, 11);
      input.value = d ? formatarMoeda(d) : '';
    });
  }

  /* ---------- faixa do MCMV a partir da renda (fonte: portaria oficial) ---------- */
  function faixaPorRenda(valor) {
    var m = SN.mcmv;
    var f = m.faixas.filter(function (x) { return valor >= x.min && valor <= x.max; })[0];
    if (f) {
      return {
        titulo: f.nome,
        texto: f.limiteTexto + '.',
        dentro: true
      };
    }
    if (valor > 0 && valor <= m.tetoUrbanoValor) {
      return {
        titulo: 'Acima da ' + m.faixas[m.faixas.length - 1].nome,
        texto: m.observacaoTeto,
        dentro: true
      };
    }
    if (valor > m.tetoUrbanoValor) {
      return {
        titulo: 'Acima do teto do programa',
        texto: 'A renda informada está acima do limite de ' + m.tetoUrbanoTexto +
               ' definido para o programa. Existem outras linhas de financiamento habitacional — vale conversarmos.',
        dentro: false
      };
    }
    return null;
  }

  /* =====================================================================
     MOTOR DE ETAPAS
     ================================================================== */
  function criarAssistente(cfg) {
    var raiz = $('#' + cfg.id);
    if (!raiz) return;

    var respostas = {};
    var atual = 0;
    var total = cfg.etapas.length;

    raiz.innerHTML =
      '<div class="ferramenta-topo">' +
        '<div class="barra-progresso" role="progressbar" aria-valuemin="1" aria-valuemax="' + (total + 1) + '" aria-valuenow="1">' +
          '<i></i>' +
        '</div>' +
        '<p class="progresso-txt"></p>' +
      '</div>' +
      '<div class="ferramenta-corpo"></div>';

    var barra = $('.barra-progresso i', raiz);
    var barraAria = $('.barra-progresso', raiz);
    var txt = $('.progresso-txt', raiz);
    var corpo = $('.ferramenta-corpo', raiz);

    function htmlEtapa(etapa, indice) {
      var campos = '';

      if (etapa.tipo === 'opcoes' || etapa.tipo === 'multi') {
        var cols = etapa.colunas === 2 ? ' opcoes--2' : (etapa.colunas === 3 ? ' opcoes--3' : '');
        campos = '<div class="opcoes' + cols + '" role="group" aria-label="' + esc(etapa.pergunta) + '">' +
          etapa.opcoes.map(function (o) {
            return '<button type="button" class="opcao" aria-pressed="false" data-valor="' + esc(o.valor) + '">' +
              '<span class="marca-sel" aria-hidden="true">' + SN.ICO.check + '</span>' +
              '<span>' + esc(o.rotulo) + '</span></button>';
          }).join('') + '</div>';
      } else if (etapa.tipo === 'campo') {
        campos = etapa.campos.map(function (c) {
          var attrs = 'id="' + esc(cfg.id + '-' + c.chave) + '" name="' + esc(c.chave) + '"' +
                      (c.obrigatorio ? ' required' : '') +
                      (c.placeholder ? ' placeholder="' + esc(c.placeholder) + '"' : '') +
                      (c.moeda ? ' inputmode="numeric"' : '');
          var controle = c.opcoes
            ? '<select ' + attrs + '>' + c.opcoes.map(function (o) {
                return '<option value="' + esc(o) + '">' + esc(o) + '</option>';
              }).join('') + '</select>'
            : '<input type="' + (c.tipo || 'text') + '" ' + attrs + '>';
          return '<div class="campo" data-campo-chave="' + esc(c.chave) + '">' +
            '<label for="' + esc(cfg.id + '-' + c.chave) + '">' + esc(c.rotulo) + '</label>' +
            controle +
            '<span class="erro">' + esc(c.erro || 'Preencha este campo para continuar.') + '</span>' +
            '</div>';
        }).join('');
      }

      return '<div class="etapa" data-etapa="' + indice + '">' +
        '<p class="etapa-pergunta">' + esc(etapa.pergunta) + '</p>' +
        (etapa.ajuda ? '<p class="etapa-ajuda">' + esc(etapa.ajuda) + '</p>' : '') +
        campos +
        '<div class="etapa-nav">' +
          (indice > 0 ? '<button type="button" class="btn btn--linha" data-nav="voltar">Voltar</button>' : '') +
          '<button type="button" class="btn btn--ouro" data-nav="continuar">' +
            (indice === total - 1 ? 'Ver resumo' : 'Continuar') +
          '</button>' +
        '</div>' +
        '</div>';
    }

    corpo.innerHTML = cfg.etapas.map(htmlEtapa).join('') +
      '<div class="etapa" data-etapa="' + total + '" id="' + cfg.id + '-resultado"></div>';

    /* máscara de moeda nos campos marcados */
    cfg.etapas.forEach(function (et) {
      if (et.tipo !== 'campo') return;
      et.campos.forEach(function (c) {
        if (!c.moeda) return;
        var input = $('#' + cfg.id + '-' + c.chave, corpo);
        if (input) aplicarMascaraMoeda(input);
      });
    });

    function mostrar(indice) {
      atual = indice;
      $$('.etapa', corpo).forEach(function (e, i) { e.classList.toggle('ativa', i === indice); });
      var pct = ((indice + 1) / (total + 1)) * 100;
      barra.style.width = pct + '%';
      barraAria.setAttribute('aria-valuenow', indice + 1);
      txt.textContent = indice < total
        ? 'Passo ' + (indice + 1) + ' de ' + total
        : 'Resumo';
      var topo = raiz.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > topo + 60) window.scrollTo({ top: topo, behavior: 'smooth' });
    }

    function validar(indice) {
      var etapa = cfg.etapas[indice];
      var elEtapa = $$('.etapa', corpo)[indice];

      if (etapa.tipo === 'opcoes' || etapa.tipo === 'multi') {
        if (!etapa.obrigatorio) return true;
        var marcados = $$('.opcao[aria-pressed="true"]', elEtapa);
        if (!marcados.length) {
          elEtapa.classList.add('tremer');
          var grupo = $('.opcoes', elEtapa);
          grupo.style.outline = '2px solid #B3261E';
          grupo.style.outlineOffset = '6px';
          grupo.style.borderRadius = '14px';
          setTimeout(function () { grupo.style.outline = 'none'; }, 1600);
          return false;
        }
        return true;
      }

      if (etapa.tipo === 'campo') {
        var ok = true;
        etapa.campos.forEach(function (c) {
          var wrap = $('[data-campo-chave="' + c.chave + '"]', elEtapa);
          var input = $('#' + cfg.id + '-' + c.chave, elEtapa);
          var vazio = !input.value || (c.moeda && valorNumerico(input.value) <= 0);
          var invalido = c.obrigatorio && vazio;
          wrap.classList.toggle('invalido', invalido);
          if (invalido) ok = false;
        });
        return ok;
      }
      return true;
    }

    function coletar(indice) {
      var etapa = cfg.etapas[indice];
      var elEtapa = $$('.etapa', corpo)[indice];

      if (etapa.tipo === 'opcoes') {
        var m = $('.opcao[aria-pressed="true"]', elEtapa);
        respostas[etapa.chave] = m ? m.dataset.valor : '';
      } else if (etapa.tipo === 'multi') {
        respostas[etapa.chave] = $$('.opcao[aria-pressed="true"]', elEtapa).map(function (b) { return b.dataset.valor; });
      } else if (etapa.tipo === 'campo') {
        etapa.campos.forEach(function (c) {
          respostas[c.chave] = $('#' + cfg.id + '-' + c.chave, elEtapa).value;
        });
      }
    }

    corpo.addEventListener('click', function (ev) {
      var opcao = ev.target.closest('.opcao');
      if (opcao) {
        var elEtapa = opcao.closest('.etapa');
        var indice = parseInt(elEtapa.dataset.etapa, 10);
        var etapa = cfg.etapas[indice];
        if (etapa.tipo === 'opcoes') {
          $$('.opcao', elEtapa).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
          opcao.setAttribute('aria-pressed', 'true');
        } else {
          opcao.setAttribute('aria-pressed', opcao.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        }
        return;
      }

      var nav = ev.target.closest('[data-nav]');
      if (!nav) return;

      if (nav.dataset.nav === 'voltar') { mostrar(atual - 1); return; }

      if (!validar(atual)) return;
      coletar(atual);

      if (atual < total - 1) { mostrar(atual + 1); return; }

      $('#' + cfg.id + '-resultado').innerHTML = cfg.resultado(respostas);
      mostrar(total);
      if (cfg.aoConcluir) cfg.aoConcluir(respostas);
    });

    corpo.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-reiniciar]')) {
        respostas = {};
        $$('.opcao', corpo).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        $$('input,select', corpo).forEach(function (i) { if (i.type !== 'submit') i.value = i.tagName === 'SELECT' ? i.options[0].value : ''; });
        mostrar(0);
      }
    });

    mostrar(0);
  }

  /* ---------- blocos reutilizáveis de resultado ---------- */
  function htmlResumo(pares) {
    return '<dl class="resumo">' + pares.filter(function (p) { return p[1]; }).map(function (p) {
      return '<div class="resumo-item"><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>';
    }).join('') + '</dl>';
  }
  function htmlAviso(texto) {
    return '<div class="aviso">' + SN.ICO.alerta + '<p>' + esc(texto) + '</p></div>';
  }
  function lista(v) { return Array.isArray(v) ? v.join(', ') : v; }

  /* nomes legíveis a partir dos ids */
  function nomeRegiao(id) {
    var r = SN.regioes.filter(function (x) { return x.id === id; })[0];
    return r ? r.nome : id;
  }
  function nomeLazer(id) {
    var l = SN.lazer.filter(function (x) { return x.id === id; })[0];
    return l ? l.nome : id;
  }

  /* opções de renda geradas a partir das faixas oficiais */
  function opcoesRenda() {
    var m = SN.mcmv;
    var ops = m.faixas.map(function (f) {
      return { valor: f.limiteTexto.replace('Renda bruta familiar mensal ', ''), rotulo: f.limiteTexto.replace('Renda bruta familiar mensal ', '') };
    });
    ops.push({ valor: 'de R$ 9.600,01 até ' + m.tetoUrbanoTexto, rotulo: 'de R$ 9.600,01 até ' + m.tetoUrbanoTexto });
    ops.push({ valor: 'acima de ' + m.tetoUrbanoTexto, rotulo: 'acima de ' + m.tetoUrbanoTexto });
    return ops;
  }

  var SIM_NAO = [{ valor: 'Sim', rotulo: 'Sim' }, { valor: 'Não', rotulo: 'Não' }];
  var SIM_NAO_TALVEZ = SIM_NAO.concat([{ valor: 'Não sei', rotulo: 'Não sei' }]);

  /* =====================================================================
     1. ANALISAR MEU PERFIL
     ================================================================== */
  function perfil() {
    criarAssistente({
      id: 'ferramenta-perfil',
      etapas: [
        { chave: 'renda', tipo: 'opcoes', obrigatorio: true,
          pergunta: 'Qual a sua renda familiar mensal?',
          ajuda: 'Some a renda bruta de todos que vão compor a compra. As faixas seguem a portaria oficial vigente.',
          opcoes: opcoesRenda() },

        { chave: 'fgts', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Você possui FGTS?', opcoes: SIM_NAO_TALVEZ },

        { chave: 'primeiroImovel', tipo: 'opcoes', obrigatorio: true, colunas: 2,
          pergunta: 'É o seu primeiro imóvel?', opcoes: SIM_NAO },

        { chave: 'possuiImovel', tipo: 'opcoes', obrigatorio: true, colunas: 2,
          pergunta: 'Você possui algum imóvel atualmente?', opcoes: SIM_NAO },

        { chave: 'estadoCivil', tipo: 'opcoes', obrigatorio: true,
          pergunta: 'Qual o seu estado civil?',
          opcoes: [
            { valor: 'Solteiro(a)', rotulo: 'Solteiro(a)' },
            { valor: 'Casado(a) ou união estável', rotulo: 'Casado(a) ou união estável' },
            { valor: 'Divorciado(a)', rotulo: 'Divorciado(a)' },
            { valor: 'Viúvo(a)', rotulo: 'Viúvo(a)' }
          ] },

        { chave: 'composicao', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Pretende compor renda com outra pessoa?',
          ajuda: 'Compor renda significa somar a sua renda com a de outra pessoa na análise.',
          opcoes: SIM_NAO_TALVEZ },

        { chave: 'regiao', tipo: 'multi', obrigatorio: true,
          pergunta: 'Em qual região você quer morar?',
          ajuda: 'Pode marcar mais de uma.',
          opcoes: SN.regioes.map(function (r) { return { valor: r.id, rotulo: r.nome }; }) },

        { chave: 'dormitorios', tipo: 'multi', obrigatorio: true, colunas: 3,
          pergunta: 'Quantos dormitórios você procura?',
          opcoes: [{ valor: '1', rotulo: '1 dormitório' }, { valor: '2', rotulo: '2 dormitórios' }, { valor: '3', rotulo: '3 dormitórios' }] },

        { chave: 'vaga', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Você precisa de vaga de garagem?',
          opcoes: [{ valor: 'Sim', rotulo: 'Sim' }, { valor: 'Não', rotulo: 'Não' }, { valor: 'Indiferente', rotulo: 'Indiferente' }] },

        { chave: 'lazer', tipo: 'multi', obrigatorio: false,
          pergunta: 'Quais itens de lazer são importantes para você?',
          ajuda: 'Opcional. Pode marcar quantos quiser ou seguir sem marcar nada.',
          opcoes: SN.lazer.map(function (l) { return { valor: l.id, rotulo: l.nome }; }) }
      ],

      aoConcluir: function (r) {
        SN.perfil = {
          renda: r.renda,
          fgts: r.fgts,
          primeiroImovel: r.primeiroImovel,
          regiao: (r.regiao || []).map(nomeRegiao).join(', ')
        };
      },

      resultado: function (r) {
        var regioes = (r.regiao || []).map(nomeRegiao);
        var lazeres = (r.lazer || []).map(nomeLazer);

        var dadosWpp = {
          renda: r.renda,
          fgts: r.fgts,
          primeiroImovel: r.primeiroImovel,
          possuiImovel: r.possuiImovel,
          estadoCivil: r.estadoCivil,
          composicao: r.composicao,
          regiao: regioes.join(', '),
          dormitorios: (r.dormitorios || []).join(', '),
          vaga: r.vaga,
          lazer: lazeres.join(', ')
        };

        return '<p class="resultado-titulo">Com base nas informações que você informou, podemos analisar opções compatíveis com o seu perfil.</p>' +
          '<p class="texto" style="margin-bottom:4px">Confira o resumo antes de enviar:</p>' +
          htmlResumo([
            ['Renda familiar', r.renda],
            ['Possui FGTS', r.fgts],
            ['Primeiro imóvel', r.primeiroImovel],
            ['Possui imóvel hoje', r.possuiImovel],
            ['Estado civil', r.estadoCivil],
            ['Composição de renda', r.composicao],
            ['Região de interesse', regioes.join(', ')],
            ['Dormitórios', (r.dormitorios || []).join(', ')],
            ['Vaga de garagem', r.vaga],
            ['Lazer importante', lazeres.join(', ')]
          ]) +
          htmlAviso(SN.mcmv.aviso) +
          '<div class="btn-grupo" style="margin-top:20px">' +
            '<button class="btn btn--wpp" data-enviar="perfil" data-dados=\'' + esc(JSON.stringify(dadosWpp)) + '\'>' +
              SN.ICO.wpp + 'Enviar para a Silvana' +
            '</button>' +
            '<button class="btn btn--linha" data-reiniciar>Refazer</button>' +
          '</div>';
      }
    });
  }

  /* =====================================================================
     2. QUANTO POSSO PAGAR
     ================================================================== */
  function quantoPossoPagar() {
    criarAssistente({
      id: 'ferramenta-pagar',
      etapas: [
        { tipo: 'campo',
          pergunta: 'Vamos começar pela sua renda.',
          ajuda: 'Informe a renda bruta familiar mensal — a soma de quem vai entrar na compra.',
          campos: [
            { chave: 'rendaValor', rotulo: 'Renda familiar mensal', moeda: true, obrigatorio: true, placeholder: 'R$ 0,00', erro: 'Informe a renda familiar para continuar.' }
          ] },

        { tipo: 'campo',
          pergunta: 'Você tem algum valor de entrada?',
          ajuda: 'Se ainda não tiver, pode deixar zerado e seguir.',
          campos: [
            { chave: 'entradaValor', rotulo: 'Entrada disponível', moeda: true, obrigatorio: false, placeholder: 'R$ 0,00' }
          ] },

        { chave: 'fgts', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Você possui FGTS?', opcoes: SIM_NAO_TALVEZ },

        { tipo: 'campo',
          pergunta: 'Se souber, qual o saldo aproximado do seu FGTS?',
          ajuda: 'Opcional. Se não souber, siga em frente.',
          campos: [
            { chave: 'fgtsValor', rotulo: 'Saldo aproximado de FGTS', moeda: true, obrigatorio: false, placeholder: 'R$ 0,00' }
          ] },

        { chave: 'composicao', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Pretende compor renda com outra pessoa?', opcoes: SIM_NAO_TALVEZ },

        { chave: 'composicaoQtd', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Quantas pessoas entrariam na composição de renda?',
          opcoes: [
            { valor: 'Somente eu', rotulo: 'Somente eu' },
            { valor: '2 pessoas', rotulo: '2 pessoas' },
            { valor: '3 ou mais', rotulo: '3 ou mais' }
          ] },

        { chave: 'regiao', tipo: 'multi', obrigatorio: true,
          pergunta: 'Qual região você prefere?',
          opcoes: SN.regioes.map(function (r) { return { valor: r.id, rotulo: r.nome }; }) },

        { chave: 'preferencia', tipo: 'opcoes', obrigatorio: true,
          pergunta: 'Qual o seu momento hoje?',
          opcoes: [
            { valor: 'Pronto para morar', rotulo: 'Quero algo pronto para morar' },
            { valor: 'Em obras', rotulo: 'Posso esperar a obra' },
            { valor: 'Lançamento', rotulo: 'Quero um lançamento' },
            { valor: 'Indiferente', rotulo: 'Tanto faz, quero o melhor negócio' }
          ] }
      ],

      aoConcluir: function (r) {
        SN.perfil = {
          renda: r.rendaValor,
          fgts: r.fgts,
          regiao: (r.regiao || []).map(nomeRegiao).join(', ')
        };
      },

      resultado: function (r) {
        var renda = valorNumerico(r.rendaValor);
        var faixa = faixaPorRenda(renda);
        var regioes = (r.regiao || []).map(nomeRegiao);

        var blocoFaixa = faixa
          ? '<div class="faixa-card" style="margin-bottom:16px">' +
              '<p class="rotulo">Enquadramento pela renda informada</p>' +
              '<p class="valor">' + esc(faixa.titulo) + '</p>' +
              '<p class="texto-peq" style="margin-top:8px">' + esc(faixa.texto) + '</p>' +
              '<p class="texto-peq" style="margin-top:8px">Fonte: ' + esc(SN.mcmv.fonteNome) + '.</p>' +
            '</div>'
          : '';

        var dadosWpp = {
          renda: r.rendaValor,
          entrada: r.entradaValor,
          fgts: r.fgts,
          fgtsValor: r.fgtsValor,
          composicao: r.composicao,
          composicaoQtd: r.composicaoQtd,
          regiao: regioes.join(', '),
          preferencia: r.preferencia
        };

        return '<p class="resultado-titulo">Aqui está o que dá para dizer com as informações que você passou.</p>' +
          blocoFaixa +
          htmlResumo([
            ['Renda familiar', r.rendaValor],
            ['Entrada disponível', r.entradaValor],
            ['Possui FGTS', r.fgts],
            ['Saldo de FGTS', r.fgtsValor],
            ['Composição de renda', r.composicao],
            ['Pessoas na composição', r.composicaoQtd],
            ['Região', regioes.join(', ')],
            ['Preferência', r.preferencia]
          ]) +
          htmlAviso('Esta é uma estimativa inicial. A capacidade real de financiamento depende da análise de crédito, renda, documentação, instituição financeira, empreendimento e condições vigentes.') +
          '<div class="btn-grupo" style="margin-top:20px">' +
            '<button class="btn btn--wpp" data-enviar="quanto-posso-pagar" data-dados=\'' + esc(JSON.stringify(dadosWpp)) + '\'>' +
              SN.ICO.wpp + 'Enviar para a Silvana' +
            '</button>' +
            '<button class="btn btn--linha" data-reiniciar>Refazer</button>' +
          '</div>';
      }
    });
  }

  /* =====================================================================
     3. QUAL IMÓVEL COMBINA COMIGO (quiz)
     ================================================================== */
  function quiz() {
    criarAssistente({
      id: 'ferramenta-quiz',
      etapas: [
        { chave: 'regiao', tipo: 'multi', obrigatorio: true,
          pergunta: 'Onde você quer morar?',
          ajuda: 'Pode marcar mais de uma região.',
          opcoes: SN.regioes.map(function (r) { return { valor: r.id, rotulo: r.nome }; }) },

        { chave: 'dormitorios', tipo: 'multi', obrigatorio: true, colunas: 3,
          pergunta: 'Quantos dormitórios?',
          opcoes: [{ valor: '1', rotulo: '1' }, { valor: '2', rotulo: '2' }, { valor: '3', rotulo: '3' }] },

        { chave: 'vaga', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Precisa de vaga de garagem?',
          opcoes: [{ valor: 'com', rotulo: 'Sim, com vaga' }, { valor: 'sem', rotulo: 'Não preciso' }, { valor: '', rotulo: 'Indiferente' }] },

        { chave: 'lazer', tipo: 'multi', obrigatorio: false,
          pergunta: 'O que não pode faltar no lazer?',
          ajuda: 'Opcional. Quanto mais itens você marcar, mais específico fica o resultado.',
          opcoes: SN.lazer.map(function (l) { return { valor: l.id, rotulo: l.nome }; }) },

        { chave: 'renda', tipo: 'opcoes', obrigatorio: true,
          pergunta: 'Qual a sua renda familiar mensal?',
          opcoes: opcoesRenda() },

        { chave: 'fgts', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Você possui FGTS?', opcoes: SIM_NAO_TALVEZ },

        { chave: 'primeiroImovel', tipo: 'opcoes', obrigatorio: true, colunas: 2,
          pergunta: 'É o seu primeiro imóvel?', opcoes: SIM_NAO },

        { chave: 'transporte', tipo: 'opcoes', obrigatorio: true, colunas: 3,
          pergunta: 'Precisa estar perto de transporte público?',
          opcoes: [{ valor: 'Sim, é essencial', rotulo: 'Sim, é essencial' }, { valor: 'Ajuda, mas não é essencial', rotulo: 'Ajuda' }, { valor: 'Não', rotulo: 'Não' }] },

        { tipo: 'campo',
          pergunta: 'Tem alguma necessidade específica?',
          ajuda: 'Opcional. Acessibilidade, pet, home office, andar baixo — o que for importante para você.',
          campos: [
            { chave: 'necessidades', rotulo: 'Necessidades específicas', obrigatorio: false, placeholder: 'Escreva aqui (opcional)' }
          ] }
      ],

      aoConcluir: function (r) {
        SN.perfil = {
          renda: r.renda,
          fgts: r.fgts,
          primeiroImovel: r.primeiroImovel,
          regiao: (r.regiao || []).map(nomeRegiao).join(', ')
        };
      },

      resultado: function (r) {
        var filtrosQuiz = {
          regiao: r.regiao || [],
          dormitorios: r.dormitorios || [],
          vaga: r.vaga ? [r.vaga] : [],
          lazer: r.lazer || []
        };
        SN.aplicarFiltros(filtrosQuiz);
        var achados = SN.resultadosAtuais();

        var regioes = (r.regiao || []).map(nomeRegiao);
        var lazeres = (r.lazer || []).map(nomeLazer);

        var dadosWpp = {
          regiao: regioes.join(', '),
          dormitorios: (r.dormitorios || []).join(', '),
          vaga: r.vaga === 'com' ? 'Sim' : (r.vaga === 'sem' ? 'Não' : 'Indiferente'),
          lazer: lazeres.join(', '),
          renda: r.renda,
          fgts: r.fgts,
          primeiroImovel: r.primeiroImovel,
          transporte: r.transporte,
          necessidades: r.necessidades
        };

        var blocoResultado;
        if (achados.length) {
          blocoResultado =
            '<p class="resultado-titulo">Encontramos opções que podem combinar com o seu perfil.</p>' +
            '<p class="texto" style="margin-bottom:16px">' + achados.length +
              (achados.length === 1 ? ' empreendimento cadastrado atende' : ' empreendimentos cadastrados atendem') +
              ' aos seus critérios. Eles já estão filtrados na seção Encontre seu imóvel.</p>' +
            '<div class="grade-imoveis">' + achados.slice(0, 3).map(function (e) { return SN.cardImovel(e, true); }).join('') + '</div>' +
            (achados.length > 3
              ? '<p style="margin-top:16px"><a class="btn btn--linha btn--bloco" href="#imoveis">Ver todos os ' + achados.length + ' resultados</a></p>'
              : '');
        } else {
          blocoResultado =
            '<p class="resultado-titulo">Não encontramos uma opção cadastrada exatamente com esses critérios no momento.</p>' +
            '<p class="texto" style="margin-bottom:16px">Isso não quer dizer que não exista. O catálogo do site é atualizado com frequência e eu tenho acesso a opções que ainda não estão publicadas aqui.</p>';
        }

        return blocoResultado +
          '<div style="margin-top:22px">' + htmlResumo([
            ['Região', regioes.join(', ')],
            ['Dormitórios', (r.dormitorios || []).join(', ')],
            ['Vaga', dadosWpp.vaga],
            ['Lazer', lazeres.join(', ')],
            ['Renda familiar', r.renda],
            ['Possui FGTS', r.fgts],
            ['Primeiro imóvel', r.primeiroImovel],
            ['Transporte público', r.transporte],
            ['Necessidades', r.necessidades]
          ]) + '</div>' +
          htmlAviso(SN.mcmv.aviso) +
          '<div class="btn-grupo" style="margin-top:20px">' +
            '<button class="btn btn--wpp" data-enviar="quiz" data-dados=\'' + esc(JSON.stringify(dadosWpp)) + '\'>' +
              SN.ICO.wpp + 'Falar com a Silvana' +
            '</button>' +
            '<button class="btn btn--linha" data-reiniciar>Refazer</button>' +
          '</div>';
      }
    });
  }

  /* =====================================================================
     ENVIO PARA O WHATSAPP A PARTIR DO RESULTADO
     ================================================================== */
  function iniciarEnvio() {
    doc.addEventListener('click', function (ev) {
      var botao = ev.target.closest('[data-enviar]');
      if (!botao) return;
      var contexto = botao.dataset.enviar;
      var dados = {};
      try { dados = JSON.parse(botao.dataset.dados || '{}'); } catch (e) { dados = {}; }
      SN.whatsapp.abrir(contexto, dados);
    });
  }

  SN.iniciarFerramentas = function () {
    perfil();
    quantoPossoPagar();
    quiz();
    iniciarEnvio();
  };
})();
