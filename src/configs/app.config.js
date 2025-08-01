const convict = require('convict')
const dotenv = require('dotenv')
const path = require('path')

// Update path for dotenv file
dotenv.config({ path: path.resolve('src', '../.env') })

const config = convict({
  app: {
    name: {
      doc: 'Tgt Admin',
      format: String,
      default: 'Tgt Admin'
    },
    siteUrl: {
      doc: 'URL of the application Site',
      format: String,
      default: '',
      env: 'WEB_APP_URL'
    },
    userBackendUrl: {
      default: '',
      env: 'USER_BACKEND_URL'
    },
    jobBackendUrl: {
      default: '',
      env: 'JOB_BACKEND_URL'
    },
    userFrontendUrl: {
      default: '',
      env: 'USER_FRONTEND_URL'
    },
    origin: {
      default: '',
      env: 'ALLOWED_ORIGIN'
    }
  },
  alea: {
    casino_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_ID'
    },
    casino_pp_sc_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_PP_SC_ID'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_KEY'
    },
    secret_pp_key: {
      format: String,
      default: '',
      env: 'ALEA_PP_SECRET_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'ALEA_BASE_URL'
    },
    secret_token: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_TOKEN'
    },
    environment_id: {
      format: String,
      default: '',
      env: 'ALEA_ENVIRONMENT_ID'
    },
    pp_environment_id: {
      format: String,
      default: '',
      env: 'ALEA_PP_ENVIRONMENT_ID'
    }
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 8080,
    env: 'PORT'
  },
  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },
  webApp: {
    adminDomain: {
      default: '',
      env: 'ADMIN_DOMAIN'
    }
  },

  sequelize: {
    name: {
      default: 'test_db',
      env: 'DB_NAME'
    },
    user: {
      default: 'postgres',
      env: 'DB_USER'
    },
    password: {
      default: '123456',
      env: 'DB_PASSWORD'
    },
    readHost: {
      default: 'localhost',
      env: 'DB_READ_HOST'
    },
    writeHost: {
      default: 'localhost',
      env: 'DB_WRITE_HOST'
    },
    port: {
      default: 5433,
      env: 'DB_PORT'
    },
    sync: {
      default: false,
      env: 'DB_SYNC'
    }
  },

  logConfig: {
    maxSize: {
      default: '50m',
      env: 'WINSTON_LOG_MAX_SIZE'
    },
    maxFiles: {
      default: '10d',
      env: 'WINSTON_MAX_FILES_DURATION'
    },
    dirname: {
      default: 'logs',
      env: 'WINSTON_LOG_DIR'
    },
    datePattern: {
      default: 'YYYY-MM-DD-HH',
      env: 'WINSTON_FILE_NAME_DATE_PATTERN'
    },
    zippedArchive: {
      default: true,
      env: 'WINSTON_ZIPPED_ARCHIVE'
    }
  },
  jwt: {
    loginTokenSecret: {
      default: '',
      env: 'JWT_LOGIN_SECRET'
    },
    loginTokenExpiry: {
      default: '25100000',
      env: 'JWT_LOGIN_TOKEN_EXPIRY'
    },
    verificationTokenSecret: {
      default: '',
      env: 'VERIFICATION_TOKEN_SECRET'
    },
    verificationTokenExpiry: {
      default: '120s',
      env: 'VERIFICATION_TOKEN_EXPIRY'
    },
    secretKey: {
      default: '',
      env: 'SECRET_KEY'
    },
    resetPasswordKey: {
      default: '',
      env: 'RESET_PASSWORD_KEY'
    },
    resetPasswordExpiry: {
      default: '',
      env: 'RESET_PASSWORD_EXPIRY'
    },
    emailTokenExpiry: {
      default: '',
      env: 'EMAIL_TOKEN_EXPIRY'
    },
    emailTokenKey: {
      default: '',
      env: 'EMAIL_TOKEN_KEY'
    }
  },
  microService: {
    accessToken: {
      default: '',
      env: 'MICRO_SERVICE_ACCESS_TOKEN'
    },
    url: {
      default: '',
      env: 'MICRO_SERVICE_URL'
    }
  },
  aws: {
    bucket: {
      default: '',
      env: 'AWS_BUCKET'
    },
    region: {
      default: 'us-east-1',
      env: 'AWS_REGION'
    },
    accessKeyId: {
      default: '',
      env: 'AWS_ACCESS_KEY'
    },
    secretAccessKey: {
      default: '',
      env: 'AWS_SECRET_ACCESS_KEY'
    }
  },
  credentialEncryptionKey: {
    default: '',
    env: 'CREDENTIAL_ENCRYPTION_KEY'
  },
  redis: {
    host: {
      default: 'localhost',
      env: 'REDIS_HOST'
    },
    port: {
      default: 6379,
      env: 'REDIS_PORT'
    },
    password: {
      default: '',
      env: 'REDIS_PASSWORD'
    }
  },
  email: {
    mailjetApiKey: {
      default: '',
      env: 'MAILJET_API_KEY'
    },
    mailjetSecretKey: {
      default: '',
      env: 'MAILJET_SECRET_KEY'
    },
    senderName: {
      default: 'TG Casino',
      env: 'EMAIL_SENDER_NAME'
    },
    senderEmail: {
      default: '',
      env: 'EMAIL_SENDER_EMAIL'
    }
  },
  gsoft: {
    email: {
      default: '',
      env: 'GSOFT_EMAIL'
    },
    password: {
      default: '',
      env: 'GSOFT_PASSWORD'
    },
    baseUrl: {
      default: '',
      env: 'GSOFT_BASE_URL'
    },
    operatorId: {
      default: '',
      env: 'GSOFT_OPERATOR_ID'
    }
  },
  sendGrid: {
    apiKey: {
      default: '',
      env: 'SENDGRID_API_KEY'
    },
    senderEmail: {
      default: '',
      env: 'SENDER_EMAIL'
    },
    organisationName: {
      default: '',
      env: 'ORGANISATION_NAME'
    },
    organisationLogo: {
      default: '',
      env: 'ORGANISATION_LOGO'
    },
    helpCentreUrl: {
      default: '',
      env: 'HELP_CENTER_URL'
    }
  },

  basic: {
    username: {
      doc: 'basic username for authentication middleware.',
      default: 'admin',
      env: 'BASIC_USERNAME'
    },
    password: {
      doc: 'basic password for authentication middleware.',
      default: 'admin',
      env: 'BASIC_PASSWORD'
    }
  }
})
config.validate({ allowed: 'strict' })

module.exports = config
