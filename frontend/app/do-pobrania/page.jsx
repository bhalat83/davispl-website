'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import { buildApiUrl } from '@/lib/api';
import './DoPobrania.css';

const CATEGORIES = ['technicalSheet', 'photos', 'video', 'textures3d'];
const FILE_CATEGORIES = new Set(['technicalSheet', 'video']);
const FOLDER_CATEGORIES = new Set(['textures3d']);

function getCategoryLabel(cat, t) {
  return {
    technicalSheet: t.catTechnicalSheet,
    photos: t.catPhotos,
    video: t.catVideo,
    textures3d: t.catTextures3d,
  }[cat];
}

const collectionKey = (cId) => `c:${cId}`;
const categoryKey = (cId, cat) => `c:${cId}:${cat}`;
const variantKey = (cId, cat, vId) => `c:${cId}:${cat}:v:${vId}`;
const fileKey = (cId, cat, idx) => `c:${cId}:${cat}:f:${idx}`;

const getVideoFiles = (col) => {
  const media = col.media?.video;
  if (!media) return [];
  const url = media.sizes?.['340x492'] ||
              media.sizes?.['360x360'] ||
              media.sizes?.['662x662'] ||
              media.video ||
              (media.sizes ? Object.values(media.sizes)[0] : null);
  if (!url) return [];
  const filename = url.split('/').pop() || 'video';
  const thumb = media.thumb || col.media?.image || null;
  return [{ name: filename, url, thumb }];
};

const getTechnicalFiles = (col) => {
  if (!col.pdf) return [];
  return [{ name: 'Karta katalogowa', url: col.pdf }];
};

const getCategoryFileCount = (col, cat) => {
  if (cat === 'technicalSheet') return getTechnicalFiles(col).length;
  if (cat === 'photos') return (col.variants || []).length;
  if (cat === 'video') return getVideoFiles(col).length;
  if (cat === 'textures3d') return 0;
  return 0;
};

const getTotalFileCount = (col) =>
  CATEGORIES.reduce((sum, cat) => sum + getCategoryFileCount(col, cat), 0);

function CheckboxIcon({ checked, indeterminate, onToggle }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="tree-checkbox"
      checked={checked}
      onChange={() => {}}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
    />
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className="tree-file-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M3 1.5h6l3 3v9H3v-12z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      <path d="M9 1.5v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

export default function DoPobrania() {
  const { language } = useLanguage();
  const t = translations[language].downloads;

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCollections, setExpandedCollections] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedVariantFolders, setExpandedVariantFolders] = useState(new Set());
  const [checked, setChecked] = useState(new Set());

  useEffect(() => {
    fetch(buildApiUrl('/v1/collections?per_page=1000'))
      .then((r) => r.json())
      .then((data) => {
        setCollections(data.collections || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = collections.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const childKeys = useCallback(
    (cId, cat) => {
      const col = collections.find((c) => c.id === cId);
      if (!col) return [];
      if (cat === 'technicalSheet') return getTechnicalFiles(col).map((_, i) => fileKey(cId, cat, i));
      if (cat === 'video') return getVideoFiles(col).map((_, i) => fileKey(cId, cat, i));
      return (col.variants || []).map((v) => variantKey(cId, cat, v.id));
    },
    [collections]
  );

  const allCollectionKeys = useCallback(
    (cId) => {
      const keys = [collectionKey(cId)];
      CATEGORIES.forEach((cat) => {
        keys.push(categoryKey(cId, cat));
        childKeys(cId, cat).forEach((k) => keys.push(k));
      });
      return keys;
    },
    [childKeys]
  );

  const isChecked = (key) => checked.has(key);

  const isIndeterminate = useCallback(
    (keys) => {
      const some = keys.some((k) => checked.has(k));
      const all = keys.every((k) => checked.has(k));
      return some && !all;
    },
    [checked]
  );

  const allChecked = useCallback(
    (keys) => keys.length > 0 && keys.every((k) => checked.has(k)),
    [checked]
  );

  const toggle = (keys) => {
    setChecked((prev) => {
      const next = new Set(prev);
      const value = !keys.every((k) => prev.has(k));
      keys.forEach((k) => (value ? next.add(k) : next.delete(k)));
      return next;
    });
  };

  const toggleCollection = (cId) => {
    setExpandedCollections((prev) => {
      const next = new Set(prev);
      next.has(cId) ? next.delete(cId) : next.add(cId);
      return next;
    });
  };

  const toggleCategory = (key) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleVariantFolder = (key) => {
    setExpandedVariantFolders((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const fileCountLabel = (n) => {
    if (language === 'ENG') return `${n} ${n === 1 ? t.fileSingular : t.fileMany}`;
    if (n === 1) return `1 ${t.fileSingular}`;
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} ${t.fileFew}`;
    return `${n} ${t.fileMany}`;
  };

  const totalSelected = checked.size;

  const resolveCheckedFiles = useCallback(() => {
    const files = [];
    const seen = new Set();
    const collectionNames = new Set();

    for (const key of checked) {
      const parts = key.split(':');
      if (parts.length < 5) continue; // skip collection/category keys

      const cId = parts[1];
      const cat = parts[2];
      const type = parts[3];
      const idOrIdx = parts[4];

      const col = collections.find((c) => String(c.id) === cId);
      if (!col) continue;

      if (type === 'f') {
        const idx = parseInt(idOrIdx);
        if (cat === 'technicalSheet') {
          const file = getTechnicalFiles(col)[idx];
          if (file && !seen.has(file.url)) {
            seen.add(file.url);
            collectionNames.add(col.name);
            files.push({ name: `${col.name} - Karta katalogowa.pdf`, url: file.url });
          }
        } else if (cat === 'video') {
          const file = getVideoFiles(col)[idx];
          if (file && !seen.has(file.url)) {
            seen.add(file.url);
            collectionNames.add(col.name);
            files.push({ name: file.name, url: file.url });
          }
        }
      } else if (type === 'v' && cat === 'photos') {
        const variant = (col.variants || []).find((v) => String(v.id) === idOrIdx);
        if (variant?.image && !seen.has(variant.image)) {
          seen.add(variant.image);
          collectionNames.add(col.name);
          const ext = variant.image.split('.').pop()?.split('?')[0] || 'jpg';
          files.push({ name: `${col.name} - ${variant.name}.${ext}`, url: variant.image });
        }
      }
    }

    const names = [...collectionNames];
    const zipName = names.length === 1
      ? names[0]
      : names.length <= 3
        ? names.join(', ')
        : 'kolekcje';

    return { files, zipName };
  }, [checked, collections]);

  const [downloading, setDownloading] = useState(false);
  const [quickDownloading, setQuickDownloading] = useState({});

  const handleQuickDownload = async (type) => {
    setQuickDownloading((prev) => ({ ...prev, [type]: true }));

    const files = [];
    for (const col of collections) {
      if (type === 'collections') {
        for (const v of col.variants || []) {
          if (v.image) {
            const ext = v.image.split('.').pop()?.split('?')[0] || 'jpg';
            files.push({ name: `${col.name} - ${v.name}.${ext}`, url: v.image });
          }
        }
      } else if (type === 'marketing') {
        const vids = getVideoFiles(col);
        vids.forEach((f) => files.push({ name: f.name, url: f.url }));
      } else if (type === 'technical') {
        const techs = getTechnicalFiles(col);
        techs.forEach((f) => files.push({ name: `${col.name} - Karta katalogowa.pdf`, url: f.url }));
      }
    }

    if (!files.length) {
      setQuickDownloading((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      const names = { collections: 'Kolekcje', marketing: 'Marketing', technical: 'Dane-techniczne' };
      a.download = files.length === 1 ? files[0].name : `${names[type]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Quick download error:', err);
    }

    setQuickDownloading((prev) => ({ ...prev, [type]: false }));
  };

  const handleDownload = async () => {
    const { files, zipName } = resolveCheckedFiles();
    if (!files.length) return;
    setDownloading(true);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files }),
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = files.length === 1 ? files[0].name : `${zipName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Download error:', err);
    }

    setDownloading(false);
  };

  return (
    <div className="downloads-page">
      <div className="downloads-container">
        <div className="downloads-header">
          <h1 className="downloads-title">{t.title}</h1>
          <div className="downloads-search">
            <input
              type="text"
              className="downloads-search-input"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="downloads-search-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>

        <div className="downloads-layout">
          <div className="downloads-tree-col">
            {loading ? (
              <p className="tree-no-results">{t.loading}</p>
            ) : filtered.length === 0 ? (
              <p className="tree-no-results">{t.noResults}</p>
            ) : (
              <div className="downloads-tree">
                {filtered.map((col) => {
                  const cId = col.id;
                  const colExpanded = expandedCollections.has(cId);
                  const colKeys = allCollectionKeys(cId);
                  const colChecked = allChecked(colKeys);
                  const colIndeterminate = isIndeterminate(colKeys);
                  const colThumb = col.media?.video?.thumb || col.media?.image;
                  const totalFiles = getTotalFileCount(col);

                  return (
                    <div key={cId} className="tree-collection">
                      <div
                        className={`tree-row tree-row--collection${colExpanded ? ' tree-row--open' : ''}`}
                        onClick={() => toggleCollection(cId)}
                      >
                        <CheckboxIcon
                          checked={colChecked}
                          indeterminate={colIndeterminate}
                          onToggle={() => toggle(colKeys)}
                        />
                        {colThumb && (
                          <div className="tree-col-thumb">
                            <img src={colThumb} alt={col.name} />
                          </div>
                        )}
                        <div className="tree-label-group">
                          <span className="tree-label tree-label--collection">{col.name}</span>
                          <span className="tree-meta">{fileCountLabel(totalFiles)}</span>
                        </div>
                        <span className={`tree-toggle ${colExpanded ? 'tree-toggle--open' : ''}`}>
                          <ChevronIcon />
                        </span>
                      </div>

                      {colExpanded && (
                        <div className="tree-children">
                          {CATEGORIES.map((cat) => {
                            const catKey = categoryKey(cId, cat);
                            const isFileCategory = FILE_CATEGORIES.has(cat);
                            const isFolderCategory = FOLDER_CATEGORIES.has(cat);
                            const catExpanded = expandedCategories.has(catKey);
                            const cKeys = childKeys(cId, cat);
                            const catAllKeys = [catKey, ...cKeys];
                            const catChecked = allChecked(catAllKeys);
                            const catIndeterminate = isIndeterminate(catAllKeys);
                            const fileCount = getCategoryFileCount(col, cat);

                            const technicalFiles = cat === 'technicalSheet' ? getTechnicalFiles(col) : [];
                            const videoFiles = cat === 'video' ? getVideoFiles(col) : [];
                            const photoVariants = cat === 'photos' ? (col.variants || []) : [];
                            const folderVariants = isFolderCategory ? (col.variants || []) : [];

                            return (
                              <div key={cat} className="tree-category-wrapper">
                                <div
                                  className={`tree-row tree-row--category${catExpanded ? ' tree-row--open' : ''}`}
                                  onClick={() => toggleCategory(catKey)}
                                >
                                  <CheckboxIcon
                                    checked={catChecked}
                                    indeterminate={catIndeterminate}
                                    onToggle={() => toggle(catAllKeys)}
                                  />
                                  <div className="tree-label-count">
                                    <span className="tree-label">{getCategoryLabel(cat, t)}</span>
                                    <span className="tree-count">| {fileCountLabel(fileCount)}</span>
                                  </div>
                                  <span className={`tree-toggle ${catExpanded ? 'tree-toggle--open' : ''}`}>
                                    <ChevronIcon />
                                  </span>
                                </div>

                                {catExpanded && (
                                  <div className="tree-category-content">
                                    {cat === 'technicalSheet' && technicalFiles.map((file, i) => {
                                      const fKey = fileKey(cId, cat, i);
                                      return (
                                        <div
                                          key={i}
                                          className="tree-row tree-row--file tree-item"
                                          onClick={() => toggle([fKey])}
                                        >
                                          <CheckboxIcon
                                            checked={isChecked(fKey)}
                                            indeterminate={false}
                                            onToggle={() => toggle([fKey])}
                                          />
                                          <FileIcon />
                                          <span className="tree-label tree-label--variant">{file.name}</span>
                                        </div>
                                      );
                                    })}

                                    {cat === 'video' && videoFiles.map((file, i) => {
                                      const fKey = fileKey(cId, cat, i);
                                      return (
                                        <div
                                          key={i}
                                          className="tree-row tree-row--file tree-item"
                                          onClick={() => toggle([fKey])}
                                        >
                                          <CheckboxIcon
                                            checked={isChecked(fKey)}
                                            indeterminate={false}
                                            onToggle={() => toggle([fKey])}
                                          />
                                          {file.thumb && (
                                            <div className="tree-variant-thumb">
                                              <img src={file.thumb} alt={file.name} />
                                            </div>
                                          )}
                                          <span className="tree-label tree-label--variant">{file.name}</span>
                                        </div>
                                      );
                                    })}

                                    {cat === 'photos' && photoVariants.map((v) => {
                                      const vKey = variantKey(cId, cat, v.id);
                                      return (
                                        <div
                                          key={v.id}
                                          className="tree-row tree-row--file tree-item"
                                          onClick={() => toggle([vKey])}
                                        >
                                          <CheckboxIcon
                                            checked={isChecked(vKey)}
                                            indeterminate={false}
                                            onToggle={() => toggle([vKey])}
                                          />
                                          {v.image && (
                                            <div className="tree-variant-thumb">
                                              <img src={v.image} alt={v.name} />
                                            </div>
                                          )}
                                          <span className="tree-label tree-label--variant">{v.name}</span>
                                        </div>
                                      );
                                    })}

                                    {cat === 'textures3d' && folderVariants.map((v) => {
                                      const vKey = variantKey(cId, cat, v.id);
                                      const folderExpanded = expandedVariantFolders.has(vKey);
                                      return (
                                        <div key={v.id} className="tree-item">
                                          <div
                                            className={`tree-row tree-row--folder${folderExpanded ? ' tree-row--open' : ''}`}
                                            onClick={() => toggleVariantFolder(vKey)}
                                          >
                                            <CheckboxIcon
                                              checked={isChecked(vKey)}
                                              indeterminate={false}
                                              onToggle={() => toggle([vKey])}
                                            />
                                            <div className="tree-label-count">
                                              <span className="tree-label tree-label--variant">{v.name}</span>
                                              <span className="tree-count">| {fileCountLabel(0)}</span>
                                            </div>
                                            <span className={`tree-toggle ${folderExpanded ? 'tree-toggle--open' : ''}`}>
                                              <ChevronIcon />
                                            </span>
                                          </div>
                                          {folderExpanded && (
                                            <div className="tree-row tree-row--empty">
                                              <span className="tree-empty-label">{t.noFiles}</span>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {totalSelected > 0 && (
              <div className="downloads-fab">
                <button
                  className="downloads-fab-btn"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? t.downloading || 'Pobieranie...' : t.downloadBtn}
                  <span className="downloads-fab-count">{totalSelected}</span>
                </button>
              </div>
            )}
          </div>

          <div className="downloads-side-col">
            <div className="quick-download">
              <h2 className="quick-download-title">Szybkie pobieranie</h2>
              <div className="quick-download-list">
                {[
                  { key: 'collections', label: 'Kolekcje', desc: 'Różne' },
                  { key: 'marketing', label: 'Marketing', desc: 'Logotypy' },
                  { key: 'technical', label: 'Dane techniczne', desc: 'Certyfikaty' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="quick-download-row">
                    <span className="quick-download-label">{label}</span>
                    <span className="quick-download-desc">{desc}</span>
                    <button
                      className="quick-download-btn"
                      onClick={() => handleQuickDownload(key)}
                      disabled={quickDownloading[key] || loading}
                    >
                      {quickDownloading[key] ? 'Pobieranie...' : 'Pobierz paczkę z kolekcjami'}
                      <svg className="quick-download-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
