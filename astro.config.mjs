import { defineConfig } from 'astro/config';
import react from "@astrojs/react";


import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    configFile: 'tailwind.config.mjs',
    applyBaseStyles: false,
  })],

  vite: {
    define: {
      'import.meta.env.MAIL_MAILER': JSON.stringify(process.env.MAIL_MAILER),
      'import.meta.env.MAIL_HOST': JSON.stringify(process.env.MAIL_HOST),
      'import.meta.env.MAIL_PORT': JSON.stringify(process.env.MAIL_PORT),
      'import.meta.env.MAIL_USERNAME': JSON.stringify(process.env.MAIL_USERNAME),
      'import.meta.env.MAIL_PASSWORD': JSON.stringify(process.env.MAIL_PASSWORD),
      'import.meta.env.MAIL_ENCRYPTION': JSON.stringify(process.env.MAIL_ENCRYPTION),
      'import.meta.env.MAIL_FROM_ADDRESS': JSON.stringify(process.env.MAIL_FROM_ADDRESS),
      'import.meta.env.MAIL_FROM_ADDRESS': JSON.stringify(process.env.PEXELS_API_KEY),
    },
  },


});