import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import './Kontakt.css';

function Kontakt() {
  const { language } = useLanguage();
  const t = translations[language].contact;
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
      name: "Hurtownia Davis",
      address: ["ul. Cło 31A, Hala nr 1", "63-604 Baranów"],
      phones: ["+48 571 600 650"],
      email: "hurtownia@davis.pl",
      website: null
    },
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
      name: "Artmeb",
      address: ["ul. Wrocławska 5", "63-600 Kępno"],
      phones: ["+48 502 444 222"],
      email: null,
      website: "artmeb-hurt.pl"
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
                <p>43–346 Bielsko-Biała</p>
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
                      {region}
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
                      <p className="kontakt-sales-office-name">{salesData[selectedRegion1].office.name}</p>
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
                <h2>{t.domesticSales}</h2>
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
                      {region}
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
                      <p className="kontakt-sales-office-name">{salesData[selectedRegion2].office.name}</p>
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
                <h2>{t.domesticSales}</h2>
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
                      {region}
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
                      <p className="kontakt-sales-office-name">{salesData[selectedRegion3].office.name}</p>
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
    </div>
  );
}

export default Kontakt;
