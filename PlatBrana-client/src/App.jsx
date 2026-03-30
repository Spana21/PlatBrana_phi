import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Mail, CreditCard, Calendar, Lock, Info } from 'lucide-react';
import './App.css';
import DiplomkaModal from './components/BlackWindow.jsx';

const WORKER_URL = "https://anton-databaze.spaniklukas.workers.dev";

function App() {
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    rememberCard: false
  });
  
  const [showModal, setShowModal] = useState(false);
  const [cardType, setCardType] = useState('unknown'); 
  
  // ukládání textu chyby
  const [error, setError] = useState('');

  const currentPath = window.location.pathname.replace('/', '');
  const schoolId = currentPath !== '' ? currentPath : 'nezadano';

  useEffect(() => {
    if (WORKER_URL) {
      fetch(`${WORKER_URL}/visit?school=${schoolId}`)
        .then(res => console.log("Návštěva odeslána pro:", schoolId))
        .catch(err => console.error("Chyba při odesílání návštěvy:", err));
    }
  }, [schoolId]);

  // CHYTRÝ HANDLER - Formátuje čísla a detekuje typ karty
  const handleChange = (e) => {
    // Jakmile začne uživatel něco psát, skryjeme případnou předchozí chybu
    setError(''); 
    
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    // 1. Automatické formátování čísla karty (přidá mezery)
    if (name === 'cardNumber') {
      let numbersOnly = newValue.replace(/\D/g, ''); 
      
      if (numbersOnly.startsWith('4')) setCardType('visa');
      else if (numbersOnly.startsWith('5')) setCardType('mastercard');
      else setCardType('unknown');

      newValue = numbersOnly.replace(/(.{4})/g, '$1 ').trim();
    }

    // 2. Automatické formátování platnosti (přidá lomítko)
    if (name === 'expiry') {
      let numbersOnly = newValue.replace(/\D/g, '');
      if (numbersOnly.length > 2) {
        newValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2, 4);
      } else {
        newValue = numbersOnly;
      }
    }

    // 3. Omezení CVC jen na čísla
    if (name === 'cvc') {
      newValue = newValue.replace(/\D/g, '');
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    // Číslo karty (musí mít 16 čísel, bez mezer)
    const cleanCard = formData.cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) {
      setError("Zadejte platné 16místné číslo platební karty.");
      return; 
    }

    // Platnost (musí mít 5 znaků: MM/RR)
    if (formData.expiry.length !== 5) {
      setError("Zadejte platnost karty ve formátu MM/RR (např. 11/28).");
      return;
    }

    // CVC (musí mít 3 čísla)
    if (formData.cvc.length !== 3) {
      setError("Zadejte 3místný CVC kód ze zadní strany karty.");
      return;
    }

    // E-mail (jednoduchá kontrola zavináče)
    if (!formData.email.includes('@')) {
      setError("Zadejte platný e-mail.");
      return;
    }

    // POKUD VŠE PROŠLO:
    setError(''); // Pro jistotu vymažeme jakoukoliv starou chybu
 
    fetch(`${WORKER_URL}/track-login-click?school=${schoolId}`).catch(console.error);
    fetch(`${WORKER_URL}/track-modal-view?school=${schoolId}`).catch(console.error);

    
    setShowModal(true);
  };

return (
    <div className="app-container">
      
      {showModal && (
        <DiplomkaModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}

      <div className="gopay-overlay">
        <div className="payment-modal">
          <div className="modal-header">
            <ArrowLeft size={24} className="header-icon pointer" />
            <h3>Změnit platební metodu</h3>
            <X size={24} className="header-icon pointer" />
          </div>

          <div className="logo-section">
            <img src="/GoPayLogo.svg" alt="GoPay" className="gopay-logo-img" />
          </div>

          <div className="tabs-section">
            <div className="tab active">Platba</div>
            <div className="tab inactive">Objednávka</div>
          </div>

          <form onSubmit={handleSubmit} className="payment-form" noValidate>
            <div className="input-group">
              <div className="input-wrapper left-icon">
                <Mail size={20} className="field-icon-left" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="E-mail" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper left-icon right-icons">
                <CreditCard size={20} className="field-icon-left" />
                <input 
                  type="text" 
                  name="cardNumber" 
                  placeholder="Číslo karty"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  maxLength="19"
                  required 
                />
                
                <div className="field-icons-right cards">
                  {cardType === 'unknown' && (
                    <>
                      <img src="/VisaLogo.svg" alt="Visa" className="card-logo-img dimmed" />
                      <img src="/MasterCardLogo.svg" alt="MasterCard" className="card-logo-img dimmed" />
                    </>
                  )}
                  {cardType === 'visa' && (
                    <img src="/VisaLogo.svg" alt="Visa" className="card-logo-img active-logo" />
                  )}
                  {cardType === 'mastercard' && (
                    <img src="/MasterCardLogo.svg" alt="MasterCard" className="card-logo-img active-logo" />
                  )}
                  <Info size={18} className="info-icon" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group flex-1">
                <div className="input-wrapper left-icon">
                  <Calendar size={20} className="field-icon-left" />
                  <input 
                    type="text" 
                    name="expiry" 
                    placeholder="Platnost (MM/RR)"
                    value={formData.expiry}
                    onChange={handleChange}
                    maxLength="5" 
                    required 
                  />
                </div>
              </div>
              <div className="input-group flex-1">
                <div className="input-wrapper left-icon right-icon">
                  <Lock size={20} className="field-icon-left" />
                  <input 
                    type="password" 
                    name="cvc" 
                    placeholder="CVC"
                    value={formData.cvc}
                    onChange={handleChange}
                    maxLength="3"
                    required 
                  />
                  <Info size={18} className="field-icon-right info-icon" />
                </div>
              </div>
            </div>

            <div className="toggle-section">
              <label htmlFor="remember-toggle">Zapamatovat kartu</label>
              <Info size={16} className="info-icon-small" />
              <div className="toggle-switch-wrapper">
                <input 
                  type="checkbox" 
                  id="remember-toggle" 
                  name="rememberCard"
                  checked={formData.rememberCard}
                  onChange={handleChange}
                  className="toggle-input"
                />
                <label htmlFor="remember-toggle" className="toggle-label"></label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="pay-button">
              Zaplatit 5 Kč
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;