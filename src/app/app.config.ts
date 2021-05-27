export enum host {
  /** ==>> PROD EXCISE_SERVER <<== */
  // api = "192.168.109.52",
  // report = "192.168.109.54",
  // xcs_dns_service = 'http://web.excise.go.th/EDRestServices',
  // xcs_ip_service = 'http://192.168.3.136/EDRestServices',
  // oag_service = 'http://oag1.uat.excise.go.th',

  // /** ==>> UAT EXCISE_SERVER <<== */
  // api = "192.168.112.31",
  // report = "192.168.112.32",
  // xcs_dns_service = 'http://webtest.excise.go.th/EDRestServicesUAT',
  // xcs_ip_service = 'http://192.168.103.10/EDRestServicesUAT',
  // oag_service = 'http://oag1.uat.excise.go.th',

  /** ==>> DEV COLOCATION_SERVER <<== */
  // api = "103.233.193.62", //api_score
  // api = "localhost",
  // api = "10.11.1.116", //api_pcc
  api = "192.168.112.31", //api_rd_uat
  // api = "edrac12-scan.excise.go.th", //api_rd_uat2
  // api = "192.168.109.52", //api_rd_production
  // report = "scorexcsilg.thddns.net:8000",
  report = "192.168.112.32", //report_rd_uat
  // report = "172.29.60.13", //report_rd_pcc
  xcs_dns_service = 'http://webtest.excise.go.th/EDRestServicesUAT',
  xcs_ip_service = 'http://192.168.103.10/EDRestServicesUAT',
  oag_service = 'http://oag1.uat.excise.go.th',

  /** ==>> LOCALHOST <<== */
  // localhost = "localhost"
}


export const appConfig = {
  /** Illegal_Service */
  api1111: `http://${host.api}:1111/XCS60`,
  api2222: `http://${host.api}:2222/XCS60`,
  api1118: `http://${host.api}:1118/XCS60`,
  api1119: `http://${host.api}:1119/XCS60`,
  api1120: `http://${host.api}:1120/XCS60`,
  api1122: `http://${host.api}:1122/XCS60`,
  api1121: `http://${host.api}:1121/XCS60`,
  api8086: `http://${host.api}:8086/XCS60`,
  apiReport: `http://${host.report}/Report_XCS`,

  /** Excise_Service */
  XCS_DNS_SERVICE: `${host.xcs_dns_service}`,
  XCS_IP_SERVICE: `${host.xcs_ip_service}`,
  OAG_SERVICE: `${host.oag_service}`,
  XCS_API_GATEWAY: 'http://apigateway.excise.go.th',
  XCS_IP_ETS_SIGNER: 'http://192.168.160.59',
};