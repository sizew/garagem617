import { BAY_STAGES } from '../data/studioData';
import styles from './ProcessSequence.module.css';

export function ProcessSequence() {
  return (
    <section id="processo" className={styles.section} aria-labelledby="process-title">
      <div className="container">
        <div className={styles.header}>
          <h2 id="process-title" className={styles.title}>
            Como funciona o atendimento na oficina
          </h2>
          <p className={styles.lead}>
            Do primeiro orçamento até a conferência sob luz de entrega, cada carro passa por etapas
            definidas para preservar o verniz e evitar retrabalho.
          </p>
        </div>

        <ol className={styles.sequenceGrid}>
          {BAY_STAGES.map((stage) => (
            <li key={stage.step} className={styles.stageItem}>
              <div className={styles.stageHeader}>
                <span className={`${styles.stepBadge} tabular`}>{stage.step}</span>
                <span className={styles.instrument}>{stage.instrument}</span>
              </div>
              <h3 className={styles.stageTitle}>{stage.title}</h3>
              <p className={styles.stageDetail}>{stage.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
