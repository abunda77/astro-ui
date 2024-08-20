import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import icon from "astro-icon";


import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind({
    configFile: 'tailwind.config.mjs',
    applyBaseStyles: false,
  }),icon({
    include: {
      mdi: ["*"] // This includes all icons from the MDI set
    }
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
      'import.meta.env.MAIL_FROM_ADDRESS': JSON.stringify(process.env.API_NEWS),
      'import.meta.env.MAIL_FROM_ADDRESS': JSON.stringify(process.env.FASTAPI_ENDPOINT),
      'import.meta.env.MAIL_FROM_ADDRESS': JSON.stringify(process.env.HOME_DOMAIN),
      'import.meta.env.MAIL_FROM_ADDRESS': JSON.stringify(process.env.AUTH_LOGIN_ENDPOINT),
      
      
    },
    ssr: {
      noExternal: ['@astrojs/react'],
    },
  },
  routes: [
    {
      path: '/post/:title/:id',
      component: './src/pages/post/[...slug].astro',
    },
  ],

});