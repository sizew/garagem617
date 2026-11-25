import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { buildWhatsAppUrl, GARAGE_CONTACT } from '../data/studioData';
import styles from './Footer.module.css';

export function Footer() {
  const mapQuery = encodeURIComponent(GARAGE_CONTACT.address);
  const waHref = buildWhatsAppUrl(
    'Olá, vim pelo site da Garagem 617 e gostaria de tirar uma dúvida sobre atendimento.'
  );

  return (
    <footer id="contato" className={styles.footer}>
      <div className="container">
        <div className={styles.locationBand}>
          <div className={styles.locationInfo}>
            <h2 className={styles.locationTitle}>Onde estamos em Guarulhos</h2>
            <p className={styles.locationLead}>
              Traga seu veículo para avaliação presencial na Rua Anagé, 617 ou agende sua entrada
              com antecedência pelo WhatsApp.
            </p>

            <dl className={styles.contactList}>
              <div className={styles.contactRow}>
                <dt className={styles.contactTerm}>Endereço</dt>
                <dd className={styles.contactValue}>{GARAGE_CONTACT.address}</dd>
              </div>
              <div className={styles.contactRow}>
                <dt className={styles.contactTerm}>Telefone e WhatsApp</dt>
                <dd className={`${styles.contactValue} tabular`}>{GARAGE_CONTACT.phoneDisplay}</dd>
              </div>
              <div className={styles.contactRow}>
                <dt className={styles.contactTerm}>E-mail</dt>
                <dd className={styles.contactValue}>{GARAGE_CONTACT.email}</dd>
              </div>
              <div className={styles.contactRow}>
                <dt className={styles.contactTerm}>Horário de funcionamento</dt>
                <dd className={styles.contactValue}>
                  <span>{GARAGE_CONTACT.hoursWeekdays}</span>
                  <span>{GARAGE_CONTACT.hoursSaturday}</span>
                </dd>
              </div>
            </dl>

            <div className={styles.locationActions}>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.routeButton}
              >
                <MapPin size={17} strokeWidth={2} aria-hidden="true" />
                <span>Como chegar no mapa</span>
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waButton}
              >
                <MessageCircle size={17} strokeWidth={2} aria-hidden="true" />
                <span>Chamar no WhatsApp</span>
              </a>
              <a href="tel:+5511934624257" className={styles.callLink}>
                <Phone size={15} strokeWidth={2} aria-hidden="true" />
                <span className="tabular">{GARAGE_CONTACT.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <div className={styles.mapFrame}>
            <iframe
              title="Localização da Garagem 617 no mapa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className={styles.mapIframe}
            />
          </div>
        </div>

        <div className={styles.bottomGrid}>
          <div className={styles.brandCol}>
            <div className={styles.brandRow}>
              <span className={styles.badge617}>617</span>
              <span className={styles.brandName}>
                {GARAGE_CONTACT.brand} Estética Automotiva
              </span>
            </div>
            <p className={styles.brandNote}>
              Lavagem premium, polimento técnico, cristalização, higienização interna, funilaria e
              pintura automotiva em Guarulhos.
            </p>
          </div>

          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>Navegação</h3>
            <nav className={styles.footerNav} aria-label="Links do rodapé">
              <a href="#servicos" className={styles.footerLink}>
                Serviços
              </a>
              <a href="#transformacao" className={styles.footerLink}>
                Antes e depois
              </a>
              <a href="#estrutura" className={styles.footerLink}>
                A loja
              </a>
              <a href="#orcamento" className={styles.footerLink}>
                Orçamento
              </a>
            </nav>
          </div>

          <div className={styles.navCol}>
            <h3 className={styles.colHeading}>Redes sociais</h3>
            <div className={styles.footerNav}>
              {GARAGE_CONTACT.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2026 Garagem 617 Estética Automotiva. Jardim Presidente Dutra, Guarulhos - SP.
          </p>
        </div>
      </div>
    </footer>
  );
}
