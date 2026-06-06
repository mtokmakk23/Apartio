import { Environment } from '@abp/ng.core';
import { eAccountComponents } from '@abp/ng.account';

const baseUrl = 'http://localhost:4200';

export const environment = {
  
  production: false,
  application: {
    baseUrl,
    name: 'Apartio',
    logoUrl: '',
    menus: {
      [eAccountComponents.PersonalSettings]: {
        hidden: true
      }
    }
  },

  oAuthConfig: {
    issuer: 'https://localhost:44359/',
    redirectUri: baseUrl,
    clientId: 'Apartio_App',
    responseType: 'code',
    scope: 'offline_access Apartio',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44359',
      rootNamespace: 'Apartio',
    },
  }
} as Environment;
