# 📱 Simulace Quishingu (Výzkumný projekt)
### 🎓 Diplomová práce | Akademický projekt pro pochopení kyberbezpečnosti

![React](https://img.shields.io/badge/Webová_aplikace-React-blue?style=for-the-badge&logo=react)
![Security](https://img.shields.io/badge/Zaměření-Bezpečnost-green?style=for-the-badge)
![Research](https://img.shields.io/badge/Účel-Výzkum-orange?style=for-the-badge)

Tento projekt vznikl jako součást diplomové práce a slouží k názorné ukázce toho, jak funguje tzv. **Quishing** (QR Phishing) – podvodná technika zneužívající QR kódy k přesměrování uživatelů na falešné platební brány. Cílem aplikace je simulovat reálný útok v kontrolovaném prostředí a sbírat anonymní statistická data o chování uživatelů.

---

## 📌 O co v projektu jde?
Scénář simuluje situaci, kdy uživatel naskenuje QR kód (např. na parkovacím automatu, v restauraci nebo na faktuře) a je přesměrován na tuto stránku, která věrně kopíruje platební bránu GoPay. Sledujeme, zda uživatelé po naskenování kódu věnují pozornost URL adrese a bezpečnosti před zadáním údajů o kartě.

### 🛡️ Je to bezpečné? (Ochrana soukromí)
*   Aplikace **neukládá** čísla karet, CVC kódy ani jiné citlivé údaje. 
*   Veškerý sběr dat je **anonymní**.
*   Po pokusu o platbu je uživateli okamžitě zobrazeno edukační okno vysvětlující rizika spojená s QR kódy, spolu s informovaným souhlasem.

---

## 🏗️ Struktura projektu

### 💻 1. Webová stránka (`PlatBrana-client/`)
Uživatelské rozhraní v **Reactu**, které napodobuje design brány GoPay.
- Optimalizováno pro mobilní zařízení (předpokládaný vstup přes skenování QR kódu).
- Obsahuje mechanismy pro detekci typu karty a validaci vstupu.

### ⚙️ 2. Backend / Worker (`platbrana-worker/`)
Serverová část na **Cloudflare Workers**.
- Zpracovává anonymní statistiky o tom, kolik lidí po naskenování kódu došlo až k pokusu o platbu.

---

## 💡 Co je to Quishing?
Quishing je kombinace slov "QR Code" a "Phishing". Útočník nahradí legitimní QR kód svým vlastním (např. přelepkou) nebo pošle podvodný kód e-mailem. Po naskenování je oběť dovedena na stránku, která vypadá jako skutečná služba, ale slouží ke krádeži platebních údajů nebo instalaci malwaru.

---

## 📧 Kontakt

- **Autor:** Lukáš Špánik
- **Instituce:** Univerzita Obrany
- **Email:** lukas.spanik@unob.cz
