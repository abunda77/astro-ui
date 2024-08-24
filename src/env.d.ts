/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="astro-icon" />
interface ImportMetaEnv {
    readonly DB_PASSWORD: string;
    readonly PUBLIC_POKEAPI: string;
    readonly VITE_AUTH_ENDPOINT: string;
    readonly MAIL_MAILER: string;
  readonly MAIL_HOST: string;
  readonly MAIL_PORT: string;
  readonly MAIL_USERNAME: string;
  readonly MAIL_PASSWORD: string;
  readonly MAIL_ENCRYPTION: string;
  readonly MAIL_FROM_ADDRESS: string;
  readonly PEXELS_API_KEY: string;
  readonly PUBLIC_FRONTAPI_ENDPOINT: string;
  readonly PUBLIC_HOME_DOMAIN: string;
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }