import { useState, useEffect } from 'react';
import CollectionCard from '../components/CollectionCard';
import './Kolekcje.css';

function Kolekcje() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(16);

  useEffect(() => {
    fetchCollections();
  }, [currentPage]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/collections?page=${currentPage}&per_page=${perPage}`
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać kolekcji');
      }

      const data = await response.json();

      // API zwraca obiekt z collections i pagination
      const collectionsArray = data.collections || [];

      // Sortowanie po ID malejąco (wyższe ID = nowsze)
      const sortedCollections = collectionsArray.sort((a, b) => b.id - a.id);

      setCollections(sortedCollections);

      // Ustaw totalPages z API
      if (data.pagination && data.pagination.page_count) {
        setTotalPages(data.pagination.page_count);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generuj numery stron do wyświetlenia
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="collections-loading">Ładowanie kolekcji...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="collections-error">Błąd: {error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="collections-header">
        <h1>Kolekcje</h1>
      </div>

      <div className="collections-grid">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>

      <div className="collections-pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Poprzednia
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={collections.length < perPage}
          className="pagination-btn"
        >
          Następna
        </button>
      </div>
    </div>
  );
}

export default Kolekcje;
