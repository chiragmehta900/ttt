let appConfig = {};

appConfig.port = 8080;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";

module.exports = {
    port: appConfig.port,
    allowedCorsOrigin: appConfig.allowedCorsOrigin,
    environment: appConfig.env
};