import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Camera, Check, Info, MessageCircle, X } from 'lucide-react';
import {
  AVAILABLE_SLOTS,
  buildWhatsAppUrl,
  PAINT_CONDITIONS,
  STUDIO_PROTOCOLS,
  VEHICLE_SIZES,
} from '../data/studioData';
import styles from './QuoteBuilder.module.css';

interface QuoteBuilderProps {
  selectedProtocolIds: string[];
  onToggleProtocol: (id: string) => void;
  onSelectProtocol: (id: string) => void;
}

interface PhotoPreview {
  id: string;
  name: string;
  url: string;
}

function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateBr(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function QuoteBuilder({
  selectedProtocolIds,
  onToggleProtocol,
  onSelectProtocol,
}: QuoteBuilderProps) {
  const [requestMode, setRequestMode] = useState<'booking' | 'quote'>('booking');
  const [vehicleSizeId, setVehicleSizeId] = useState(VEHICLE_SIZES[0].id);
  const [paintConditionId, setPaintConditionId] = useState(PAINT_CONDITIONS[1].id);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const photosRef = useRef<PhotoPreview[]>([]);
  const [photoFeedback, setPhotoFeedback] = useState('');
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const todayIso = useMemo(() => getTodayIso(), []);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const vehicleSize =
    VEHICLE_SIZES.find((item) => item.id === vehicleSizeId) ?? VEHICLE_SIZES[0];
  const paintCondition =
    PAINT_CONDITIONS.find((item) => item.id === paintConditionId) ?? PAINT_CONDITIONS[0];

  const selectedProtocols = useMemo(
    () => STUDIO_PROTOCOLS.filter((item) => selectedProtocolIds.includes(item.id)),
    [selectedProtocolIds]
  );

  const isSunday = useMemo(() => {
    if (!preferredDate) return false;
    const [y, m, d] = preferredDate.split('-').map(Number);
    return new Date(y, m - 1, d).getDay() === 0;
  }, [preferredDate]);

  const isSaturday = useMemo(() => {
    if (!preferredDate) return false;
    const [y, m, d] = preferredDate.split('-').map(Number);
    return new Date(y, m - 1, d).getDay() === 6;
  }, [preferredDate]);

  const slotsForDate = useMemo(() => {
    if (!preferredDate || isSunday) return [];
    const base = isSaturday
      ? AVAILABLE_SLOTS.filter((slot) => Number(slot.slice(0, 2)) <= 11)
      : AVAILABLE_SLOTS;

    if (preferredDate !== todayIso) return base;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30;
    return base.filter((slot) => {
      const slotMinutes = Number(slot.slice(0, 2)) * 60 + Number(slot.slice(3, 5));
      return slotMinutes > currentMinutes;
    });
  }, [isSaturday, isSunday, preferredDate, todayIso]);

  const bayDuration = useMemo(() => {
    if (selectedProtocols.length === 0) {
      return { daysMin: 0, daysMax: 0 };
    }

    const rawDaysMin = selectedProtocols.reduce((acc, item) => acc + item.bayDaysMin, 0);
    const rawDaysMax = selectedProtocols.reduce((acc, item) => acc + item.bayDaysMax, 0);

    return {
      daysMin: Math.max(
        1,
        Math.min(7, rawDaysMin + vehicleSize.timeOffsetDays - (selectedProtocols.length > 1 ? 1 : 0))
      ),
      daysMax: Math.max(
        1,
        Math.min(9, rawDaysMax + vehicleSize.timeOffsetDays - (selectedProtocols.length > 1 ? 1 : 0))
      ),
    };
  }, [selectedProtocols, vehicleSize.timeOffsetDays]);

  const showTip = !selectedProtocolIds.includes(paintCondition.recommendedProtocolId);
  const recommendedService = STUDIO_PROTOCOLS.find(
    (item) => item.id === paintCondition.recommendedProtocolId
  );

  const handlePhotoChange = (files: FileList | null) => {
    if (!files) return;
    setPhotoFeedback('');
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const nextPhotos: PhotoPreview[] = [];

    for (const file of Array.from(files)) {
      if (photos.length + nextPhotos.length >= 6) {
        setPhotoFeedback('Limite de 6 fotos por solicitação.');
        break;
      }
      if (!allowedTypes.includes(file.type)) {
        setPhotoFeedback('Envie imagens no formato JPG, PNG ou WEBP.');
        continue;
      }
      if (file.size > 12 * 1024 * 1024) {
        setPhotoFeedback('Cada imagem deve ter até 12 MB.');
        continue;
      }
      nextPhotos.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }

    if (nextPhotos.length > 0) {
      setPhotos((prev) => [...prev, ...nextPhotos]);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedProtocols.length === 0) {
      setFormError('Marque ao menos um serviço para gerar o resumo do orçamento.');
      return;
    }

    if (requestMode === 'booking') {
      if (!preferredDate || isSunday) {
        setFormError('Escolha uma data válida de segunda a sábado para o agendamento.');
        return;
      }
      if (!preferredSlot) {
        setFormError('Selecione um dos horários disponíveis para o dia escolhido.');
        return;
      }
    }

    if (!customerName.trim() || !vehicleModel.trim() || !whatsapp.trim()) {
      setFormError('Preencha seu nome, veículo (marca/modelo/ano) e número de WhatsApp.');
      return;
    }

    setFormError('');
    setSubmitted(true);
  };

  const whatsAppSummaryHref = useMemo(() => {
    const servicesText = selectedProtocols.map((item) => item.shortTitle).join(', ');
    const schedulePart =
      requestMode === 'booking' && preferredDate && preferredSlot
        ? ` Data desejada: ${formatDateBr(preferredDate)} às ${preferredSlot}.`
        : ' Solicitação de orçamento prévio por fotos.';
    const notesPart = notes.trim() ? ` Observações: ${notes.trim()}.` : '';
    const photoPart =
      photos.length > 0
        ? ` Separei ${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'} para enviar na sequência.`
        : '';

    return buildWhatsAppUrl(
      `Olá, Garagem 617! Sou ${customerName.trim()}. Veículo: ${vehicleModel.trim()} (${vehicleSize.label}). Serviços: ${servicesText}. Estado: ${paintCondition.label}.${schedulePart}${notesPart}${photoPart}`
    );
  }, [
    customerName,
    notes,
    paintCondition.label,
    photos.length,
    preferredDate,
    preferredSlot,
    requestMode,
    selectedProtocols,
    vehicleModel,
    vehicleSize.label,
  ]);

  return (
    <section id="orcamento" className={styles.section} aria-labelledby="quote-title">
      <div className="container">
        <div className={styles.topHeader}>
          <div className={styles.headerBlock}>
            <h2 id="quote-title" className={styles.title}>
              Orçamento e agendamento online
            </h2>
            <p className={styles.lead}>
              Selecione os serviços desejados, escolha um horário na Rua Anagé, 617 ou anexe fotos
              do veículo para fechar seu orçamento direto pelo WhatsApp da Garagem 617.
            </p>
          </div>

          <div className={styles.modeSwitch} role="group" aria-label="Modalidade de atendimento">
            <button
              type="button"
              aria-pressed={requestMode === 'booking'}
              className={`${styles.modeButton} ${
                requestMode === 'booking' ? styles.modeButtonActive : ''
              }`}
              onClick={() => {
                setRequestMode('booking');
                setSubmitted(false);
              }}
            >
              <Calendar size={16} strokeWidth={2} aria-hidden="true" />
              <span>Agendar horário na loja</span>
            </button>
            <button
              type="button"
              aria-pressed={requestMode === 'quote'}
              className={`${styles.modeButton} ${
                requestMode === 'quote' ? styles.modeButtonActive : ''
              }`}
              onClick={() => {
                setRequestMode('quote');
                setSubmitted(false);
              }}
            >
              <Camera size={16} strokeWidth={2} aria-hidden="true" />
              <span>Orçamento por fotos</span>
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.configColumn}>
            <fieldset className={styles.group}>
              <legend className={styles.groupTitle}>1. Porte do veículo</legend>
              <div className={styles.optionGrid}>
                {VEHICLE_SIZES.map((item) => {
                  const selected = item.id === vehicleSize.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      className={`${styles.choiceTile} ${selected ? styles.choiceTileActive : ''}`}
                      onClick={() => {
                        setVehicleSizeId(item.id);
                        setSubmitted(false);
                      }}
                    >
                      <span className={styles.choiceTitle}>{item.label}</span>
                      <span className={styles.choiceSub}>{item.examples}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.groupTitle}>2. Situação atual da pintura ou lataria</legend>
              <div className={styles.stackList}>
                {PAINT_CONDITIONS.map((condition) => {
                  const selected = condition.id === paintCondition.id;
                  return (
                    <button
                      key={condition.id}
                      type="button"
                      aria-pressed={selected}
                      className={`${styles.conditionRow} ${
                        selected ? styles.conditionRowActive : ''
                      }`}
                      onClick={() => {
                        setPaintConditionId(condition.id);
                        setSubmitted(false);
                      }}
                    >
                      <span className={styles.radioDot} aria-hidden="true">
                        {selected && <span className={styles.radioInner} />}
                      </span>
                      <span className={styles.conditionBody}>
                        <span className={styles.choiceTitle}>{condition.label}</span>
                        <span className={styles.choiceSub}>{condition.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {showTip && recommendedService && (
                <div className={styles.advisory} role="note">
                  <Info size={16} strokeWidth={2} className={styles.advisoryIcon} aria-hidden="true" />
                  <div className={styles.advisoryContent}>
                    <span>
                      Para essa condição, sugerimos incluir{' '}
                      <strong>{recommendedService.title}</strong> na avaliação.
                    </span>
                    <button
                      type="button"
                      className={styles.advisoryAction}
                      onClick={() => onSelectProtocol(recommendedService.id)}
                    >
                      Incluir {recommendedService.shortTitle}
                    </button>
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className={styles.group}>
              <legend className={styles.groupTitle}>3. Serviços desejados</legend>
              <div className={styles.stackList}>
                {STUDIO_PROTOCOLS.map((protocol) => {
                  const selected = selectedProtocolIds.includes(protocol.id);

                  return (
                    <button
                      key={protocol.id}
                      type="button"
                      aria-pressed={selected}
                      className={`${styles.protocolRow} ${selected ? styles.protocolRowActive : ''}`}
                      onClick={() => {
                        onToggleProtocol(protocol.id);
                        setSubmitted(false);
                      }}
                    >
                      <span className={styles.checkboxBox} aria-hidden="true">
                        {selected && <Check size={14} strokeWidth={2.5} />}
                      </span>
                      <span className={styles.protocolInfo}>
                        <span className={styles.choiceTitle}>{protocol.title}</span>
                        <span className={styles.choiceSub}>{protocol.idealFor}</span>
                      </span>
                      <span className={`${styles.protocolDuration} tabular`}>
                        {protocol.durationLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {requestMode === 'booking' && (
              <fieldset className={styles.group}>
                <legend className={styles.groupTitle}>4. Data e horário preferido</legend>
                <div className={styles.scheduleGrid}>
                  <div className={styles.field}>
                    <label htmlFor="preferred-date" className={styles.label}>
                      Data desejada
                    </label>
                    <input
                      id="preferred-date"
                      type="date"
                      min={todayIso}
                      value={preferredDate}
                      onChange={(e) => {
                        setPreferredDate(e.target.value);
                        setPreferredSlot('');
                        setSubmitted(false);
                      }}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>Horário de entrada</span>
                    {!preferredDate ? (
                      <p className={styles.slotHint}>Selecione uma data para ver os horários.</p>
                    ) : isSunday ? (
                      <p className={styles.slotHint}>
                        Aos domingos a Garagem 617 está fechada. Escolha entre segunda e sábado.
                      </p>
                    ) : slotsForDate.length === 0 ? (
                      <p className={styles.slotHint}>
                        Sem horários restantes hoje. Escolha a partir do próximo dia útil.
                      </p>
                    ) : (
                      <div className={styles.slotGrid} role="radiogroup" aria-label="Horários">
                        {slotsForDate.map((slot) => {
                          const picked = slot === preferredSlot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              role="radio"
                              aria-checked={picked}
                              className={`${styles.slotChip} ${
                                picked ? styles.slotChipActive : ''
                              } tabular`}
                              onClick={() => {
                                setPreferredSlot(slot);
                                setSubmitted(false);
                              }}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            )}
          </div>

          <div className={styles.summaryColumn}>
            <div className={styles.summaryPanel}>
              <div className={styles.estimateHeader}>
                <h3 className={styles.summaryTitle}>Resumo do pedido</h3>
                <p className={styles.summarySub}>
                  {vehicleSize.label}, {paintCondition.label.toLowerCase()}
                </p>
              </div>

              {selectedProtocols.length > 0 ? (
                <div className={styles.estimateBody}>
                  <div className={styles.estimateMetric}>
                    <span className={styles.estimateLabel}>Atendimento e orçamento</span>
                    <strong className={styles.estimateStatus}>
                      Orçamento personalizado pelo WhatsApp
                    </strong>
                  </div>
                  <div className={styles.estimateRow}>
                    <span>Tempo médio em baia</span>
                    <strong className="tabular">
                      {bayDuration.daysMin === bayDuration.daysMax
                        ? bayDuration.daysMin === 1
                          ? '1 dia útil'
                          : `${bayDuration.daysMin} dias úteis`
                        : `${bayDuration.daysMin} a ${bayDuration.daysMax} dias úteis`}
                    </strong>
                  </div>
                  <div className={styles.selectedPills}>
                    {selectedProtocols.map((item) => (
                      <span key={item.id} className={styles.selectedTag}>
                        {item.shortTitle}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.emptyEstimate}>
                  Selecione um ou mais serviços ao lado para estimar o prazo e enviar sua
                  solicitação pelo WhatsApp.
                </div>
              )}

              {submitted ? (
                <div className={styles.confirmationBox} role="status" aria-live="polite">
                  <div className={styles.confirmationBadge}>
                    <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                    <span>Pedido pronto para envio</span>
                  </div>
                  <h4 className={styles.confirmationTitle}>
                    {requestMode === 'booking' && preferredDate
                      ? `Pré-agendamento para ${formatDateBr(preferredDate)} às ${preferredSlot}`
                      : `Solicitação preparada para ${vehicleModel}`}
                  </h4>
                  <p className={styles.confirmationCopy}>
                    Confira abaixo ou envie agora diretamente para o WhatsApp da Garagem 617 (
                    {whatsapp}) com todos os serviços já preenchidos.
                    {photos.length > 0 &&
                      ` Você anexou ${photos.length} ${photos.length === 1 ? 'foto' : 'fotos'} de referência para enviar na conversa.`}
                  </p>

                  <a
                    href={whatsAppSummaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waSubmitButton}
                  >
                    <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                    <span>Enviar resumo no WhatsApp da Garagem 617</span>
                  </a>

                  <button
                    type="button"
                    className={styles.resetButton}
                    onClick={() => setSubmitted(false)}
                  >
                    Alterar serviços ou dados
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.field}>
                    <label htmlFor="customer-name" className={styles.label}>
                      Nome completo
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      className={styles.input}
                      placeholder="Ex.: Rafael Nogueira"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="vehicle-model" className={styles.label}>
                      Veículo (marca, modelo e ano)
                    </label>
                    <input
                      id="vehicle-model"
                      type="text"
                      className={styles.input}
                      placeholder="Ex.: VW Polo 2023 ou Honda Civic 2021"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="whatsapp-number" className={styles.label}>
                      WhatsApp para retorno
                    </label>
                    <input
                      id="whatsapp-number"
                      type="tel"
                      className={styles.input}
                      placeholder="(11) 99999-0000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>Fotos do veículo (até 6 imagens, opcional)</span>
                    <label className={styles.photoDrop}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        hidden
                        onChange={(e) => {
                          handlePhotoChange(e.target.files);
                          e.target.value = '';
                        }}
                      />
                      <Camera size={18} strokeWidth={1.8} aria-hidden="true" />
                      <span>Selecionar fotos do carro ou dano</span>
                    </label>
                    {photoFeedback && <p className={styles.photoNote}>{photoFeedback}</p>}

                    {photos.length > 0 && (
                      <div className={styles.thumbGrid}>
                        {photos.map((photo) => (
                          <div key={photo.id} className={styles.thumbItem}>
                            <img src={photo.url} alt={photo.name} className={styles.thumbImg} />
                            <button
                              type="button"
                              className={styles.thumbRemove}
                              aria-label={`Remover foto ${photo.name}`}
                              onClick={() => removePhoto(photo.id)}
                            >
                              <X size={13} strokeWidth={2.5} aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="notes" className={styles.label}>
                      Detalhes do serviço ou dúvida (opcional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className={styles.textarea}
                      placeholder="Conte se há riscos específicos, amassado no para-choque ou preferência de entrega."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {formError && (
                    <p className={styles.errorMessage} role="alert">
                      {formError}
                    </p>
                  )}

                  <button type="submit" className={styles.submitButton}>
                    {requestMode === 'booking'
                      ? 'Confirmar pré-agendamento'
                      : 'Gerar resumo de orçamento'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
