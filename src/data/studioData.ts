export interface ProtocolSpec {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  idealFor: string;
  image: string;
  imageAlt: string;
  durationLabel: string;
  bayDaysMin: number;
  bayDaysMax: number;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  deliverables: string[];
}

export interface RealTransformation {
  id: string;
  title: string;
  vehicle: string;
  service: string;
  summary: string;
  beforeImage: string;
  afterImage: string;
  beforeNote: string;
  afterNote: string;
}

export interface PaintPreset {
  id: string;
  name: string;
  paintTone: string;
  metallicTint: string;
  beforeGloss: string;
  afterGloss: string;
  surfaceCondition: string;
}

export interface BayStage {
  step: number;
  title: string;
  detail: string;
  instrument: string;
}

export interface VehicleSizeOption {
  id: string;
  label: string;
  examples: string;
  timeOffsetDays: number;
}

export interface PaintConditionOption {
  id: string;
  label: string;
  description: string;
  recommendedProtocolId: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const GARAGE_CONTACT = {
  brand: 'Garagem 617',
  subtitle: 'Estética Automotiva',
  phoneDisplay: '(11) 93462-4257',
  whatsappDigits: '5511934624257',
  email: 'santisfe9@gmail.com',
  address: 'Rua Anagé, 617, Jardim Presidente Dutra, Guarulhos - SP',
  hoursWeekdays: 'Segunda a sexta: 08:00 às 18:00',
  hoursSaturday: 'Sábado: 08:00 às 12:00 (domingo fechado)',
  socials: [
    { label: 'Instagram', url: 'https://instagram.com/felpzzn' },
    { label: 'Facebook', url: 'https://facebook.com/felpzzn' },
    { label: 'TikTok', url: 'https://tiktok.com/@felpqy' },
  ],
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${GARAGE_CONTACT.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export const STUDIO_PROTOCOLS: ProtocolSpec[] = [
  {
    id: 'lavagem-premium',
    title: 'Lavagem Premium',
    shortTitle: 'Lavagem Premium',
    summary:
      'Higienização externa detalhada com pré-lavagem em espuma ativa neutra, limpeza de emblemas, caixas de roda, pinças de freio e proteção rápida da pintura sem atrito agressivo.',
    idealFor: 'Manutenção periódica de veículos polidos, cristalizados ou de uso diário que exigem limpeza segura.',
    image: '/images/estetica-guarulhos.jpg',
    imageAlt: 'Estúdio da Garagem 617 com veículo prata em processo de detalhamento e iluminação hexagonal',
    durationLabel: '3 a 5 horas',
    bayDaysMin: 1,
    bayDaysMax: 1,
    metrics: [
      { label: 'Lavagem química', value: 'pH neutro controlado' },
      { label: 'Secagem segura', value: 'Microfibra e soprador' },
      { label: 'Acabamento externo', value: 'Selante hidrofóbico' },
    ],
    deliverables: [
      'Pré-lavagem snow foam para soltar sujeira pesada antes do toque',
      'Pincelamento detalhado em grades, cantos de portas e emblemas',
      'Descontaminação de rodas, parafusos e caixas de roda',
      'Condicionamento acetinado de pneus e plásticos externos',
    ],
  },
  {
    id: 'polimento-tecnico',
    title: 'Polimento Técnico',
    shortTitle: 'Polimento Técnico',
    summary:
      'Correção controlada da pintura em múltiplos estágios para remover riscos superficiais, marcas circulares de lava-rápido e hologramas, devolvendo profundidade e nitidez real ao verniz.',
    idealFor: 'Pinturas opacas, com teias visíveis sob o sol ou após reparos localizados.',
    image: '/images/polimento-guarulhos.jpg',
    imageAlt: 'Técnico realizando polimento técnico com politriz roto-orbital e luminária de inspeção',
    durationLabel: '1 a 2 dias úteis',
    bayDaysMin: 1,
    bayDaysMax: 2,
    metrics: [
      { label: 'Conferência de defeitos', value: 'Luz de inspeção LED' },
      { label: 'Nivelamento', value: 'Corte, refino e lustro' },
      { label: 'Resultado real', value: 'Sem mascaradores oleosos' },
    ],
    deliverables: [
      'Lavagem técnica e descontaminação ferrosa com clay bar',
      'Isolamento de borrachas, frisos e cantos sensíveis antes do corte',
      'Setup de boinas e compostos adaptado à dureza de cada verniz',
      'Inspeção painel a painel para eliminar hologramas',
    ],
  },
  {
    id: 'cristalizacao',
    title: 'Cristalização e Proteção',
    shortTitle: 'Cristalização',
    summary:
      'Aplicação de camada protetora de alta repelência sobre o verniz limpo ou corrigido, formando barreira contra raios UV, seiva de árvores, chuva ácida e sujeira impregnada.',
    idealFor: 'Quem busca proteção duradoura, toque liso e facilidade nas próximas lavagens.',
    image: '/images/ceramic-cure.jpg',
    imageAlt: 'Pintura automotiva protegida com gotas esféricas sob lâmpada infravermelha de cura',
    durationLabel: '1 a 2 dias úteis',
    bayDaysMin: 1,
    bayDaysMax: 2,
    metrics: [
      { label: 'Proteção térmica e UV', value: 'Barreira química ativa' },
      { label: 'Repelência à água', value: 'Efeito hidrofóbico imediato' },
      { label: 'Opções de proteção', value: 'Cristalização ou cerâmica' },
    ],
    deliverables: [
      'Preparação química de superfície para ancoragem uniforme',
      'Aplicação controlada em pintura, lanternas e colunas black piano',
      'Tempo controlado de cura em área coberta e livre de poeira',
      'Orientações práticas de lavagem para prolongar a durabilidade',
    ],
  },
  {
    id: 'higienizacao-interna',
    title: 'Higienização Interna',
    shortTitle: 'Higienização Interna',
    summary:
      'Limpeza profunda e segura de bancos em tecido ou couro, teto, carpetes, painel, consoles e saídas de ar, restaurando o aspecto fosco de fábrica sem cheiro forte ou oleosidade.',
    idealFor: 'Cabines com manchas nos bancos, couro brilhante por acúmulo de gordura ou odores persistentes.',
    image: '/images/interior-care.jpg',
    imageAlt: 'Bancos em couro perfurado fosco e volante após higienização interna técnica',
    durationLabel: '1 dia útil',
    bayDaysMin: 1,
    bayDaysMax: 1,
    metrics: [
      { label: 'Acabamento em couro', value: 'Fosco e seco ao toque' },
      { label: 'Extração profunda', value: 'Baixa umidade residual' },
      { label: 'Sanitização', value: 'Dutos e cabine tratados' },
    ],
    deliverables: [
      'Aspiração detalhada de trilhos, porta-malas e junções do console',
      'Limpeza e hidratação não oleosa de bancos em couro ou extração em tecidos',
      'Higienização cuidadosa de forro de teto e cintos de segurança',
      'Proteção UV em painéis, telas e acabamentos internos',
    ],
  },
  {
    id: 'funilaria-pintura',
    title: 'Funilaria, Pintura e Martelinho',
    shortTitle: 'Funilaria e Pintura',
    summary:
      'Recuperação estrutural e estética de amassados, para-choques trincados, riscos profundos e repintura completa ou localizada com acerto de tonalidade e polimento de acabamento.',
    idealFor: 'Veículos com ralados de estacionamento, pequenas colisões ou necessidade de restauração de peças.',
    image: '/images/pintura-oficina.jpg',
    imageAlt: 'Técnico paramentado aplicando pintura automotiva em cabine iluminada',
    durationLabel: '2 a 6 dias úteis',
    bayDaysMin: 2,
    bayDaysMax: 5,
    metrics: [
      { label: 'Pequenos amassados', value: 'Martelinho sem repintura' },
      { label: 'Colorimetria', value: 'Acerto fino de tonalidade' },
      { label: 'Entrega final', value: 'Nivelamento e lustro' },
    ],
    deliverables: [
      'Avaliação presencial ou por fotos para definir recuperação ou troca',
      'Recuperação de para-choques, alinhamento de folgas e fixações',
      'Preparação com primer nivelador e pintura uniforme',
      'Polimento final de transição para integrar o brilho ao restante do carro',
    ],
  },
];

export const REAL_TRANSFORMATIONS: RealTransformation[] = [
  {
    id: 'lateral-prata',
    title: 'Remoção de riscos e recuperação lateral',
    vehicle: 'Hatchback prata metálico',
    service: 'Funilaria localizada, pintura e polimento técnico',
    summary:
      'Correção de arranhões profundos e marcas de transferência ao longo das duas portas laterais, com nivelamento de tonalidade e acabamento em alto brilho.',
    beforeImage: '/images/lateral-antes.jpg',
    afterImage: '/images/lateral-depois.jpg',
    beforeNote: 'Riscos transversais e desgaste nas portas esquerda e traseira',
    afterNote: 'Superfície alinhada, sem marcas e com reflexo contínuo das luminárias',
  },
  {
    id: 'frontal-gol',
    title: 'Recuperação frontal completa',
    vehicle: 'Volkswagen Gol prata',
    service: 'Funilaria, alinhamento, pintura e cristalização',
    summary:
      'Reconstrução de conjunto frontal após colisão: substituição de farol e grade, recuperação de capô, para-lama e para-choque, pintura e acabamento final.',
    beforeImage: '/images/recuperacao-antes.jpg',
    afterImage: '/images/recuperacao-depois.jpg',
    beforeNote: 'Capô dobrado, para-choque trincado e desalinhamento frontal',
    afterNote: 'Vãos alinhados de fábrica, pintura uniforme e conjunto óptico renovado',
  },
];

export const PAINT_PRESETS: PaintPreset[] = [
  {
    id: 'obsidian-black',
    name: 'Preto sólido',
    paintTone: '#111419',
    metallicTint: '#262f3c',
    beforeGloss: '71,4 GU',
    afterGloss: '97,2 GU',
    surfaceCondition: 'Teias circulares de lavagem e micro-hologramas sob luz direta',
  },
  {
    id: 'amber-graphite',
    name: 'Grafite metálico',
    paintTone: '#1d2128',
    metallicTint: '#485261',
    beforeGloss: '74,8 GU',
    afterGloss: '96,1 GU',
    surfaceCondition: 'Névoa superficial que apaga a profundidade dos flocos metálicos',
  },
  {
    id: 'deep-cobalt',
    name: 'Azul perolizado',
    paintTone: '#102138',
    metallicTint: '#26538d',
    beforeGloss: '76,2 GU',
    afterGloss: '96,8 GU',
    surfaceCondition: 'Marcas finas de secagem e oxidação leve por exposição solar',
  },
];

export const BAY_STAGES: BayStage[] = [
  {
    step: 1,
    title: 'Avaliação por fotos ou na loja',
    detail:
      'Você envia fotos pelo site ou WhatsApp, ou traz o carro à Rua Anagé, 617 para analisarmos pintura, lataria e definir o melhor protocolo.',
    instrument: 'Orçamento transparente',
  },
  {
    step: 2,
    title: 'Lavagem e descontaminação',
    detail:
      'Remoção segura de sujeira pesada, partículas ferrosas e contaminantes que comprometem o brilho ou a aderência da proteção.',
    instrument: 'Espuma pH neutro e clay bar',
  },
  {
    step: 3,
    title: 'Correção, reparo ou proteção',
    detail:
      'Execução dedicada do serviço escolhido: polimento técnico em estágios, cristalização, higienização de cabine ou funilaria e pintura.',
    instrument: 'Baia iluminada e controlada',
  },
  {
    step: 4,
    title: 'Inspeção sob luz e entrega',
    detail:
      'Conferência painel a painel com luminária de inspeção antes da liberação e orientações para conservar o resultado por mais tempo.',
    instrument: 'Check final LED',
  },
];

export const VEHICLE_SIZES: VehicleSizeOption[] = [
  {
    id: 'hatch-coupe',
    label: 'Hatch ou cupê',
    examples: 'Gol, Polo, Golf, Mini, Cupês',
    timeOffsetDays: 0,
  },
  {
    id: 'sedan',
    label: 'Sedã',
    examples: 'Onix Plus, Corolla, Civic, Série 3',
    timeOffsetDays: 0,
  },
  {
    id: 'suv',
    label: 'SUV ou crossover',
    examples: 'Compass, HR-V, Nivus, Tiggo, XC60',
    timeOffsetDays: 1,
  },
  {
    id: 'pickup',
    label: 'Picape ou utilitário',
    examples: 'Hilux, Toro, Ranger, S10',
    timeOffsetDays: 1,
  },
];

export const PAINT_CONDITIONS: PaintConditionOption[] = [
  {
    id: 'manutencao',
    label: 'Pintura conservada ou 0 km',
    description: 'Ideal para lavagem premium, cristalização imediata e proteção de cabine.',
    recommendedProtocolId: 'cristalizacao',
  },
  {
    id: 'teias-leves',
    label: 'Riscos finos e perda de brilho',
    description: 'Indica necessidade de polimento técnico antes da cristalização.',
    recommendedProtocolId: 'polimento-tecnico',
  },
  {
    id: 'danos-lataria',
    label: 'Riscos profundos, amassados ou batida',
    description: 'Requer avaliação de funilaria, martelinho ou pintura localizada.',
    recommendedProtocolId: 'funilaria-pintura',
  },
];

export const STUDIO_METRICS = [
  { value: '+500', label: 'Veículos atendidos na loja' },
  { value: '+10 anos', label: 'Experiência em estética e funilaria' },
  { value: '98%', label: 'Aprovação dos clientes' },
];

export const AVAILABLE_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-wa',
    question: 'Vocês fazem orçamento pelo WhatsApp?',
    answer:
      'Sim. Você pode enviar fotos do veículo e uma breve descrição pelo próprio formulário deste site ou direto pelo WhatsApp (11) 93462-4257. Caso precise de avaliação presencial, já combinamos o melhor horário.',
  },
  {
    id: 'faq-presencial',
    question: 'Preciso levar o carro até a Garagem 617 para fazer orçamento?',
    answer:
      'Nem sempre. Serviços de estética como lavagem premium, polimento técnico, higienização e cristalização, além de reparos simples, costumam ser pré-orçados por fotos. Danos estruturais ou amassados maiores têm confirmação exata na loja.',
  },
  {
    id: 'faq-prazo',
    question: 'Quanto tempo o carro fica na oficina?',
    answer:
      'Depende do protocolo. Lavagem premium e higienização interna costumam ser entregues no mesmo dia; polimento técnico e cristalização levam de 1 a 2 dias úteis; serviços de funilaria e pintura variam conforme a extensão do reparo.',
  },
  {
    id: 'faq-pintura',
    question: 'Vocês fazem pintura completa e reparos localizados?',
    answer:
      'Sim. Executamos desde retoques e recuperação de para-choques até pintura completa, com acerto de tonalidade e polimento de acabamento integrado.',
  },
  {
    id: 'faq-agendamento',
    question: 'Preciso agendar antes de levar o veículo?',
    answer:
      'Recomendamos o agendamento prévio para garantir sua vaga na baia e atendimento imediato no horário marcado, inclusive aos sábados pela manhã.',
  },
];
