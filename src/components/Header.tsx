import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { GARAGE_CONTACT } from '../data/studioData';
import styles from './Header.module.css';

interface HeaderProps {
  onNavigateQuote: () => void;
}

const NAV_ITEMS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#transformacao', label: 'Antes e depois' },
  { href: '#estrutura', label: 'A loja' },
  { href: '#orcamento', label: 'Orçamento' },
  { href: '#contato', label: 'Contato' },
];

export function Header({ onNavigateQuote }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#topo" className={styles.brand} aria-label="Garagem 617 Estética Automotiva, início">
          <span className={styles.badge617}>617</span>
          <span className={styles.brandGroup}>
            <span className={styles.brandTitle}>{GARAGE_CONTACT.brand}</span>
            <span className={styles.brandSub}>{GARAGE_CONTACT.subtitle}</span>
          </span>
        </a>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.ctaButton} onClick={onNavigateQuote}>
            Agendar horário
          </button>

          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={menuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav-drawer" className={styles.mobileDrawer} aria-label="Navegação móvel">
          <div className={`container ${styles.mobileInner}`}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className={styles.mobileCta}
              onClick={() => {
                setMenuOpen(false);
                onNavigateQuote();
              }}
            >
              Agendar horário
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
