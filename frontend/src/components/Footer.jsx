import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <span>DAVIS FABRICS</span>
          <span>ul. Miłosna</span>
          <span>37 43-346 Bielsko-Biała</span>
        </div>
        <div className="footer-right">
          <a href="https://www.linkedin.com/company/davis-fabrics/posts/?feedView=all" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href="http://facebook.com/davisfabrics/" target="_blank" rel="noopener noreferrer">FACEBOOK</a>
          <a href="https://www.instagram.com/davisfabrics/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a href="https://www.youtube.com/channel/UCSA76QNra8q_JUxUbCsMzVQ" target="_blank" rel="noopener noreferrer">YOUTUBE</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
