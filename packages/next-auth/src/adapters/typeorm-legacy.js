import { createHash, randomBytes } from "crypto"

export class TypeORMAccountModel {
  constructor(
    userId,
    providerId,
    providerType,
    providerAccountId,
    refreshToken,
    accessToken,
    accessTokenExpires,
  ) {
    this.compoundId = createHash("sha256")
      .update(`${providerId}:${providerAccountId}`)
      .digest("hex")
    this.userId = userId
    this.providerType = providerType
    this.providerId = providerId
    this.providerAccountId = providerAccountId
    this.refreshToken = refreshToken
    this.accessToken = accessToken
    this.accessTokenExpires = accessTokenExpires
  }
}

export const TypeORMAccountSchema = {
  name: "Account",
  target: TypeORMAccountModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    compoundId: {
      type: "varchar",
      unique: true,
    },
    userId: {
      type: "int",
    },
    providerType: {
      type: "varchar",
    },
    providerId: {
      type: "varchar",
    },
    providerAccountId: {
      type: "varchar",
    },
    refreshToken: {
      type: "text",
      nullable: true,
    },
    accessToken: {
      type: "text",
      nullable: true,
    },
    accessTokenExpires: {
      type: "timestamp",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  indices: [
    {
      name: "userId",
      columns: ["userId"],
    },
    {
      name: "providerId",
      columns: ["providerId"],
    },
    {
      name: "providerAccountId",
      columns: ["providerAccountId"],
    },
  ],
}

export class TypeORMUserModel {
  constructor(profile) {
    this.name = profile?.name
    this.email = profile?.email
    this.image = profile?.image
    this.emailVerified = profile?.emailVerified && new Date()
  }
}

export const TypeORMUserSchema = {
  name: "User",
  target: TypeORMUserModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: true,
    },
    emailVerified: {
      type: "timestamp",
      nullable: true,
    },
    image: {
      type: "varchar",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
}

export class TypeORMSessionModel {
  constructor(userId, expires, sessionToken, accessToken) {
    this.userId = userId
    this.expires = expires
    this.sessionToken = sessionToken || randomBytes(32).toString("hex")
    this.accessToken = accessToken || randomBytes(32).toString("hex")
  }
}

export const TypeORMSessionSchema = {
  name: "Session",
  target: TypeORMSessionModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
    },
    expires: {
      type: "timestamp",
    },
    sessionToken: {
      type: "varchar",
      unique: true,
    },
    accessToken: {
      type: "varchar",
      unique: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
}

export class TypeORMVerificationRequestModel {
  constructor(identifier, token, expires) {
    if (identifier) {
      this.identifier = identifier
    }

    if (token) {
      this.token = token
    }

    if (expires) {
      this.expires = expires
    }
  }
}

export const TypeORMVerificationRequestSchema = {
  name: "VerificationRequest",
  target: TypeORMVerificationRequestModel,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    identifier: {
      type: "varchar",
    },
    token: {
      type: "varchar",
      unique: true,
    },
    expires: {
      type: "timestamp",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
}

export const Models = {
  Account: {
    model: TypeORMAccountModel,
    schema: TypeORMAccountSchema,
  },
  User: {
    model: TypeORMUserModel,
    schema: TypeORMUserSchema,
  },
  Session: {
    model: TypeORMSessionModel,
    schema: TypeORMSessionSchema,
  },
  VerificationRequest: {
    model: TypeORMVerificationRequestModel,
    schema: TypeORMVerificationRequestSchema,
  },
}

function cloneSchema(schema) {
  return {
    ...schema,
    columns: Object.fromEntries(
      Object.entries(schema.columns).map(([key, value]) => [key, { ...value }]),
    ),
    indices: schema.indices?.map((index) => ({ ...index })),
  }
}

function cloneModels(models) {
  return Object.fromEntries(
    Object.entries(models).map(([key, value]) => [
      key,
      {
        model: value.model,
        schema: cloneSchema(value.schema),
      },
    ]),
  )
}

function parseConnectionString(configOrString) {
  if (typeof configOrString !== "string") {
    return { ...configOrString }
  }

  try {
    const parsedUrl = new URL(configOrString)
    const config = {}

    if (parsedUrl.protocol.startsWith("mongodb+srv")) {
      config.type = "mongodb"
      config.url = configOrString.replace(/\?(.*)$/, "")
      config.useNewUrlParser = true
    } else {
      config.type = parsedUrl.protocol.replace(/:$/, "")
      config.host = parsedUrl.hostname
      config.port = Number(parsedUrl.port)
      config.username = parsedUrl.username
      config.password = parsedUrl.password
      config.database = parsedUrl.pathname
        .replace(/^\//, "")
        .replace(/\?(.*)$/, "")
      config.options = {}
    }

    if (config.type === "mongodb") {
      config.useUnifiedTopology = true
    }

    if (config.type === "mssql") {
      config.options.enableArithAbort = true
    }

    if (parsedUrl.search) {
      parsedUrl.search
        .replace(/^\?/, "")
        .split("&")
        .forEach((keyValuePair) => {
          let [key, value] = keyValuePair.split("=")

          if (value === "true") {
            value = true
          }

          if (value === "false") {
            value = false
          }

          config[key] = value
        })
    }

    return config
  } catch {
    return {
      url: configOrString,
    }
  }
}

function snakeCase(value = "") {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s.-]+/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase()
}

function camelCase(value = "") {
  return value
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (match) => match.toLowerCase())
}

function createNamingStrategies(DefaultNamingStrategy) {
  class SnakeCaseNamingStrategy extends DefaultNamingStrategy {
    tableName(className, customName) {
      return customName || snakeCase(`${className}s`)
    }

    columnName(propertyName, customName, embeddedPrefixes) {
      return `${snakeCase(embeddedPrefixes.join("_"))}${
        customName || snakeCase(propertyName)
      }`
    }

    relationName(propertyName) {
      return snakeCase(propertyName)
    }

    joinColumnName(relationName, referencedColumnName) {
      return snakeCase(`${relationName}_${referencedColumnName}`)
    }

    joinTableName(firstTableName, secondTableName, firstPropertyName) {
      return snakeCase(
        `${firstTableName}_${firstPropertyName.replace(/\./gi, "_")}_${secondTableName}`,
      )
    }

    joinTableColumnName(tableName, propertyName, columnName) {
      return snakeCase(`${tableName}_${columnName || propertyName}`)
    }

    classTableInheritanceParentColumnName(
      parentTableName,
      parentTableIdPropertyName,
    ) {
      return snakeCase(`${parentTableName}_${parentTableIdPropertyName}`)
    }

    eagerJoinRelationAlias(alias, propertyPath) {
      return `${alias}__${propertyPath.replace(".", "_")}`
    }
  }

  class CamelCaseNamingStrategy extends DefaultNamingStrategy {
    tableName(className, customName) {
      return customName || camelCase(`${className}s`)
    }
  }

  return {
    SnakeCaseNamingStrategy,
    CamelCaseNamingStrategy,
  }
}

function transformConfig(config, models, options, namingStrategies) {
  const { SnakeCaseNamingStrategy, CamelCaseNamingStrategy } = namingStrategies

  const applyTimestampTransform = (type, applyPrecision = false) => {
    for (const model of Object.values(models)) {
      for (const column of Object.values(model.schema.columns)) {
        if (column.type === "timestamp") {
          column.type = type

          if (applyPrecision && typeof column.precision === "undefined") {
            column.precision = 6
          }
        }
      }
    }
  }

  if (
    (config.type && config.type.startsWith("mongodb")) ||
    (config.url && config.url.startsWith("mongodb"))
  ) {
    if (!options.namingStrategy) {
      options.namingStrategy = new CamelCaseNamingStrategy()
    }

    for (const model of Object.values(models)) {
      delete model.schema.columns.id.type
      model.schema.columns.id.objectId = true
    }

    models.Account.schema.columns.userId.type = "objectId"
    models.Session.schema.columns.userId.type = "objectId"
    delete models.User.schema.columns.email.unique

    if (!models.User.schema.indices) {
      models.User.schema.indices = []
    }

    models.User.schema.indices.push({
      name: "email",
      unique: true,
      sparse: true,
      columns: ["email"],
    })

    return
  }

  if (
    (config.type && config.type.startsWith("postgres")) ||
    (config.url && config.url.startsWith("postgres"))
  ) {
    if (!options.namingStrategy) {
      options.namingStrategy = new SnakeCaseNamingStrategy()
    }

    applyTimestampTransform("timestamptz")
    return
  }

  if (
    (config.type && config.type.startsWith("mysql")) ||
    (config.url && config.url.startsWith("mysql"))
  ) {
    if (!options.namingStrategy) {
      options.namingStrategy = new SnakeCaseNamingStrategy()
    }

    applyTimestampTransform("timestamp", true)
    return
  }

  if (
    (config.type && config.type.startsWith("sqlite")) ||
    (config.url && config.url.startsWith("sqlite"))
  ) {
    if (!options.namingStrategy) {
      options.namingStrategy = new SnakeCaseNamingStrategy()
    }

    applyTimestampTransform("datetime")
    return
  }

  if (
    (config.type && config.type.startsWith("mssql")) ||
    (config.url && config.url.startsWith("mssql"))
  ) {
    if (!options.namingStrategy) {
      options.namingStrategy = new SnakeCaseNamingStrategy()
    }

    applyTimestampTransform("datetime")
    delete models.User.schema.columns.email.unique

    if (!models.User.schema.indices) {
      models.User.schema.indices = []
    }

    models.User.schema.indices.push({
      name: "email",
      columns: ["email"],
      unique: true,
      where: "email IS NOT NULL",
    })

    return
  }

  if (!options.namingStrategy) {
    options.namingStrategy = new SnakeCaseNamingStrategy()
  }
}

function entitiesChanged(previousEntities = [], nextEntities = []) {
  if (previousEntities.length !== nextEntities.length) {
    return true
  }

  for (let index = 0; index < previousEntities.length; index += 1) {
    if (previousEntities[index] !== nextEntities[index]) {
      return true
    }
  }

  return false
}

async function updateConnectionEntities(dataSource, entities) {
  if (!dataSource || !entitiesChanged(dataSource.options.entities, entities)) {
    return
  }

  if (typeof dataSource.setOptions === "function") {
    dataSource.setOptions({ entities })
  } else {
    dataSource.options.entities = entities
  }

  dataSource.buildMetadatas()

  if (dataSource.options.synchronize) {
    await dataSource.synchronize()
  }
}

async function loadTypeORM() {
  try {
    return await import("typeorm")
  } catch {
    throw new Error(
      'The TypeORM adapter requires the "typeorm" package. Install typeorm@^0.3.28 to use it.',
    )
  }
}

async function loadObjectId() {
  try {
    const mongodbModule = await import("mongodb")
    return mongodbModule.ObjectId || mongodbModule.default?.ObjectId || null
  } catch {
    return null
  }
}

async function findOne(manager, entity, where) {
  return manager.findOne(entity, {
    where,
  })
}

export function TypeORMLegacyAdapter(configOrString, options = {}) {
  const typeOrmConfig = parseConnectionString(configOrString)
  const models = {
    ...cloneModels(Models),
    ...(options.models || {}),
  }

  const {
    User: { model: User },
    Account: { model: Account },
    Session: { model: Session },
    VerificationRequest: { model: VerificationRequest },
  } = models

  let dataSource = null

  return {
    async getAdapter({
      session: { maxAge, updateAge },
      secret,
      logger,
      ...appOptions
    }) {
      const typeorm = await loadTypeORM()
      const { DataSource, DefaultNamingStrategy, EntitySchema } =
        typeorm.default || typeorm

      if (!DataSource || !EntitySchema || !DefaultNamingStrategy) {
        throw new Error(
          'The installed "typeorm" version is not supported. Install typeorm@^0.3.28.',
        )
      }

      const localOptions = { ...options }
      const localModels = {
        ...cloneModels(models),
      }

      transformConfig(
        typeOrmConfig,
        localModels,
        localOptions,
        createNamingStrategies(DefaultNamingStrategy),
      )

      const config = {
        name: "nextauth",
        entities: [
          new EntitySchema(localModels.User.schema),
          new EntitySchema(localModels.Account.schema),
          new EntitySchema(localModels.Session.schema),
          new EntitySchema(localModels.VerificationRequest.schema),
        ],
        timezone: "Z",
        logging: false,
        namingStrategy: localOptions.namingStrategy,
        ...typeOrmConfig,
      }

      try {
        if (!dataSource) {
          dataSource = new DataSource(config)
        } else if (
          entitiesChanged(dataSource.options.entities, config.entities)
        ) {
          if (typeof dataSource.setOptions === "function") {
            dataSource.setOptions(config)
          } else {
            Object.assign(dataSource.options, config)
          }
        }

        if (!dataSource.isInitialized) {
          await dataSource.initialize()
        }
      } catch (error) {
        logger.error("ADAPTER_CONNECTION_ERROR", error)
        throw error
      }

      if (process.env.NODE_ENV !== "production") {
        await updateConnectionEntities(dataSource, config.entities)
      }

      const { manager } = dataSource
      let idKey = "id"
      let ObjectId = null

      if (config.type === "mongodb") {
        idKey = "_id"
        ObjectId = await loadObjectId()
      }

      const sessionMaxAge = maxAge * 1000
      const sessionUpdateAge = updateAge * 1000

      const hashToken = (token) =>
        createHash("sha256").update(`${token}${secret}`).digest("hex")

      return {
        displayName: "TYPEORM_LEGACY",

        createUser(profile) {
          return manager.save(new User(profile))
        },

        getUser(id) {
          if (ObjectId && !(id instanceof ObjectId)) {
            id = new ObjectId(id)
          }

          return findOne(manager, User, {
            [idKey]: id,
          })
        },

        getUserByEmail(email) {
          if (email) {
            return findOne(manager, User, {
              email,
            })
          }

          return null
        },

        async getUserByProviderAccountId(providerId, providerAccountId) {
          const account = await findOne(manager, Account, {
            providerId,
            providerAccountId,
          })

          if (account) {
            return findOne(manager, User, {
              [idKey]: account.userId,
            })
          }

          return null
        },

        updateUser(user) {
          return manager.save(User, user)
        },

        async deleteUser() {},

        linkAccount(
          userId,
          providerId,
          providerType,
          providerAccountId,
          refreshToken,
          accessToken,
          accessTokenExpires,
        ) {
          return manager.save(
            new Account(
              userId,
              providerId,
              providerType,
              providerAccountId,
              refreshToken,
              accessToken,
              accessTokenExpires,
            ),
          )
        },

        async unlinkAccount() {},

        createSession(user) {
          let expires = null

          if (sessionMaxAge) {
            const dateExpires = new Date()
            dateExpires.setTime(dateExpires.getTime() + sessionMaxAge)
            expires = dateExpires
          }

          return manager.save(new Session(user.id, expires))
        },

        async getSession(sessionToken) {
          const session = await findOne(manager, Session, {
            sessionToken,
          })

          if (session?.expires && new Date() > new Date(session.expires)) {
            await manager.delete(Session, {
              sessionToken,
            })

            return null
          }

          return session
        },

        updateSession(session, force) {
          if (
            sessionMaxAge &&
            (sessionUpdateAge || sessionUpdateAge === 0) &&
            session.expires
          ) {
            const dateSessionIsDueToBeUpdated = new Date(session.expires)
            dateSessionIsDueToBeUpdated.setTime(
              dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge,
            )
            dateSessionIsDueToBeUpdated.setTime(
              dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge,
            )

            if (new Date() > dateSessionIsDueToBeUpdated) {
              const newExpiryDate = new Date()
              newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge)
              session.expires = newExpiryDate
            } else if (!force) {
              return null
            }
          } else if (!force) {
            return null
          }

          return manager.save(Session, session)
        },

        deleteSession(sessionToken) {
          return manager.delete(Session, {
            sessionToken,
          })
        },

        async createVerificationRequest(identifier, url, token, _, provider) {
          const { sendVerificationRequest, maxAge } = provider
          const hashedToken = hashToken(token)
          let expires = null

          if (maxAge) {
            const dateExpires = new Date()
            dateExpires.setTime(dateExpires.getTime() + maxAge * 1000)
            expires = dateExpires
          }

          await manager.save(
            new VerificationRequest(identifier, hashedToken, expires),
          )

          await sendVerificationRequest({
            identifier,
            url,
            token,
            baseUrl: appOptions.baseUrl,
            provider,
          })
        },

        async getVerificationRequest(identifier, token) {
          const hashedToken = hashToken(token)
          const verificationRequest = await findOne(
            manager,
            VerificationRequest,
            {
              identifier,
              token: hashedToken,
            },
          )

          if (
            verificationRequest?.expires &&
            new Date() > new Date(verificationRequest.expires)
          ) {
            await manager.delete(VerificationRequest, {
              token: hashedToken,
            })

            return null
          }

          return verificationRequest
        },

        async deleteVerificationRequest(identifier, token) {
          const hashedToken = hashToken(token)
          await manager.delete(VerificationRequest, {
            identifier,
            token: hashedToken,
          })
        },
      }
    },
  }
}

export { TypeORMLegacyAdapter as Adapter }
