import { Link } from 'react-router-dom';
import logo from '../assets/logo/davis-fabrics-logo-RGB.svg';
import './Navigation.css';

function Navigation() {
  return (
    <header className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Davis Fabrics" />
        </Link>
        <nav className="nav-menu">
          <Link to="/kolekcje">Kolekcje</Link>
          <Link to="/trendy">Trendy</Link>
          <Link to="/oferta">Oferta</Link>
          <Link to="/o-nas">O nas</Link>
          <Link to="/do-pobrania">Do pobrania</Link>
          <Link to="/kontakt">Kontakt</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
