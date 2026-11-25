import { buildWhatsAppUrl } from '../data/studioData';
import styles from './Hero.module.css';

interface HeroProps {
  onExploreServices: () => void;
  onRequestQuote: () => void;
}

const CORE_PILLARS = [
  {
    name: 'Lavagem Premium',
    note: 'Espuma neutra, detalhamento de rodas e proteção sem atrito',
  },
  {
    name: 'Polimento Técnico',
    note: 'Remoção de riscos e hologramas sob luz de inspeção',
  },
  {
    name: 'Cristalização e Cabine',
    note: 'Proteção de pintura, higienização interna, funilaria e pintura',
  },
];

export function Hero({ onExploreServices, onRequestQuote }: HeroProps) {
  const waHref = buildWhatsAppUrl(
    'Olá, vim pelo site da Garagem 617 e gostaria de solicitar um orçamento para meu carro.'
  );

  return (
    <section id="topo" className={styles.hero}>
      <div className={styles.accentLines} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copyColumn}>
          <p className={`${styles.location} hero-reveal`}>
            Rua Anagé, 617, Jardim Presidente Dutra, Guarulhos
          </p>

          <h1 className={`${styles.headline} hero-reveal-delay-1`}>
            Estética automotiva, polimento técnico e funilaria com acabamento de estúdio
          </h1>

          <p className={`${styles.lead} hero-reveal-delay-1`}>
            Seu carro tratado nos mínimos detalhes na Garagem 617: lavagem premium, polimento
            técnico, cristalização, higienização interna e recuperação completa de lataria e pintura.
          </p>

          <div className={`${styles.actions} hero-reveal-delay-2`}>
            <button type="button" className={styles.primaryAction} onClick={onRequestQuote}>
              Solicitar orçamento e agendar
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryAction}
            >
              Chamar no WhatsApp
            </a>
            <button type="button" className={styles.textAction} onClick={onExploreServices}>
              Ver protocolos de serviço
            </button>
          </div>

          <dl className={`${styles.pillarStrip} hero-reveal-delay-2`}>
            {CORE_PILLARS.map((pillar) => (
              <div key={pillar.name} className={styles.pillarItem}>
                <dt className={styles.pillarTitle}>{pillar.name}</dt>
                <dd className={styles.pillarNote}>{pillar.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={`${styles.mediaColumn} hero-reveal-delay-1`}>
          <figure className={styles.figure}>
            <div className={styles.imageFrame}>
              <img
                src="/images/fachada-garagem-617.jpg"
                alt="Fachada oficial da Garagem 617 Estética Automotiva com portão preto e amarelo listando Lavagem Premium, Polimento Técnico, Cristalização e Higienização Interna"
                className={styles.heroImage}
                width={1200}
                height={900}
              />
            </div>
            <figcaption className={styles.caption}>
              Fachada da Garagem 617 em Guarulhos, atendendo de segunda a sábado com hora marcada e
              orçamento por fotos.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
