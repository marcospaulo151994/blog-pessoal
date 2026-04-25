// data.jsx — fonte única de posts + tags

window.DPPosts = [
  { n: '087', date: '19 abr 2026', dateShort: '19.04', title: 'Reescrevendo um parser em Rust', tag: 'Rust', mins: 11, blurb: 'Performance era a desculpa. O verdadeiro presente foi ownership.', featured: true },
  { n: '086', date: '04 abr 2026', dateShort: '04.04', title: 'Por que TCP nunca foi "só TCP"', tag: 'Redes', mins: 7, blurb: 'Três décadas de hacks empilhados num protocolo que se recusa a morrer.' },
  { n: '085', date: '22 mar 2026', dateShort: '22.03', title: 'Mudei de cidade. E a stack mudou junto.', tag: 'Vida', mins: 4, blurb: 'Como o ambiente molda silenciosamente as decisões técnicas.' },
  { n: '084', date: '08 mar 2026', dateShort: '08.03', title: 'Meu homelab em 2026: tudo que quebrou', tag: 'Infra', mins: 14, blurb: 'Um ano cuidando de seis máquinas em casa. Anti-tutorial.' },
  { n: '083', date: '19 fev 2026', dateShort: '19.02', title: 'Neovim depois de oito anos: ainda vale', tag: 'Tools', mins: 6, blurb: 'O caso contraintuitivo a favor de aprender ferramentas profundas.' },
  { n: '082', date: '02 fev 2026', dateShort: '02.02', title: 'Observabilidade: traces, métricas e logs em paz', tag: 'Infra', mins: 12, blurb: 'Quando cada um deles é a ferramenta certa — e quando não é.' },
  { n: '081', date: '15 jan 2026', dateShort: '15.01', title: 'Lendo código fonte como exercício', tag: 'Ofício', mins: 8, blurb: 'Por que ler código fonte é melhor que ler livro técnico.' },
  { n: '080', date: '02 jan 2026', dateShort: '02.01', title: 'O que aprendi com 2025 (não é IA)', tag: 'Vida', mins: 5, blurb: 'Retrospectiva honesta, sem hype.' },
  { n: '079', date: '18 dez 2025', dateShort: '18.12', title: 'Postgres como cache, fila e store', tag: 'Banco', mins: 10, blurb: 'O caso de usar uma ferramenta só, bem, em vez de cinco.' },
  { n: '078', date: '04 dez 2025', dateShort: '04.12', title: 'Rate limiting: do mais simples ao mais útil', tag: 'Backend', mins: 9, blurb: 'Token bucket, leaky bucket, sliding window — quando cada um.' },
];

window.DPTags = [
  ['Rust', 12], ['Redes', 9], ['Infra', 14], ['Backend', 11], ['Banco', 6],
  ['Tools', 8], ['Vida', 7], ['Ofício', 5], ['Frontend', 4],
];
