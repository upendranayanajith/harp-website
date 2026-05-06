/* ============================================================
   idb.js — IndexedDB helper for HARP file storage
   Replaces localStorage (5 MB limit) with IndexedDB (no hard limit).
   ============================================================ */

const HARP_DB_NAME    = 'harp_files_db';
const HARP_DB_VERSION = 1;
const STORE_DOCS      = 'docs';
const STORE_SLIDES    = 'slides';

function openHarpDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(HARP_DB_NAME, HARP_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_DOCS))   db.createObjectStore(STORE_DOCS,   { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_SLIDES)) db.createObjectStore(STORE_SLIDES, { keyPath: 'id' });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

function idbGetAll(storeName) {
  return openHarpDB().then(db => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = () => reject(req.error);
  }));
}

function idbPutAll(storeName, items) {
  return openHarpDB().then(db => new Promise((resolve, reject) => {
    const tx    = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.clear();
    items.forEach(item => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  }));
}

function idbDelete(storeName, id) {
  return openHarpDB().then(db => new Promise((resolve, reject) => {
    const tx  = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  }));
}

/* Public API */
window.HarpIDB = {
  getDocs:    () => idbGetAll(STORE_DOCS),
  saveDocs:   (docs)   => idbPutAll(STORE_DOCS, docs),
  deleteDoc:  (id)     => idbDelete(STORE_DOCS, id),

  getSlides:  () => idbGetAll(STORE_SLIDES),
  saveSlides: (slides) => idbPutAll(STORE_SLIDES, slides),
  deleteSlide:(id)     => idbDelete(STORE_SLIDES, id),
};
