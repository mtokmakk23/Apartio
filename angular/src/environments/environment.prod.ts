import { Environment } from '@abp/ng.core';


const baseUrl = 'https://bayi.beysangroup.com.tr:443';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Apartio',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://bayi.beysangroup.com.tr:444/',
    redirectUri: baseUrl,
    clientId: 'Apartio_App',
    responseType: 'code',
    scope: 'offline_access Apartio',
    requireHttps: false
  },
  apis: {
    default: {
      url: 'https://bayi.beysangroup.com.tr:444',
      rootNamespace: 'Apartio',
    },
  }

} as Environment;
