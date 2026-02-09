import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import CollectionCard from '../components/CollectionCard';
import { buildApiUrl } from '../utils/api';
import './Kolekcje.css';

function Kolekcje() {
  const { language } = useLanguage();
  const t = translations[language].collections;
  const [searchParams, setSearchParams] = useSearchParams();
  const [allCollections, setAllCollections] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(16);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedRodzaj, setSelectedRodzaj] = useState([]);
  const [selectedTechnologia, setSelectedTechnologia] = useState([]);
  const [selectedFilter3, setSelectedFilter3] = useState([]);
  const [selectedFilter4, setSelectedFilter4] = useState([]);
  const [rodzajeOptions, setRodzajeOptions] = useState([]);
  const [technologiaOptions, setTechnologiaOptions] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  // Sync URL search param with state
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndPaginateCollections();
  }, [searchQuery, currentPage, allCollections, selectedRodzaj, selectedTechnologia, selectedFilter3, selectedFilter4]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        buildApiUrl(`/v1/collections?page=1&per_page=1000`)
      );

      if (!response.ok) {
        throw new Error(t.errorFetch);
      }

      const data = await response.json();

      // API zwraca obiekt z collections i pagination
      const collectionsArray = data.collections || [];

      // Sortowanie po ID malejąco (wyższe ID = nowsze)
      const sortedCollections = collectionsArray.sort((a, b) => b.id - a.id);

      setAllCollections(sortedCollections);

      // Wyciągnij unikalne wartości dla filtrów
      extractFilterOptions(sortedCollections);

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (collections) => {
    const rodzajeSet = new Set();
    const technologiaSet = new Set();

    collections.forEach(collection => {
      // Szukaj "Rodzaj" w attributes
      if (collection.attributes) {
        collection.attributes.forEach(attr => {
          if (attr.name === 'Rodzaj' && attr.value) {
            rodzajeSet.add(attr.value);
          }
        });
      }
      // Szukaj "Rodzaj" w parameters
      if (collection.parameters) {
        collection.parameters.forEach(param => {
          if (param.name === 'Rodzaj' && param.value) {
            rodzajeSet.add(param.value);
          }
        });
      }
      // Pobierz "Technologia" z functions
      if (collection.functions && Array.isArray(collection.functions)) {
        collection.functions.forEach(func => {
          if (func.name) {
            technologiaSet.add(func.name);
          }
        });
      }
    });

    setRodzajeOptions(Array.from(rodzajeSet).sort());
    setTechnologiaOptions(Array.from(technologiaSet).sort());
  };

  const filterAndPaginateCollections = () => {
    let filtered = allCollections;

    // Filtruj według wyszukiwania
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(query)
      );
    }

    // Filtruj według Rodzaj (wielokrotny wybór)
    if (selectedRodzaj.length > 0) {
      filtered = filtered.filter(collection => {
        return selectedRodzaj.some(rodzaj => {
          const hasInAttributes = collection.attributes?.some(
            attr => attr.name === 'Rodzaj' && attr.value === rodzaj
          );
          const hasInParameters = collection.parameters?.some(
            param => param.name === 'Rodzaj' && param.value === rodzaj
          );
          return hasInAttributes || hasInParameters;
        });
      });
    }

    // Filtruj według Technologia (wielokrotny wybór, z functions)
    if (selectedTechnologia.length > 0) {
      filtered = filtered.filter(collection => {
        return selectedTechnologia.some(tech =>
          collection.functions?.some(func => func.name === tech)
        );
      });
    }

    // Oblicz total pages dla przefiltrowanych wyników
    const calculatedTotalPages = Math.ceil(filtered.length / perPage);
    setTotalPages(calculatedTotalPages);

    // Pobierz kolekcje dla aktualnej strony
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedCollections = filtered.slice(startIndex, endIndex);

    setCollections(paginatedCollections);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    // Update URL without search param if empty
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const toggleFilterValue = (filterType, value) => {
    let setter;
    let currentValues;

    switch(filterType) {
      case 'rodzaj':
        setter = setSelectedRodzaj;
        currentValues = selectedRodzaj;
        break;
      case 'technologia':
        setter = setSelectedTechnologia;
        currentValues = selectedTechnologia;
        break;
      case 'filter3':
        setter = setSelectedFilter3;
        currentValues = selectedFilter3;
        break;
      case 'filter4':
        setter = setSelectedFilter4;
        currentValues = selectedFilter4;
        break;
      default:
        return;
    }

    const isSelected = currentValues.includes(value);
    if (isSelected) {
      setter(currentValues.filter(v => v !== value));
    } else {
      setter([...currentValues, value]);
    }
    setCurrentPage(1);
  };

  const getFilterLabel = (filterType) => {
    let selectedValues;
    switch(filterType) {
      case 'rodzaj':
        selectedValues = selectedRodzaj;
        break;
      case 'technologia':
        selectedValues = selectedTechnologia;
        break;
      case 'filter3':
        selectedValues = selectedFilter3;
        break;
      case 'filter4':
        selectedValues = selectedFilter4;
        break;
      default:
        return '';
    }

    if (selectedValues.length === 0) {
      return filterType === 'rodzaj' ? 'Rodzaj' :
             filterType === 'technologia' ? 'Technologia' :
             filterType === 'filter3' ? 'Filtr 3' : 'Filtr 4';
    }
    return `${selectedValues.length} wybrane`;
  };

  const clearAllFilters = () => {
    setSelectedRodzaj([]);
    setSelectedTechnologia([]);
    setSelectedFilter3([]);
    setSelectedFilter4([]);
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return selectedRodzaj.length > 0 ||
           selectedTechnologia.length > 0 ||
           selectedFilter3.length > 0 ||
           selectedFilter4.length > 0 ||
           searchQuery.trim() !== '';
  };

  // Oblicz całkowitą liczbę przefiltrowanych produktów
  const getTotalFilteredCount = () => {
    let filtered = allCollections;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(query)
      );
    }

    if (selectedRodzaj.length > 0) {
      filtered = filtered.filter(collection => {
        return selectedRodzaj.some(rodzaj => {
          const hasInAttributes = collection.attributes?.some(
            attr => attr.name === 'Rodzaj' && attr.value === rodzaj
          );
          const hasInParameters = collection.parameters?.some(
            param => param.name === 'Rodzaj' && param.value === rodzaj
          );
          return hasInAttributes || hasInParameters;
        });
      });
    }

    if (selectedTechnologia.length > 0) {
      filtered = filtered.filter(collection => {
        return selectedTechnologia.some(tech =>
          collection.functions?.some(func => func.name === tech)
        );
      });
    }

    return filtered.length;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        <div className="collections-loading">{t.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="collections-error">{t.error}: {error}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="collections-header">
        <h1>{t.title}</h1>
      </div>

      <div className="collections-filters" ref={dropdownRef}>
        {/* Rodzaj Dropdown */}
        <div className="filter-dropdown">
          <button
            className="filter-button"
            onClick={() => setOpenDropdown(openDropdown === 'rodzaj' ? null : 'rodzaj')}
            disabled={rodzajeOptions.length === 0}
          >
            {getFilterLabel('rodzaj')}
            <span className={`filter-arrow ${openDropdown === 'rodzaj' ? 'open' : ''}`}></span>
          </button>
          {openDropdown === 'rodzaj' && rodzajeOptions.length > 0 && (
            <div className="filter-dropdown-menu">
              {rodzajeOptions.map(option => (
                <label key={option} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedRodzaj.includes(option)}
                    onChange={() => toggleFilterValue('rodzaj', option)}
                  />
                  <span className="filter-option-text">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Technologia Dropdown */}
        <div className="filter-dropdown">
          <button
            className="filter-button"
            onClick={() => setOpenDropdown(openDropdown === 'technologia' ? null : 'technologia')}
            disabled={technologiaOptions.length === 0}
          >
            {getFilterLabel('technologia')}
            <span className={`filter-arrow ${openDropdown === 'technologia' ? 'open' : ''}`}></span>
          </button>
          {openDropdown === 'technologia' && technologiaOptions.length > 0 && (
            <div className="filter-dropdown-menu">
              {technologiaOptions.map(option => (
                <label key={option} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedTechnologia.includes(option)}
                    onChange={() => toggleFilterValue('technologia', option)}
                  />
                  <span className="filter-option-text">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Filtr 3 - Disabled */}
        <div className="filter-dropdown">
          <button className="filter-button" disabled>
            Filtr 3
            <span className="filter-arrow"></span>
          </button>
        </div>

        {/* Filtr 4 - Disabled */}
        <div className="filter-dropdown">
          <button className="filter-button" disabled>
            Filtr 4
            <span className="filter-arrow"></span>
          </button>
        </div>
      </div>

      <div className="collections-search">
        <input
          type="text"
          placeholder="Wpisz nazwę kolekcji"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="collections-info">
        <div className="collections-count">
          Produkty ({getTotalFilteredCount()})
        </div>
        {hasActiveFilters() && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Wyczyść filtry
          </button>
        )}
      </div>

      {collections.length === 0 && !loading ? (
        <div className="collections-empty">Nie znaleziono kolekcji</div>
      ) : (
        <div className="collections-grid">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="collections-pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagination-btn pagination-arrow"
          >
            ←
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
            disabled={currentPage >= totalPages}
            className="pagination-btn pagination-arrow"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default Kolekcje;
