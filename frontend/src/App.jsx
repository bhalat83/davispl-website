import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Kolekcje from './pages/Kolekcje';
import KolekcjaDetails from './pages/KolekcjaDetails';
import Trendy from './pages/Trendy';
import Oferta from './pages/Oferta';
import ONas from './pages/ONas';
import DoPobrania from './pages/DoPobrania';
import Kontakt from './pages/Kontakt';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kolekcje" element={<Kolekcje />} />
              <Route path="/kolekcje/:id" element={<KolekcjaDetails />} />
              <Route path="/trendy" element={<Trendy />} />
              <Route path="/oferta" element={<Oferta />} />
              <Route path="/o-nas" element={<ONas />} />
              <Route path="/do-pobrania" element={<DoPobrania />} />
              <Route path="/kontakt" element={<Kontakt />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
