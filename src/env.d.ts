/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly DB_PASSWORD: string;
    readonly PUBLIC_POKEAPI: string;
    readonly VITE_AUTH_ENDPOINT: string;
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }