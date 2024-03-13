export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'development',
  host: process.env.DB_HOST || 'localhost',
  host_api: process.env.HOST_API,
  db_name: process.env.DB_NAME,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_port: parseInt(process.env.DB_PORT),
  port: parseInt(process.env.PORT) || 3000,
  jwt_secret: process.env.JWT_SECRET,
});
