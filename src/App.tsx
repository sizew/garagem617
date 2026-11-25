import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TransformationShowcase } from './components/TransformationShowcase';
import { ProtocolExplorer } from './components/ProtocolExplorer';
import { ProcessSequence } from './components/ProcessSequence';
import { StudioAboutFaq } from './components/StudioAboutFaq';
import { QuoteBuilder } from './components/QuoteBuilder';
import { Footer } from './components/Footer';
import { buildWhatsAppUrl } from './data/studioData';
import styles from './App.module.css';

export function App() {
  const [selectedProtocolIds, setSelectedProtocolIds] = useState<string[]>([
    'polimento-tecnico',
    'cristalizacao',
  ]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleProtocol = (id: string) => {
    setSelectedProtocolIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectProtocol = (id: string) => {
    setSelectedProtocolIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const waQuickHref = buildWhatsAppUrl(
    'Olá, vim pelo site da Garagem 617 e gostaria de solicitar um orçamento.'
  );

  return (
    <>
      <Header onNavigateQuote={() => scrollToSection('orcamento')} />
      <main>
        <Hero
          onExploreServices={() => scrollToSection('servicos')}
          onRequestQuote={() => scrollToSection('orcamento')}
        />
        <TransformationShowcase onRequestQuote={() => scrollToSection('orcamento')} />
        <ProtocolExplorer
          selectedProtocolIds={selectedProtocolIds}
          onToggleProtocol={handleToggleProtocol}
          onJumpToQuote={() => scrollToSection('orcamento')}
        />
        <ProcessSequence />
        <StudioAboutFaq />
        <QuoteBuilder
          selectedProtocolIds={selectedProtocolIds}
          onToggleProtocol={handleToggleProtocol}
          onSelectProtocol={handleSelectProtocol}
        />
      </main>
      <Footer />

      <a
        href={waQuickHref}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatingWa}
        aria-label="Falar com a Garagem 617 pelo WhatsApp"
      >
        <MessageCircle size={22} strokeWidth={2} aria-hidden="true" />
        <span className={styles.floatingWaLabel}>WhatsApp</span>
      </a>
    </>
  );
}

export default App;
