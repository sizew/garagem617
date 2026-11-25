import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { buildWhatsAppUrl, STUDIO_PROTOCOLS } from '../data/studioData';
import styles from './ProtocolExplorer.module.css';

interface ProtocolExplorerProps {
  selectedProtocolIds: string[];
  onToggleProtocol: (id: string) => void;
  onJumpToQuote: () => void;
}

export function ProtocolExplorer({
  selectedProtocolIds,
  onToggleProtocol,
  onJumpToQuote,
}: ProtocolExplorerProps) {
  const [activeId, setActiveId] = useState(STUDIO_PROTOCOLS[0].id);

  const activeProtocol =
    STUDIO_PROTOCOLS.find((protocol) => protocol.id === activeId) ?? STUDIO_PROTOCOLS[0];
  const isIncludedInQuote = selectedProtocolIds.includes(activeProtocol.id);

  const serviceWaHref = buildWhatsAppUrl(
    `Olá, vim pelo site da Garagem 617 e gostaria de um orçamento para ${activeProtocol.title}.`
  );

  return (
    <section id="servicos" className={styles.section} aria-labelledby="protocols-title">
      <div className="container">
        <div className={styles.headerBlock}>
          <h2 id="protocols-title" className={styles.title}>
            Serviços de estética e reparação
          </h2>
          <p className={styles.lead}>
            Os quatro pilares da fachada da Garagem 617 unidos à nossa estrutura completa de
            funilaria e pintura. Escolha um protocolo para conferir escopo, prazo e incluir no
            orçamento.
          </p>
        </div>

        <div className={styles.explorerGrid}>
          <div className={styles.selectorRail} role="tablist" aria-label="Lista de serviços">
            {STUDIO_PROTOCOLS.map((protocol) => {
              const isActive = protocol.id === activeProtocol.id;
              const isSelected = selectedProtocolIds.includes(protocol.id);

              return (
                <button
                  key={protocol.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.railItem} ${isActive ? styles.railItemActive : ''}`}
                  onClick={() => setActiveId(protocol.id)}
                >
                  <div className={styles.railTop}>
                    <span className={styles.railTitle}>{protocol.title}</span>
                    {isSelected && <span className={styles.includedBadge}>Selecionado</span>}
                  </div>
                  <span className={`${styles.railMeta} tabular`}>{protocol.durationLabel}</span>
                </button>
              );
            })}
          </div>

          <article
            key={activeProtocol.id}
            className={styles.detailStage}
            role="tabpanel"
            aria-label={activeProtocol.title}
          >
            <div className={styles.mediaWrap}>
              <img
                src={activeProtocol.image}
                alt={activeProtocol.imageAlt}
                className={`${styles.detailImage} ${
                  activeProtocol.id === 'higienizacao-interna' ? styles.interiorCrop : ''
                }`}
                width={1200}
                height={720}
              />
            </div>

            <div className={styles.detailBody}>
              <div>
                <h3 className={styles.detailTitle}>{activeProtocol.title}</h3>
                <p className={styles.detailSummary}>{activeProtocol.summary}</p>
              </div>

              <div className={styles.idealBox}>
                <span className={styles.idealLabel}>Indicação principal</span>
                <p className={styles.idealText}>{activeProtocol.idealFor}</p>
              </div>

              <dl className={styles.metricsRow}>
                {activeProtocol.metrics.map((metric) => (
                  <div key={metric.label} className={styles.metricCell}>
                    <dt className={styles.metricLabel}>{metric.label}</dt>
                    <dd className={`${styles.metricValue} tabular`}>{metric.value}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <h4 className={styles.deliverablesHeading}>O que é executado no veículo</h4>
                <ul className={styles.deliverablesList}>
                  {activeProtocol.deliverables.map((item) => (
                    <li key={item} className={styles.deliverableItem}>
                      <Check size={16} strokeWidth={2.2} className={styles.checkIcon} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.actionFooter}>
                <button
                  type="button"
                  className={`${styles.includeButton} ${
                    isIncludedInQuote ? styles.includeButtonSelected : ''
                  }`}
                  onClick={() => onToggleProtocol(activeProtocol.id)}
                >
                  {isIncludedInQuote ? (
                    <>
                      <Check size={17} strokeWidth={2.2} aria-hidden="true" />
                      <span>Incluído no orçamento</span>
                    </>
                  ) : (
                    <>
                      <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
                      <span>Incluir no orçamento</span>
                    </>
                  )}
                </button>

                <button type="button" className={styles.goQuoteLink} onClick={onJumpToQuote}>
                  Finalizar orçamento e agenda
                </button>

                <a
                  href={serviceWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waInlineLink}
                >
                  Orçar este serviço no WhatsApp
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
