import React, { useState } from 'react';

// Tady si definujeme adresu Workeru (stejná jako v App.jsx)
const WORKER_URL = "https://platbrana-worker.spaniklukas.workers.dev"; 

function DiplomkaModal({ isOpen, onClose }) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedAge, setSelectedAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const ageGroups = [
    "Méně než 17", "18 - 24", "25 - 34", "35 - 44",
    "45 - 54", "55 - 64", "65 a více"
  ];

  const handleDownload = async () => {
    
    setIsSubmitting(true); 

    try {
      // 1. Spuštění stahování souboru
      const link = document.createElement('a');
      link.href = '/informovany_souhlas.pdf'; 
      link.download = 'Informovany_souhlas_ucastnika.pdf'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 2. Získání identifikátoru školy z URL
      const currentPath = window.location.pathname.replace('/', ''); 
      const schoolId = currentPath !== '' ? currentPath : 'nezadano';

      // 3. Odeslání dat na Worker (pokud je adresa vyplněná a není to jen prázdný text)
      if (WORKER_URL && WORKER_URL !== "") {
        await fetch(`${WORKER_URL}/wtf`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            age: selectedAge,
            school: schoolId,
            timestamp: new Date().toISOString() 
          })
        });
        console.log(`Statistika věku odeslána pro školu: ${schoolId}`);
      }
    } catch (err) {
      console.error("Chyba při zpracování:", err);
    } finally {
      // 4. Vypneme stav odesílání a okno zavřeme
      setIsSubmitting(false);
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <div className="warning-icon">⚠️</div>
          <h3>Pozor: Toto byla simulace Quishingu (QR Phishing)</h3>
        </header>
        
        <div className="modal-body">
          <section className="modal-info-section">
            <p className="modal-text">
              Právě jste interagovali s testovací stránkou vytvořenou pro účely <strong>výzkumu v rámci diplomové práce</strong>. 
              Tato stránka pouze napodobuje vzhled platební brány GoPay, aby demonstrovala, jak snadno lze vytvořit věrohodnou kopii platebního rozhraní.
            </p>
            
            <div className="security-guarantee">
              <h4>🛡️ Vaše soukromí je 100% zachováno</h4>
              <p>
                V souladu s etickými pravidly výzkumu <strong>nebyla uložena žádná citlivá data</strong>. Číslo vaší karty, platnost ani CVC kód 
                nebyly odeslány na server ani nikde zaznamenány. Systém pouze eviduje anonymní statistiku (že na stránku někdo přišel a klikl na tlačítko). 
             <p><strong>Jediný údaj, který o sobě můžete dobrovolně poskytnout pro potřeby výzkumu, je vaše věková kategorie níže.</strong></p>
              </p>
            </div>
          </section>

          <section className="education-section">
            <h4>💡 Jak poznat quishing příště?</h4>
            <div className="edu-grid">
              <div className="edu-item">
                <span className="edu-icon">📱</span>
                <div>
                  <strong>Kontrola URL po naskenování:</strong> Moderní čtečky QR kódů vám před otevřením ukážou cílovou adresu. Pokud vede na jinou doménu než oficiální (např. <code>platba-parkovne.cz</code> nebo <code>platBra.fun</code>), stránku neotvírejte.
                </div>
              </div>
              <div className="edu-item">
                <span className="edu-icon">🕵️</span>
                <div>
                  <strong>Fyzická kontrola QR kódu:</strong> Pokud skenujete QR kód na veřejném místě (např. na parkovacím automatu), zkontrolujte, zda se nejedná <strong> o přelepku.</strong> Útočníci často legitimní kód jednoduše přelepí svým podvodným.
                </div>
              </div>
              <div className="edu-item">
                <span className="edu-icon">🔗</span>
                <div>
                  <strong>Zkracovače adres:</strong> Buďte extrémně opatrní, pokud QR kód vede na zkrácenou adresu (např. <code>bit.ly</code> nebo <code>tinyurl.com</code>). Oficiální instituce a platební brány zkracovače v QR kódech pro platby nepoužívají.
                </div>
              </div>
              <div className="edu-item">
                <span className="edu-icon">💳</span>
                <div>
                  <strong>Preferujte oficiální aplikace:</strong> Místo skenování náhodných QR kódů raději využívejte oficiální aplikace služeb (např. MPLA pro parkování) nebo zadejte adresu webu ručně do prohlížeče.
                </div>
              </div>
              <div className="edu-item">
                <span className="edu-icon">💸</span>
                <div>
                  <strong>Podezřele výhodná nabídka:</strong> Pokud je nabídka až nereálně výhodná, je na místě zvýšená opatrnost. Útočníci často pracují s extrémně nízkými cenami nebo vysokými slevami.
                </div>
              </div>
              <div className="edu-item">
                <span className="edu-icon">❓</span>
                <div>
                  <strong>Neznámý původ plakátu:</strong> Chybějící logo společnosti, kontaktní údaje nebo oficiální identifikace organizátora jsou varovným signálem.
                </div>
              </div>
            </div>
          </section>

          <div className="research-form">
            <p className="section-title">Pomozte mi s výzkumem: Jaký je váš věk?</p>
            
            <div className="form-controls">
              <div className="select-wrapper">
                <label>Váš věk:</label>
                <select 
                  className="modal-select"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                >
                  <option value="" disabled>Vyberte věkovou skupinu...</option>
                  {ageGroups.map((age) => (
                    <option key={age} value={age}>{age} let</option>
                  ))}
                </select>
              </div>

              <div className="agreement-wrapper">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                  />
                  Souhlasím se zapojením do anonymního výzkumu
                </label>
              </div>
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <p className="small-note">Kliknutím dokončíte simulaci a stáhnete Informovaný souhlas (PDF).</p>
          <button 
            onClick={handleDownload} 
            className="close-btn"
            disabled={!isAgreed || !selectedAge || isSubmitting} 
          >
            {isSubmitting ? 'Odesílám...' : 'Dokončit a stáhnout PDF'}
          </button>
          <p className="github-info">
            Kód projektu je dostupný na <a href="https://github.com/Spana21/PlatBrana_phi" target="_blank" rel="noopener noreferrer" className="github-link">GitHubu</a>.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DiplomkaModal;
