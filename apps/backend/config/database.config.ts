export default () => ({
    host: process.env.MYSQL_HOST || 'localhost',
    db_port: parseInt(process.env.DB_PORT, 10) || 3306,
    db_username: process.env.DB_USERNAME || 'root',
    db_password: process.env.DB_PASSWORD || '',
    db_database: process.env.DB_DATABASE || 'booquiz',
    db_synchronize: process.env.DB_SYNCHRONIZE === 'true',
});
