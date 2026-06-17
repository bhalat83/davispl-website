import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Davis Fabrics',
  description: 'Tkaniny do pięknych przestrzeni',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <LanguageProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
