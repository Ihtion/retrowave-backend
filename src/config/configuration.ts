export const configuration = () => {
  return {
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    DATABASE: {
      TYPE: process.env.DB_TYPE,
      HOST: process.env.DB_HOST,
      PORT: process.env.DB_PORT,
      USERNAME: process.env.DB_USERNAME,
      PASSWORD: process.env.DB_PASSWORD,
      NAME: process.env.DB_DATABASE,
      SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
    },
    JWT_EXPIRATION: process.env.JWT_EXPIRATION,
    SECRET_KEY: process.env.SECRET_KEY,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  };
};
