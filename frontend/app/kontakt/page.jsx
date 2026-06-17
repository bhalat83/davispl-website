'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import './Kontakt.css';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const HIGHLIGHTED_COUNTRIES = {
  POL: 'Polska',
  ROU: 'Rumunia',
  ITA: 'Włochy',
  ESP: 'Hiszpania',
  BGR: 'Bułgaria',
  SRB: 'Serbia',
  BIH: 'Bośnia i Hercegowina',
  ALB: 'Albania',
};

const EUROPE_COUNTRY_CODES = new Set([
  'ALB','AND','AUT','BLR','BEL','BIH','BGR','HRV','CYP','CZE','DNK','EST',
  'FIN','FRA','DEU','GRC','HUN','IRL','ITA','XKX','LVA','LIE','LTU',
  'LUX','MLT','MDA','MCO','MNE','NLD','MKD','NOR','POL','PRT','ROU',
  'SMR','SRB','SVK','SVN','ESP','SWE','CHE','UKR','GBR','VAT',
]);

const GLOBAL_CONTACTS = {
  POL: {
    company: 'Davis Fabrics Sp. z o.o',
    address: ['ul. Miłosna 37', '43-346 Bielsko-Biała', 'Polska'],
    phones: ['+48 33 816 36 60'],
    email: 'biuro@davis.pl',
  },
  ROU: {
    company: 'DAVIS ROMANIA SRL',
    address: ['Str. Careiului nr. 164', '440157 SATU MARE', 'Romania'],
    phones: ['+40 766 181 221'],
    contacts: [{ name: 'Dan Vlad Ciprian', role: 'General Manager', phone: '+40 749 383 064', email: 'v.dan@davis.pl' }],
  },
  ITA: {
    company: 'DAVIS ITALIA S.R.L',
    address: ['VIA Cavin Caselle 19', '30036 Santa Maria di Sala', 'Italy'],
    phones: ['+39 041 573 1791'],
  },
  ESP: {
    company: 'DAVIS FABRICS SPAIN, S.L.U.',
    address: ['Apdo Correos 489', 'C/ Doctor Pedro Pons, № 3', 'Pol. Ind. Las Teresas', '30510 Yecla', 'Spain'],
    phones: ['+34 968 927 990'],
    contacts: [{ name: 'Jose Miguel Vicedo', role: 'General Manager', phone: '+34 677 722 494', email: 'jmvicedo@davis.es' }],
  },
  BGR: {
    company: 'Davis Bulgaria EOOD',
    address: ['Bul. Vasil Levski 150', '1527 Sofia', 'Bulgaria'],
    contacts: [
      { name: 'Mihaela Ivanova', role: 'General Manager', phone: '+359 877 888 467', email: 'm.ivanova@davis.pl' },
      { name: 'Nural Tatov', role: 'General Manager', phone: '+35 988 6421896', email: 'n.tatov@davis.pl' },
    ],
  },
  SRB: {
    company: 'DERBRI PLUS DOO',
    address: ['TRG ZORANA ĐINĐIĆA 91', '11271 SURČIN', 'Serbia'],
    phones: ['+381 62 260 097'],
    contacts: [
      { name: 'Nemanja Stojanov', role: 'Export Area Manager', phone: '+38 162 260 214', email: 'nemanja@davis.rs' },
      { name: 'Aleksandar Topalović', role: 'Sales Manager', phone: '+38 162 260 213', email: 'aleksandar@davis.rs' },
    ],
  },
  BIH: {
    company: 'Davis Fabrics BH',
    address: ['Sprečki pravac bb', '75270 Živinice', 'Bośnia i Hercegovina'],
    contacts: [{ name: 'Anton Šimleša', role: 'Sales Manager', phone: '+387 62 020 373', email: 'anton@davis.ba' }],
  },
  ALB: {
    company: 'DAVIS ALBANIA shpk',
    address: ['Tirane – Vore', 'Rruga Perspektiva Nr.7', 'Zona kadastrale 2183, Nr Pasurie 131/5', 'Koder Vore'],
    contacts: [{ name: 'Ergys Dhamo', role: 'General Manager', phone: '+355696087165', email: 'ergys.dhamo@davis.al' }],
  },
  OTHER: {
    email: 'export@davis.pl',
  },
};

const ISO_NUMERIC_TO_ALPHA3 = {
  '008': 'ALB', '020': 'AND', '040': 'AUT', '112': 'BLR', '056': 'BEL',
  '070': 'BIH', '100': 'BGR', '191': 'HRV', '196': 'CYP', '203': 'CZE',
  '208': 'DNK', '233': 'EST', '246': 'FIN', '250': 'FRA', '276': 'DEU',
  '300': 'GRC', '348': 'HUN', '352': 'ISL', '372': 'IRL', '380': 'ITA',
  '428': 'LVA', '438': 'LIE', '440': 'LTU', '442': 'LUX', '470': 'MLT',
  '498': 'MDA', '492': 'MCO', '499': 'MNE', '528': 'NLD', '807': 'MKD',
  '578': 'NOR', '616': 'POL', '620': 'PRT', '642': 'ROU', '643': 'RUS',
  '674': 'SMR', '688': 'SRB', '703': 'SVK', '705': 'SVN', '724': 'ESP',
  '752': 'SWE', '756': 'CHE', '804': 'UKR', '826': 'GBR', '336': 'VAT',
};

function Kontakt() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const [activeCountry, setActiveCountry] = useState(null);
  const [selectedRegion1, setSelectedRegion1] = useState('dolnośląskie');
  const [selectedRegion2, setSelectedRegion2] = useState('kujawsko-pomorskie');
  const [selectedRegion3, setSelectedRegion3] = useState('lubelskie');

  const departments = [
    t.salesDepartment,
    t.management,
    t.accounting,
    t.marketing,
    t.hr,
    t.complaints,
    t.showroom
  ];

  // Dane handlowców przypisanych do województw
  const salesData = {
    'dolnośląskie': {
      name: 'Jan Kowalski',
      phone: '+48 33 812 70 60',
      email: 'jan.kowalski@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 71 123 45 67',
        email: 'wroclaw@davis.pl'
      }
    },
    'kujawsko-pomorskie': {
      name: 'Anna Nowak',
      phone: '+48 33 812 70 61',
      email: 'anna.nowak@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 52 123 45 67',
        email: 'bydgoszcz@davis.pl'
      }
    },
    'lubelskie': {
      name: 'Piotr Wiśniewski',
      phone: '+48 33 812 70 62',
      email: 'piotr.wisniewski@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 81 123 45 67',
        email: 'lublin@davis.pl'
      }
    },
    'lubuskie': {
      name: 'Maria Wójcik',
      phone: '+48 33 812 70 63',
      email: 'maria.wojcik@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 95 123 45 67',
        email: 'gorzow@davis.pl'
      }
    },
    'łódzkie': {
      name: 'Tomasz Kamiński',
      phone: '+48 33 812 70 64',
      email: 'tomasz.kaminski@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 42 123 45 67',
        email: 'lodz@davis.pl'
      }
    },
    'małopolskie': {
      name: 'Katarzyna Lewandowska',
      phone: '+48 33 812 70 65',
      email: 'katarzyna.lewandowska@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 12 123 45 67',
        email: 'krakow@davis.pl'
      }
    },
    'mazowieckie': {
      name: 'Paweł Zieliński',
      phone: '+48 33 812 70 66',
      email: 'pawel.zielinski@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 22 123 45 67',
        email: 'warszawa@davis.pl'
      }
    },
    'opolskie': {
      name: 'Magdalena Szymańska',
      phone: '+48 33 812 70 67',
      email: 'magdalena.szymanska@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 77 123 45 67',
        email: 'opole@davis.pl'
      }
    },
    'podkarpackie': {
      name: 'Grzegorz Woźniak',
      phone: '+48 33 812 70 68',
      email: 'grzegorz.wozniak@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 17 123 45 67',
        email: 'rzeszow@davis.pl'
      }
    },
    'podlaskie': {
      name: 'Ewa Dąbrowska',
      phone: '+48 33 812 70 69',
      email: 'ewa.dabrowska@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 85 123 45 67',
        email: 'bialystok@davis.pl'
      }
    },
    'pomorskie': {
      name: 'Michał Kozłowski',
      phone: '+48 33 812 70 70',
      email: 'michal.kozlowski@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 58 123 45 67',
        email: 'gdansk@davis.pl'
      }
    },
    'śląskie': {
      name: 'Agnieszka Jankowska',
      phone: '+48 33 812 70 71',
      email: 'agnieszka.jankowska@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 32 123 45 67',
        email: 'katowice@davis.pl'
      }
    },
    'świętokrzyskie': {
      name: 'Krzysztof Mazur',
      phone: '+48 33 812 70 72',
      email: 'krzysztof.mazur@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 41 123 45 67',
        email: 'kielce@davis.pl'
      }
    },
    'warmińsko-mazurskie': {
      name: 'Joanna Krawczyk',
      phone: '+48 33 812 70 73',
      email: 'joanna.krawczyk@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 89 123 45 67',
        email: 'olsztyn@davis.pl'
      }
    },
    'wielkopolskie': {
      name: 'Adam Piotrowski',
      phone: '+48 33 812 70 74',
      email: 'adam.piotrowski@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 61 123 45 67',
        email: 'poznan@davis.pl'
      }
    },
    'zachodniopomorskie': {
      name: 'Barbara Grabowska',
      phone: '+48 33 812 70 75',
      email: 'barbara.grabowska@davis.pl',
      office: {
        name: 'Biuro obsługi klienta',
        phone: '+48 91 123 45 67',
        email: 'szczecin@davis.pl'
      }
    }
  };

  const regions = Object.keys(salesData);

  const wholesalers = [
    {
      name: "Kornix Forest",
      address: ["ul. Podmiejska 12", "84-200 Wejherowo"],
      phones: ["+48 58 677 98 02", "+48 668 497 479"],
      email: null,
      website: "kornix.com.pl"
    },
    {
      name: "Prohurt",
      address: ["36-073 Strażów 351"],
      phones: ["17 77 11 554", "+48 733 701 731"],
      email: null,
      website: "prohurt.pl"
    },
    {
      name: "Megab",
      address: ["Rynek 30", "34-130 Kalwaria Zebrzydowska"],
      phones: ["+48 33 876 49 20"],
      email: "mazuga@vp.pl",
      website: "www.magab.pl"
    },
    {
      name: "Atena",
      address: ["ul. Polna 3a", "34-140 Kalwaria Zebrzydowska"],
      phones: ["+48 33 876 49 72"],
      email: null,
      website: "atena-kalwaria.pl"
    },
    {
      name: "Materiały tapicerskie Plich",
      address: ["Rynek 18 b", "34-130 Kalwaria Zebrzydowska"],
      phones: ["+48 506 106 205"],
      email: null,
      website: null
    },
    {
      name: "Mati",
      address: ["ul. Wrzesińska 102", "62-020 Swarzędz"],
      phones: ["+48 61 651 08 08"],
      email: "biuro@pwmati.pl",
      website: null
    },
    {
      name: "Dar-Tex",
      address: ["ul. Kościuszki 22", "42-500 Będzin"],
      phones: ["+48 32 761 54 97"],
      email: null,
      website: "dar-tex.pl"
    },
    {
      name: "Wera",
      address: ["ul. Dworcowa 46", "89-530 Śliwice"],
      phones: ["+48 52 334 01 36"],
      email: null,
      website: "tkaniny-wera.pl"
    },
    {
      name: "MT Filipowicz",
      address: ["ul. Płk. Dąbka 10", "30-732 Kraków"],
      phones: ["+48 12 429 21 34"],
      email: null,
      website: "www.artykulytapicerskie.pl"
    },
    {
      name: "Tkaniny Karoliny",
      address: ["Kokosowa 40", "02-797 Warszawa"],
      phones: ["+48 22 245 03 72", "+48 605 141 363"],
      email: null,
      website: "www.tkaninykaroliny.pl"
    },
    {
      name: "Jardex",
      address: ["ul. Rolnicza 8", "44-240 Żory"],
      phones: ["+48 726 430 300", "+48 32 43 58 141"],
      email: null,
      website: "www.jardex.com.pl"
    },
    {
      name: "ARKOS Hurtownia Tapicerska",
      address: ["ul. Brzeźnicka 59", "97-500 Radomsko"],
      phones: ["+48 697 555 567"],
      email: "kosmala82@o2.pl",
      website: null
    }
  ];

  return (
    <div className="kontakt">
      {/* Contact Section */}
      <section className="kontakt-section">
        <div className="kontakt-container">
          <h1 className="kontakt-main-title">{t.title}</h1>

          <div className="kontakt-grid">
            {/* Company Data */}
            <div className="kontakt-company-block">
              <h2 className="kontakt-company-name">{t.companyName}</h2>
              <div className="kontakt-info">
                <p>ul. Miłosna 37</p>
                <p>43-346 Bielsko-Biała</p>
                <p className="kontakt-phone">+48 33 816 36 60</p>
                <p className="kontakt-legal">NIP PL5472185966</p>
                <p className="kontakt-legal">REGON 368618137</p>
              </div>
            </div>

            {/* Departments */}
            {departments.map((dept, index) => (
              <div key={index} className="kontakt-department">
                <h3 className="kontakt-department-name">{dept}</h3>
                <a href="mailto:hello@davis.pl" className="kontakt-email">hello@davis.pl</a>
                <a href="tel:+48338127060" className="kontakt-phone">+48 33 812 70 60</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Regions Section */}
      <section className="kontakt-sales-section">
        <div className="kontakt-sales-container">
          <div className="kontakt-sales-grid">
            {/* Column 1 */}
            <div className="kontakt-sales-column">
              <div className="kontakt-sales-header">
                <h2>{t.domesticSales}</h2>
              </div>
              <div className="kontakt-sales-content">
                <label className="kontakt-sales-label">{t.selectRegion}</label>
                <select
                  className="kontakt-sales-select"
                  value={selectedRegion1}
                  onChange={(e) => setSelectedRegion1(e.target.value)}
                >
                  <option value="">{t.selectVoivodeship}</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {t.regionNames?.[region] || region}
                    </option>
                  ))}
                </select>

                {selectedRegion1 && salesData[selectedRegion1] && (
                  <div className="kontakt-sales-info">
                    <div className="kontakt-sales-person">
                      <p className="kontakt-sales-name">{salesData[selectedRegion1].name}</p>
                      <a href={`tel:${salesData[selectedRegion1].phone}`} className="kontakt-sales-phone">
                        {salesData[selectedRegion1].phone}
                      </a>
                      <a href={`mailto:${salesData[selectedRegion1].email}`} className="kontakt-sales-email">
                        {salesData[selectedRegion1].email}
                      </a>
                    </div>
                    <div className="kontakt-sales-office">
                      <p className="kontakt-sales-office-name">{t.customerService}</p>
                      <a href={`tel:${salesData[selectedRegion1].office.phone}`} className="kontakt-sales-phone">
                        {salesData[selectedRegion1].office.phone}
                      </a>
                      <a href={`mailto:${salesData[selectedRegion1].office.email}`} className="kontakt-sales-email">
                        {salesData[selectedRegion1].office.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="kontakt-sales-column">
              <div className="kontakt-sales-header">
                <h2>{t.exportSales}</h2>
              </div>
              <div className="kontakt-sales-content">
                <label className="kontakt-sales-label">{t.selectRegion}</label>
                <select
                  className="kontakt-sales-select"
                  value={selectedRegion2}
                  onChange={(e) => setSelectedRegion2(e.target.value)}
                >
                  <option value="">{t.selectVoivodeship}</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {t.regionNames?.[region] || region}
                    </option>
                  ))}
                </select>

                {selectedRegion2 && salesData[selectedRegion2] && (
                  <div className="kontakt-sales-info">
                    <div className="kontakt-sales-person">
                      <p className="kontakt-sales-name">{salesData[selectedRegion2].name}</p>
                      <a href={`tel:${salesData[selectedRegion2].phone}`} className="kontakt-sales-phone">
                        {salesData[selectedRegion2].phone}
                      </a>
                      <a href={`mailto:${salesData[selectedRegion2].email}`} className="kontakt-sales-email">
                        {salesData[selectedRegion2].email}
                      </a>
                    </div>
                    <div className="kontakt-sales-office">
                      <p className="kontakt-sales-office-name">{t.customerService}</p>
                      <a href={`tel:${salesData[selectedRegion2].office.phone}`} className="kontakt-sales-phone">
                        {salesData[selectedRegion2].office.phone}
                      </a>
                      <a href={`mailto:${salesData[selectedRegion2].office.email}`} className="kontakt-sales-email">
                        {salesData[selectedRegion2].office.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3 */}
            <div className="kontakt-sales-column">
              <div className="kontakt-sales-header">
                <h2>{t.architectZone}</h2>
              </div>
              <div className="kontakt-sales-content">
                <label className="kontakt-sales-label">{t.selectRegion}</label>
                <select
                  className="kontakt-sales-select"
                  value={selectedRegion3}
                  onChange={(e) => setSelectedRegion3(e.target.value)}
                >
                  <option value="">{t.selectVoivodeship}</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {t.regionNames?.[region] || region}
                    </option>
                  ))}
                </select>

                {selectedRegion3 && salesData[selectedRegion3] && (
                  <div className="kontakt-sales-info">
                    <div className="kontakt-sales-person">
                      <p className="kontakt-sales-name">{salesData[selectedRegion3].name}</p>
                      <a href={`tel:${salesData[selectedRegion3].phone}`} className="kontakt-sales-phone">
                        {salesData[selectedRegion3].phone}
                      </a>
                      <a href={`mailto:${salesData[selectedRegion3].email}`} className="kontakt-sales-email">
                        {salesData[selectedRegion3].email}
                      </a>
                    </div>
                    <div className="kontakt-sales-office">
                      <p className="kontakt-sales-office-name">{t.customerService}</p>
                      <a href={`tel:${salesData[selectedRegion3].office.phone}`} className="kontakt-sales-phone">
                        {salesData[selectedRegion3].office.phone}
                      </a>
                      <a href={`mailto:${salesData[selectedRegion3].office.email}`} className="kontakt-sales-email">
                        {salesData[selectedRegion3].office.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Central Warehouse Section */}
      <section className="kontakt-central-section">
        <div className="kontakt-container">
          <div className="kontakt-central-grid">
            <div className="kontakt-central-left">
              <h2 className="kontakt-central-title">{t.centralWarehouse}</h2>
              <div className="kontakt-department">
                <h3 className="kontakt-department-name">Hurtownia Davis</h3>
                <div className="kontakt-info">
                  <p>ul. Cło 31A, Hala nr 1</p>
                  <p>63-604 Baranów</p>
                  <a href="tel:+48571600650" className="kontakt-phone">+48 571 600 650</a>
                  <a href="mailto:hurtownia@davis.pl" className="kontakt-email">hurtownia@davis.pl</a>
                </div>
              </div>
            </div>
            <div className="kontakt-central-right">
              <img src="/contact/1.jpg" alt="Hurtownia centralna" className="kontakt-central-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Wholesalers Section */}
      <section className="kontakt-section">
        <div className="kontakt-container">
          <h1 className="kontakt-main-title">{t.wholesalersTitle}</h1>

          <div className="kontakt-wholesalers-grid">
            {wholesalers.map((wholesaler, index) => (
              <div key={index} className="kontakt-department">
                <h3 className="kontakt-department-name">{wholesaler.name}</h3>
                <div className="kontakt-info">
                  {wholesaler.address.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  {wholesaler.phones.map((phone, i) => (
                    <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="kontakt-phone">
                      {phone}
                    </a>
                  ))}
                  {wholesaler.email && (
                    <a href={`mailto:${wholesaler.email}`} className="kontakt-email">
                      {wholesaler.email}
                    </a>
                  )}
                  {wholesaler.website && (
                    <a
                      href={`https://${wholesaler.website}`}
                      className="kontakt-email"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {wholesaler.website}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Davis Global Section */}
      <section className="kontakt-global-section">
        <div className="kontakt-container">
          <h2 className="kontakt-global-title">{t.davisGlobal}</h2>
          <div className="kontakt-global-grid">

            {/* Left: expandable country rows */}
            <div className="kontakt-global-countries">
              {[...Object.keys(HIGHLIGHTED_COUNTRIES).map(code => [code, t.countryNames[code] || HIGHLIGHTED_COUNTRIES[code]]), ['OTHER', t.otherMarkets]].map(([code, name]) => (
                <div key={code} className="kontakt-global-row">
                  <button
                    className={`kontakt-global-row-btn ${activeCountry === code ? 'active' : ''}`}
                    onClick={() => setActiveCountry(activeCountry === code ? null : code)}
                  >
                    <span>{name}</span>
                    <svg
                      className={`kontakt-global-chevron ${activeCountry === code ? 'open' : ''}`}
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                    >
                      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {activeCountry === code && (
                    <div className="kontakt-global-row-content">
                      {(() => {
                        const d = GLOBAL_CONTACTS[code];
                        if (!d) return null;
                        return (
                          <div className="kontakt-global-contact">
                            {d.company && <p className="kontakt-global-company">{d.company}</p>}
                            {d.address?.map((line, i) => <p key={i} className="kontakt-global-text">{line}</p>)}
                            {d.phones?.map((p, i) => <a key={i} href={`tel:${p.replace(/\s/g,'')}`} className="kontakt-phone">{p}</a>)}
                            {d.email && <a href={`mailto:${d.email}`} className="kontakt-email">{d.email}</a>}
                            {d.contacts?.map((c, i) => (
                              <div key={i} className="kontakt-global-person">
                                <p className="kontakt-global-person-name">{c.name}</p>
                                <p className="kontakt-global-text kontakt-global-role">{c.role}</p>
                                {c.phone && <a href={`tel:${c.phone.replace(/\s/g,'')}`} className="kontakt-phone">{c.phone}</a>}
                                {c.email && <a href={`mailto:${c.email}`} className="kontakt-email">{c.email}</a>}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: interactive Europe map */}
            <div className="kontakt-global-map">
              <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{ rotate: [-15, -52, 0], scale: 900 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies
                      .filter((geo) => {
                        const alpha3 = ISO_NUMERIC_TO_ALPHA3[geo.id];
                        return alpha3 && EUROPE_COUNTRY_CODES.has(alpha3);
                      })
                      .map((geo) => {
                        const alpha3 = ISO_NUMERIC_TO_ALPHA3[geo.id];
                        const isHighlighted = alpha3 && HIGHLIGHTED_COUNTRIES[alpha3];
                        const isActive = alpha3 === activeCountry;
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => {
                              if (isHighlighted) {
                                setActiveCountry(activeCountry === alpha3 ? null : alpha3);
                              }
                            }}
                            style={{
                              default: {
                                fill: isActive ? '#000' : isHighlighted ? '#555' : '#d8d8d8',
                                stroke: '#fff',
                                strokeWidth: 0.5,
                                outline: 'none',
                              },
                              hover: {
                                fill: isHighlighted ? '#000' : '#d8d8d8',
                                stroke: '#fff',
                                strokeWidth: 0.5,
                                outline: 'none',
                                cursor: isHighlighted ? 'pointer' : 'default',
                              },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })
                  }
                </Geographies>
              </ComposableMap>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Kontakt;
