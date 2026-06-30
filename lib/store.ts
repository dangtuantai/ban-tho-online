"use client";

import { create } from "zustand";
import {
  type AltarItem,
  type AltarDesign,
  type ItemType,
  STAGE_WIDTH,
  STAGE_HEIGHT,
} from "./types";
import {
  defaultLayout,
  BACKGROUNDS,
  defaultSrc,
  DEFAULT_BURN_SECONDS,
} from "./altarConfig";

type Snapshot = { items: AltarItem[]; background: string };

type EditorState = {
  items: AltarItem[];
  background: string;
  selectedId: string | null;
  past: Snapshot[];
  future: Snapshot[];
  /** Bản lưu có tên đang mở (để "Lưu" cập nhật đúng bản đó). */
  savedId: string | null;
  savedName: string;

  addItem: (type: ItemType, partial?: Partial<AltarItem>) => void;
  updateItem: (id: string, patch: Partial<AltarItem>, record?: boolean) => void;
  removeItem: (id: string) => void;
  select: (id: string | null) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  setBackground: (id: string) => void;

  applyDefaultLayout: () => void;
  clearAll: () => void;

  undo: () => void;
  redo: () => void;

  toDesign: () => AltarDesign;
  loadDesign: (d: AltarDesign) => void;
  setSaved: (id: string | null, name: string) => void;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.floor(Math.random() * 1e9)}`;

function snap(s: EditorState): Snapshot {
  return { items: s.items.map((i) => ({ ...i })), background: s.background };
}

export const useEditor = create<EditorState>((set, get) => ({
  items: [],
  background: BACKGROUNDS[0].id,
  selectedId: null,
  past: [],
  future: [],
  savedId: null,
  savedName: "",

  addItem: (type, partial) => {
    const s = get();
    const item: AltarItem = {
      id: newId(),
      type,
      x: partial?.x ?? STAGE_WIDTH / 2,
      y: partial?.y ?? STAGE_HEIGHT / 2,
      scale: partial?.scale ?? 1,
      rotation: partial?.rotation ?? 0,
      src: partial?.src ?? defaultSrc(type),
      ...(type === "anh_tho" ? { gender: partial?.gender ?? "nam" } : {}),
      ...(type === "nhang"
        ? { litAt: Date.now(), burnSeconds: DEFAULT_BURN_SECONDS }
        : {}),
      ...partial,
    };
    set({
      past: [...s.past, snap(s)],
      future: [],
      items: [...s.items, item],
      selectedId: item.id,
    });
  },

  updateItem: (id, patch, record = true) => {
    const s = get();
    set({
      ...(record ? { past: [...s.past, snap(s)], future: [] } : {}),
      items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  },

  removeItem: (id) => {
    const s = get();
    set({
      past: [...s.past, snap(s)],
      future: [],
      items: s.items.filter((i) => i.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    });
  },

  select: (id) => set({ selectedId: id }),

  bringForward: (id) => {
    const s = get();
    const idx = s.items.findIndex((i) => i.id === id);
    if (idx < 0 || idx === s.items.length - 1) return;
    const items = [...s.items];
    [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
    set({ past: [...s.past, snap(s)], future: [], items });
  },

  sendBackward: (id) => {
    const s = get();
    const idx = s.items.findIndex((i) => i.id === id);
    if (idx <= 0) return;
    const items = [...s.items];
    [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
    set({ past: [...s.past, snap(s)], future: [], items });
  },

  setBackground: (id) => {
    const s = get();
    set({ past: [...s.past, snap(s)], future: [], background: id });
  },

  applyDefaultLayout: () => {
    const s = get();
    const items: AltarItem[] = defaultLayout().map((l) => ({
      id: newId(),
      type: l.type,
      x: l.x,
      y: l.y,
      scale: 1,
      rotation: 0,
      src: defaultSrc(l.type),
      ...("gender" in l ? { gender: l.gender } : {}),
    }));
    set({ past: [...s.past, snap(s)], future: [], items, selectedId: null });
  },

  clearAll: () => {
    const s = get();
    set({ past: [...s.past, snap(s)], future: [], items: [], selectedId: null });
  },

  undo: () => {
    const s = get();
    if (!s.past.length) return;
    const previous = s.past[s.past.length - 1];
    set({
      past: s.past.slice(0, -1),
      future: [snap(s), ...s.future],
      items: previous.items,
      background: previous.background,
      selectedId: null,
    });
  },

  redo: () => {
    const s = get();
    if (!s.future.length) return;
    const next = s.future[0];
    set({
      past: [...s.past, snap(s)],
      future: s.future.slice(1),
      items: next.items,
      background: next.background,
      selectedId: null,
    });
  },

  toDesign: () => {
    const s = get();
    return {
      version: 1,
      background: s.background,
      items: s.items,
      updatedAt: typeof Date !== "undefined" ? Date.now() : 0,
    };
  },

  loadDesign: (d) => {
    set({
      items: d.items ?? [],
      background: d.background ?? BACKGROUNDS[0].id,
      selectedId: null,
      past: [],
      future: [],
    });
  },

  setSaved: (id, name) => set({ savedId: id, savedName: name }),
}));
