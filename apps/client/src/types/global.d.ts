// src/types/global.d.ts or src/custom.d.ts
export {};

declare global {
  interface Window {
    transformers: any;
  }
}
