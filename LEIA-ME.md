# Site da Silvana Novaes — SN IMOB

Tema escuro com a paleta do selo dela (preto `#080807` + dourado `#C2A049`),
topo em vídeo e conteúdo todo interativo.

## Como abrir
Abra o arquivo `index.html` no navegador. Não precisa instalar nada,
não precisa de servidor e não precisa rodar nenhum comando de build.

## Onde mexer

| O que você quer mudar | Arquivo |
|---|---|
| CRECI, WhatsApp, Instagram, Facebook | `assets/js/dados.js` → `SN.config` |
| Empreendimentos (add/editar/remover) | `assets/js/dados.js` → `SN.empreendimentos` |
| Faixas do Minha Casa Minha Vida | `assets/js/dados.js` → `SN.mcmv` |
| Perguntas do FAQ | `assets/js/dados.js` → `SN.faq` |
| Etapas do financiamento | `assets/js/dados.js` → `SN.processo` |
| Regiões de atuação | `assets/js/dados.js` → `SN.regioes` |
| Textos das seções | `index.html` |
| Cores e layout | `assets/css/estilo.css` |

## Vídeo do topo
`assets/video/hero.mp4` — montagem das fotos reais de entrega de chave, com
zoom lento e transições. Foi gerado a partir de `assets/img/trabalho-1..8.jpg`.

Para trocar por um vídeo da própria Silvana, basta substituir esse arquivo
(mantendo o nome) e gerar um novo quadro de capa em `assets/img/hero-poster.jpg`.
O ideal é vertical, sem áudio, curto (10 a 20 segundos) e abaixo de 3 MB.

## Fotos dos empreendimentos
Coloque os arquivos em `assets/img/empreendimentos/` e escreva o nome
deles no campo `imagens` do empreendimento, assim:

    imagens: ['dez-jardim-fachada.jpg', 'dez-jardim-piscina.jpg']

A primeira foto vira a capa do card. Todas entram na galeria com zoom.
Enquanto a lista estiver vazia, o card mostra "FOTO A INCLUIR".

## Imagem de compartilhamento
`assets/img/compartilhar.jpg` (1200x630) é o que aparece na prévia quando o
link é enviado no WhatsApp. Se mudar a frase do topo, vale regerar essa imagem.

## Mensagens de WhatsApp
Todas saem de `assets/js/whatsapp.js`. Para mudar um texto de abertura
ou fechamento, edite `ABERTURAS` e `FECHAMENTOS` — não há mensagem
escrita solta em outro lugar.

## Versões anteriores
- `bio/index.html` — link na bio (página única, curta). Fica no ar em `/silvana/bio/`.
- `v2/` — a mesma estrutura de hoje, porém no tema claro.
- `v1/` — a primeira versão, arquivo único com as imagens embutidas.
