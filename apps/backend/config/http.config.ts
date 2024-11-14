export enum Environment {
    Development = 'DEV',
    Staging = 'STG',
    Production = 'PROD',
}

export default () => ({
    env: process.env.NODE_ENV || Environment.Development,
    port: parseInt(process.env.PORT) || 3000,
    sessionSecret: process.env.SESSION_SECRET || 'development-session-secret',
});
