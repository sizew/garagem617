import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS, STUDIO_METRICS } from '../data/studioData';
import styles from './StudioAboutFaq.module.css';

export function StudioAboutFaq() {
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <section id="estrutura" className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.aboutColumn}>
          <h2 id="about-title" className={styles.title}>
            Conheça a Garagem 617
          </h2>
          <p className={styles.copy}>
            A Garagem 617 nasceu no Jardim Presidente Dutra, em Guarulhos, para unir estética
            automotiva de detalhe e reparação de lataria com o mesmo cuidado dedicado a carros de
            coleção. Trabalhamos com transparência na avaliação, produtos profissionais e foco total
            no acabamento final.
          </p>

          <dl className={styles.metricsRow}>
            {STUDIO_METRICS.map((item) => (
              <div key={item.label} className={styles.metricItem}>
                <dt className={`${styles.metricValue} tabular`}>{item.value}</dt>
                <dd className={styles.metricLabel}>{item.label}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.galleryPair}>
            <figure className={styles.photoCard}>
              <img
                src="/images/estetica-guarulhos.jpg"
                alt="Área de vitrificação e polimento técnico da Garagem 617 em Guarulhos"
                className={styles.photo}
                width={1200}
                height={675}
                loading="lazy"
              />
              <figcaption className={styles.photoCaption}>
                Área dedicada a vitrificação, polimento e conferência sob iluminação hexagonal.
              </figcaption>
            </figure>
            <figure className={styles.photoCard}>
              <img
                src="/images/polimento-guarulhos.jpg"
                alt="Polimento técnico em hatchback cinza com luminária portátil de inspeção"
                className={styles.photo}
                width={1200}
                height={675}
                loading="lazy"
              />
              <figcaption className={styles.photoCaption}>
                Correção de verniz painel a painel com controle de calor e inspeção LED.
              </figcaption>
            </figure>
          </div>
        </div>

        <div className={styles.faqColumn}>
          <h3 className={styles.faqTitle}>Perguntas frequentes</h3>
          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={styles.faqItem}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className={styles.faqTrigger}
                    onClick={() => setOpenId(isOpen ? '' : item.id)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && <p className={styles.faqAnswer}>{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
