"use client";

import type { AltarDesign } from "./types";

/**
 * Lưu trữ hoàn toàn phía người dùng bằng IndexedDB (không cần backend).
 * - store "designs": nhiều bản lưu có tên ("Bàn thờ của tôi").
 * - store "meta": bản nháp đang làm (auto-save) theo key "draft".
 * IndexedDB chứa được nhiều ảnh (dataURL) mà không vướng giới hạn ~5MB của localStorage.
 */

const DB_NAME = "bantho";
const DB_VERSION = 1;
const DESIGNS = "designs";
const META = "meta";

export type SavedDesign = {
  id: string;
  name: string;
  design: AltarDesign;
  updatedAt: number;
};

function hasIDB(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DESIGNS)) {
        db.createObjectStore(DESIGNS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(META)) {
        db.createObjectStore(META);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = run(t.objectStore(store));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        t.oncomplete = () => db.close();
      }),
  );
}

export const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.floor(Math.random() * 1e9)}`;

/* ---------- Bản nháp (auto-save) ---------- */

export async function saveDraft(design: AltarDesign): Promise<void> {
  if (!hasIDB()) return;
  try {
    await tx(META, "readwrite", (s) => s.put(design, "draft"));
  } catch {
    /* bỏ qua lỗi lưu (vd chế độ riêng tư) */
  }
}

export async function getDraft(): Promise<AltarDesign | null> {
  if (!hasIDB()) return null;
  try {
    const d = await tx<AltarDesign | undefined>(META, "readonly", (s) =>
      s.get("draft"),
    );
    return d ?? null;
  } catch {
    return null;
  }
}

/* ---------- Nhiều bản lưu có tên ---------- */

export async function listDesigns(): Promise<SavedDesign[]> {
  if (!hasIDB()) return [];
  try {
    const all = await tx<SavedDesign[]>(DESIGNS, "readonly", (s) => s.getAll());
    return all.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function saveDesign(
  name: string,
  design: AltarDesign,
  id?: string,
): Promise<SavedDesign> {
  const record: SavedDesign = {
    id: id ?? newId(),
    name: name.trim() || "Bàn thờ không tên",
    design,
    updatedAt: Date.now(),
  };
  await tx(DESIGNS, "readwrite", (s) => s.put(record));
  return record;
}

export async function deleteDesign(id: string): Promise<void> {
  await tx(DESIGNS, "readwrite", (s) => s.delete(id));
}
