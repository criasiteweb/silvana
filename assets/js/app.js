/* =====================================================================
   APP — Silvana Novaes / SN IMOB
   Navegação, renderização das seções orientadas a dados, filtros de
   empreendimentos, book do empreendimento, galeria com lightbox e FAQ.
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

  /* Perfil respondido nas ferramentas, reaproveitado nas mensagens
     enviadas a partir de um empreendimento. */
  SN.perfil = {};

  /* ---------- ÍCONES (SVG inline, sem dependência externa) ---------- */
  var ICO = {
    local:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-4.7-7-10a7 7 0 1 1 14 0c0 5.3-7 10-7 10z"/><circle cx="12" cy="11" r="2.5"/></svg>',
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    seta:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    mais:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    x:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01" stroke-linecap="round"/></svg>',
    alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3 2.5 20h19L12 3z" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke-linecap="round"/></svg>',
    lupa:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5" stroke-linecap="round"/></svg>',
    wpp:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 18.15h-.01c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.23.85.86-3.15-.2-.32a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.2 8.24"/></svg>',
    insta:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none"/></svg>',
    face:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg>',
    doc:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z"/><path d="M14 2.5v5h5M8.5 13h7M8.5 17h4.5" stroke-linecap="round"/></svg>',
    casa:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5" stroke-linecap="round"/><path d="M5 9.8V20h14V9.8"/><path d="M9.5 20v-5.5h5V20"/></svg>',
    banco:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 10 12 4l9 6" stroke-linecap="round"/><path d="M5 10v9M19 10v9M9.5 10v9M14.5 10v9M3 20h18" stroke-linecap="round"/></svg>',
    grafico:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 17l5-5 4 3 5-6 4 4"/><path d="M3 21h18"/></svg>',
    pessoa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round"/></svg>',
    chave:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="8" cy="12" r="4.2"/><path d="M12.2 12H21M17.5 12v3.2M20 12v2.4" stroke-linecap="round"/></svg>',
    fgts:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M17 5.5H9.8a3.3 3.3 0 0 0 0 6.5h4.4a3.3 3.3 0 0 1 0 6.5H6"/></svg>'
  };
  SN.ICO = ICO;

  /* =====================================================================
     1. CABEÇALHO, MENU E NAVEGAÇÃO
     ================================================================== */
  function iniciarCabecalho() {
    var cabecalho = $('.cabecalho');
    var botao = $('#btn-menu');
    var menu = $('#menu-mobile');

    window.addEventListener('scroll', function () {
      cabecalho.classList.toggle('rolado', window.scrollY > 8);
    }, { passive: true });

    function fechar() {
      menu.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
      doc.body.classList.remove('travado');
    }
    function alternar() {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      doc.body.classList.toggle('travado', aberto);
    }
    botao.addEventListener('click', alternar);
    $$('#menu-mobile a').forEach(function (a) { a.addEventListener('click', fechar); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { fechar(); botao.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) fechar();
    });

    /* seção ativa no menu do desktop */
    var links = $$('.nav-desktop a[href^="#"]');
    var secoes = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    if ('IntersectionObserver' in window && secoes.length) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('ativo', a.getAttribute('href') === '#' + en.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
      secoes.forEach(function (s) { obs.observe(s); });
    }
  }

  /* =====================================================================
     2. ANIMAÇÃO DE ENTRADA
     ================================================================== */
  function iniciarRevelacao() {
    var alvos = $$('.rv');
    if (!('IntersectionObserver' in window)) {
      alvos.forEach(function (a) { a.classList.add('visivel'); });
      return;
    }
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    alvos.forEach(function (a) { obs.observe(a); });
    /* rede de segurança: nada pode ficar invisível */
    setTimeout(function () { alvos.forEach(function (a) { a.classList.add('visivel'); }); }, 3000);
  }

  /* =====================================================================
     3. SEÇÕES ORIENTADAS A DADOS
     ================================================================== */
  function renderizarRegioes() {
    var alvo = $('#lista-regioes');
    if (!alvo) return;
    alvo.innerHTML = SN.regioes.map(function (r) { return '<li>' + esc(r.nome) + '</li>'; }).join('');

    var grade = $('#grade-regioes');
    if (grade) {
      grade.innerHTML = SN.regioes.map(function (r) {
        return '<article class="cartao rv">' +
          '<div class="cartao-ico">' + ICO.local + '</div>' +
          '<h3>' + esc(r.nome) + '</h3>' +
          '<p>Atendimento e acompanhamento em toda a região.</p>' +
          '<p style="margin-top:12px"><button class="btn btn--linha btn--peq" data-wpp="filtros" data-regiao="' + esc(r.nome) + '">Ver opções aqui</button></p>' +
          '</article>';
      }).join('');
    }
  }

  function renderizarProcesso() {
    var alvo = $('#lista-processo');
    if (!alvo) return;
    alvo.innerHTML = SN.processo.map(function (p) {
      return '<article class="passo rv">' +
        '<span class="passo-n" aria-hidden="true">' + esc(p.n) + '</span>' +
        '<div><h3>' + esc(p.titulo) + '</h3><p>' + esc(p.texto) + '</p></div>' +
        '</article>';
    }).join('');
  }

  function renderizarMcmv() {
    var m = SN.mcmv;

    var faixas = $('#lista-faixas');
    if (faixas) {
      faixas.innerHTML = m.faixas.map(function (f) {
        return '<article class="faixa-card rv">' +
          '<p class="rotulo">' + esc(f.nome) + '</p>' +
          '<p class="valor">' + esc(f.limiteTexto) + '</p>' +
          '</article>';
      }).join('');
    }

    var teto = $('#mcmv-teto');
    if (teto) teto.textContent = m.observacaoTeto;

    var fonte = $('#mcmv-fonte');
    if (fonte) {
      fonte.innerHTML = ICO.info +
        '<p>Informações atualizadas em <strong>' + esc(m.atualizadoEm) + '</strong>, conforme a ' +
        '<a href="' + esc(m.fonteUrl) + '" target="_blank" rel="noopener">' + esc(m.fonteNome) + '</a>.</p>';
    }

    var fatores = $('#lista-fatores');
    if (fatores) {
      fatores.innerHTML = m.fatores.map(function (f) {
        return '<li>' + ICO.check + '<span>' + esc(f) + '</span></li>';
      }).join('');
    }

    $$('.js-aviso-mcmv').forEach(function (n) {
      n.innerHTML = ICO.alerta + '<p>' + esc(m.aviso) + '</p>';
    });
  }

  function renderizarConstrutoras() {
    var alvo = $('#lista-construtoras');
    if (!alvo) return;
    alvo.innerHTML = SN.construtoras.map(function (c) {
      return '<div class="construtora">' + esc(c.nome) + '</div>';
    }).join('');
  }

  function renderizarFaq() {
    var alvo = $('#lista-faq');
    if (!alvo) return;
    alvo.innerHTML = SN.faq.map(function (item, i) {
      var id = 'faq-painel-' + i;
      return '<div class="acc-item">' +
        '<h3><button class="acc-botao" aria-expanded="false" aria-controls="' + id + '">' +
          '<span>' + esc(item.p) + '</span>' +
          '<span class="acc-icone" aria-hidden="true">' + ICO.mais + '</span>' +
        '</button></h3>' +
        '<div class="acc-painel" id="' + id + '" role="region"><div><p>' + esc(item.r) + '</p></div></div>' +
        '</div>';
    }).join('');

    alvo.addEventListener('click', function (ev) {
      var botao = ev.target.closest('.acc-botao');
      if (!botao) return;
      var item = botao.closest('.acc-item');
      var aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', aberto ? 'false' : 'true');
      item.classList.toggle('aberto', !aberto);
    });
  }

  /* =====================================================================
     4. CATÁLOGO DE EMPREENDIMENTOS
     ================================================================== */
  var filtros = { regiao: [], dormitorios: [], vaga: [], lazer: [] };
  var LOTE = 6;          /* quantos cards aparecem antes do "ver mais" */
  var mostrando = LOTE;

  function nomeRegiao(id) {
    var r = SN.regioes.filter(function (x) { return x.id === id; })[0];
    return r ? r.nome : id;
  }
  function nomeLazer(id) {
    var l = SN.lazer.filter(function (x) { return x.id === id; })[0];
    return l ? l.nome : id;
  }
  function textoDorms(emp) {
    var partes = [];
    if (emp.studio) partes.push('Studio');
    emp.dormitorios.forEach(function (d) { partes.push(d + ' dorm.'); });
    return partes.join(' · ');
  }
  function textoVaga(emp) {
    if (emp.vaga === 'sim') return 'Com vaga';
    if (emp.vaga === 'nao') return 'Sem vaga';
    if (emp.vaga === 'opcional') return 'Com ou sem vaga';
    return 'Vaga: consultar';
  }

  function passaNoFiltro(emp) {
    if (filtros.regiao.length && filtros.regiao.indexOf(emp.regiao) === -1) return false;

    if (filtros.dormitorios.length) {
      var bate = filtros.dormitorios.some(function (d) {
        var n = parseInt(d, 10);
        if (emp.dormitorios.indexOf(n) !== -1) return true;
        return n === 1 && emp.studio === true;   /* studio conta como 1 */
      });
      if (!bate) return false;
    }

    if (filtros.vaga.length) {
      var okVaga = filtros.vaga.some(function (v) {
        if (v === 'com') return emp.vaga === 'sim' || emp.vaga === 'opcional';
        if (v === 'sem') return emp.vaga === 'nao' || emp.vaga === 'opcional';
        return false;
      });
      if (!okVaga) return false;
    }

    if (filtros.lazer.length) {
      var temTodos = filtros.lazer.every(function (l) { return emp.lazer.indexOf(l) !== -1; });
      if (!temTodos) return false;
    }
    return true;
  }

  function cardImovel(emp, destaque) {
    var capa = emp.imagens && emp.imagens.length
      ? '<img src="assets/img/empreendimentos/' + esc(emp.imagens[0]) + '" alt="' + esc(emp.nome) + ' — ' + esc(emp.bairro) + '" loading="lazy" width="640" height="480">'
      : '<div class="imovel-foto-vazia"><img src="assets/img/logo.png" alt="" width="54" height="54" loading="lazy"><span>Foto a incluir</span></div>';

    var specs = ['<span class="spec">' + esc(textoDorms(emp)) + '</span>',
                 '<span class="spec">' + esc(textoVaga(emp)) + '</span>'];
    emp.lazer.slice(0, 2).forEach(function (l) {
      specs.push('<span class="spec">' + esc(nomeLazer(l)) + '</span>');
    });

    var preco = emp.preco
      ? '<span class="val">' + esc(emp.preco) + '</span>'
      : '<span class="consultar">Consulte as condições atuais</span>';

    return '<article class="imovel rv">' +
      '<div class="imovel-foto">' + capa +
        '<div class="imovel-tags">' +
          '<span class="tag' + (destaque ? ' tag--ouro' : '') + '">' + esc(emp.status) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="imovel-corpo">' +
        '<p class="imovel-local">' + ICO.local + esc(emp.bairro + ', ' + emp.cidade) + '</p>' +
        '<h3>' + esc(emp.nome) + '</h3>' +
        '<p class="imovel-construtora">' + esc(emp.construtora) + '</p>' +
        '<div class="imovel-specs">' + specs.join('') + '</div>' +
        '<div class="imovel-preco"><span class="rot">Valor</span>' + preco + '</div>' +
        '<div class="imovel-acoes">' +
          '<button class="btn btn--linha btn--peq btn--bloco" data-book="' + esc(emp.id) + '">Ver detalhes</button>' +
          '<button class="btn btn--ouro btn--peq btn--bloco" data-interesse="' + esc(emp.id) + '">Tenho interesse</button>' +
        '</div>' +
      '</div>' +
      '</article>';
  }

  function renderizarCatalogo() {
    var grade = $('#grade-imoveis');
    var contador = $('#contador-imoveis');
    if (!grade) return;

    var lista = SN.empreendimentos.filter(passaNoFiltro);

    if (contador) {
      contador.innerHTML = '<b>' + lista.length + '</b> ' +
        (lista.length === 1 ? 'empreendimento encontrado' : 'empreendimentos encontrados');
    }

    if (!lista.length) {
      var resumo = resumoDosFiltros();
      grade.className = '';
      grade.innerHTML = '<div class="vazio">' + ICO.lupa +
        '<h3>Não encontramos uma opção cadastrada exatamente com esses critérios no momento.</h3>' +
        '<p>O catálogo é atualizado com frequência. Me mande os seus critérios que eu verifico o que existe disponível hoje.</p>' +
        '<button class="btn btn--wpp" data-wpp="sem-resultado">' + ICO.wpp + 'Falar com a Silvana</button>' +
        (resumo ? '<p class="texto-peq" style="margin-top:14px">Critérios: ' + esc(resumo) + '</p>' : '') +
        '</div>';
    } else {
      grade.className = 'grade-imoveis';
      grade.innerHTML = lista.slice(0, mostrando).map(function (e) { return cardImovel(e, false); }).join('');
    }

    var maisWrap = $('#ver-mais');
    if (maisWrap) {
      var restam = lista.length - mostrando;
      maisWrap.innerHTML = restam > 0
        ? '<button type="button" class="btn btn--linha btn--bloco" id="btn-ver-mais">Ver mais ' + restam +
          (restam === 1 ? ' empreendimento' : ' empreendimentos') + '</button>'
        : '';
    }
    /* Resultado de filtro aparece na hora: sem animação de entrada, para que
       nenhum card fique invisível se o observer não disparar. */
    $$('.rv', grade).forEach(function (n) { n.classList.add('visivel'); });
  }

  function resumoDosFiltros() {
    var p = [];
    if (filtros.regiao.length)      p.push('Região: ' + filtros.regiao.map(nomeRegiao).join(', '));
    if (filtros.dormitorios.length) p.push('Dormitórios: ' + filtros.dormitorios.join(', '));
    if (filtros.vaga.length)        p.push('Vaga: ' + filtros.vaga.map(function (v) { return v === 'com' ? 'com vaga' : 'sem vaga'; }).join(', '));
    if (filtros.lazer.length)       p.push('Lazer: ' + filtros.lazer.map(nomeLazer).join(', '));
    return p.join(' | ');
  }

  function renderizarDestaques() {
    var grade = $('#grade-destaques');
    if (!grade) return;
    /* Destaque = lançamentos primeiro, depois o resto. Sem inventar ordem comercial. */
    var lista = SN.empreendimentos.slice().sort(function (a, b) {
      var peso = { 'Lançamento': 0, 'Em obras': 1, 'Pronto para morar': 2 };
      return (peso[a.status] == null ? 9 : peso[a.status]) - (peso[b.status] == null ? 9 : peso[b.status]);
    }).slice(0, 3);
    grade.innerHTML = lista.map(function (e) { return cardImovel(e, true); }).join('');
    $$('.rv', grade).forEach(function (n) { n.classList.add('visivel'); });
  }

  function montarFiltros() {
    var caixa = $('#filtros');
    if (!caixa) return;

    function bloco(titulo, chave, opcoes) {
      return '<div class="filtro-bloco"><span>' + esc(titulo) + '</span><div class="chips">' +
        opcoes.map(function (o) {
          return '<button type="button" class="chip" aria-pressed="false" data-filtro="' + chave + '" data-valor="' + esc(o.id) + '">' + esc(o.nome) + '</button>';
        }).join('') + '</div></div>';
    }

    caixa.innerHTML =
      bloco('Região', 'regiao', SN.regioes) +
      bloco('Dormitórios', 'dormitorios', [{ id: '1', nome: '1' }, { id: '2', nome: '2' }, { id: '3', nome: '3' }]) +
      bloco('Vaga', 'vaga', [{ id: 'com', nome: 'Com vaga' }, { id: 'sem', nome: 'Sem vaga' }]) +
      bloco('Lazer', 'lazer', SN.lazer) +
      '<div class="filtros-rodape">' +
        '<p class="contador" id="contador-imoveis"></p>' +
        '<button type="button" class="btn btn--linha btn--peq" id="btn-limpar">Limpar filtros</button>' +
      '</div>';

    caixa.addEventListener('click', function (ev) {
      var chip = ev.target.closest('.chip');
      if (chip) {
        var chave = chip.dataset.filtro, valor = chip.dataset.valor;
        var i = filtros[chave].indexOf(valor);
        if (i === -1) filtros[chave].push(valor); else filtros[chave].splice(i, 1);
        chip.setAttribute('aria-pressed', i === -1 ? 'true' : 'false');
        mostrando = LOTE;
        renderizarCatalogo();
        return;
      }
      if (ev.target.closest('#btn-limpar')) {
        Object.keys(filtros).forEach(function (k) { filtros[k] = []; });
        $$('.chip', caixa).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        mostrando = LOTE;
        renderizarCatalogo();
      }
    });

    doc.addEventListener('click', function (ev) {
      if (!ev.target.closest('#btn-ver-mais')) return;
      mostrando += LOTE;
      renderizarCatalogo();
    });
  }

  /* Usado pelo quiz: aplica filtros vindos de fora e rola até o catálogo. */
  SN.aplicarFiltros = function (novos) {
    Object.keys(filtros).forEach(function (k) { filtros[k] = novos[k] ? novos[k].slice() : []; });
    mostrando = LOTE;
    $$('#filtros .chip').forEach(function (c) {
      var ativo = filtros[c.dataset.filtro].indexOf(c.dataset.valor) !== -1;
      c.setAttribute('aria-pressed', ativo ? 'true' : 'false');
    });
    renderizarCatalogo();
  };
  SN.resultadosAtuais = function () { return SN.empreendimentos.filter(passaNoFiltro); };
  SN.cardImovel = cardImovel;

  /* =====================================================================
     5. BOOK DO EMPREENDIMENTO
     ================================================================== */
  var modal, modalConteudo, ultimoFoco;

  function abrirBook(id) {
    var emp = SN.empreendimentos.filter(function (e) { return e.id === id; })[0];
    if (!emp) return;

    var galeria = emp.imagens && emp.imagens.length
      ? '<div class="book-galeria">' + emp.imagens.map(function (img, i) {
          return '<figure class="book-foto" data-galeria="book" data-indice="' + i + '" tabindex="0" role="button" aria-label="Ampliar foto ' + (i + 1) + ' de ' + esc(emp.nome) + '">' +
            '<img src="assets/img/empreendimentos/' + esc(img) + '" alt="' + esc(emp.nome) + ' — foto ' + (i + 1) + '" loading="lazy">' +
            '</figure>';
        }).join('') + '</div>'
      : '<div class="vazio" style="padding:30px 20px;margin-bottom:22px">' +
          '<img src="assets/img/logo.png" alt="" width="46" height="46" style="margin:0 auto 12px;opacity:.5">' +
          '<h3 style="font-size:17px">Fotos oficiais ainda não cadastradas</h3>' +
          '<p style="margin-bottom:0;font-size:14px">Fachada, decorado, lazer e planta entram aqui assim que o material oficial do empreendimento for adicionado.</p>' +
        '</div>';

    var dados = [
      ['Construtora', emp.construtora],
      ['Localização', emp.bairro + ', ' + emp.cidade],
      ['Região', nomeRegiao(emp.regiao)],
      ['Tipologia', emp.tipoTexto],
      ['Vaga', textoVaga(emp)],
      ['Status', emp.status],
      ['Valor', emp.preco || 'Consulte as condições atuais'],
      ['Financiamento', emp.financiamento || 'Consultar condições vigentes']
    ].map(function (d) {
      return '<div class="book-dado"><dt>' + esc(d[0]) + '</dt><dd>' + esc(d[1]) + '</dd></div>';
    }).join('');

    var lazerHtml = emp.lazer.length
      ? '<div class="book-secao"><h4>Lazer</h4><ul class="book-lista">' +
          emp.lazer.map(function (l) { return '<li>' + esc(nomeLazer(l)) + '</li>'; }).join('') +
        '</ul></div>'
      : '';

    var destaquesHtml = emp.destaques && emp.destaques.length
      ? '<div class="book-secao"><h4>Diferenciais</h4><ul class="book-lista">' +
          emp.destaques.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') +
        '</ul></div>'
      : '';

    modalConteudo.innerHTML =
      '<div class="modal-cabeca">' +
        '<p class="sobretitulo">' + esc(nomeRegiao(emp.regiao)) + '</p>' +
        '<h3 id="titulo-book">' + esc(emp.nome) + '</h3>' +
        '<p class="texto">' + esc(emp.bairro + ', ' + emp.cidade) + ' · ' + esc(emp.construtora) + '</p>' +
      '</div>' +
      galeria +
      '<div class="book-secao"><h4>Informações</h4><dl class="book-dados">' + dados + '</dl></div>' +
      lazerHtml + destaquesHtml +
      '<div class="aviso js-aviso-mcmv"></div>' +
      '<p class="texto-peq" style="margin-top:14px">Informação obtida do material oficial da construtora em ' + esc(emp.atualizadoEm) +
        '. <a href="' + esc(emp.fonte) + '" target="_blank" rel="noopener" style="color:var(--ouro-escuro);font-weight:700">Ver fonte</a>. ' +
        'Disponibilidade e condições devem ser confirmadas comigo.</p>' +
      '<div class="btn-grupo" style="margin-top:20px">' +
        '<button class="btn btn--wpp btn--bloco" data-interesse="' + esc(emp.id) + '">' + ICO.wpp + 'Tenho interesse</button>' +
      '</div>';

    $$('.js-aviso-mcmv', modalConteudo).forEach(function (n) {
      n.innerHTML = ICO.alerta + '<p>' + esc(SN.mcmv.aviso) + '</p>';
    });

    modal.dataset.galeria = JSON.stringify(
      (emp.imagens || []).map(function (i) { return 'assets/img/empreendimentos/' + i; })
    );

    ultimoFoco = doc.activeElement;
    modal.classList.add('aberto');
    doc.body.classList.add('travado');
    $('.modal-fechar', modal).focus();
  }

  function fecharBook() {
    modal.classList.remove('aberto');
    doc.body.classList.remove('travado');
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  function iniciarBook() {
    modal = $('#modal-book');
    modalConteudo = $('#modal-conteudo');
    if (!modal) return;

    $('.modal-fechar', modal).addEventListener('click', fecharBook);
    $('.modal-fundo', modal).addEventListener('click', fecharBook);
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('aberto') && !$('#lightbox').classList.contains('aberto')) fecharBook();
    });

    doc.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-book]');
      if (b) { abrirBook(b.dataset.book); return; }

      var i = ev.target.closest('[data-interesse]');
      if (i) {
        var emp = SN.empreendimentos.filter(function (e) { return e.id === i.dataset.interesse; })[0];
        if (emp) SN.whatsapp.abrir('empreendimento', SN.whatsapp.dadosDoEmpreendimento(emp, SN.perfil));
      }
    });
  }

  /* =====================================================================
     6. LIGHTBOX
     ================================================================== */
  var lb, lbImg, lbContador, lbLista = [], lbIndice = 0;

  function abrirLightbox(lista, indice) {
    lbLista = lista; lbIndice = indice;
    mostrarLightbox();
    lb.classList.add('aberto');
    doc.body.classList.add('travado');
    $('.lb-fechar', lb).focus();
  }
  function mostrarLightbox() {
    if (!lbLista.length) return;
    lbImg.src = lbLista[lbIndice];
    lbImg.alt = 'Foto ' + (lbIndice + 1) + ' de ' + lbLista.length;
    lbContador.textContent = (lbIndice + 1) + ' / ' + lbLista.length;
    var mostraSetas = lbLista.length > 1;
    $('.lb-ant', lb).hidden = !mostraSetas;
    $('.lb-prox', lb).hidden = !mostraSetas;
  }
  function moverLightbox(passo) {
    if (!lbLista.length) return;
    lbIndice = (lbIndice + passo + lbLista.length) % lbLista.length;
    mostrarLightbox();
  }
  function fecharLightbox() {
    lb.classList.remove('aberto');
    if (!modal || !modal.classList.contains('aberto')) doc.body.classList.remove('travado');
  }

  function iniciarLightbox() {
    lb = $('#lightbox');
    if (!lb) return;
    lbImg = $('#lb-img');
    lbContador = $('.lb-contador', lb);

    $('.lb-fechar', lb).addEventListener('click', fecharLightbox);
    $('.lb-ant', lb).addEventListener('click', function () { moverLightbox(-1); });
    $('.lb-prox', lb).addEventListener('click', function () { moverLightbox(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) fecharLightbox(); });

    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('aberto')) return;
      if (e.key === 'Escape') fecharLightbox();
      if (e.key === 'ArrowLeft') moverLightbox(-1);
      if (e.key === 'ArrowRight') moverLightbox(1);
    });

    /* swipe no celular */
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) moverLightbox(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });

    /* abre a partir de qualquer elemento marcado com data-galeria */
    function acionar(alvo) {
      var fig = alvo.closest('[data-galeria]');
      if (!fig) return false;
      var grupo = fig.dataset.galeria;
      var lista;
      if (grupo === 'book') {
        lista = JSON.parse(modal.dataset.galeria || '[]');
      } else {
        lista = $$('[data-galeria="' + grupo + '"]').map(function (n) {
          return n.querySelector('img').getAttribute('src');
        });
      }
      if (!lista.length) return false;
      abrirLightbox(lista, parseInt(fig.dataset.indice, 10) || 0);
      return true;
    }
    doc.addEventListener('click', function (e) { acionar(e.target); });
    doc.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target.closest('[data-galeria]')) { e.preventDefault(); acionar(e.target); }
    });
  }

  /* =====================================================================
     7. LINKS DE WHATSAPP DECLARATIVOS
     Qualquer elemento com data-wpp="<contexto>" abre o WhatsApp.
     ================================================================== */
  function iniciarWhatsapp() {
    doc.addEventListener('click', function (ev) {
      var alvo = ev.target.closest('[data-wpp]');
      if (!alvo) return;
      ev.preventDefault();

      var contexto = alvo.dataset.wpp || 'geral';
      var dados = {};

      if (contexto === 'filtros') {
        if (alvo.dataset.regiao) dados.regiao = alvo.dataset.regiao;
        else {
          var r = resumoDosFiltros();
          if (r) dados['Critérios da busca'] = r;
        }
      }
      if (contexto === 'sem-resultado') {
        var res = resumoDosFiltros();
        if (res) dados['Critérios da busca'] = res;
      }
      /* reaproveita o que o visitante já respondeu nas ferramentas */
      if (SN.perfil.renda)          dados.renda = SN.perfil.renda;
      if (SN.perfil.regiao && !dados.regiao) dados.regiao = SN.perfil.regiao;

      SN.whatsapp.abrir(contexto, dados);
    });
  }

  /* =====================================================================
     8. PREENCHIMENTO DOS DADOS DE CONTATO NO HTML
     ================================================================== */
  function preencherContato() {
    var c = SN.config;
    $$('[data-campo]').forEach(function (n) {
      var v = c[n.dataset.campo];
      if (v) n.textContent = v;
    });
    $$('[data-link="instagram"]').forEach(function (a) { a.href = c.instagramUrl; });
    $$('[data-link="facebook"]').forEach(function (a) { a.href = c.facebookUrl; });
    var ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();
  }

  /* =====================================================================
     INÍCIO
     ================================================================== */
  doc.addEventListener('DOMContentLoaded', function () {
    preencherContato();
    iniciarCabecalho();
    renderizarRegioes();
    renderizarProcesso();
    renderizarMcmv();
    renderizarConstrutoras();
    renderizarFaq();
    montarFiltros();
    renderizarDestaques();
    renderizarCatalogo();
    iniciarBook();
    iniciarLightbox();
    iniciarWhatsapp();
    if (SN.iniciarFerramentas) SN.iniciarFerramentas();
    iniciarRevelacao();
  });
})();
