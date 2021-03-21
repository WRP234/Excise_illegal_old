import { host } from '../app/app.config';

export const environment = {
  production: false,
  api: `http://${host.api}:1122/`,
  api90: `http://${host.api}:1111`,
  api_port: `http://${host.api}:`
};
