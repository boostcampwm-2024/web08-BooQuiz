export default () => ({
    host: process.env.MYSQL_HOST,
    db_port: parseInt(process.env.DB_PORT, 10),
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_database: process.env.DB_DATABASE,
    db_synchronize: process.env.DB_SYNCHRONIZE,
});
