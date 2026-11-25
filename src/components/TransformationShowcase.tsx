import { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { PAINT_PRESETS, REAL_TRANSFORMATIONS } from '../data/studioData';
import styles from './TransformationShowcase.module.css';

interface TransformationShowcaseProps {
  onRequestQuote: () => void;
}

type ShowcaseMode = 'lateral-prata' | 'frontal-gol' | 'simulador-optico';

export function TransformationShowcase({ onRequestQuote }: TransformationShowcaseProps) {
  const [mode, setMode] = useState<ShowcaseMode>('lateral-prata');
  const [presetId, setPresetId] = useState(PAINT_PRESETS[0].id);
  const [splitPercent, setSplitPercent] = useState(50);
  const [lampPosition, setLampPosition] = useState({ x: 54, y: 44 });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const realCase = REAL_TRANSFORMATIONS.find((item) => item.id === mode);
  const preset = PAINT_PRESETS.find((item) => item.id === presetId) ?? PAINT_PRESETS[0];

  const updateSplitFromClientX = (clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(94, Math.max(6, raw));
    setSplitPercent(Math.round(clamped));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.min(82, Math.max(18, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(78, Math.max(22, ((e.clientY - rect.top) / rect.height) * 100));
    setLampPosition({ x, y });

    if (draggingRef.current) {
      updateSplitFromClientX(e.clientX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSplitFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitPercent((prev) => Math.max(6, prev - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitPercent((prev) => Math.min(94, prev + 4));
    }
  };

  return (
    <section id="transformacao" className={styles.section} aria-labelledby="transform-title">
      <div className="container">
        <div className={styles.topRow}>
          <div className={styles.intro}>
            <h2 id="transform-title" className={styles.title}>
              Resultados reais e inspeção óptica
            </h2>
            <p className={styles.subtitle}>
              Arraste o divisor para comparar carros recuperados na Garagem 617 ou teste o simulador
              de brilho sob luz direcionada de polimento.
            </p>
          </div>

          <div className={styles.tabGroup} role="tablist" aria-label="Comparações disponíveis">
            {REAL_TRANSFORMATIONS.map((item) => {
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
                  onClick={() => {
                    setMode(item.id as ShowcaseMode);
                    setSplitPercent(50);
                  }}
                >
                  {item.title}
                </button>
              );
            })}
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'simulador-optico'}
              className={`${styles.tabButton} ${
                mode === 'simulador-optico' ? styles.tabButtonActive : ''
              }`}
              onClick={() => {
                setMode('simulador-optico');
                setSplitPercent(52);
              }}
            >
              Simulador de polimento LED
            </button>
          </div>
        </div>

        <div className={styles.workspaceGrid}>
          <div className={styles.stageColumn}>
            <div
              ref={stageRef}
              className={styles.stage}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {realCase ? (
                <>
                  <img
                    src={realCase.afterImage}
                    alt={`${realCase.title} após serviço na Garagem 617`}
                    className={styles.stagePhoto}
                    draggable={false}
                  />
                  <div
                    className={styles.clippedBefore}
                    style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
                  >
                    <img
                      src={realCase.beforeImage}
                      alt={`${realCase.title} antes do serviço`}
                      className={styles.stagePhoto}
                      draggable={false}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={styles.panelCorrected}
                    style={{
                      background: `radial-gradient(circle at ${lampPosition.x}% ${lampPosition.y}%, ${preset.metallicTint} 0%, ${preset.paintTone} 54%, #0b0d11 100%)`,
                    }}
                  >
                    <div
                      className={styles.studioBarReflection}
                      style={{
                        transform: `translate(${(lampPosition.x - 50) * 0.25}px, ${(lampPosition.y - 50) * 0.18}px) rotate(-14deg)`,
                      }}
                    />
                    <div
                      className={styles.studioBarSecondary}
                      style={{
                        transform: `translate(${(lampPosition.x - 50) * 0.2}px, ${(lampPosition.y - 50) * 0.14}px) rotate(-14deg)`,
                      }}
                    />
                    <div
                      className={styles.specularCore}
                      style={{ left: `${lampPosition.x}%`, top: `${lampPosition.y}%` }}
                    />
                  </div>

                  <div
                    className={styles.clippedBefore}
                    style={{
                      clipPath: `inset(0 ${100 - splitPercent}% 0 0)`,
                      background: `radial-gradient(circle at ${lampPosition.x}% ${lampPosition.y}%, #4a515d 0%, ${preset.paintTone} 52%, #0e1116 100%)`,
                    }}
                  >
                    <div
                      className={styles.diffusedBarReflection}
                      style={{
                        transform: `translate(${(lampPosition.x - 50) * 0.25}px, ${(lampPosition.y - 50) * 0.18}px) rotate(-14deg)`,
                      }}
                    />
                    <svg
                      className={styles.swirlLayer}
                      viewBox="0 0 800 480"
                      preserveAspectRatio="xMidYMid slice"
                      aria-hidden="true"
                    >
                      <g
                        fill="none"
                        stroke="rgba(255, 240, 200, 0.36)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      >
                        <circle cx="420" cy="215" r="32" strokeDasharray="18 11 24 14" />
                        <circle cx="420" cy="215" r="54" strokeDasharray="28 16 14 19" />
                        <circle cx="420" cy="215" r="82" strokeDasharray="42 20 18 22" />
                        <circle cx="420" cy="215" r="114" strokeDasharray="36 28 24 24" />
                        <circle cx="420" cy="215" r="148" strokeDasharray="48 34 22 30" />
                        <circle cx="240" cy="180" r="46" strokeDasharray="20 15 16 18" />
                        <circle cx="240" cy="180" r="76" strokeDasharray="30 22 20 24" />
                        <circle cx="575" cy="265" r="42" strokeDasharray="22 14 16 18" />
                        <path d="M120 130 C210 150, 290 110, 390 140" opacity="0.55" />
                        <path d="M150 280 C250 240, 340 290, 480 250" opacity="0.5" />
                        <path d="M290 95 C380 145, 450 90, 560 135" opacity="0.45" />
                      </g>
                    </svg>
                    <div className={styles.hazeOverlay} />
                  </div>
                </>
              )}

              <span
                className={`${styles.sideLabelLeft} ${splitPercent < 20 ? styles.sideLabelHidden : ''}`}
              >
                Antes
              </span>
              <span
                className={`${styles.sideLabelRight} ${splitPercent > 80 ? styles.sideLabelHidden : ''}`}
              >
                Depois
              </span>

              <div
                className={styles.divider}
                style={{ left: `${splitPercent}%` }}
                role="slider"
                tabIndex={0}
                aria-label="Posição da comparação antes e depois"
                aria-valuemin={6}
                aria-valuemax={94}
                aria-valuenow={splitPercent}
                onKeyDown={handleSliderKeyDown}
              >
                <span className={styles.dividerKnob}>
                  <MoveHorizontal size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <aside className={styles.infoPanel}>
            {realCase ? (
              <>
                <span className={styles.serviceTag}>{realCase.service}</span>
                <h3 className={styles.infoTitle}>{realCase.title}</h3>
                <p className={styles.vehicleLabel}>{realCase.vehicle}</p>
                <p className={styles.infoSummary}>{realCase.summary}</p>

                <div className={styles.compareNotes}>
                  <div className={styles.noteBox}>
                    <span className={styles.noteHeading}>Entrada na oficina</span>
                    <p className={styles.noteText}>{realCase.beforeNote}</p>
                  </div>
                  <div className={`${styles.noteBox} ${styles.noteBoxAfter}`}>
                    <span className={styles.noteHeading}>Entrega final</span>
                    <p className={styles.noteText}>{realCase.afterNote}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className={styles.serviceTag}>Simulação de inspeção LED</span>
                <h3 className={styles.infoTitle}>Correção de verniz e cristalização</h3>
                <p className={styles.infoSummary}>
                  Mova o cursor sobre a pintura para observar o efeito da luz direcionada sobre
                  marcas de lavagem versus verniz polido.
                </p>

                <div className={styles.presetRow} role="group" aria-label="Cor simulada">
                  {PAINT_PRESETS.map((item) => {
                    const selected = item.id === preset.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={selected}
                        className={`${styles.presetChip} ${
                          selected ? styles.presetChipActive : ''
                        }`}
                        onClick={() => setPresetId(item.id)}
                      >
                        <span
                          className={styles.presetSwatch}
                          style={{ backgroundColor: item.metallicTint }}
                          aria-hidden="true"
                        />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.compareNotes}>
                  <div className={styles.noteBox}>
                    <span className={styles.noteHeading}>Sem correção</span>
                    <p className={`${styles.noteText} tabular`}>
                      Brilho {preset.beforeGloss}. {preset.surfaceCondition}.
                    </p>
                  </div>
                  <div className={`${styles.noteBox} ${styles.noteBoxAfter}`}>
                    <span className={styles.noteHeading}>Pós-polimento técnico</span>
                    <p className={`${styles.noteText} tabular`}>
                      Brilho {preset.afterGloss} com reflexo contínuo das barras de LED.
                    </p>
                  </div>
                </div>
              </>
            )}

            <button type="button" className={styles.panelAction} onClick={onRequestQuote}>
              Solicitar avaliação para meu veículo
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
