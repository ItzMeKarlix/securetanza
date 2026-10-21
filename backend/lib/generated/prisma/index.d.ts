
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Offense
 * One recorded offense with its stage of felony. Offenses are never grouped:
 * a blotter that lists several offenses is several independent records.
 */
export type Offense = $Result.DefaultSelection<Prisma.$OffensePayload>
/**
 * Model OffenseDefinition
 * 
 */
export type OffenseDefinition = $Result.DefaultSelection<Prisma.$OffenseDefinitionPayload>
/**
 * Model Barangay
 * 
 */
export type Barangay = $Result.DefaultSelection<Prisma.$BarangayPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AuthToken
 * *
 *  * One-time links emailed to staff: an invite to set a first password, or a
 *  * password reset. Only the SHA-256 of the token is stored; the raw value
 *  * exists solely in the email that was sent.
 */
export type AuthToken = $Result.DefaultSelection<Prisma.$AuthTokenPayload>
/**
 * Model Backup
 * *
 *  * A retained copy of exported data, held in the database rather than on disk so it
 *  * survives redeploys and container restarts. Content is the finished file itself —
 *  * an .xlsx snapshot of the register, or a generated PDF report.
 */
export type Backup = $Result.DefaultSelection<Prisma.$BackupPayload>
/**
 * Model ExportSchedule
 * 
 */
export type ExportSchedule = $Result.DefaultSelection<Prisma.$ExportSchedulePayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>
/**
 * Model UserPermission
 * 
 */
export type UserPermission = $Result.DefaultSelection<Prisma.$UserPermissionPayload>
/**
 * Model MfaBackupCode
 * * One-time recovery codes for two-factor sign-in (bcrypt hashes; regenerating replaces the set).
 */
export type MfaBackupCode = $Result.DefaultSelection<Prisma.$MfaBackupCodePayload>
/**
 * Model TrustedDevice
 * *
 *  * A browser the person chose to trust, so the second factor is skipped there
 *  * until expiresAt. Bound to the user's sessionVersion at the time: any password
 *  * change, unlock or 2FA reset invalidates it.
 */
export type TrustedDevice = $Result.DefaultSelection<Prisma.$TrustedDevicePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Offenses
 * const offenses = await prisma.offense.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Offenses
   * const offenses = await prisma.offense.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.offense`: Exposes CRUD operations for the **Offense** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Offenses
    * const offenses = await prisma.offense.findMany()
    * ```
    */
  get offense(): Prisma.OffenseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.offenseDefinition`: Exposes CRUD operations for the **OffenseDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OffenseDefinitions
    * const offenseDefinitions = await prisma.offenseDefinition.findMany()
    * ```
    */
  get offenseDefinition(): Prisma.OffenseDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.barangay`: Exposes CRUD operations for the **Barangay** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Barangays
    * const barangays = await prisma.barangay.findMany()
    * ```
    */
  get barangay(): Prisma.BarangayDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authToken`: Exposes CRUD operations for the **AuthToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthTokens
    * const authTokens = await prisma.authToken.findMany()
    * ```
    */
  get authToken(): Prisma.AuthTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.backup`: Exposes CRUD operations for the **Backup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Backups
    * const backups = await prisma.backup.findMany()
    * ```
    */
  get backup(): Prisma.BackupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exportSchedule`: Exposes CRUD operations for the **ExportSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExportSchedules
    * const exportSchedules = await prisma.exportSchedule.findMany()
    * ```
    */
  get exportSchedule(): Prisma.ExportScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPermission`: Exposes CRUD operations for the **UserPermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPermissions
    * const userPermissions = await prisma.userPermission.findMany()
    * ```
    */
  get userPermission(): Prisma.UserPermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mfaBackupCode`: Exposes CRUD operations for the **MfaBackupCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MfaBackupCodes
    * const mfaBackupCodes = await prisma.mfaBackupCode.findMany()
    * ```
    */
  get mfaBackupCode(): Prisma.MfaBackupCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trustedDevice`: Exposes CRUD operations for the **TrustedDevice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrustedDevices
    * const trustedDevices = await prisma.trustedDevice.findMany()
    * ```
    */
  get trustedDevice(): Prisma.TrustedDeviceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Offense: 'Offense',
    OffenseDefinition: 'OffenseDefinition',
    Barangay: 'Barangay',
    AuditLog: 'AuditLog',
    User: 'User',
    AuthToken: 'AuthToken',
    Backup: 'Backup',
    ExportSchedule: 'ExportSchedule',
    Permission: 'Permission',
    UserPermission: 'UserPermission',
    MfaBackupCode: 'MfaBackupCode',
    TrustedDevice: 'TrustedDevice'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "offense" | "offenseDefinition" | "barangay" | "auditLog" | "user" | "authToken" | "backup" | "exportSchedule" | "permission" | "userPermission" | "mfaBackupCode" | "trustedDevice"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Offense: {
        payload: Prisma.$OffensePayload<ExtArgs>
        fields: Prisma.OffenseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OffenseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OffenseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>
          }
          findFirst: {
            args: Prisma.OffenseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OffenseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>
          }
          findMany: {
            args: Prisma.OffenseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>[]
          }
          create: {
            args: Prisma.OffenseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>
          }
          createMany: {
            args: Prisma.OffenseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OffenseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>[]
          }
          delete: {
            args: Prisma.OffenseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>
          }
          update: {
            args: Prisma.OffenseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>
          }
          deleteMany: {
            args: Prisma.OffenseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OffenseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OffenseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>[]
          }
          upsert: {
            args: Prisma.OffenseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffensePayload>
          }
          aggregate: {
            args: Prisma.OffenseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOffense>
          }
          groupBy: {
            args: Prisma.OffenseGroupByArgs<ExtArgs>
            result: $Utils.Optional<OffenseGroupByOutputType>[]
          }
          count: {
            args: Prisma.OffenseCountArgs<ExtArgs>
            result: $Utils.Optional<OffenseCountAggregateOutputType> | number
          }
        }
      }
      OffenseDefinition: {
        payload: Prisma.$OffenseDefinitionPayload<ExtArgs>
        fields: Prisma.OffenseDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OffenseDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OffenseDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>
          }
          findFirst: {
            args: Prisma.OffenseDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OffenseDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>
          }
          findMany: {
            args: Prisma.OffenseDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>[]
          }
          create: {
            args: Prisma.OffenseDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>
          }
          createMany: {
            args: Prisma.OffenseDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OffenseDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>[]
          }
          delete: {
            args: Prisma.OffenseDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>
          }
          update: {
            args: Prisma.OffenseDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.OffenseDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OffenseDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OffenseDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.OffenseDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OffenseDefinitionPayload>
          }
          aggregate: {
            args: Prisma.OffenseDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOffenseDefinition>
          }
          groupBy: {
            args: Prisma.OffenseDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OffenseDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OffenseDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<OffenseDefinitionCountAggregateOutputType> | number
          }
        }
      }
      Barangay: {
        payload: Prisma.$BarangayPayload<ExtArgs>
        fields: Prisma.BarangayFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BarangayFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BarangayFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          findFirst: {
            args: Prisma.BarangayFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BarangayFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          findMany: {
            args: Prisma.BarangayFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>[]
          }
          create: {
            args: Prisma.BarangayCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          createMany: {
            args: Prisma.BarangayCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BarangayCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>[]
          }
          delete: {
            args: Prisma.BarangayDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          update: {
            args: Prisma.BarangayUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          deleteMany: {
            args: Prisma.BarangayDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BarangayUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BarangayUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>[]
          }
          upsert: {
            args: Prisma.BarangayUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BarangayPayload>
          }
          aggregate: {
            args: Prisma.BarangayAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBarangay>
          }
          groupBy: {
            args: Prisma.BarangayGroupByArgs<ExtArgs>
            result: $Utils.Optional<BarangayGroupByOutputType>[]
          }
          count: {
            args: Prisma.BarangayCountArgs<ExtArgs>
            result: $Utils.Optional<BarangayCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AuthToken: {
        payload: Prisma.$AuthTokenPayload<ExtArgs>
        fields: Prisma.AuthTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          findFirst: {
            args: Prisma.AuthTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          findMany: {
            args: Prisma.AuthTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>[]
          }
          create: {
            args: Prisma.AuthTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          createMany: {
            args: Prisma.AuthTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>[]
          }
          delete: {
            args: Prisma.AuthTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          update: {
            args: Prisma.AuthTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          deleteMany: {
            args: Prisma.AuthTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>[]
          }
          upsert: {
            args: Prisma.AuthTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          aggregate: {
            args: Prisma.AuthTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthToken>
          }
          groupBy: {
            args: Prisma.AuthTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthTokenCountArgs<ExtArgs>
            result: $Utils.Optional<AuthTokenCountAggregateOutputType> | number
          }
        }
      }
      Backup: {
        payload: Prisma.$BackupPayload<ExtArgs>
        fields: Prisma.BackupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BackupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BackupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          findFirst: {
            args: Prisma.BackupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BackupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          findMany: {
            args: Prisma.BackupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>[]
          }
          create: {
            args: Prisma.BackupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          createMany: {
            args: Prisma.BackupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BackupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>[]
          }
          delete: {
            args: Prisma.BackupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          update: {
            args: Prisma.BackupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          deleteMany: {
            args: Prisma.BackupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BackupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BackupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>[]
          }
          upsert: {
            args: Prisma.BackupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BackupPayload>
          }
          aggregate: {
            args: Prisma.BackupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBackup>
          }
          groupBy: {
            args: Prisma.BackupGroupByArgs<ExtArgs>
            result: $Utils.Optional<BackupGroupByOutputType>[]
          }
          count: {
            args: Prisma.BackupCountArgs<ExtArgs>
            result: $Utils.Optional<BackupCountAggregateOutputType> | number
          }
        }
      }
      ExportSchedule: {
        payload: Prisma.$ExportSchedulePayload<ExtArgs>
        fields: Prisma.ExportScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExportScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExportScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          findFirst: {
            args: Prisma.ExportScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExportScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          findMany: {
            args: Prisma.ExportScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>[]
          }
          create: {
            args: Prisma.ExportScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          createMany: {
            args: Prisma.ExportScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExportScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>[]
          }
          delete: {
            args: Prisma.ExportScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          update: {
            args: Prisma.ExportScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          deleteMany: {
            args: Prisma.ExportScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExportScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExportScheduleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>[]
          }
          upsert: {
            args: Prisma.ExportScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExportSchedulePayload>
          }
          aggregate: {
            args: Prisma.ExportScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExportSchedule>
          }
          groupBy: {
            args: Prisma.ExportScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExportScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExportScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<ExportScheduleCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
      UserPermission: {
        payload: Prisma.$UserPermissionPayload<ExtArgs>
        fields: Prisma.UserPermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findFirst: {
            args: Prisma.UserPermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findMany: {
            args: Prisma.UserPermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          create: {
            args: Prisma.UserPermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          createMany: {
            args: Prisma.UserPermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          delete: {
            args: Prisma.UserPermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          update: {
            args: Prisma.UserPermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          deleteMany: {
            args: Prisma.UserPermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserPermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          upsert: {
            args: Prisma.UserPermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          aggregate: {
            args: Prisma.UserPermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPermission>
          }
          groupBy: {
            args: Prisma.UserPermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPermissionCountArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionCountAggregateOutputType> | number
          }
        }
      }
      MfaBackupCode: {
        payload: Prisma.$MfaBackupCodePayload<ExtArgs>
        fields: Prisma.MfaBackupCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MfaBackupCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MfaBackupCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          findFirst: {
            args: Prisma.MfaBackupCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MfaBackupCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          findMany: {
            args: Prisma.MfaBackupCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>[]
          }
          create: {
            args: Prisma.MfaBackupCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          createMany: {
            args: Prisma.MfaBackupCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MfaBackupCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>[]
          }
          delete: {
            args: Prisma.MfaBackupCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          update: {
            args: Prisma.MfaBackupCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          deleteMany: {
            args: Prisma.MfaBackupCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MfaBackupCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MfaBackupCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>[]
          }
          upsert: {
            args: Prisma.MfaBackupCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          aggregate: {
            args: Prisma.MfaBackupCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMfaBackupCode>
          }
          groupBy: {
            args: Prisma.MfaBackupCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<MfaBackupCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.MfaBackupCodeCountArgs<ExtArgs>
            result: $Utils.Optional<MfaBackupCodeCountAggregateOutputType> | number
          }
        }
      }
      TrustedDevice: {
        payload: Prisma.$TrustedDevicePayload<ExtArgs>
        fields: Prisma.TrustedDeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrustedDeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrustedDeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          findFirst: {
            args: Prisma.TrustedDeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrustedDeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          findMany: {
            args: Prisma.TrustedDeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>[]
          }
          create: {
            args: Prisma.TrustedDeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          createMany: {
            args: Prisma.TrustedDeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrustedDeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>[]
          }
          delete: {
            args: Prisma.TrustedDeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          update: {
            args: Prisma.TrustedDeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          deleteMany: {
            args: Prisma.TrustedDeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrustedDeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrustedDeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>[]
          }
          upsert: {
            args: Prisma.TrustedDeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrustedDevicePayload>
          }
          aggregate: {
            args: Prisma.TrustedDeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrustedDevice>
          }
          groupBy: {
            args: Prisma.TrustedDeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrustedDeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrustedDeviceCountArgs<ExtArgs>
            result: $Utils.Optional<TrustedDeviceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    offense?: OffenseOmit
    offenseDefinition?: OffenseDefinitionOmit
    barangay?: BarangayOmit
    auditLog?: AuditLogOmit
    user?: UserOmit
    authToken?: AuthTokenOmit
    backup?: BackupOmit
    exportSchedule?: ExportScheduleOmit
    permission?: PermissionOmit
    userPermission?: UserPermissionOmit
    mfaBackupCode?: MfaBackupCodeOmit
    trustedDevice?: TrustedDeviceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OffenseDefinitionCountOutputType
   */

  export type OffenseDefinitionCountOutputType = {
    records: number
  }

  export type OffenseDefinitionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | OffenseDefinitionCountOutputTypeCountRecordsArgs
  }

  // Custom InputTypes
  /**
   * OffenseDefinitionCountOutputType without action
   */
  export type OffenseDefinitionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinitionCountOutputType
     */
    select?: OffenseDefinitionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OffenseDefinitionCountOutputType without action
   */
  export type OffenseDefinitionCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OffenseWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    permissions: number
    exportSchedules: number
    authTokens: number
    mfaBackupCodes: number
    trustedDevices: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | UserCountOutputTypeCountPermissionsArgs
    exportSchedules?: boolean | UserCountOutputTypeCountExportSchedulesArgs
    authTokens?: boolean | UserCountOutputTypeCountAuthTokensArgs
    mfaBackupCodes?: boolean | UserCountOutputTypeCountMfaBackupCodesArgs
    trustedDevices?: boolean | UserCountOutputTypeCountTrustedDevicesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExportSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExportScheduleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuthTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMfaBackupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MfaBackupCodeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTrustedDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustedDeviceWhereInput
  }


  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    users: number
  }

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | PermissionCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionCountOutputType
     */
    select?: PermissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Offense
   */

  export type AggregateOffense = {
    _count: OffenseCountAggregateOutputType | null
    _avg: OffenseAvgAggregateOutputType | null
    _sum: OffenseSumAggregateOutputType | null
    _min: OffenseMinAggregateOutputType | null
    _max: OffenseMaxAggregateOutputType | null
  }

  export type OffenseAvgAggregateOutputType = {
    sourceRow: number | null
    suspectCount: number | null
    victimCount: number | null
    latitude: number | null
    longitude: number | null
  }

  export type OffenseSumAggregateOutputType = {
    sourceRow: number | null
    suspectCount: number | null
    victimCount: number | null
    latitude: number | null
    longitude: number | null
  }

  export type OffenseMinAggregateOutputType = {
    id: string | null
    offenseDefinitionId: string | null
    importKey: string | null
    crimeType: string | null
    felonyStage: string | null
    sourceFile: string | null
    sourceSheet: string | null
    sourceRow: number | null
    blotterNo: string | null
    dateEncoded: Date | null
    pro: string | null
    ppo: string | null
    stn: string | null
    pcp: string | null
    region: string | null
    province: string | null
    municipal: string | null
    barangay: string | null
    street: string | null
    typeOfPlace: string | null
    dateReported: Date | null
    timeReported: string | null
    dateCommitted: Date | null
    timeCommitted: string | null
    isCrime: boolean | null
    modeReporting: string | null
    stageOfFelony: string | null
    offense: string | null
    offenseType: string | null
    section: string | null
    modus: string | null
    suspectMotive: string | null
    suspectSubMotive: string | null
    heinous: boolean | null
    sensational: boolean | null
    threatGrp: boolean | null
    grpAffiliation: string | null
    mrs: string | null
    suspectIsEGO: boolean | null
    suspectEGOPosition: string | null
    suspectEGOClass: string | null
    suspectCount: number | null
    suspectArrested: boolean | null
    victimIsEGO: boolean | null
    victimEGOPosition: string | null
    victimEGOClass: string | null
    victimCount: number | null
    caseStatus: string | null
    investigator: string | null
    headInves: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OffenseMaxAggregateOutputType = {
    id: string | null
    offenseDefinitionId: string | null
    importKey: string | null
    crimeType: string | null
    felonyStage: string | null
    sourceFile: string | null
    sourceSheet: string | null
    sourceRow: number | null
    blotterNo: string | null
    dateEncoded: Date | null
    pro: string | null
    ppo: string | null
    stn: string | null
    pcp: string | null
    region: string | null
    province: string | null
    municipal: string | null
    barangay: string | null
    street: string | null
    typeOfPlace: string | null
    dateReported: Date | null
    timeReported: string | null
    dateCommitted: Date | null
    timeCommitted: string | null
    isCrime: boolean | null
    modeReporting: string | null
    stageOfFelony: string | null
    offense: string | null
    offenseType: string | null
    section: string | null
    modus: string | null
    suspectMotive: string | null
    suspectSubMotive: string | null
    heinous: boolean | null
    sensational: boolean | null
    threatGrp: boolean | null
    grpAffiliation: string | null
    mrs: string | null
    suspectIsEGO: boolean | null
    suspectEGOPosition: string | null
    suspectEGOClass: string | null
    suspectCount: number | null
    suspectArrested: boolean | null
    victimIsEGO: boolean | null
    victimEGOPosition: string | null
    victimEGOClass: string | null
    victimCount: number | null
    caseStatus: string | null
    investigator: string | null
    headInves: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OffenseCountAggregateOutputType = {
    id: number
    offenseDefinitionId: number
    importKey: number
    crimeType: number
    felonyStage: number
    sourceFile: number
    sourceSheet: number
    sourceRow: number
    blotterNo: number
    dateEncoded: number
    pro: number
    ppo: number
    stn: number
    pcp: number
    region: number
    province: number
    municipal: number
    barangay: number
    street: number
    typeOfPlace: number
    dateReported: number
    timeReported: number
    dateCommitted: number
    timeCommitted: number
    isCrime: number
    modeReporting: number
    stageOfFelony: number
    offense: number
    offenseType: number
    section: number
    modus: number
    suspectMotive: number
    suspectSubMotive: number
    heinous: number
    sensational: number
    threatGrp: number
    grpAffiliation: number
    mrs: number
    suspectIsEGO: number
    suspectEGOPosition: number
    suspectEGOClass: number
    suspectCount: number
    suspectArrested: number
    victimIsEGO: number
    victimEGOPosition: number
    victimEGOClass: number
    victimCount: number
    caseStatus: number
    investigator: number
    headInves: number
    latitude: number
    longitude: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OffenseAvgAggregateInputType = {
    sourceRow?: true
    suspectCount?: true
    victimCount?: true
    latitude?: true
    longitude?: true
  }

  export type OffenseSumAggregateInputType = {
    sourceRow?: true
    suspectCount?: true
    victimCount?: true
    latitude?: true
    longitude?: true
  }

  export type OffenseMinAggregateInputType = {
    id?: true
    offenseDefinitionId?: true
    importKey?: true
    crimeType?: true
    felonyStage?: true
    sourceFile?: true
    sourceSheet?: true
    sourceRow?: true
    blotterNo?: true
    dateEncoded?: true
    pro?: true
    ppo?: true
    stn?: true
    pcp?: true
    region?: true
    province?: true
    municipal?: true
    barangay?: true
    street?: true
    typeOfPlace?: true
    dateReported?: true
    timeReported?: true
    dateCommitted?: true
    timeCommitted?: true
    isCrime?: true
    modeReporting?: true
    stageOfFelony?: true
    offense?: true
    offenseType?: true
    section?: true
    modus?: true
    suspectMotive?: true
    suspectSubMotive?: true
    heinous?: true
    sensational?: true
    threatGrp?: true
    grpAffiliation?: true
    mrs?: true
    suspectIsEGO?: true
    suspectEGOPosition?: true
    suspectEGOClass?: true
    suspectCount?: true
    suspectArrested?: true
    victimIsEGO?: true
    victimEGOPosition?: true
    victimEGOClass?: true
    victimCount?: true
    caseStatus?: true
    investigator?: true
    headInves?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OffenseMaxAggregateInputType = {
    id?: true
    offenseDefinitionId?: true
    importKey?: true
    crimeType?: true
    felonyStage?: true
    sourceFile?: true
    sourceSheet?: true
    sourceRow?: true
    blotterNo?: true
    dateEncoded?: true
    pro?: true
    ppo?: true
    stn?: true
    pcp?: true
    region?: true
    province?: true
    municipal?: true
    barangay?: true
    street?: true
    typeOfPlace?: true
    dateReported?: true
    timeReported?: true
    dateCommitted?: true
    timeCommitted?: true
    isCrime?: true
    modeReporting?: true
    stageOfFelony?: true
    offense?: true
    offenseType?: true
    section?: true
    modus?: true
    suspectMotive?: true
    suspectSubMotive?: true
    heinous?: true
    sensational?: true
    threatGrp?: true
    grpAffiliation?: true
    mrs?: true
    suspectIsEGO?: true
    suspectEGOPosition?: true
    suspectEGOClass?: true
    suspectCount?: true
    suspectArrested?: true
    victimIsEGO?: true
    victimEGOPosition?: true
    victimEGOClass?: true
    victimCount?: true
    caseStatus?: true
    investigator?: true
    headInves?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OffenseCountAggregateInputType = {
    id?: true
    offenseDefinitionId?: true
    importKey?: true
    crimeType?: true
    felonyStage?: true
    sourceFile?: true
    sourceSheet?: true
    sourceRow?: true
    blotterNo?: true
    dateEncoded?: true
    pro?: true
    ppo?: true
    stn?: true
    pcp?: true
    region?: true
    province?: true
    municipal?: true
    barangay?: true
    street?: true
    typeOfPlace?: true
    dateReported?: true
    timeReported?: true
    dateCommitted?: true
    timeCommitted?: true
    isCrime?: true
    modeReporting?: true
    stageOfFelony?: true
    offense?: true
    offenseType?: true
    section?: true
    modus?: true
    suspectMotive?: true
    suspectSubMotive?: true
    heinous?: true
    sensational?: true
    threatGrp?: true
    grpAffiliation?: true
    mrs?: true
    suspectIsEGO?: true
    suspectEGOPosition?: true
    suspectEGOClass?: true
    suspectCount?: true
    suspectArrested?: true
    victimIsEGO?: true
    victimEGOPosition?: true
    victimEGOClass?: true
    victimCount?: true
    caseStatus?: true
    investigator?: true
    headInves?: true
    latitude?: true
    longitude?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OffenseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Offense to aggregate.
     */
    where?: OffenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Offenses to fetch.
     */
    orderBy?: OffenseOrderByWithRelationInput | OffenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OffenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Offenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Offenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Offenses
    **/
    _count?: true | OffenseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OffenseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OffenseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OffenseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OffenseMaxAggregateInputType
  }

  export type GetOffenseAggregateType<T extends OffenseAggregateArgs> = {
        [P in keyof T & keyof AggregateOffense]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOffense[P]>
      : GetScalarType<T[P], AggregateOffense[P]>
  }




  export type OffenseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OffenseWhereInput
    orderBy?: OffenseOrderByWithAggregationInput | OffenseOrderByWithAggregationInput[]
    by: OffenseScalarFieldEnum[] | OffenseScalarFieldEnum
    having?: OffenseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OffenseCountAggregateInputType | true
    _avg?: OffenseAvgAggregateInputType
    _sum?: OffenseSumAggregateInputType
    _min?: OffenseMinAggregateInputType
    _max?: OffenseMaxAggregateInputType
  }

  export type OffenseGroupByOutputType = {
    id: string
    offenseDefinitionId: string
    importKey: string | null
    crimeType: string
    felonyStage: string
    sourceFile: string | null
    sourceSheet: string | null
    sourceRow: number | null
    blotterNo: string | null
    dateEncoded: Date | null
    pro: string | null
    ppo: string | null
    stn: string | null
    pcp: string | null
    region: string | null
    province: string | null
    municipal: string | null
    barangay: string
    street: string | null
    typeOfPlace: string | null
    dateReported: Date
    timeReported: string
    dateCommitted: Date
    timeCommitted: string
    isCrime: boolean
    modeReporting: string | null
    stageOfFelony: string | null
    offense: string | null
    offenseType: string | null
    section: string | null
    modus: string | null
    suspectMotive: string | null
    suspectSubMotive: string | null
    heinous: boolean
    sensational: boolean
    threatGrp: boolean
    grpAffiliation: string | null
    mrs: string | null
    suspectIsEGO: boolean
    suspectEGOPosition: string | null
    suspectEGOClass: string | null
    suspectCount: number | null
    suspectArrested: boolean | null
    victimIsEGO: boolean
    victimEGOPosition: string | null
    victimEGOClass: string | null
    victimCount: number | null
    caseStatus: string | null
    investigator: string | null
    headInves: string | null
    latitude: number | null
    longitude: number | null
    createdAt: Date
    updatedAt: Date
    _count: OffenseCountAggregateOutputType | null
    _avg: OffenseAvgAggregateOutputType | null
    _sum: OffenseSumAggregateOutputType | null
    _min: OffenseMinAggregateOutputType | null
    _max: OffenseMaxAggregateOutputType | null
  }

  type GetOffenseGroupByPayload<T extends OffenseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OffenseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OffenseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OffenseGroupByOutputType[P]>
            : GetScalarType<T[P], OffenseGroupByOutputType[P]>
        }
      >
    >


  export type OffenseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    offenseDefinitionId?: boolean
    importKey?: boolean
    crimeType?: boolean
    felonyStage?: boolean
    sourceFile?: boolean
    sourceSheet?: boolean
    sourceRow?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    offenseDefinition?: boolean | OffenseDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["offense"]>

  export type OffenseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    offenseDefinitionId?: boolean
    importKey?: boolean
    crimeType?: boolean
    felonyStage?: boolean
    sourceFile?: boolean
    sourceSheet?: boolean
    sourceRow?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    offenseDefinition?: boolean | OffenseDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["offense"]>

  export type OffenseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    offenseDefinitionId?: boolean
    importKey?: boolean
    crimeType?: boolean
    felonyStage?: boolean
    sourceFile?: boolean
    sourceSheet?: boolean
    sourceRow?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    offenseDefinition?: boolean | OffenseDefinitionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["offense"]>

  export type OffenseSelectScalar = {
    id?: boolean
    offenseDefinitionId?: boolean
    importKey?: boolean
    crimeType?: boolean
    felonyStage?: boolean
    sourceFile?: boolean
    sourceSheet?: boolean
    sourceRow?: boolean
    blotterNo?: boolean
    dateEncoded?: boolean
    pro?: boolean
    ppo?: boolean
    stn?: boolean
    pcp?: boolean
    region?: boolean
    province?: boolean
    municipal?: boolean
    barangay?: boolean
    street?: boolean
    typeOfPlace?: boolean
    dateReported?: boolean
    timeReported?: boolean
    dateCommitted?: boolean
    timeCommitted?: boolean
    isCrime?: boolean
    modeReporting?: boolean
    stageOfFelony?: boolean
    offense?: boolean
    offenseType?: boolean
    section?: boolean
    modus?: boolean
    suspectMotive?: boolean
    suspectSubMotive?: boolean
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: boolean
    mrs?: boolean
    suspectIsEGO?: boolean
    suspectEGOPosition?: boolean
    suspectEGOClass?: boolean
    suspectCount?: boolean
    suspectArrested?: boolean
    victimIsEGO?: boolean
    victimEGOPosition?: boolean
    victimEGOClass?: boolean
    victimCount?: boolean
    caseStatus?: boolean
    investigator?: boolean
    headInves?: boolean
    latitude?: boolean
    longitude?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OffenseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "offenseDefinitionId" | "importKey" | "crimeType" | "felonyStage" | "sourceFile" | "sourceSheet" | "sourceRow" | "blotterNo" | "dateEncoded" | "pro" | "ppo" | "stn" | "pcp" | "region" | "province" | "municipal" | "barangay" | "street" | "typeOfPlace" | "dateReported" | "timeReported" | "dateCommitted" | "timeCommitted" | "isCrime" | "modeReporting" | "stageOfFelony" | "offense" | "offenseType" | "section" | "modus" | "suspectMotive" | "suspectSubMotive" | "heinous" | "sensational" | "threatGrp" | "grpAffiliation" | "mrs" | "suspectIsEGO" | "suspectEGOPosition" | "suspectEGOClass" | "suspectCount" | "suspectArrested" | "victimIsEGO" | "victimEGOPosition" | "victimEGOClass" | "victimCount" | "caseStatus" | "investigator" | "headInves" | "latitude" | "longitude" | "createdAt" | "updatedAt", ExtArgs["result"]["offense"]>
  export type OffenseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    offenseDefinition?: boolean | OffenseDefinitionDefaultArgs<ExtArgs>
  }
  export type OffenseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    offenseDefinition?: boolean | OffenseDefinitionDefaultArgs<ExtArgs>
  }
  export type OffenseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    offenseDefinition?: boolean | OffenseDefinitionDefaultArgs<ExtArgs>
  }

  export type $OffensePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Offense"
    objects: {
      offenseDefinition: Prisma.$OffenseDefinitionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      offenseDefinitionId: string
      importKey: string | null
      crimeType: string
      felonyStage: string
      sourceFile: string | null
      sourceSheet: string | null
      sourceRow: number | null
      blotterNo: string | null
      dateEncoded: Date | null
      pro: string | null
      ppo: string | null
      stn: string | null
      pcp: string | null
      region: string | null
      province: string | null
      municipal: string | null
      barangay: string
      street: string | null
      typeOfPlace: string | null
      dateReported: Date
      timeReported: string
      dateCommitted: Date
      timeCommitted: string
      isCrime: boolean
      modeReporting: string | null
      stageOfFelony: string | null
      offense: string | null
      offenseType: string | null
      section: string | null
      modus: string | null
      suspectMotive: string | null
      suspectSubMotive: string | null
      heinous: boolean
      sensational: boolean
      threatGrp: boolean
      grpAffiliation: string | null
      mrs: string | null
      suspectIsEGO: boolean
      suspectEGOPosition: string | null
      suspectEGOClass: string | null
      suspectCount: number | null
      suspectArrested: boolean | null
      victimIsEGO: boolean
      victimEGOPosition: string | null
      victimEGOClass: string | null
      victimCount: number | null
      caseStatus: string | null
      investigator: string | null
      headInves: string | null
      latitude: number | null
      longitude: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["offense"]>
    composites: {}
  }

  type OffenseGetPayload<S extends boolean | null | undefined | OffenseDefaultArgs> = $Result.GetResult<Prisma.$OffensePayload, S>

  type OffenseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OffenseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: OffenseCountAggregateInputType | true
    }

  export interface OffenseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Offense'], meta: { name: 'Offense' } }
    /**
     * Find zero or one Offense that matches the filter.
     * @param {OffenseFindUniqueArgs} args - Arguments to find a Offense
     * @example
     * // Get one Offense
     * const offense = await prisma.offense.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OffenseFindUniqueArgs>(args: SelectSubset<T, OffenseFindUniqueArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Offense that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OffenseFindUniqueOrThrowArgs} args - Arguments to find a Offense
     * @example
     * // Get one Offense
     * const offense = await prisma.offense.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OffenseFindUniqueOrThrowArgs>(args: SelectSubset<T, OffenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Offense that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseFindFirstArgs} args - Arguments to find a Offense
     * @example
     * // Get one Offense
     * const offense = await prisma.offense.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OffenseFindFirstArgs>(args?: SelectSubset<T, OffenseFindFirstArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Offense that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseFindFirstOrThrowArgs} args - Arguments to find a Offense
     * @example
     * // Get one Offense
     * const offense = await prisma.offense.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OffenseFindFirstOrThrowArgs>(args?: SelectSubset<T, OffenseFindFirstOrThrowArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Offenses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Offenses
     * const offenses = await prisma.offense.findMany()
     * 
     * // Get first 10 Offenses
     * const offenses = await prisma.offense.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const offenseWithIdOnly = await prisma.offense.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OffenseFindManyArgs>(args?: SelectSubset<T, OffenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Offense.
     * @param {OffenseCreateArgs} args - Arguments to create a Offense.
     * @example
     * // Create one Offense
     * const Offense = await prisma.offense.create({
     *   data: {
     *     // ... data to create a Offense
     *   }
     * })
     * 
     */
    create<T extends OffenseCreateArgs>(args: SelectSubset<T, OffenseCreateArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Offenses.
     * @param {OffenseCreateManyArgs} args - Arguments to create many Offenses.
     * @example
     * // Create many Offenses
     * const offense = await prisma.offense.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OffenseCreateManyArgs>(args?: SelectSubset<T, OffenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Offenses and returns the data saved in the database.
     * @param {OffenseCreateManyAndReturnArgs} args - Arguments to create many Offenses.
     * @example
     * // Create many Offenses
     * const offense = await prisma.offense.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Offenses and only return the `id`
     * const offenseWithIdOnly = await prisma.offense.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OffenseCreateManyAndReturnArgs>(args?: SelectSubset<T, OffenseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Offense.
     * @param {OffenseDeleteArgs} args - Arguments to delete one Offense.
     * @example
     * // Delete one Offense
     * const Offense = await prisma.offense.delete({
     *   where: {
     *     // ... filter to delete one Offense
     *   }
     * })
     * 
     */
    delete<T extends OffenseDeleteArgs>(args: SelectSubset<T, OffenseDeleteArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Offense.
     * @param {OffenseUpdateArgs} args - Arguments to update one Offense.
     * @example
     * // Update one Offense
     * const offense = await prisma.offense.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OffenseUpdateArgs>(args: SelectSubset<T, OffenseUpdateArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Offenses.
     * @param {OffenseDeleteManyArgs} args - Arguments to filter Offenses to delete.
     * @example
     * // Delete a few Offenses
     * const { count } = await prisma.offense.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OffenseDeleteManyArgs>(args?: SelectSubset<T, OffenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Offenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Offenses
     * const offense = await prisma.offense.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OffenseUpdateManyArgs>(args: SelectSubset<T, OffenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Offenses and returns the data updated in the database.
     * @param {OffenseUpdateManyAndReturnArgs} args - Arguments to update many Offenses.
     * @example
     * // Update many Offenses
     * const offense = await prisma.offense.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Offenses and only return the `id`
     * const offenseWithIdOnly = await prisma.offense.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OffenseUpdateManyAndReturnArgs>(args: SelectSubset<T, OffenseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Offense.
     * @param {OffenseUpsertArgs} args - Arguments to update or create a Offense.
     * @example
     * // Update or create a Offense
     * const offense = await prisma.offense.upsert({
     *   create: {
     *     // ... data to create a Offense
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Offense we want to update
     *   }
     * })
     */
    upsert<T extends OffenseUpsertArgs>(args: SelectSubset<T, OffenseUpsertArgs<ExtArgs>>): Prisma__OffenseClient<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Offenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseCountArgs} args - Arguments to filter Offenses to count.
     * @example
     * // Count the number of Offenses
     * const count = await prisma.offense.count({
     *   where: {
     *     // ... the filter for the Offenses we want to count
     *   }
     * })
    **/
    count<T extends OffenseCountArgs>(
      args?: Subset<T, OffenseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OffenseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Offense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OffenseAggregateArgs>(args: Subset<T, OffenseAggregateArgs>): Prisma.PrismaPromise<GetOffenseAggregateType<T>>

    /**
     * Group by Offense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OffenseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OffenseGroupByArgs['orderBy'] }
        : { orderBy?: OffenseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OffenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOffenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Offense model
   */
  readonly fields: OffenseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Offense.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OffenseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    offenseDefinition<T extends OffenseDefinitionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OffenseDefinitionDefaultArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Offense model
   */
  interface OffenseFieldRefs {
    readonly id: FieldRef<"Offense", 'String'>
    readonly offenseDefinitionId: FieldRef<"Offense", 'String'>
    readonly importKey: FieldRef<"Offense", 'String'>
    readonly crimeType: FieldRef<"Offense", 'String'>
    readonly felonyStage: FieldRef<"Offense", 'String'>
    readonly sourceFile: FieldRef<"Offense", 'String'>
    readonly sourceSheet: FieldRef<"Offense", 'String'>
    readonly sourceRow: FieldRef<"Offense", 'Int'>
    readonly blotterNo: FieldRef<"Offense", 'String'>
    readonly dateEncoded: FieldRef<"Offense", 'DateTime'>
    readonly pro: FieldRef<"Offense", 'String'>
    readonly ppo: FieldRef<"Offense", 'String'>
    readonly stn: FieldRef<"Offense", 'String'>
    readonly pcp: FieldRef<"Offense", 'String'>
    readonly region: FieldRef<"Offense", 'String'>
    readonly province: FieldRef<"Offense", 'String'>
    readonly municipal: FieldRef<"Offense", 'String'>
    readonly barangay: FieldRef<"Offense", 'String'>
    readonly street: FieldRef<"Offense", 'String'>
    readonly typeOfPlace: FieldRef<"Offense", 'String'>
    readonly dateReported: FieldRef<"Offense", 'DateTime'>
    readonly timeReported: FieldRef<"Offense", 'String'>
    readonly dateCommitted: FieldRef<"Offense", 'DateTime'>
    readonly timeCommitted: FieldRef<"Offense", 'String'>
    readonly isCrime: FieldRef<"Offense", 'Boolean'>
    readonly modeReporting: FieldRef<"Offense", 'String'>
    readonly stageOfFelony: FieldRef<"Offense", 'String'>
    readonly offense: FieldRef<"Offense", 'String'>
    readonly offenseType: FieldRef<"Offense", 'String'>
    readonly section: FieldRef<"Offense", 'String'>
    readonly modus: FieldRef<"Offense", 'String'>
    readonly suspectMotive: FieldRef<"Offense", 'String'>
    readonly suspectSubMotive: FieldRef<"Offense", 'String'>
    readonly heinous: FieldRef<"Offense", 'Boolean'>
    readonly sensational: FieldRef<"Offense", 'Boolean'>
    readonly threatGrp: FieldRef<"Offense", 'Boolean'>
    readonly grpAffiliation: FieldRef<"Offense", 'String'>
    readonly mrs: FieldRef<"Offense", 'String'>
    readonly suspectIsEGO: FieldRef<"Offense", 'Boolean'>
    readonly suspectEGOPosition: FieldRef<"Offense", 'String'>
    readonly suspectEGOClass: FieldRef<"Offense", 'String'>
    readonly suspectCount: FieldRef<"Offense", 'Int'>
    readonly suspectArrested: FieldRef<"Offense", 'Boolean'>
    readonly victimIsEGO: FieldRef<"Offense", 'Boolean'>
    readonly victimEGOPosition: FieldRef<"Offense", 'String'>
    readonly victimEGOClass: FieldRef<"Offense", 'String'>
    readonly victimCount: FieldRef<"Offense", 'Int'>
    readonly caseStatus: FieldRef<"Offense", 'String'>
    readonly investigator: FieldRef<"Offense", 'String'>
    readonly headInves: FieldRef<"Offense", 'String'>
    readonly latitude: FieldRef<"Offense", 'Float'>
    readonly longitude: FieldRef<"Offense", 'Float'>
    readonly createdAt: FieldRef<"Offense", 'DateTime'>
    readonly updatedAt: FieldRef<"Offense", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Offense findUnique
   */
  export type OffenseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * Filter, which Offense to fetch.
     */
    where: OffenseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense findUniqueOrThrow
   */
  export type OffenseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * Filter, which Offense to fetch.
     */
    where: OffenseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense findFirst
   */
  export type OffenseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * Filter, which Offense to fetch.
     */
    where?: OffenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Offenses to fetch.
     */
    orderBy?: OffenseOrderByWithRelationInput | OffenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Offenses.
     */
    cursor?: OffenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Offenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Offenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Offenses.
     */
    distinct?: OffenseScalarFieldEnum | OffenseScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense findFirstOrThrow
   */
  export type OffenseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * Filter, which Offense to fetch.
     */
    where?: OffenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Offenses to fetch.
     */
    orderBy?: OffenseOrderByWithRelationInput | OffenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Offenses.
     */
    cursor?: OffenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Offenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Offenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Offenses.
     */
    distinct?: OffenseScalarFieldEnum | OffenseScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense findMany
   */
  export type OffenseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * Filter, which Offenses to fetch.
     */
    where?: OffenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Offenses to fetch.
     */
    orderBy?: OffenseOrderByWithRelationInput | OffenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Offenses.
     */
    cursor?: OffenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Offenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Offenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Offenses.
     */
    distinct?: OffenseScalarFieldEnum | OffenseScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense create
   */
  export type OffenseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * The data needed to create a Offense.
     */
    data: XOR<OffenseCreateInput, OffenseUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense createMany
   */
  export type OffenseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Offenses.
     */
    data: OffenseCreateManyInput | OffenseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Offense createManyAndReturn
   */
  export type OffenseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * The data used to create many Offenses.
     */
    data: OffenseCreateManyInput | OffenseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Offense update
   */
  export type OffenseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * The data needed to update a Offense.
     */
    data: XOR<OffenseUpdateInput, OffenseUncheckedUpdateInput>
    /**
     * Choose, which Offense to update.
     */
    where: OffenseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense updateMany
   */
  export type OffenseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Offenses.
     */
    data: XOR<OffenseUpdateManyMutationInput, OffenseUncheckedUpdateManyInput>
    /**
     * Filter which Offenses to update
     */
    where?: OffenseWhereInput
    /**
     * Limit how many Offenses to update.
     */
    limit?: number
  }

  /**
   * Offense updateManyAndReturn
   */
  export type OffenseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * The data used to update Offenses.
     */
    data: XOR<OffenseUpdateManyMutationInput, OffenseUncheckedUpdateManyInput>
    /**
     * Filter which Offenses to update
     */
    where?: OffenseWhereInput
    /**
     * Limit how many Offenses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Offense upsert
   */
  export type OffenseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * The filter to search for the Offense to update in case it exists.
     */
    where: OffenseWhereUniqueInput
    /**
     * In case the Offense found by the `where` argument doesn't exist, create a new Offense with this data.
     */
    create: XOR<OffenseCreateInput, OffenseUncheckedCreateInput>
    /**
     * In case the Offense was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OffenseUpdateInput, OffenseUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense delete
   */
  export type OffenseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    /**
     * Filter which Offense to delete.
     */
    where: OffenseWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Offense deleteMany
   */
  export type OffenseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Offenses to delete
     */
    where?: OffenseWhereInput
    /**
     * Limit how many Offenses to delete.
     */
    limit?: number
  }

  /**
   * Offense without action
   */
  export type OffenseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
  }


  /**
   * Model OffenseDefinition
   */

  export type AggregateOffenseDefinition = {
    _count: OffenseDefinitionCountAggregateOutputType | null
    _min: OffenseDefinitionMinAggregateOutputType | null
    _max: OffenseDefinitionMaxAggregateOutputType | null
  }

  export type OffenseDefinitionMinAggregateOutputType = {
    id: string | null
    code: string | null
    label: string | null
  }

  export type OffenseDefinitionMaxAggregateOutputType = {
    id: string | null
    code: string | null
    label: string | null
  }

  export type OffenseDefinitionCountAggregateOutputType = {
    id: number
    code: number
    label: number
    _all: number
  }


  export type OffenseDefinitionMinAggregateInputType = {
    id?: true
    code?: true
    label?: true
  }

  export type OffenseDefinitionMaxAggregateInputType = {
    id?: true
    code?: true
    label?: true
  }

  export type OffenseDefinitionCountAggregateInputType = {
    id?: true
    code?: true
    label?: true
    _all?: true
  }

  export type OffenseDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OffenseDefinition to aggregate.
     */
    where?: OffenseDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OffenseDefinitions to fetch.
     */
    orderBy?: OffenseDefinitionOrderByWithRelationInput | OffenseDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OffenseDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OffenseDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OffenseDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OffenseDefinitions
    **/
    _count?: true | OffenseDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OffenseDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OffenseDefinitionMaxAggregateInputType
  }

  export type GetOffenseDefinitionAggregateType<T extends OffenseDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregateOffenseDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOffenseDefinition[P]>
      : GetScalarType<T[P], AggregateOffenseDefinition[P]>
  }




  export type OffenseDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OffenseDefinitionWhereInput
    orderBy?: OffenseDefinitionOrderByWithAggregationInput | OffenseDefinitionOrderByWithAggregationInput[]
    by: OffenseDefinitionScalarFieldEnum[] | OffenseDefinitionScalarFieldEnum
    having?: OffenseDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OffenseDefinitionCountAggregateInputType | true
    _min?: OffenseDefinitionMinAggregateInputType
    _max?: OffenseDefinitionMaxAggregateInputType
  }

  export type OffenseDefinitionGroupByOutputType = {
    id: string
    code: string
    label: string
    _count: OffenseDefinitionCountAggregateOutputType | null
    _min: OffenseDefinitionMinAggregateOutputType | null
    _max: OffenseDefinitionMaxAggregateOutputType | null
  }

  type GetOffenseDefinitionGroupByPayload<T extends OffenseDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OffenseDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OffenseDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OffenseDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], OffenseDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type OffenseDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    label?: boolean
    records?: boolean | OffenseDefinition$recordsArgs<ExtArgs>
    _count?: boolean | OffenseDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["offenseDefinition"]>

  export type OffenseDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    label?: boolean
  }, ExtArgs["result"]["offenseDefinition"]>

  export type OffenseDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    label?: boolean
  }, ExtArgs["result"]["offenseDefinition"]>

  export type OffenseDefinitionSelectScalar = {
    id?: boolean
    code?: boolean
    label?: boolean
  }

  export type OffenseDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "label", ExtArgs["result"]["offenseDefinition"]>
  export type OffenseDefinitionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | OffenseDefinition$recordsArgs<ExtArgs>
    _count?: boolean | OffenseDefinitionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OffenseDefinitionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OffenseDefinitionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OffenseDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OffenseDefinition"
    objects: {
      records: Prisma.$OffensePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      label: string
    }, ExtArgs["result"]["offenseDefinition"]>
    composites: {}
  }

  type OffenseDefinitionGetPayload<S extends boolean | null | undefined | OffenseDefinitionDefaultArgs> = $Result.GetResult<Prisma.$OffenseDefinitionPayload, S>

  type OffenseDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OffenseDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: OffenseDefinitionCountAggregateInputType | true
    }

  export interface OffenseDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OffenseDefinition'], meta: { name: 'OffenseDefinition' } }
    /**
     * Find zero or one OffenseDefinition that matches the filter.
     * @param {OffenseDefinitionFindUniqueArgs} args - Arguments to find a OffenseDefinition
     * @example
     * // Get one OffenseDefinition
     * const offenseDefinition = await prisma.offenseDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OffenseDefinitionFindUniqueArgs>(args: SelectSubset<T, OffenseDefinitionFindUniqueArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OffenseDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OffenseDefinitionFindUniqueOrThrowArgs} args - Arguments to find a OffenseDefinition
     * @example
     * // Get one OffenseDefinition
     * const offenseDefinition = await prisma.offenseDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OffenseDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, OffenseDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OffenseDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionFindFirstArgs} args - Arguments to find a OffenseDefinition
     * @example
     * // Get one OffenseDefinition
     * const offenseDefinition = await prisma.offenseDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OffenseDefinitionFindFirstArgs>(args?: SelectSubset<T, OffenseDefinitionFindFirstArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OffenseDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionFindFirstOrThrowArgs} args - Arguments to find a OffenseDefinition
     * @example
     * // Get one OffenseDefinition
     * const offenseDefinition = await prisma.offenseDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OffenseDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, OffenseDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OffenseDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OffenseDefinitions
     * const offenseDefinitions = await prisma.offenseDefinition.findMany()
     * 
     * // Get first 10 OffenseDefinitions
     * const offenseDefinitions = await prisma.offenseDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const offenseDefinitionWithIdOnly = await prisma.offenseDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OffenseDefinitionFindManyArgs>(args?: SelectSubset<T, OffenseDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OffenseDefinition.
     * @param {OffenseDefinitionCreateArgs} args - Arguments to create a OffenseDefinition.
     * @example
     * // Create one OffenseDefinition
     * const OffenseDefinition = await prisma.offenseDefinition.create({
     *   data: {
     *     // ... data to create a OffenseDefinition
     *   }
     * })
     * 
     */
    create<T extends OffenseDefinitionCreateArgs>(args: SelectSubset<T, OffenseDefinitionCreateArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OffenseDefinitions.
     * @param {OffenseDefinitionCreateManyArgs} args - Arguments to create many OffenseDefinitions.
     * @example
     * // Create many OffenseDefinitions
     * const offenseDefinition = await prisma.offenseDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OffenseDefinitionCreateManyArgs>(args?: SelectSubset<T, OffenseDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OffenseDefinitions and returns the data saved in the database.
     * @param {OffenseDefinitionCreateManyAndReturnArgs} args - Arguments to create many OffenseDefinitions.
     * @example
     * // Create many OffenseDefinitions
     * const offenseDefinition = await prisma.offenseDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OffenseDefinitions and only return the `id`
     * const offenseDefinitionWithIdOnly = await prisma.offenseDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OffenseDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, OffenseDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OffenseDefinition.
     * @param {OffenseDefinitionDeleteArgs} args - Arguments to delete one OffenseDefinition.
     * @example
     * // Delete one OffenseDefinition
     * const OffenseDefinition = await prisma.offenseDefinition.delete({
     *   where: {
     *     // ... filter to delete one OffenseDefinition
     *   }
     * })
     * 
     */
    delete<T extends OffenseDefinitionDeleteArgs>(args: SelectSubset<T, OffenseDefinitionDeleteArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OffenseDefinition.
     * @param {OffenseDefinitionUpdateArgs} args - Arguments to update one OffenseDefinition.
     * @example
     * // Update one OffenseDefinition
     * const offenseDefinition = await prisma.offenseDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OffenseDefinitionUpdateArgs>(args: SelectSubset<T, OffenseDefinitionUpdateArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OffenseDefinitions.
     * @param {OffenseDefinitionDeleteManyArgs} args - Arguments to filter OffenseDefinitions to delete.
     * @example
     * // Delete a few OffenseDefinitions
     * const { count } = await prisma.offenseDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OffenseDefinitionDeleteManyArgs>(args?: SelectSubset<T, OffenseDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OffenseDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OffenseDefinitions
     * const offenseDefinition = await prisma.offenseDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OffenseDefinitionUpdateManyArgs>(args: SelectSubset<T, OffenseDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OffenseDefinitions and returns the data updated in the database.
     * @param {OffenseDefinitionUpdateManyAndReturnArgs} args - Arguments to update many OffenseDefinitions.
     * @example
     * // Update many OffenseDefinitions
     * const offenseDefinition = await prisma.offenseDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OffenseDefinitions and only return the `id`
     * const offenseDefinitionWithIdOnly = await prisma.offenseDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OffenseDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, OffenseDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OffenseDefinition.
     * @param {OffenseDefinitionUpsertArgs} args - Arguments to update or create a OffenseDefinition.
     * @example
     * // Update or create a OffenseDefinition
     * const offenseDefinition = await prisma.offenseDefinition.upsert({
     *   create: {
     *     // ... data to create a OffenseDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OffenseDefinition we want to update
     *   }
     * })
     */
    upsert<T extends OffenseDefinitionUpsertArgs>(args: SelectSubset<T, OffenseDefinitionUpsertArgs<ExtArgs>>): Prisma__OffenseDefinitionClient<$Result.GetResult<Prisma.$OffenseDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OffenseDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionCountArgs} args - Arguments to filter OffenseDefinitions to count.
     * @example
     * // Count the number of OffenseDefinitions
     * const count = await prisma.offenseDefinition.count({
     *   where: {
     *     // ... the filter for the OffenseDefinitions we want to count
     *   }
     * })
    **/
    count<T extends OffenseDefinitionCountArgs>(
      args?: Subset<T, OffenseDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OffenseDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OffenseDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OffenseDefinitionAggregateArgs>(args: Subset<T, OffenseDefinitionAggregateArgs>): Prisma.PrismaPromise<GetOffenseDefinitionAggregateType<T>>

    /**
     * Group by OffenseDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OffenseDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OffenseDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OffenseDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: OffenseDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OffenseDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOffenseDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OffenseDefinition model
   */
  readonly fields: OffenseDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OffenseDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OffenseDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    records<T extends OffenseDefinition$recordsArgs<ExtArgs> = {}>(args?: Subset<T, OffenseDefinition$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OffensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OffenseDefinition model
   */
  interface OffenseDefinitionFieldRefs {
    readonly id: FieldRef<"OffenseDefinition", 'String'>
    readonly code: FieldRef<"OffenseDefinition", 'String'>
    readonly label: FieldRef<"OffenseDefinition", 'String'>
  }
    

  // Custom InputTypes
  /**
   * OffenseDefinition findUnique
   */
  export type OffenseDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which OffenseDefinition to fetch.
     */
    where: OffenseDefinitionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition findUniqueOrThrow
   */
  export type OffenseDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which OffenseDefinition to fetch.
     */
    where: OffenseDefinitionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition findFirst
   */
  export type OffenseDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which OffenseDefinition to fetch.
     */
    where?: OffenseDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OffenseDefinitions to fetch.
     */
    orderBy?: OffenseDefinitionOrderByWithRelationInput | OffenseDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OffenseDefinitions.
     */
    cursor?: OffenseDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OffenseDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OffenseDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OffenseDefinitions.
     */
    distinct?: OffenseDefinitionScalarFieldEnum | OffenseDefinitionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition findFirstOrThrow
   */
  export type OffenseDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which OffenseDefinition to fetch.
     */
    where?: OffenseDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OffenseDefinitions to fetch.
     */
    orderBy?: OffenseDefinitionOrderByWithRelationInput | OffenseDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OffenseDefinitions.
     */
    cursor?: OffenseDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OffenseDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OffenseDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OffenseDefinitions.
     */
    distinct?: OffenseDefinitionScalarFieldEnum | OffenseDefinitionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition findMany
   */
  export type OffenseDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * Filter, which OffenseDefinitions to fetch.
     */
    where?: OffenseDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OffenseDefinitions to fetch.
     */
    orderBy?: OffenseDefinitionOrderByWithRelationInput | OffenseDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OffenseDefinitions.
     */
    cursor?: OffenseDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OffenseDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OffenseDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OffenseDefinitions.
     */
    distinct?: OffenseDefinitionScalarFieldEnum | OffenseDefinitionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition create
   */
  export type OffenseDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to create a OffenseDefinition.
     */
    data: XOR<OffenseDefinitionCreateInput, OffenseDefinitionUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition createMany
   */
  export type OffenseDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OffenseDefinitions.
     */
    data: OffenseDefinitionCreateManyInput | OffenseDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OffenseDefinition createManyAndReturn
   */
  export type OffenseDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many OffenseDefinitions.
     */
    data: OffenseDefinitionCreateManyInput | OffenseDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OffenseDefinition update
   */
  export type OffenseDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * The data needed to update a OffenseDefinition.
     */
    data: XOR<OffenseDefinitionUpdateInput, OffenseDefinitionUncheckedUpdateInput>
    /**
     * Choose, which OffenseDefinition to update.
     */
    where: OffenseDefinitionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition updateMany
   */
  export type OffenseDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OffenseDefinitions.
     */
    data: XOR<OffenseDefinitionUpdateManyMutationInput, OffenseDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which OffenseDefinitions to update
     */
    where?: OffenseDefinitionWhereInput
    /**
     * Limit how many OffenseDefinitions to update.
     */
    limit?: number
  }

  /**
   * OffenseDefinition updateManyAndReturn
   */
  export type OffenseDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update OffenseDefinitions.
     */
    data: XOR<OffenseDefinitionUpdateManyMutationInput, OffenseDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which OffenseDefinitions to update
     */
    where?: OffenseDefinitionWhereInput
    /**
     * Limit how many OffenseDefinitions to update.
     */
    limit?: number
  }

  /**
   * OffenseDefinition upsert
   */
  export type OffenseDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * The filter to search for the OffenseDefinition to update in case it exists.
     */
    where: OffenseDefinitionWhereUniqueInput
    /**
     * In case the OffenseDefinition found by the `where` argument doesn't exist, create a new OffenseDefinition with this data.
     */
    create: XOR<OffenseDefinitionCreateInput, OffenseDefinitionUncheckedCreateInput>
    /**
     * In case the OffenseDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OffenseDefinitionUpdateInput, OffenseDefinitionUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition delete
   */
  export type OffenseDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
    /**
     * Filter which OffenseDefinition to delete.
     */
    where: OffenseDefinitionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * OffenseDefinition deleteMany
   */
  export type OffenseDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OffenseDefinitions to delete
     */
    where?: OffenseDefinitionWhereInput
    /**
     * Limit how many OffenseDefinitions to delete.
     */
    limit?: number
  }

  /**
   * OffenseDefinition.records
   */
  export type OffenseDefinition$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Offense
     */
    select?: OffenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Offense
     */
    omit?: OffenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseInclude<ExtArgs> | null
    where?: OffenseWhereInput
    orderBy?: OffenseOrderByWithRelationInput | OffenseOrderByWithRelationInput[]
    cursor?: OffenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OffenseScalarFieldEnum | OffenseScalarFieldEnum[]
  }

  /**
   * OffenseDefinition without action
   */
  export type OffenseDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OffenseDefinition
     */
    select?: OffenseDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OffenseDefinition
     */
    omit?: OffenseDefinitionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OffenseDefinitionInclude<ExtArgs> | null
  }


  /**
   * Model Barangay
   */

  export type AggregateBarangay = {
    _count: BarangayCountAggregateOutputType | null
    _avg: BarangayAvgAggregateOutputType | null
    _sum: BarangaySumAggregateOutputType | null
    _min: BarangayMinAggregateOutputType | null
    _max: BarangayMaxAggregateOutputType | null
  }

  export type BarangayAvgAggregateOutputType = {
    population: number | null
    area: number | null
  }

  export type BarangaySumAggregateOutputType = {
    population: number | null
    area: number | null
  }

  export type BarangayMinAggregateOutputType = {
    id: string | null
    name: string | null
    population: number | null
    area: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BarangayMaxAggregateOutputType = {
    id: string | null
    name: string | null
    population: number | null
    area: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BarangayCountAggregateOutputType = {
    id: number
    name: number
    coordinates: number
    population: number
    area: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BarangayAvgAggregateInputType = {
    population?: true
    area?: true
  }

  export type BarangaySumAggregateInputType = {
    population?: true
    area?: true
  }

  export type BarangayMinAggregateInputType = {
    id?: true
    name?: true
    population?: true
    area?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BarangayMaxAggregateInputType = {
    id?: true
    name?: true
    population?: true
    area?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BarangayCountAggregateInputType = {
    id?: true
    name?: true
    coordinates?: true
    population?: true
    area?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BarangayAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Barangay to aggregate.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Barangays
    **/
    _count?: true | BarangayCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BarangayAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BarangaySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BarangayMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BarangayMaxAggregateInputType
  }

  export type GetBarangayAggregateType<T extends BarangayAggregateArgs> = {
        [P in keyof T & keyof AggregateBarangay]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBarangay[P]>
      : GetScalarType<T[P], AggregateBarangay[P]>
  }




  export type BarangayGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BarangayWhereInput
    orderBy?: BarangayOrderByWithAggregationInput | BarangayOrderByWithAggregationInput[]
    by: BarangayScalarFieldEnum[] | BarangayScalarFieldEnum
    having?: BarangayScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BarangayCountAggregateInputType | true
    _avg?: BarangayAvgAggregateInputType
    _sum?: BarangaySumAggregateInputType
    _min?: BarangayMinAggregateInputType
    _max?: BarangayMaxAggregateInputType
  }

  export type BarangayGroupByOutputType = {
    id: string
    name: string
    coordinates: JsonValue | null
    population: number | null
    area: number | null
    createdAt: Date
    updatedAt: Date
    _count: BarangayCountAggregateOutputType | null
    _avg: BarangayAvgAggregateOutputType | null
    _sum: BarangaySumAggregateOutputType | null
    _min: BarangayMinAggregateOutputType | null
    _max: BarangayMaxAggregateOutputType | null
  }

  type GetBarangayGroupByPayload<T extends BarangayGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BarangayGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BarangayGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BarangayGroupByOutputType[P]>
            : GetScalarType<T[P], BarangayGroupByOutputType[P]>
        }
      >
    >


  export type BarangaySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barangay"]>

  export type BarangaySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barangay"]>

  export type BarangaySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["barangay"]>

  export type BarangaySelectScalar = {
    id?: boolean
    name?: boolean
    coordinates?: boolean
    population?: boolean
    area?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BarangayOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "coordinates" | "population" | "area" | "createdAt" | "updatedAt", ExtArgs["result"]["barangay"]>

  export type $BarangayPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Barangay"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      coordinates: Prisma.JsonValue | null
      population: number | null
      area: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["barangay"]>
    composites: {}
  }

  type BarangayGetPayload<S extends boolean | null | undefined | BarangayDefaultArgs> = $Result.GetResult<Prisma.$BarangayPayload, S>

  type BarangayCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BarangayFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: BarangayCountAggregateInputType | true
    }

  export interface BarangayDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Barangay'], meta: { name: 'Barangay' } }
    /**
     * Find zero or one Barangay that matches the filter.
     * @param {BarangayFindUniqueArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BarangayFindUniqueArgs>(args: SelectSubset<T, BarangayFindUniqueArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Barangay that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BarangayFindUniqueOrThrowArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BarangayFindUniqueOrThrowArgs>(args: SelectSubset<T, BarangayFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Barangay that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayFindFirstArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BarangayFindFirstArgs>(args?: SelectSubset<T, BarangayFindFirstArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Barangay that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayFindFirstOrThrowArgs} args - Arguments to find a Barangay
     * @example
     * // Get one Barangay
     * const barangay = await prisma.barangay.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BarangayFindFirstOrThrowArgs>(args?: SelectSubset<T, BarangayFindFirstOrThrowArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Barangays that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Barangays
     * const barangays = await prisma.barangay.findMany()
     * 
     * // Get first 10 Barangays
     * const barangays = await prisma.barangay.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const barangayWithIdOnly = await prisma.barangay.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BarangayFindManyArgs>(args?: SelectSubset<T, BarangayFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Barangay.
     * @param {BarangayCreateArgs} args - Arguments to create a Barangay.
     * @example
     * // Create one Barangay
     * const Barangay = await prisma.barangay.create({
     *   data: {
     *     // ... data to create a Barangay
     *   }
     * })
     * 
     */
    create<T extends BarangayCreateArgs>(args: SelectSubset<T, BarangayCreateArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Barangays.
     * @param {BarangayCreateManyArgs} args - Arguments to create many Barangays.
     * @example
     * // Create many Barangays
     * const barangay = await prisma.barangay.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BarangayCreateManyArgs>(args?: SelectSubset<T, BarangayCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Barangays and returns the data saved in the database.
     * @param {BarangayCreateManyAndReturnArgs} args - Arguments to create many Barangays.
     * @example
     * // Create many Barangays
     * const barangay = await prisma.barangay.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Barangays and only return the `id`
     * const barangayWithIdOnly = await prisma.barangay.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BarangayCreateManyAndReturnArgs>(args?: SelectSubset<T, BarangayCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Barangay.
     * @param {BarangayDeleteArgs} args - Arguments to delete one Barangay.
     * @example
     * // Delete one Barangay
     * const Barangay = await prisma.barangay.delete({
     *   where: {
     *     // ... filter to delete one Barangay
     *   }
     * })
     * 
     */
    delete<T extends BarangayDeleteArgs>(args: SelectSubset<T, BarangayDeleteArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Barangay.
     * @param {BarangayUpdateArgs} args - Arguments to update one Barangay.
     * @example
     * // Update one Barangay
     * const barangay = await prisma.barangay.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BarangayUpdateArgs>(args: SelectSubset<T, BarangayUpdateArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Barangays.
     * @param {BarangayDeleteManyArgs} args - Arguments to filter Barangays to delete.
     * @example
     * // Delete a few Barangays
     * const { count } = await prisma.barangay.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BarangayDeleteManyArgs>(args?: SelectSubset<T, BarangayDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Barangays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Barangays
     * const barangay = await prisma.barangay.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BarangayUpdateManyArgs>(args: SelectSubset<T, BarangayUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Barangays and returns the data updated in the database.
     * @param {BarangayUpdateManyAndReturnArgs} args - Arguments to update many Barangays.
     * @example
     * // Update many Barangays
     * const barangay = await prisma.barangay.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Barangays and only return the `id`
     * const barangayWithIdOnly = await prisma.barangay.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BarangayUpdateManyAndReturnArgs>(args: SelectSubset<T, BarangayUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Barangay.
     * @param {BarangayUpsertArgs} args - Arguments to update or create a Barangay.
     * @example
     * // Update or create a Barangay
     * const barangay = await prisma.barangay.upsert({
     *   create: {
     *     // ... data to create a Barangay
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Barangay we want to update
     *   }
     * })
     */
    upsert<T extends BarangayUpsertArgs>(args: SelectSubset<T, BarangayUpsertArgs<ExtArgs>>): Prisma__BarangayClient<$Result.GetResult<Prisma.$BarangayPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Barangays.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayCountArgs} args - Arguments to filter Barangays to count.
     * @example
     * // Count the number of Barangays
     * const count = await prisma.barangay.count({
     *   where: {
     *     // ... the filter for the Barangays we want to count
     *   }
     * })
    **/
    count<T extends BarangayCountArgs>(
      args?: Subset<T, BarangayCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BarangayCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Barangay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BarangayAggregateArgs>(args: Subset<T, BarangayAggregateArgs>): Prisma.PrismaPromise<GetBarangayAggregateType<T>>

    /**
     * Group by Barangay.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BarangayGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BarangayGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BarangayGroupByArgs['orderBy'] }
        : { orderBy?: BarangayGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BarangayGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBarangayGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Barangay model
   */
  readonly fields: BarangayFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Barangay.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BarangayClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Barangay model
   */
  interface BarangayFieldRefs {
    readonly id: FieldRef<"Barangay", 'String'>
    readonly name: FieldRef<"Barangay", 'String'>
    readonly coordinates: FieldRef<"Barangay", 'Json'>
    readonly population: FieldRef<"Barangay", 'Int'>
    readonly area: FieldRef<"Barangay", 'Float'>
    readonly createdAt: FieldRef<"Barangay", 'DateTime'>
    readonly updatedAt: FieldRef<"Barangay", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Barangay findUnique
   */
  export type BarangayFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where: BarangayWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay findUniqueOrThrow
   */
  export type BarangayFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where: BarangayWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay findFirst
   */
  export type BarangayFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Barangays.
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barangays.
     */
    distinct?: BarangayScalarFieldEnum | BarangayScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay findFirstOrThrow
   */
  export type BarangayFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangay to fetch.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Barangays.
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barangays.
     */
    distinct?: BarangayScalarFieldEnum | BarangayScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay findMany
   */
  export type BarangayFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter, which Barangays to fetch.
     */
    where?: BarangayWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Barangays to fetch.
     */
    orderBy?: BarangayOrderByWithRelationInput | BarangayOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Barangays.
     */
    cursor?: BarangayWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Barangays from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Barangays.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Barangays.
     */
    distinct?: BarangayScalarFieldEnum | BarangayScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay create
   */
  export type BarangayCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data needed to create a Barangay.
     */
    data: XOR<BarangayCreateInput, BarangayUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay createMany
   */
  export type BarangayCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Barangays.
     */
    data: BarangayCreateManyInput | BarangayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Barangay createManyAndReturn
   */
  export type BarangayCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data used to create many Barangays.
     */
    data: BarangayCreateManyInput | BarangayCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Barangay update
   */
  export type BarangayUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data needed to update a Barangay.
     */
    data: XOR<BarangayUpdateInput, BarangayUncheckedUpdateInput>
    /**
     * Choose, which Barangay to update.
     */
    where: BarangayWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay updateMany
   */
  export type BarangayUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Barangays.
     */
    data: XOR<BarangayUpdateManyMutationInput, BarangayUncheckedUpdateManyInput>
    /**
     * Filter which Barangays to update
     */
    where?: BarangayWhereInput
    /**
     * Limit how many Barangays to update.
     */
    limit?: number
  }

  /**
   * Barangay updateManyAndReturn
   */
  export type BarangayUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The data used to update Barangays.
     */
    data: XOR<BarangayUpdateManyMutationInput, BarangayUncheckedUpdateManyInput>
    /**
     * Filter which Barangays to update
     */
    where?: BarangayWhereInput
    /**
     * Limit how many Barangays to update.
     */
    limit?: number
  }

  /**
   * Barangay upsert
   */
  export type BarangayUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * The filter to search for the Barangay to update in case it exists.
     */
    where: BarangayWhereUniqueInput
    /**
     * In case the Barangay found by the `where` argument doesn't exist, create a new Barangay with this data.
     */
    create: XOR<BarangayCreateInput, BarangayUncheckedCreateInput>
    /**
     * In case the Barangay was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BarangayUpdateInput, BarangayUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay delete
   */
  export type BarangayDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
    /**
     * Filter which Barangay to delete.
     */
    where: BarangayWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Barangay deleteMany
   */
  export type BarangayDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Barangays to delete
     */
    where?: BarangayWhereInput
    /**
     * Limit how many Barangays to delete.
     */
    limit?: number
  }

  /**
   * Barangay without action
   */
  export type BarangayDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Barangay
     */
    select?: BarangaySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Barangay
     */
    omit?: BarangayOmit<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    fileSize: number | null
    recordsImported: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    fileSize: number | null
    recordsImported: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    action: string | null
    details: string | null
    user: string | null
    createdAt: Date | null
    ip: string | null
    session: string | null
    userAgent: string | null
    resource: string | null
    severity: string | null
    outcome: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    errorMessage: string | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    details: string | null
    user: string | null
    createdAt: Date | null
    ip: string | null
    session: string | null
    userAgent: string | null
    resource: string | null
    severity: string | null
    outcome: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    errorMessage: string | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    action: number
    details: number
    user: number
    createdAt: number
    ip: number
    session: number
    userAgent: number
    resource: number
    severity: number
    outcome: number
    fileName: number
    fileSize: number
    recordsImported: number
    errorMessage: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    fileSize?: true
    recordsImported?: true
  }

  export type AuditLogSumAggregateInputType = {
    fileSize?: true
    recordsImported?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    action?: true
    details?: true
    user?: true
    createdAt?: true
    ip?: true
    session?: true
    userAgent?: true
    resource?: true
    severity?: true
    outcome?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    errorMessage?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    details?: true
    user?: true
    createdAt?: true
    ip?: true
    session?: true
    userAgent?: true
    resource?: true
    severity?: true
    outcome?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    errorMessage?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    action?: true
    details?: true
    user?: true
    createdAt?: true
    ip?: true
    session?: true
    userAgent?: true
    resource?: true
    severity?: true
    outcome?: true
    fileName?: true
    fileSize?: true
    recordsImported?: true
    errorMessage?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    action: string | null
    details: string | null
    user: string | null
    createdAt: Date
    ip: string | null
    session: string | null
    userAgent: string | null
    resource: string | null
    severity: string | null
    outcome: string | null
    fileName: string | null
    fileSize: number | null
    recordsImported: number | null
    errorMessage: string | null
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    userAgent?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    userAgent?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    userAgent?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    details?: boolean
    user?: boolean
    createdAt?: boolean
    ip?: boolean
    session?: boolean
    userAgent?: boolean
    resource?: boolean
    severity?: boolean
    outcome?: boolean
    fileName?: boolean
    fileSize?: boolean
    recordsImported?: boolean
    errorMessage?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "details" | "user" | "createdAt" | "ip" | "session" | "userAgent" | "resource" | "severity" | "outcome" | "fileName" | "fileSize" | "recordsImported" | "errorMessage", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string | null
      details: string | null
      user: string | null
      createdAt: Date
      ip: string | null
      session: string | null
      userAgent: string | null
      resource: string | null
      severity: string | null
      outcome: string | null
      fileName: string | null
      fileSize: number | null
      recordsImported: number | null
      errorMessage: string | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'String'>
    readonly user: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
    readonly ip: FieldRef<"AuditLog", 'String'>
    readonly session: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly resource: FieldRef<"AuditLog", 'String'>
    readonly severity: FieldRef<"AuditLog", 'String'>
    readonly outcome: FieldRef<"AuditLog", 'String'>
    readonly fileName: FieldRef<"AuditLog", 'String'>
    readonly fileSize: FieldRef<"AuditLog", 'Int'>
    readonly recordsImported: FieldRef<"AuditLog", 'Int'>
    readonly errorMessage: FieldRef<"AuditLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data?: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    sessionVersion: number | null
    autoLogoutTimer: number | null
    failedLoginAttempts: number | null
    totpLastStep: number | null
    mfaFailedAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    sessionVersion: number | null
    autoLogoutTimer: number | null
    failedLoginAttempts: number | null
    totpLastStep: number | null
    mfaFailedAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    accountNumber: string | null
    email: string | null
    emailVerifiedAt: Date | null
    sessionVersion: number | null
    fullName: string | null
    passwordHash: string | null
    mustChangePassword: boolean | null
    defaultLandingPage: string | null
    autoLogoutTimer: number | null
    failedLoginAttempts: number | null
    lockedAt: Date | null
    totpSecretEnc: string | null
    totpEnabledAt: Date | null
    totpLastStep: number | null
    mfaFailedAttempts: number | null
    passwordResetViaEmailAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    accountNumber: string | null
    email: string | null
    emailVerifiedAt: Date | null
    sessionVersion: number | null
    fullName: string | null
    passwordHash: string | null
    mustChangePassword: boolean | null
    defaultLandingPage: string | null
    autoLogoutTimer: number | null
    failedLoginAttempts: number | null
    lockedAt: Date | null
    totpSecretEnc: string | null
    totpEnabledAt: Date | null
    totpLastStep: number | null
    mfaFailedAttempts: number | null
    passwordResetViaEmailAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    accountNumber: number
    email: number
    emailVerifiedAt: number
    sessionVersion: number
    fullName: number
    passwordHash: number
    mustChangePassword: number
    defaultLandingPage: number
    autoLogoutTimer: number
    failedLoginAttempts: number
    lockedAt: number
    totpSecretEnc: number
    totpEnabledAt: number
    totpLastStep: number
    mfaFailedAttempts: number
    passwordResetViaEmailAt: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    deletedBy: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    sessionVersion?: true
    autoLogoutTimer?: true
    failedLoginAttempts?: true
    totpLastStep?: true
    mfaFailedAttempts?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    sessionVersion?: true
    autoLogoutTimer?: true
    failedLoginAttempts?: true
    totpLastStep?: true
    mfaFailedAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    accountNumber?: true
    email?: true
    emailVerifiedAt?: true
    sessionVersion?: true
    fullName?: true
    passwordHash?: true
    mustChangePassword?: true
    defaultLandingPage?: true
    autoLogoutTimer?: true
    failedLoginAttempts?: true
    lockedAt?: true
    totpSecretEnc?: true
    totpEnabledAt?: true
    totpLastStep?: true
    mfaFailedAttempts?: true
    passwordResetViaEmailAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    accountNumber?: true
    email?: true
    emailVerifiedAt?: true
    sessionVersion?: true
    fullName?: true
    passwordHash?: true
    mustChangePassword?: true
    defaultLandingPage?: true
    autoLogoutTimer?: true
    failedLoginAttempts?: true
    lockedAt?: true
    totpSecretEnc?: true
    totpEnabledAt?: true
    totpLastStep?: true
    mfaFailedAttempts?: true
    passwordResetViaEmailAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    accountNumber?: true
    email?: true
    emailVerifiedAt?: true
    sessionVersion?: true
    fullName?: true
    passwordHash?: true
    mustChangePassword?: true
    defaultLandingPage?: true
    autoLogoutTimer?: true
    failedLoginAttempts?: true
    lockedAt?: true
    totpSecretEnc?: true
    totpEnabledAt?: true
    totpLastStep?: true
    mfaFailedAttempts?: true
    passwordResetViaEmailAt?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    deletedBy?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    accountNumber: string
    email: string | null
    emailVerifiedAt: Date | null
    sessionVersion: number
    fullName: string
    passwordHash: string
    mustChangePassword: boolean
    defaultLandingPage: string
    autoLogoutTimer: number
    failedLoginAttempts: number
    lockedAt: Date | null
    totpSecretEnc: string | null
    totpEnabledAt: Date | null
    totpLastStep: number | null
    mfaFailedAttempts: number
    passwordResetViaEmailAt: Date | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    deletedBy: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountNumber?: boolean
    email?: boolean
    emailVerifiedAt?: boolean
    sessionVersion?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    defaultLandingPage?: boolean
    autoLogoutTimer?: boolean
    failedLoginAttempts?: boolean
    lockedAt?: boolean
    totpSecretEnc?: boolean
    totpEnabledAt?: boolean
    totpLastStep?: boolean
    mfaFailedAttempts?: boolean
    passwordResetViaEmailAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
    permissions?: boolean | User$permissionsArgs<ExtArgs>
    exportSchedules?: boolean | User$exportSchedulesArgs<ExtArgs>
    authTokens?: boolean | User$authTokensArgs<ExtArgs>
    mfaBackupCodes?: boolean | User$mfaBackupCodesArgs<ExtArgs>
    trustedDevices?: boolean | User$trustedDevicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountNumber?: boolean
    email?: boolean
    emailVerifiedAt?: boolean
    sessionVersion?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    defaultLandingPage?: boolean
    autoLogoutTimer?: boolean
    failedLoginAttempts?: boolean
    lockedAt?: boolean
    totpSecretEnc?: boolean
    totpEnabledAt?: boolean
    totpLastStep?: boolean
    mfaFailedAttempts?: boolean
    passwordResetViaEmailAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountNumber?: boolean
    email?: boolean
    emailVerifiedAt?: boolean
    sessionVersion?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    defaultLandingPage?: boolean
    autoLogoutTimer?: boolean
    failedLoginAttempts?: boolean
    lockedAt?: boolean
    totpSecretEnc?: boolean
    totpEnabledAt?: boolean
    totpLastStep?: boolean
    mfaFailedAttempts?: boolean
    passwordResetViaEmailAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    accountNumber?: boolean
    email?: boolean
    emailVerifiedAt?: boolean
    sessionVersion?: boolean
    fullName?: boolean
    passwordHash?: boolean
    mustChangePassword?: boolean
    defaultLandingPage?: boolean
    autoLogoutTimer?: boolean
    failedLoginAttempts?: boolean
    lockedAt?: boolean
    totpSecretEnc?: boolean
    totpEnabledAt?: boolean
    totpLastStep?: boolean
    mfaFailedAttempts?: boolean
    passwordResetViaEmailAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountNumber" | "email" | "emailVerifiedAt" | "sessionVersion" | "fullName" | "passwordHash" | "mustChangePassword" | "defaultLandingPage" | "autoLogoutTimer" | "failedLoginAttempts" | "lockedAt" | "totpSecretEnc" | "totpEnabledAt" | "totpLastStep" | "mfaFailedAttempts" | "passwordResetViaEmailAt" | "createdAt" | "updatedAt" | "deletedAt" | "deletedBy", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | User$permissionsArgs<ExtArgs>
    exportSchedules?: boolean | User$exportSchedulesArgs<ExtArgs>
    authTokens?: boolean | User$authTokensArgs<ExtArgs>
    mfaBackupCodes?: boolean | User$mfaBackupCodesArgs<ExtArgs>
    trustedDevices?: boolean | User$trustedDevicesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      permissions: Prisma.$UserPermissionPayload<ExtArgs>[]
      exportSchedules: Prisma.$ExportSchedulePayload<ExtArgs>[]
      authTokens: Prisma.$AuthTokenPayload<ExtArgs>[]
      mfaBackupCodes: Prisma.$MfaBackupCodePayload<ExtArgs>[]
      trustedDevices: Prisma.$TrustedDevicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      accountNumber: string
      email: string | null
      emailVerifiedAt: Date | null
      sessionVersion: number
      fullName: string
      passwordHash: string
      mustChangePassword: boolean
      defaultLandingPage: string
      autoLogoutTimer: number
      failedLoginAttempts: number
      lockedAt: Date | null
      totpSecretEnc: string | null
      totpEnabledAt: Date | null
      totpLastStep: number | null
      mfaFailedAttempts: number
      passwordResetViaEmailAt: Date | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
      deletedBy: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    permissions<T extends User$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, User$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    exportSchedules<T extends User$exportSchedulesArgs<ExtArgs> = {}>(args?: Subset<T, User$exportSchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    authTokens<T extends User$authTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$authTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    mfaBackupCodes<T extends User$mfaBackupCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$mfaBackupCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    trustedDevices<T extends User$trustedDevicesArgs<ExtArgs> = {}>(args?: Subset<T, User$trustedDevicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly accountNumber: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly sessionVersion: FieldRef<"User", 'Int'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly mustChangePassword: FieldRef<"User", 'Boolean'>
    readonly defaultLandingPage: FieldRef<"User", 'String'>
    readonly autoLogoutTimer: FieldRef<"User", 'Int'>
    readonly failedLoginAttempts: FieldRef<"User", 'Int'>
    readonly lockedAt: FieldRef<"User", 'DateTime'>
    readonly totpSecretEnc: FieldRef<"User", 'String'>
    readonly totpEnabledAt: FieldRef<"User", 'DateTime'>
    readonly totpLastStep: FieldRef<"User", 'Int'>
    readonly mfaFailedAttempts: FieldRef<"User", 'Int'>
    readonly passwordResetViaEmailAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
    readonly deletedBy: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.permissions
   */
  export type User$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    cursor?: UserPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * User.exportSchedules
   */
  export type User$exportSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    where?: ExportScheduleWhereInput
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    cursor?: ExportScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
  }

  /**
   * User.authTokens
   */
  export type User$authTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    where?: AuthTokenWhereInput
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    cursor?: AuthTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
  }

  /**
   * User.mfaBackupCodes
   */
  export type User$mfaBackupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    where?: MfaBackupCodeWhereInput
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    cursor?: MfaBackupCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
  }

  /**
   * User.trustedDevices
   */
  export type User$trustedDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    where?: TrustedDeviceWhereInput
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    cursor?: TrustedDeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AuthToken
   */

  export type AggregateAuthToken = {
    _count: AuthTokenCountAggregateOutputType | null
    _avg: AuthTokenAvgAggregateOutputType | null
    _sum: AuthTokenSumAggregateOutputType | null
    _min: AuthTokenMinAggregateOutputType | null
    _max: AuthTokenMaxAggregateOutputType | null
  }

  export type AuthTokenAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    createdById: number | null
  }

  export type AuthTokenSumAggregateOutputType = {
    id: number | null
    userId: number | null
    createdById: number | null
  }

  export type AuthTokenMinAggregateOutputType = {
    id: number | null
    userId: number | null
    purpose: string | null
    tokenHash: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
    createdById: number | null
  }

  export type AuthTokenMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    purpose: string | null
    tokenHash: string | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
    createdById: number | null
  }

  export type AuthTokenCountAggregateOutputType = {
    id: number
    userId: number
    purpose: number
    tokenHash: number
    expiresAt: number
    usedAt: number
    createdAt: number
    createdById: number
    _all: number
  }


  export type AuthTokenAvgAggregateInputType = {
    id?: true
    userId?: true
    createdById?: true
  }

  export type AuthTokenSumAggregateInputType = {
    id?: true
    userId?: true
    createdById?: true
  }

  export type AuthTokenMinAggregateInputType = {
    id?: true
    userId?: true
    purpose?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    createdById?: true
  }

  export type AuthTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    purpose?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    createdById?: true
  }

  export type AuthTokenCountAggregateInputType = {
    id?: true
    userId?: true
    purpose?: true
    tokenHash?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    createdById?: true
    _all?: true
  }

  export type AuthTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthToken to aggregate.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthTokens
    **/
    _count?: true | AuthTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthTokenMaxAggregateInputType
  }

  export type GetAuthTokenAggregateType<T extends AuthTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthToken[P]>
      : GetScalarType<T[P], AggregateAuthToken[P]>
  }




  export type AuthTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthTokenWhereInput
    orderBy?: AuthTokenOrderByWithAggregationInput | AuthTokenOrderByWithAggregationInput[]
    by: AuthTokenScalarFieldEnum[] | AuthTokenScalarFieldEnum
    having?: AuthTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthTokenCountAggregateInputType | true
    _avg?: AuthTokenAvgAggregateInputType
    _sum?: AuthTokenSumAggregateInputType
    _min?: AuthTokenMinAggregateInputType
    _max?: AuthTokenMaxAggregateInputType
  }

  export type AuthTokenGroupByOutputType = {
    id: number
    userId: number
    purpose: string
    tokenHash: string
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    createdById: number | null
    _count: AuthTokenCountAggregateOutputType | null
    _avg: AuthTokenAvgAggregateOutputType | null
    _sum: AuthTokenSumAggregateOutputType | null
    _min: AuthTokenMinAggregateOutputType | null
    _max: AuthTokenMaxAggregateOutputType | null
  }

  type GetAuthTokenGroupByPayload<T extends AuthTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthTokenGroupByOutputType[P]>
            : GetScalarType<T[P], AuthTokenGroupByOutputType[P]>
        }
      >
    >


  export type AuthTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    createdById?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authToken"]>

  export type AuthTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    createdById?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authToken"]>

  export type AuthTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    createdById?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authToken"]>

  export type AuthTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    createdById?: boolean
  }

  export type AuthTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "purpose" | "tokenHash" | "expiresAt" | "usedAt" | "createdAt" | "createdById", ExtArgs["result"]["authToken"]>
  export type AuthTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuthTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      purpose: string
      tokenHash: string
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
      createdById: number | null
    }, ExtArgs["result"]["authToken"]>
    composites: {}
  }

  type AuthTokenGetPayload<S extends boolean | null | undefined | AuthTokenDefaultArgs> = $Result.GetResult<Prisma.$AuthTokenPayload, S>

  type AuthTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: AuthTokenCountAggregateInputType | true
    }

  export interface AuthTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthToken'], meta: { name: 'AuthToken' } }
    /**
     * Find zero or one AuthToken that matches the filter.
     * @param {AuthTokenFindUniqueArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthTokenFindUniqueArgs>(args: SelectSubset<T, AuthTokenFindUniqueArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthTokenFindUniqueOrThrowArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenFindFirstArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthTokenFindFirstArgs>(args?: SelectSubset<T, AuthTokenFindFirstArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenFindFirstOrThrowArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthTokens
     * const authTokens = await prisma.authToken.findMany()
     * 
     * // Get first 10 AuthTokens
     * const authTokens = await prisma.authToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authTokenWithIdOnly = await prisma.authToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthTokenFindManyArgs>(args?: SelectSubset<T, AuthTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthToken.
     * @param {AuthTokenCreateArgs} args - Arguments to create a AuthToken.
     * @example
     * // Create one AuthToken
     * const AuthToken = await prisma.authToken.create({
     *   data: {
     *     // ... data to create a AuthToken
     *   }
     * })
     * 
     */
    create<T extends AuthTokenCreateArgs>(args: SelectSubset<T, AuthTokenCreateArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthTokens.
     * @param {AuthTokenCreateManyArgs} args - Arguments to create many AuthTokens.
     * @example
     * // Create many AuthTokens
     * const authToken = await prisma.authToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthTokenCreateManyArgs>(args?: SelectSubset<T, AuthTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthTokens and returns the data saved in the database.
     * @param {AuthTokenCreateManyAndReturnArgs} args - Arguments to create many AuthTokens.
     * @example
     * // Create many AuthTokens
     * const authToken = await prisma.authToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthTokens and only return the `id`
     * const authTokenWithIdOnly = await prisma.authToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthToken.
     * @param {AuthTokenDeleteArgs} args - Arguments to delete one AuthToken.
     * @example
     * // Delete one AuthToken
     * const AuthToken = await prisma.authToken.delete({
     *   where: {
     *     // ... filter to delete one AuthToken
     *   }
     * })
     * 
     */
    delete<T extends AuthTokenDeleteArgs>(args: SelectSubset<T, AuthTokenDeleteArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthToken.
     * @param {AuthTokenUpdateArgs} args - Arguments to update one AuthToken.
     * @example
     * // Update one AuthToken
     * const authToken = await prisma.authToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthTokenUpdateArgs>(args: SelectSubset<T, AuthTokenUpdateArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthTokens.
     * @param {AuthTokenDeleteManyArgs} args - Arguments to filter AuthTokens to delete.
     * @example
     * // Delete a few AuthTokens
     * const { count } = await prisma.authToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthTokenDeleteManyArgs>(args?: SelectSubset<T, AuthTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthTokens
     * const authToken = await prisma.authToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthTokenUpdateManyArgs>(args: SelectSubset<T, AuthTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthTokens and returns the data updated in the database.
     * @param {AuthTokenUpdateManyAndReturnArgs} args - Arguments to update many AuthTokens.
     * @example
     * // Update many AuthTokens
     * const authToken = await prisma.authToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthTokens and only return the `id`
     * const authTokenWithIdOnly = await prisma.authToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthToken.
     * @param {AuthTokenUpsertArgs} args - Arguments to update or create a AuthToken.
     * @example
     * // Update or create a AuthToken
     * const authToken = await prisma.authToken.upsert({
     *   create: {
     *     // ... data to create a AuthToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthToken we want to update
     *   }
     * })
     */
    upsert<T extends AuthTokenUpsertArgs>(args: SelectSubset<T, AuthTokenUpsertArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenCountArgs} args - Arguments to filter AuthTokens to count.
     * @example
     * // Count the number of AuthTokens
     * const count = await prisma.authToken.count({
     *   where: {
     *     // ... the filter for the AuthTokens we want to count
     *   }
     * })
    **/
    count<T extends AuthTokenCountArgs>(
      args?: Subset<T, AuthTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthTokenAggregateArgs>(args: Subset<T, AuthTokenAggregateArgs>): Prisma.PrismaPromise<GetAuthTokenAggregateType<T>>

    /**
     * Group by AuthToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthTokenGroupByArgs['orderBy'] }
        : { orderBy?: AuthTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthToken model
   */
  readonly fields: AuthTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthToken model
   */
  interface AuthTokenFieldRefs {
    readonly id: FieldRef<"AuthToken", 'Int'>
    readonly userId: FieldRef<"AuthToken", 'Int'>
    readonly purpose: FieldRef<"AuthToken", 'String'>
    readonly tokenHash: FieldRef<"AuthToken", 'String'>
    readonly expiresAt: FieldRef<"AuthToken", 'DateTime'>
    readonly usedAt: FieldRef<"AuthToken", 'DateTime'>
    readonly createdAt: FieldRef<"AuthToken", 'DateTime'>
    readonly createdById: FieldRef<"AuthToken", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * AuthToken findUnique
   */
  export type AuthTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where: AuthTokenWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken findUniqueOrThrow
   */
  export type AuthTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where: AuthTokenWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken findFirst
   */
  export type AuthTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthTokens.
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthTokens.
     */
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken findFirstOrThrow
   */
  export type AuthTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthTokens.
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthTokens.
     */
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken findMany
   */
  export type AuthTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthTokens to fetch.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthTokens.
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthTokens.
     */
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken create
   */
  export type AuthTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthToken.
     */
    data: XOR<AuthTokenCreateInput, AuthTokenUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken createMany
   */
  export type AuthTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthTokens.
     */
    data: AuthTokenCreateManyInput | AuthTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthToken createManyAndReturn
   */
  export type AuthTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * The data used to create many AuthTokens.
     */
    data: AuthTokenCreateManyInput | AuthTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthToken update
   */
  export type AuthTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthToken.
     */
    data: XOR<AuthTokenUpdateInput, AuthTokenUncheckedUpdateInput>
    /**
     * Choose, which AuthToken to update.
     */
    where: AuthTokenWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken updateMany
   */
  export type AuthTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthTokens.
     */
    data: XOR<AuthTokenUpdateManyMutationInput, AuthTokenUncheckedUpdateManyInput>
    /**
     * Filter which AuthTokens to update
     */
    where?: AuthTokenWhereInput
    /**
     * Limit how many AuthTokens to update.
     */
    limit?: number
  }

  /**
   * AuthToken updateManyAndReturn
   */
  export type AuthTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * The data used to update AuthTokens.
     */
    data: XOR<AuthTokenUpdateManyMutationInput, AuthTokenUncheckedUpdateManyInput>
    /**
     * Filter which AuthTokens to update
     */
    where?: AuthTokenWhereInput
    /**
     * Limit how many AuthTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthToken upsert
   */
  export type AuthTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthToken to update in case it exists.
     */
    where: AuthTokenWhereUniqueInput
    /**
     * In case the AuthToken found by the `where` argument doesn't exist, create a new AuthToken with this data.
     */
    create: XOR<AuthTokenCreateInput, AuthTokenUncheckedCreateInput>
    /**
     * In case the AuthToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthTokenUpdateInput, AuthTokenUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken delete
   */
  export type AuthTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter which AuthToken to delete.
     */
    where: AuthTokenWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * AuthToken deleteMany
   */
  export type AuthTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthTokens to delete
     */
    where?: AuthTokenWhereInput
    /**
     * Limit how many AuthTokens to delete.
     */
    limit?: number
  }

  /**
   * AuthToken without action
   */
  export type AuthTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
  }


  /**
   * Model Backup
   */

  export type AggregateBackup = {
    _count: BackupCountAggregateOutputType | null
    _avg: BackupAvgAggregateOutputType | null
    _sum: BackupSumAggregateOutputType | null
    _min: BackupMinAggregateOutputType | null
    _max: BackupMaxAggregateOutputType | null
  }

  export type BackupAvgAggregateOutputType = {
    sizeBytes: number | null
    rowCount: number | null
  }

  export type BackupSumAggregateOutputType = {
    sizeBytes: number | null
    rowCount: number | null
  }

  export type BackupMinAggregateOutputType = {
    id: string | null
    kind: string | null
    fileName: string | null
    mimeType: string | null
    sizeBytes: number | null
    content: Bytes | null
    label: string | null
    barangay: string | null
    periodLabel: string | null
    rowCount: number | null
    createdBy: string | null
    createdAt: Date | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type BackupMaxAggregateOutputType = {
    id: string | null
    kind: string | null
    fileName: string | null
    mimeType: string | null
    sizeBytes: number | null
    content: Bytes | null
    label: string | null
    barangay: string | null
    periodLabel: string | null
    rowCount: number | null
    createdBy: string | null
    createdAt: Date | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type BackupCountAggregateOutputType = {
    id: number
    kind: number
    fileName: number
    mimeType: number
    sizeBytes: number
    content: number
    label: number
    barangay: number
    periodLabel: number
    rowCount: number
    createdBy: number
    createdAt: number
    deletedAt: number
    deletedBy: number
    _all: number
  }


  export type BackupAvgAggregateInputType = {
    sizeBytes?: true
    rowCount?: true
  }

  export type BackupSumAggregateInputType = {
    sizeBytes?: true
    rowCount?: true
  }

  export type BackupMinAggregateInputType = {
    id?: true
    kind?: true
    fileName?: true
    mimeType?: true
    sizeBytes?: true
    content?: true
    label?: true
    barangay?: true
    periodLabel?: true
    rowCount?: true
    createdBy?: true
    createdAt?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type BackupMaxAggregateInputType = {
    id?: true
    kind?: true
    fileName?: true
    mimeType?: true
    sizeBytes?: true
    content?: true
    label?: true
    barangay?: true
    periodLabel?: true
    rowCount?: true
    createdBy?: true
    createdAt?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type BackupCountAggregateInputType = {
    id?: true
    kind?: true
    fileName?: true
    mimeType?: true
    sizeBytes?: true
    content?: true
    label?: true
    barangay?: true
    periodLabel?: true
    rowCount?: true
    createdBy?: true
    createdAt?: true
    deletedAt?: true
    deletedBy?: true
    _all?: true
  }

  export type BackupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Backup to aggregate.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Backups
    **/
    _count?: true | BackupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BackupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BackupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BackupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BackupMaxAggregateInputType
  }

  export type GetBackupAggregateType<T extends BackupAggregateArgs> = {
        [P in keyof T & keyof AggregateBackup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBackup[P]>
      : GetScalarType<T[P], AggregateBackup[P]>
  }




  export type BackupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BackupWhereInput
    orderBy?: BackupOrderByWithAggregationInput | BackupOrderByWithAggregationInput[]
    by: BackupScalarFieldEnum[] | BackupScalarFieldEnum
    having?: BackupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BackupCountAggregateInputType | true
    _avg?: BackupAvgAggregateInputType
    _sum?: BackupSumAggregateInputType
    _min?: BackupMinAggregateInputType
    _max?: BackupMaxAggregateInputType
  }

  export type BackupGroupByOutputType = {
    id: string
    kind: string
    fileName: string
    mimeType: string
    sizeBytes: number
    content: Bytes
    label: string | null
    barangay: string | null
    periodLabel: string | null
    rowCount: number | null
    createdBy: string
    createdAt: Date
    deletedAt: Date | null
    deletedBy: string | null
    _count: BackupCountAggregateOutputType | null
    _avg: BackupAvgAggregateOutputType | null
    _sum: BackupSumAggregateOutputType | null
    _min: BackupMinAggregateOutputType | null
    _max: BackupMaxAggregateOutputType | null
  }

  type GetBackupGroupByPayload<T extends BackupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BackupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BackupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BackupGroupByOutputType[P]>
            : GetScalarType<T[P], BackupGroupByOutputType[P]>
        }
      >
    >


  export type BackupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    fileName?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    content?: boolean
    label?: boolean
    barangay?: boolean
    periodLabel?: boolean
    rowCount?: boolean
    createdBy?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["backup"]>

  export type BackupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    fileName?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    content?: boolean
    label?: boolean
    barangay?: boolean
    periodLabel?: boolean
    rowCount?: boolean
    createdBy?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["backup"]>

  export type BackupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    fileName?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    content?: boolean
    label?: boolean
    barangay?: boolean
    periodLabel?: boolean
    rowCount?: boolean
    createdBy?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["backup"]>

  export type BackupSelectScalar = {
    id?: boolean
    kind?: boolean
    fileName?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    content?: boolean
    label?: boolean
    barangay?: boolean
    periodLabel?: boolean
    rowCount?: boolean
    createdBy?: boolean
    createdAt?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }

  export type BackupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kind" | "fileName" | "mimeType" | "sizeBytes" | "content" | "label" | "barangay" | "periodLabel" | "rowCount" | "createdBy" | "createdAt" | "deletedAt" | "deletedBy", ExtArgs["result"]["backup"]>

  export type $BackupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Backup"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kind: string
      fileName: string
      mimeType: string
      sizeBytes: number
      content: Prisma.Bytes
      label: string | null
      barangay: string | null
      periodLabel: string | null
      rowCount: number | null
      createdBy: string
      createdAt: Date
      deletedAt: Date | null
      deletedBy: string | null
    }, ExtArgs["result"]["backup"]>
    composites: {}
  }

  type BackupGetPayload<S extends boolean | null | undefined | BackupDefaultArgs> = $Result.GetResult<Prisma.$BackupPayload, S>

  type BackupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BackupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: BackupCountAggregateInputType | true
    }

  export interface BackupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Backup'], meta: { name: 'Backup' } }
    /**
     * Find zero or one Backup that matches the filter.
     * @param {BackupFindUniqueArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BackupFindUniqueArgs>(args: SelectSubset<T, BackupFindUniqueArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Backup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BackupFindUniqueOrThrowArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BackupFindUniqueOrThrowArgs>(args: SelectSubset<T, BackupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Backup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupFindFirstArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BackupFindFirstArgs>(args?: SelectSubset<T, BackupFindFirstArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Backup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupFindFirstOrThrowArgs} args - Arguments to find a Backup
     * @example
     * // Get one Backup
     * const backup = await prisma.backup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BackupFindFirstOrThrowArgs>(args?: SelectSubset<T, BackupFindFirstOrThrowArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Backups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Backups
     * const backups = await prisma.backup.findMany()
     * 
     * // Get first 10 Backups
     * const backups = await prisma.backup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const backupWithIdOnly = await prisma.backup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BackupFindManyArgs>(args?: SelectSubset<T, BackupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Backup.
     * @param {BackupCreateArgs} args - Arguments to create a Backup.
     * @example
     * // Create one Backup
     * const Backup = await prisma.backup.create({
     *   data: {
     *     // ... data to create a Backup
     *   }
     * })
     * 
     */
    create<T extends BackupCreateArgs>(args: SelectSubset<T, BackupCreateArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Backups.
     * @param {BackupCreateManyArgs} args - Arguments to create many Backups.
     * @example
     * // Create many Backups
     * const backup = await prisma.backup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BackupCreateManyArgs>(args?: SelectSubset<T, BackupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Backups and returns the data saved in the database.
     * @param {BackupCreateManyAndReturnArgs} args - Arguments to create many Backups.
     * @example
     * // Create many Backups
     * const backup = await prisma.backup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Backups and only return the `id`
     * const backupWithIdOnly = await prisma.backup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BackupCreateManyAndReturnArgs>(args?: SelectSubset<T, BackupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Backup.
     * @param {BackupDeleteArgs} args - Arguments to delete one Backup.
     * @example
     * // Delete one Backup
     * const Backup = await prisma.backup.delete({
     *   where: {
     *     // ... filter to delete one Backup
     *   }
     * })
     * 
     */
    delete<T extends BackupDeleteArgs>(args: SelectSubset<T, BackupDeleteArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Backup.
     * @param {BackupUpdateArgs} args - Arguments to update one Backup.
     * @example
     * // Update one Backup
     * const backup = await prisma.backup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BackupUpdateArgs>(args: SelectSubset<T, BackupUpdateArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Backups.
     * @param {BackupDeleteManyArgs} args - Arguments to filter Backups to delete.
     * @example
     * // Delete a few Backups
     * const { count } = await prisma.backup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BackupDeleteManyArgs>(args?: SelectSubset<T, BackupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Backups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Backups
     * const backup = await prisma.backup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BackupUpdateManyArgs>(args: SelectSubset<T, BackupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Backups and returns the data updated in the database.
     * @param {BackupUpdateManyAndReturnArgs} args - Arguments to update many Backups.
     * @example
     * // Update many Backups
     * const backup = await prisma.backup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Backups and only return the `id`
     * const backupWithIdOnly = await prisma.backup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BackupUpdateManyAndReturnArgs>(args: SelectSubset<T, BackupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Backup.
     * @param {BackupUpsertArgs} args - Arguments to update or create a Backup.
     * @example
     * // Update or create a Backup
     * const backup = await prisma.backup.upsert({
     *   create: {
     *     // ... data to create a Backup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Backup we want to update
     *   }
     * })
     */
    upsert<T extends BackupUpsertArgs>(args: SelectSubset<T, BackupUpsertArgs<ExtArgs>>): Prisma__BackupClient<$Result.GetResult<Prisma.$BackupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Backups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupCountArgs} args - Arguments to filter Backups to count.
     * @example
     * // Count the number of Backups
     * const count = await prisma.backup.count({
     *   where: {
     *     // ... the filter for the Backups we want to count
     *   }
     * })
    **/
    count<T extends BackupCountArgs>(
      args?: Subset<T, BackupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BackupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Backup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BackupAggregateArgs>(args: Subset<T, BackupAggregateArgs>): Prisma.PrismaPromise<GetBackupAggregateType<T>>

    /**
     * Group by Backup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BackupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BackupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BackupGroupByArgs['orderBy'] }
        : { orderBy?: BackupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BackupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBackupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Backup model
   */
  readonly fields: BackupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Backup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BackupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Backup model
   */
  interface BackupFieldRefs {
    readonly id: FieldRef<"Backup", 'String'>
    readonly kind: FieldRef<"Backup", 'String'>
    readonly fileName: FieldRef<"Backup", 'String'>
    readonly mimeType: FieldRef<"Backup", 'String'>
    readonly sizeBytes: FieldRef<"Backup", 'Int'>
    readonly content: FieldRef<"Backup", 'Bytes'>
    readonly label: FieldRef<"Backup", 'String'>
    readonly barangay: FieldRef<"Backup", 'String'>
    readonly periodLabel: FieldRef<"Backup", 'String'>
    readonly rowCount: FieldRef<"Backup", 'Int'>
    readonly createdBy: FieldRef<"Backup", 'String'>
    readonly createdAt: FieldRef<"Backup", 'DateTime'>
    readonly deletedAt: FieldRef<"Backup", 'DateTime'>
    readonly deletedBy: FieldRef<"Backup", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Backup findUnique
   */
  export type BackupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where: BackupWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup findUniqueOrThrow
   */
  export type BackupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where: BackupWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup findFirst
   */
  export type BackupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Backups.
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Backups.
     */
    distinct?: BackupScalarFieldEnum | BackupScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup findFirstOrThrow
   */
  export type BackupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backup to fetch.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Backups.
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Backups.
     */
    distinct?: BackupScalarFieldEnum | BackupScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup findMany
   */
  export type BackupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter, which Backups to fetch.
     */
    where?: BackupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Backups to fetch.
     */
    orderBy?: BackupOrderByWithRelationInput | BackupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Backups.
     */
    cursor?: BackupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Backups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Backups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Backups.
     */
    distinct?: BackupScalarFieldEnum | BackupScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup create
   */
  export type BackupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data needed to create a Backup.
     */
    data: XOR<BackupCreateInput, BackupUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup createMany
   */
  export type BackupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Backups.
     */
    data: BackupCreateManyInput | BackupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Backup createManyAndReturn
   */
  export type BackupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data used to create many Backups.
     */
    data: BackupCreateManyInput | BackupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Backup update
   */
  export type BackupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data needed to update a Backup.
     */
    data: XOR<BackupUpdateInput, BackupUncheckedUpdateInput>
    /**
     * Choose, which Backup to update.
     */
    where: BackupWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup updateMany
   */
  export type BackupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Backups.
     */
    data: XOR<BackupUpdateManyMutationInput, BackupUncheckedUpdateManyInput>
    /**
     * Filter which Backups to update
     */
    where?: BackupWhereInput
    /**
     * Limit how many Backups to update.
     */
    limit?: number
  }

  /**
   * Backup updateManyAndReturn
   */
  export type BackupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The data used to update Backups.
     */
    data: XOR<BackupUpdateManyMutationInput, BackupUncheckedUpdateManyInput>
    /**
     * Filter which Backups to update
     */
    where?: BackupWhereInput
    /**
     * Limit how many Backups to update.
     */
    limit?: number
  }

  /**
   * Backup upsert
   */
  export type BackupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * The filter to search for the Backup to update in case it exists.
     */
    where: BackupWhereUniqueInput
    /**
     * In case the Backup found by the `where` argument doesn't exist, create a new Backup with this data.
     */
    create: XOR<BackupCreateInput, BackupUncheckedCreateInput>
    /**
     * In case the Backup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BackupUpdateInput, BackupUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup delete
   */
  export type BackupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
    /**
     * Filter which Backup to delete.
     */
    where: BackupWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Backup deleteMany
   */
  export type BackupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Backups to delete
     */
    where?: BackupWhereInput
    /**
     * Limit how many Backups to delete.
     */
    limit?: number
  }

  /**
   * Backup without action
   */
  export type BackupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Backup
     */
    select?: BackupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Backup
     */
    omit?: BackupOmit<ExtArgs> | null
  }


  /**
   * Model ExportSchedule
   */

  export type AggregateExportSchedule = {
    _count: ExportScheduleCountAggregateOutputType | null
    _avg: ExportScheduleAvgAggregateOutputType | null
    _sum: ExportScheduleSumAggregateOutputType | null
    _min: ExportScheduleMinAggregateOutputType | null
    _max: ExportScheduleMaxAggregateOutputType | null
  }

  export type ExportScheduleAvgAggregateOutputType = {
    userId: number | null
  }

  export type ExportScheduleSumAggregateOutputType = {
    userId: number | null
  }

  export type ExportScheduleMinAggregateOutputType = {
    id: string | null
    userId: number | null
    enabled: boolean | null
    frequency: string | null
    dayOfWeek: string | null
    dayOfMonth: string | null
    monthlyOn: string | null
    timeOfDay: string | null
    savedAt: Date | null
    lastRunAt: Date | null
    lastAttemptAt: Date | null
    lastRunError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExportScheduleMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    enabled: boolean | null
    frequency: string | null
    dayOfWeek: string | null
    dayOfMonth: string | null
    monthlyOn: string | null
    timeOfDay: string | null
    savedAt: Date | null
    lastRunAt: Date | null
    lastAttemptAt: Date | null
    lastRunError: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExportScheduleCountAggregateOutputType = {
    id: number
    userId: number
    enabled: number
    frequency: number
    dayOfWeek: number
    dayOfMonth: number
    monthlyOn: number
    timeOfDay: number
    savedAt: number
    lastRunAt: number
    lastAttemptAt: number
    lastRunError: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExportScheduleAvgAggregateInputType = {
    userId?: true
  }

  export type ExportScheduleSumAggregateInputType = {
    userId?: true
  }

  export type ExportScheduleMinAggregateInputType = {
    id?: true
    userId?: true
    enabled?: true
    frequency?: true
    dayOfWeek?: true
    dayOfMonth?: true
    monthlyOn?: true
    timeOfDay?: true
    savedAt?: true
    lastRunAt?: true
    lastAttemptAt?: true
    lastRunError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExportScheduleMaxAggregateInputType = {
    id?: true
    userId?: true
    enabled?: true
    frequency?: true
    dayOfWeek?: true
    dayOfMonth?: true
    monthlyOn?: true
    timeOfDay?: true
    savedAt?: true
    lastRunAt?: true
    lastAttemptAt?: true
    lastRunError?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExportScheduleCountAggregateInputType = {
    id?: true
    userId?: true
    enabled?: true
    frequency?: true
    dayOfWeek?: true
    dayOfMonth?: true
    monthlyOn?: true
    timeOfDay?: true
    savedAt?: true
    lastRunAt?: true
    lastAttemptAt?: true
    lastRunError?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExportScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExportSchedule to aggregate.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExportSchedules
    **/
    _count?: true | ExportScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExportScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExportScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExportScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExportScheduleMaxAggregateInputType
  }

  export type GetExportScheduleAggregateType<T extends ExportScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateExportSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExportSchedule[P]>
      : GetScalarType<T[P], AggregateExportSchedule[P]>
  }




  export type ExportScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExportScheduleWhereInput
    orderBy?: ExportScheduleOrderByWithAggregationInput | ExportScheduleOrderByWithAggregationInput[]
    by: ExportScheduleScalarFieldEnum[] | ExportScheduleScalarFieldEnum
    having?: ExportScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExportScheduleCountAggregateInputType | true
    _avg?: ExportScheduleAvgAggregateInputType
    _sum?: ExportScheduleSumAggregateInputType
    _min?: ExportScheduleMinAggregateInputType
    _max?: ExportScheduleMaxAggregateInputType
  }

  export type ExportScheduleGroupByOutputType = {
    id: string
    userId: number
    enabled: boolean
    frequency: string
    dayOfWeek: string | null
    dayOfMonth: string | null
    monthlyOn: string | null
    timeOfDay: string | null
    savedAt: Date | null
    lastRunAt: Date | null
    lastAttemptAt: Date | null
    lastRunError: string | null
    createdAt: Date
    updatedAt: Date
    _count: ExportScheduleCountAggregateOutputType | null
    _avg: ExportScheduleAvgAggregateOutputType | null
    _sum: ExportScheduleSumAggregateOutputType | null
    _min: ExportScheduleMinAggregateOutputType | null
    _max: ExportScheduleMaxAggregateOutputType | null
  }

  type GetExportScheduleGroupByPayload<T extends ExportScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExportScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExportScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExportScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], ExportScheduleGroupByOutputType[P]>
        }
      >
    >


  export type ExportScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    savedAt?: boolean
    lastRunAt?: boolean
    lastAttemptAt?: boolean
    lastRunError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exportSchedule"]>

  export type ExportScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    savedAt?: boolean
    lastRunAt?: boolean
    lastAttemptAt?: boolean
    lastRunError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exportSchedule"]>

  export type ExportScheduleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    savedAt?: boolean
    lastRunAt?: boolean
    lastAttemptAt?: boolean
    lastRunError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exportSchedule"]>

  export type ExportScheduleSelectScalar = {
    id?: boolean
    userId?: boolean
    enabled?: boolean
    frequency?: boolean
    dayOfWeek?: boolean
    dayOfMonth?: boolean
    monthlyOn?: boolean
    timeOfDay?: boolean
    savedAt?: boolean
    lastRunAt?: boolean
    lastAttemptAt?: boolean
    lastRunError?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExportScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "enabled" | "frequency" | "dayOfWeek" | "dayOfMonth" | "monthlyOn" | "timeOfDay" | "savedAt" | "lastRunAt" | "lastAttemptAt" | "lastRunError" | "createdAt" | "updatedAt", ExtArgs["result"]["exportSchedule"]>
  export type ExportScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExportScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExportScheduleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExportSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExportSchedule"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      enabled: boolean
      frequency: string
      dayOfWeek: string | null
      dayOfMonth: string | null
      monthlyOn: string | null
      timeOfDay: string | null
      savedAt: Date | null
      lastRunAt: Date | null
      lastAttemptAt: Date | null
      lastRunError: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["exportSchedule"]>
    composites: {}
  }

  type ExportScheduleGetPayload<S extends boolean | null | undefined | ExportScheduleDefaultArgs> = $Result.GetResult<Prisma.$ExportSchedulePayload, S>

  type ExportScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExportScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: ExportScheduleCountAggregateInputType | true
    }

  export interface ExportScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExportSchedule'], meta: { name: 'ExportSchedule' } }
    /**
     * Find zero or one ExportSchedule that matches the filter.
     * @param {ExportScheduleFindUniqueArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExportScheduleFindUniqueArgs>(args: SelectSubset<T, ExportScheduleFindUniqueArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExportSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExportScheduleFindUniqueOrThrowArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExportScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, ExportScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExportSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleFindFirstArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExportScheduleFindFirstArgs>(args?: SelectSubset<T, ExportScheduleFindFirstArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExportSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleFindFirstOrThrowArgs} args - Arguments to find a ExportSchedule
     * @example
     * // Get one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExportScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, ExportScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExportSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExportSchedules
     * const exportSchedules = await prisma.exportSchedule.findMany()
     * 
     * // Get first 10 ExportSchedules
     * const exportSchedules = await prisma.exportSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exportScheduleWithIdOnly = await prisma.exportSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExportScheduleFindManyArgs>(args?: SelectSubset<T, ExportScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExportSchedule.
     * @param {ExportScheduleCreateArgs} args - Arguments to create a ExportSchedule.
     * @example
     * // Create one ExportSchedule
     * const ExportSchedule = await prisma.exportSchedule.create({
     *   data: {
     *     // ... data to create a ExportSchedule
     *   }
     * })
     * 
     */
    create<T extends ExportScheduleCreateArgs>(args: SelectSubset<T, ExportScheduleCreateArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExportSchedules.
     * @param {ExportScheduleCreateManyArgs} args - Arguments to create many ExportSchedules.
     * @example
     * // Create many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExportScheduleCreateManyArgs>(args?: SelectSubset<T, ExportScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExportSchedules and returns the data saved in the database.
     * @param {ExportScheduleCreateManyAndReturnArgs} args - Arguments to create many ExportSchedules.
     * @example
     * // Create many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExportSchedules and only return the `id`
     * const exportScheduleWithIdOnly = await prisma.exportSchedule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExportScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, ExportScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExportSchedule.
     * @param {ExportScheduleDeleteArgs} args - Arguments to delete one ExportSchedule.
     * @example
     * // Delete one ExportSchedule
     * const ExportSchedule = await prisma.exportSchedule.delete({
     *   where: {
     *     // ... filter to delete one ExportSchedule
     *   }
     * })
     * 
     */
    delete<T extends ExportScheduleDeleteArgs>(args: SelectSubset<T, ExportScheduleDeleteArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExportSchedule.
     * @param {ExportScheduleUpdateArgs} args - Arguments to update one ExportSchedule.
     * @example
     * // Update one ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExportScheduleUpdateArgs>(args: SelectSubset<T, ExportScheduleUpdateArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExportSchedules.
     * @param {ExportScheduleDeleteManyArgs} args - Arguments to filter ExportSchedules to delete.
     * @example
     * // Delete a few ExportSchedules
     * const { count } = await prisma.exportSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExportScheduleDeleteManyArgs>(args?: SelectSubset<T, ExportScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExportSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExportScheduleUpdateManyArgs>(args: SelectSubset<T, ExportScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExportSchedules and returns the data updated in the database.
     * @param {ExportScheduleUpdateManyAndReturnArgs} args - Arguments to update many ExportSchedules.
     * @example
     * // Update many ExportSchedules
     * const exportSchedule = await prisma.exportSchedule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExportSchedules and only return the `id`
     * const exportScheduleWithIdOnly = await prisma.exportSchedule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExportScheduleUpdateManyAndReturnArgs>(args: SelectSubset<T, ExportScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExportSchedule.
     * @param {ExportScheduleUpsertArgs} args - Arguments to update or create a ExportSchedule.
     * @example
     * // Update or create a ExportSchedule
     * const exportSchedule = await prisma.exportSchedule.upsert({
     *   create: {
     *     // ... data to create a ExportSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExportSchedule we want to update
     *   }
     * })
     */
    upsert<T extends ExportScheduleUpsertArgs>(args: SelectSubset<T, ExportScheduleUpsertArgs<ExtArgs>>): Prisma__ExportScheduleClient<$Result.GetResult<Prisma.$ExportSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExportSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleCountArgs} args - Arguments to filter ExportSchedules to count.
     * @example
     * // Count the number of ExportSchedules
     * const count = await prisma.exportSchedule.count({
     *   where: {
     *     // ... the filter for the ExportSchedules we want to count
     *   }
     * })
    **/
    count<T extends ExportScheduleCountArgs>(
      args?: Subset<T, ExportScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExportScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExportSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExportScheduleAggregateArgs>(args: Subset<T, ExportScheduleAggregateArgs>): Prisma.PrismaPromise<GetExportScheduleAggregateType<T>>

    /**
     * Group by ExportSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExportScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExportScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExportScheduleGroupByArgs['orderBy'] }
        : { orderBy?: ExportScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExportScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExportScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExportSchedule model
   */
  readonly fields: ExportScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExportSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExportScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExportSchedule model
   */
  interface ExportScheduleFieldRefs {
    readonly id: FieldRef<"ExportSchedule", 'String'>
    readonly userId: FieldRef<"ExportSchedule", 'Int'>
    readonly enabled: FieldRef<"ExportSchedule", 'Boolean'>
    readonly frequency: FieldRef<"ExportSchedule", 'String'>
    readonly dayOfWeek: FieldRef<"ExportSchedule", 'String'>
    readonly dayOfMonth: FieldRef<"ExportSchedule", 'String'>
    readonly monthlyOn: FieldRef<"ExportSchedule", 'String'>
    readonly timeOfDay: FieldRef<"ExportSchedule", 'String'>
    readonly savedAt: FieldRef<"ExportSchedule", 'DateTime'>
    readonly lastRunAt: FieldRef<"ExportSchedule", 'DateTime'>
    readonly lastAttemptAt: FieldRef<"ExportSchedule", 'DateTime'>
    readonly lastRunError: FieldRef<"ExportSchedule", 'String'>
    readonly createdAt: FieldRef<"ExportSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"ExportSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExportSchedule findUnique
   */
  export type ExportScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where: ExportScheduleWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule findUniqueOrThrow
   */
  export type ExportScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where: ExportScheduleWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule findFirst
   */
  export type ExportScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExportSchedules.
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExportSchedules.
     */
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule findFirstOrThrow
   */
  export type ExportScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedule to fetch.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExportSchedules.
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExportSchedules.
     */
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule findMany
   */
  export type ExportScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter, which ExportSchedules to fetch.
     */
    where?: ExportScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExportSchedules to fetch.
     */
    orderBy?: ExportScheduleOrderByWithRelationInput | ExportScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExportSchedules.
     */
    cursor?: ExportScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExportSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExportSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExportSchedules.
     */
    distinct?: ExportScheduleScalarFieldEnum | ExportScheduleScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule create
   */
  export type ExportScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a ExportSchedule.
     */
    data: XOR<ExportScheduleCreateInput, ExportScheduleUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule createMany
   */
  export type ExportScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExportSchedules.
     */
    data: ExportScheduleCreateManyInput | ExportScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExportSchedule createManyAndReturn
   */
  export type ExportScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * The data used to create many ExportSchedules.
     */
    data: ExportScheduleCreateManyInput | ExportScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExportSchedule update
   */
  export type ExportScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a ExportSchedule.
     */
    data: XOR<ExportScheduleUpdateInput, ExportScheduleUncheckedUpdateInput>
    /**
     * Choose, which ExportSchedule to update.
     */
    where: ExportScheduleWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule updateMany
   */
  export type ExportScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExportSchedules.
     */
    data: XOR<ExportScheduleUpdateManyMutationInput, ExportScheduleUncheckedUpdateManyInput>
    /**
     * Filter which ExportSchedules to update
     */
    where?: ExportScheduleWhereInput
    /**
     * Limit how many ExportSchedules to update.
     */
    limit?: number
  }

  /**
   * ExportSchedule updateManyAndReturn
   */
  export type ExportScheduleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * The data used to update ExportSchedules.
     */
    data: XOR<ExportScheduleUpdateManyMutationInput, ExportScheduleUncheckedUpdateManyInput>
    /**
     * Filter which ExportSchedules to update
     */
    where?: ExportScheduleWhereInput
    /**
     * Limit how many ExportSchedules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExportSchedule upsert
   */
  export type ExportScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the ExportSchedule to update in case it exists.
     */
    where: ExportScheduleWhereUniqueInput
    /**
     * In case the ExportSchedule found by the `where` argument doesn't exist, create a new ExportSchedule with this data.
     */
    create: XOR<ExportScheduleCreateInput, ExportScheduleUncheckedCreateInput>
    /**
     * In case the ExportSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExportScheduleUpdateInput, ExportScheduleUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule delete
   */
  export type ExportScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
    /**
     * Filter which ExportSchedule to delete.
     */
    where: ExportScheduleWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * ExportSchedule deleteMany
   */
  export type ExportScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExportSchedules to delete
     */
    where?: ExportScheduleWhereInput
    /**
     * Limit how many ExportSchedules to delete.
     */
    limit?: number
  }

  /**
   * ExportSchedule without action
   */
  export type ExportScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExportSchedule
     */
    select?: ExportScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExportSchedule
     */
    omit?: ExportScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExportScheduleInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionAvgAggregateOutputType = {
    id: number | null
  }

  export type PermissionSumAggregateOutputType = {
    id: number | null
  }

  export type PermissionMinAggregateOutputType = {
    id: number | null
    permissionName: string | null
    description: string | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: number | null
    permissionName: string | null
    description: string | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    permissionName: number
    description: number
    _all: number
  }


  export type PermissionAvgAggregateInputType = {
    id?: true
  }

  export type PermissionSumAggregateInputType = {
    id?: true
  }

  export type PermissionMinAggregateInputType = {
    id?: true
    permissionName?: true
    description?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    permissionName?: true
    description?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    permissionName?: true
    description?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _avg?: PermissionAvgAggregateInputType
    _sum?: PermissionSumAggregateInputType
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: number
    permissionName: string
    description: string | null
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    permissionName?: boolean
    description?: boolean
    users?: boolean | Permission$usersArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    permissionName?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    permissionName?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    permissionName?: boolean
    description?: boolean
  }

  export type PermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "permissionName" | "description", ExtArgs["result"]["permission"]>
  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Permission$usersArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      users: Prisma.$UserPermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      permissionName: string
      description: string | null
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {PermissionUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, PermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Permission$usersArgs<ExtArgs> = {}>(args?: Subset<T, Permission$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'Int'>
    readonly permissionName: FieldRef<"Permission", 'String'>
    readonly description: FieldRef<"Permission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission updateManyAndReturn
   */
  export type PermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to delete.
     */
    limit?: number
  }

  /**
   * Permission.users
   */
  export type Permission$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    cursor?: UserPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Model UserPermission
   */

  export type AggregateUserPermission = {
    _count: UserPermissionCountAggregateOutputType | null
    _avg: UserPermissionAvgAggregateOutputType | null
    _sum: UserPermissionSumAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  export type UserPermissionAvgAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
  }

  export type UserPermissionSumAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
  }

  export type UserPermissionMinAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
    assignedAt: Date | null
  }

  export type UserPermissionMaxAggregateOutputType = {
    userId: number | null
    permissionId: number | null
    assignedBy: number | null
    assignedAt: Date | null
  }

  export type UserPermissionCountAggregateOutputType = {
    userId: number
    permissionId: number
    assignedBy: number
    assignedAt: number
    _all: number
  }


  export type UserPermissionAvgAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
  }

  export type UserPermissionSumAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
  }

  export type UserPermissionMinAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
    assignedAt?: true
  }

  export type UserPermissionMaxAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
    assignedAt?: true
  }

  export type UserPermissionCountAggregateInputType = {
    userId?: true
    permissionId?: true
    assignedBy?: true
    assignedAt?: true
    _all?: true
  }

  export type UserPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermission to aggregate.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPermissions
    **/
    _count?: true | UserPermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserPermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserPermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPermissionMaxAggregateInputType
  }

  export type GetUserPermissionAggregateType<T extends UserPermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPermission[P]>
      : GetScalarType<T[P], AggregateUserPermission[P]>
  }




  export type UserPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithAggregationInput | UserPermissionOrderByWithAggregationInput[]
    by: UserPermissionScalarFieldEnum[] | UserPermissionScalarFieldEnum
    having?: UserPermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPermissionCountAggregateInputType | true
    _avg?: UserPermissionAvgAggregateInputType
    _sum?: UserPermissionSumAggregateInputType
    _min?: UserPermissionMinAggregateInputType
    _max?: UserPermissionMaxAggregateInputType
  }

  export type UserPermissionGroupByOutputType = {
    userId: number
    permissionId: number
    assignedBy: number | null
    assignedAt: Date
    _count: UserPermissionCountAggregateOutputType | null
    _avg: UserPermissionAvgAggregateOutputType | null
    _sum: UserPermissionSumAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  type GetUserPermissionGroupByPayload<T extends UserPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
            : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
        }
      >
    >


  export type UserPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectScalar = {
    userId?: boolean
    permissionId?: boolean
    assignedBy?: boolean
    assignedAt?: boolean
  }

  export type UserPermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "permissionId" | "assignedBy" | "assignedAt", ExtArgs["result"]["userPermission"]>
  export type UserPermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type UserPermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type UserPermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }

  export type $UserPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPermission"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      permission: Prisma.$PermissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: number
      permissionId: number
      assignedBy: number | null
      assignedAt: Date
    }, ExtArgs["result"]["userPermission"]>
    composites: {}
  }

  type UserPermissionGetPayload<S extends boolean | null | undefined | UserPermissionDefaultArgs> = $Result.GetResult<Prisma.$UserPermissionPayload, S>

  type UserPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserPermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: UserPermissionCountAggregateInputType | true
    }

  export interface UserPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPermission'], meta: { name: 'UserPermission' } }
    /**
     * Find zero or one UserPermission that matches the filter.
     * @param {UserPermissionFindUniqueArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPermissionFindUniqueArgs>(args: SelectSubset<T, UserPermissionFindUniqueArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserPermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPermissionFindUniqueOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPermissionFindFirstArgs>(args?: SelectSubset<T, UserPermissionFindFirstArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPermissions
     * const userPermissions = await prisma.userPermission.findMany()
     * 
     * // Get first 10 UserPermissions
     * const userPermissions = await prisma.userPermission.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userPermissionWithUserIdOnly = await prisma.userPermission.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserPermissionFindManyArgs>(args?: SelectSubset<T, UserPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserPermission.
     * @param {UserPermissionCreateArgs} args - Arguments to create a UserPermission.
     * @example
     * // Create one UserPermission
     * const UserPermission = await prisma.userPermission.create({
     *   data: {
     *     // ... data to create a UserPermission
     *   }
     * })
     * 
     */
    create<T extends UserPermissionCreateArgs>(args: SelectSubset<T, UserPermissionCreateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPermissions.
     * @param {UserPermissionCreateManyArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPermissionCreateManyArgs>(args?: SelectSubset<T, UserPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPermissions and returns the data saved in the database.
     * @param {UserPermissionCreateManyAndReturnArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPermissions and only return the `userId`
     * const userPermissionWithUserIdOnly = await prisma.userPermission.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserPermission.
     * @param {UserPermissionDeleteArgs} args - Arguments to delete one UserPermission.
     * @example
     * // Delete one UserPermission
     * const UserPermission = await prisma.userPermission.delete({
     *   where: {
     *     // ... filter to delete one UserPermission
     *   }
     * })
     * 
     */
    delete<T extends UserPermissionDeleteArgs>(args: SelectSubset<T, UserPermissionDeleteArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserPermission.
     * @param {UserPermissionUpdateArgs} args - Arguments to update one UserPermission.
     * @example
     * // Update one UserPermission
     * const userPermission = await prisma.userPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPermissionUpdateArgs>(args: SelectSubset<T, UserPermissionUpdateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPermissions.
     * @param {UserPermissionDeleteManyArgs} args - Arguments to filter UserPermissions to delete.
     * @example
     * // Delete a few UserPermissions
     * const { count } = await prisma.userPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPermissionDeleteManyArgs>(args?: SelectSubset<T, UserPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPermissionUpdateManyArgs>(args: SelectSubset<T, UserPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions and returns the data updated in the database.
     * @param {UserPermissionUpdateManyAndReturnArgs} args - Arguments to update many UserPermissions.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserPermissions and only return the `userId`
     * const userPermissionWithUserIdOnly = await prisma.userPermission.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserPermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserPermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserPermission.
     * @param {UserPermissionUpsertArgs} args - Arguments to update or create a UserPermission.
     * @example
     * // Update or create a UserPermission
     * const userPermission = await prisma.userPermission.upsert({
     *   create: {
     *     // ... data to create a UserPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPermission we want to update
     *   }
     * })
     */
    upsert<T extends UserPermissionUpsertArgs>(args: SelectSubset<T, UserPermissionUpsertArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionCountArgs} args - Arguments to filter UserPermissions to count.
     * @example
     * // Count the number of UserPermissions
     * const count = await prisma.userPermission.count({
     *   where: {
     *     // ... the filter for the UserPermissions we want to count
     *   }
     * })
    **/
    count<T extends UserPermissionCountArgs>(
      args?: Subset<T, UserPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPermissionAggregateArgs>(args: Subset<T, UserPermissionAggregateArgs>): Prisma.PrismaPromise<GetUserPermissionAggregateType<T>>

    /**
     * Group by UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPermissionGroupByArgs['orderBy'] }
        : { orderBy?: UserPermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPermission model
   */
  readonly fields: UserPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PermissionDefaultArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPermission model
   */
  interface UserPermissionFieldRefs {
    readonly userId: FieldRef<"UserPermission", 'Int'>
    readonly permissionId: FieldRef<"UserPermission", 'Int'>
    readonly assignedBy: FieldRef<"UserPermission", 'Int'>
    readonly assignedAt: FieldRef<"UserPermission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserPermission findUnique
   */
  export type UserPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission findUniqueOrThrow
   */
  export type UserPermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission findFirst
   */
  export type UserPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission findFirstOrThrow
   */
  export type UserPermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission findMany
   */
  export type UserPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermissions to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission create
   */
  export type UserPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPermission.
     */
    data: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission createMany
   */
  export type UserPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPermission createManyAndReturn
   */
  export type UserPermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPermission update
   */
  export type UserPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPermission.
     */
    data: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
    /**
     * Choose, which UserPermission to update.
     */
    where: UserPermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission updateMany
   */
  export type UserPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
  }

  /**
   * UserPermission updateManyAndReturn
   */
  export type UserPermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPermission upsert
   */
  export type UserPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPermission to update in case it exists.
     */
    where: UserPermissionWhereUniqueInput
    /**
     * In case the UserPermission found by the `where` argument doesn't exist, create a new UserPermission with this data.
     */
    create: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
    /**
     * In case the UserPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission delete
   */
  export type UserPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter which UserPermission to delete.
     */
    where: UserPermissionWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * UserPermission deleteMany
   */
  export type UserPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermissions to delete
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to delete.
     */
    limit?: number
  }

  /**
   * UserPermission without action
   */
  export type UserPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
  }


  /**
   * Model MfaBackupCode
   */

  export type AggregateMfaBackupCode = {
    _count: MfaBackupCodeCountAggregateOutputType | null
    _avg: MfaBackupCodeAvgAggregateOutputType | null
    _sum: MfaBackupCodeSumAggregateOutputType | null
    _min: MfaBackupCodeMinAggregateOutputType | null
    _max: MfaBackupCodeMaxAggregateOutputType | null
  }

  export type MfaBackupCodeAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type MfaBackupCodeSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type MfaBackupCodeMinAggregateOutputType = {
    id: number | null
    userId: number | null
    codeHash: string | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type MfaBackupCodeMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    codeHash: string | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type MfaBackupCodeCountAggregateOutputType = {
    id: number
    userId: number
    codeHash: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type MfaBackupCodeAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type MfaBackupCodeSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type MfaBackupCodeMinAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    usedAt?: true
    createdAt?: true
  }

  export type MfaBackupCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    usedAt?: true
    createdAt?: true
  }

  export type MfaBackupCodeCountAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type MfaBackupCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MfaBackupCode to aggregate.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MfaBackupCodes
    **/
    _count?: true | MfaBackupCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MfaBackupCodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MfaBackupCodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MfaBackupCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MfaBackupCodeMaxAggregateInputType
  }

  export type GetMfaBackupCodeAggregateType<T extends MfaBackupCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateMfaBackupCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMfaBackupCode[P]>
      : GetScalarType<T[P], AggregateMfaBackupCode[P]>
  }




  export type MfaBackupCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MfaBackupCodeWhereInput
    orderBy?: MfaBackupCodeOrderByWithAggregationInput | MfaBackupCodeOrderByWithAggregationInput[]
    by: MfaBackupCodeScalarFieldEnum[] | MfaBackupCodeScalarFieldEnum
    having?: MfaBackupCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MfaBackupCodeCountAggregateInputType | true
    _avg?: MfaBackupCodeAvgAggregateInputType
    _sum?: MfaBackupCodeSumAggregateInputType
    _min?: MfaBackupCodeMinAggregateInputType
    _max?: MfaBackupCodeMaxAggregateInputType
  }

  export type MfaBackupCodeGroupByOutputType = {
    id: number
    userId: number
    codeHash: string
    usedAt: Date | null
    createdAt: Date
    _count: MfaBackupCodeCountAggregateOutputType | null
    _avg: MfaBackupCodeAvgAggregateOutputType | null
    _sum: MfaBackupCodeSumAggregateOutputType | null
    _min: MfaBackupCodeMinAggregateOutputType | null
    _max: MfaBackupCodeMaxAggregateOutputType | null
  }

  type GetMfaBackupCodeGroupByPayload<T extends MfaBackupCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MfaBackupCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MfaBackupCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MfaBackupCodeGroupByOutputType[P]>
            : GetScalarType<T[P], MfaBackupCodeGroupByOutputType[P]>
        }
      >
    >


  export type MfaBackupCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mfaBackupCode"]>

  export type MfaBackupCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mfaBackupCode"]>

  export type MfaBackupCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mfaBackupCode"]>

  export type MfaBackupCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type MfaBackupCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "codeHash" | "usedAt" | "createdAt", ExtArgs["result"]["mfaBackupCode"]>
  export type MfaBackupCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MfaBackupCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MfaBackupCodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MfaBackupCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MfaBackupCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      codeHash: string
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["mfaBackupCode"]>
    composites: {}
  }

  type MfaBackupCodeGetPayload<S extends boolean | null | undefined | MfaBackupCodeDefaultArgs> = $Result.GetResult<Prisma.$MfaBackupCodePayload, S>

  type MfaBackupCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MfaBackupCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: MfaBackupCodeCountAggregateInputType | true
    }

  export interface MfaBackupCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MfaBackupCode'], meta: { name: 'MfaBackupCode' } }
    /**
     * Find zero or one MfaBackupCode that matches the filter.
     * @param {MfaBackupCodeFindUniqueArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MfaBackupCodeFindUniqueArgs>(args: SelectSubset<T, MfaBackupCodeFindUniqueArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MfaBackupCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MfaBackupCodeFindUniqueOrThrowArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MfaBackupCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, MfaBackupCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MfaBackupCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeFindFirstArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MfaBackupCodeFindFirstArgs>(args?: SelectSubset<T, MfaBackupCodeFindFirstArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MfaBackupCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeFindFirstOrThrowArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MfaBackupCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, MfaBackupCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MfaBackupCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MfaBackupCodes
     * const mfaBackupCodes = await prisma.mfaBackupCode.findMany()
     * 
     * // Get first 10 MfaBackupCodes
     * const mfaBackupCodes = await prisma.mfaBackupCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mfaBackupCodeWithIdOnly = await prisma.mfaBackupCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MfaBackupCodeFindManyArgs>(args?: SelectSubset<T, MfaBackupCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MfaBackupCode.
     * @param {MfaBackupCodeCreateArgs} args - Arguments to create a MfaBackupCode.
     * @example
     * // Create one MfaBackupCode
     * const MfaBackupCode = await prisma.mfaBackupCode.create({
     *   data: {
     *     // ... data to create a MfaBackupCode
     *   }
     * })
     * 
     */
    create<T extends MfaBackupCodeCreateArgs>(args: SelectSubset<T, MfaBackupCodeCreateArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MfaBackupCodes.
     * @param {MfaBackupCodeCreateManyArgs} args - Arguments to create many MfaBackupCodes.
     * @example
     * // Create many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MfaBackupCodeCreateManyArgs>(args?: SelectSubset<T, MfaBackupCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MfaBackupCodes and returns the data saved in the database.
     * @param {MfaBackupCodeCreateManyAndReturnArgs} args - Arguments to create many MfaBackupCodes.
     * @example
     * // Create many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MfaBackupCodes and only return the `id`
     * const mfaBackupCodeWithIdOnly = await prisma.mfaBackupCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MfaBackupCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, MfaBackupCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MfaBackupCode.
     * @param {MfaBackupCodeDeleteArgs} args - Arguments to delete one MfaBackupCode.
     * @example
     * // Delete one MfaBackupCode
     * const MfaBackupCode = await prisma.mfaBackupCode.delete({
     *   where: {
     *     // ... filter to delete one MfaBackupCode
     *   }
     * })
     * 
     */
    delete<T extends MfaBackupCodeDeleteArgs>(args: SelectSubset<T, MfaBackupCodeDeleteArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MfaBackupCode.
     * @param {MfaBackupCodeUpdateArgs} args - Arguments to update one MfaBackupCode.
     * @example
     * // Update one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MfaBackupCodeUpdateArgs>(args: SelectSubset<T, MfaBackupCodeUpdateArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MfaBackupCodes.
     * @param {MfaBackupCodeDeleteManyArgs} args - Arguments to filter MfaBackupCodes to delete.
     * @example
     * // Delete a few MfaBackupCodes
     * const { count } = await prisma.mfaBackupCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MfaBackupCodeDeleteManyArgs>(args?: SelectSubset<T, MfaBackupCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MfaBackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MfaBackupCodeUpdateManyArgs>(args: SelectSubset<T, MfaBackupCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MfaBackupCodes and returns the data updated in the database.
     * @param {MfaBackupCodeUpdateManyAndReturnArgs} args - Arguments to update many MfaBackupCodes.
     * @example
     * // Update many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MfaBackupCodes and only return the `id`
     * const mfaBackupCodeWithIdOnly = await prisma.mfaBackupCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MfaBackupCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, MfaBackupCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MfaBackupCode.
     * @param {MfaBackupCodeUpsertArgs} args - Arguments to update or create a MfaBackupCode.
     * @example
     * // Update or create a MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.upsert({
     *   create: {
     *     // ... data to create a MfaBackupCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MfaBackupCode we want to update
     *   }
     * })
     */
    upsert<T extends MfaBackupCodeUpsertArgs>(args: SelectSubset<T, MfaBackupCodeUpsertArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MfaBackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeCountArgs} args - Arguments to filter MfaBackupCodes to count.
     * @example
     * // Count the number of MfaBackupCodes
     * const count = await prisma.mfaBackupCode.count({
     *   where: {
     *     // ... the filter for the MfaBackupCodes we want to count
     *   }
     * })
    **/
    count<T extends MfaBackupCodeCountArgs>(
      args?: Subset<T, MfaBackupCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MfaBackupCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MfaBackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MfaBackupCodeAggregateArgs>(args: Subset<T, MfaBackupCodeAggregateArgs>): Prisma.PrismaPromise<GetMfaBackupCodeAggregateType<T>>

    /**
     * Group by MfaBackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MfaBackupCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MfaBackupCodeGroupByArgs['orderBy'] }
        : { orderBy?: MfaBackupCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MfaBackupCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMfaBackupCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MfaBackupCode model
   */
  readonly fields: MfaBackupCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MfaBackupCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MfaBackupCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MfaBackupCode model
   */
  interface MfaBackupCodeFieldRefs {
    readonly id: FieldRef<"MfaBackupCode", 'Int'>
    readonly userId: FieldRef<"MfaBackupCode", 'Int'>
    readonly codeHash: FieldRef<"MfaBackupCode", 'String'>
    readonly usedAt: FieldRef<"MfaBackupCode", 'DateTime'>
    readonly createdAt: FieldRef<"MfaBackupCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MfaBackupCode findUnique
   */
  export type MfaBackupCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where: MfaBackupCodeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode findUniqueOrThrow
   */
  export type MfaBackupCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where: MfaBackupCodeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode findFirst
   */
  export type MfaBackupCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MfaBackupCodes.
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaBackupCodes.
     */
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode findFirstOrThrow
   */
  export type MfaBackupCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MfaBackupCodes.
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaBackupCodes.
     */
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode findMany
   */
  export type MfaBackupCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCodes to fetch.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MfaBackupCodes.
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaBackupCodes.
     */
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode create
   */
  export type MfaBackupCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a MfaBackupCode.
     */
    data: XOR<MfaBackupCodeCreateInput, MfaBackupCodeUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode createMany
   */
  export type MfaBackupCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MfaBackupCodes.
     */
    data: MfaBackupCodeCreateManyInput | MfaBackupCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MfaBackupCode createManyAndReturn
   */
  export type MfaBackupCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * The data used to create many MfaBackupCodes.
     */
    data: MfaBackupCodeCreateManyInput | MfaBackupCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MfaBackupCode update
   */
  export type MfaBackupCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a MfaBackupCode.
     */
    data: XOR<MfaBackupCodeUpdateInput, MfaBackupCodeUncheckedUpdateInput>
    /**
     * Choose, which MfaBackupCode to update.
     */
    where: MfaBackupCodeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode updateMany
   */
  export type MfaBackupCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MfaBackupCodes.
     */
    data: XOR<MfaBackupCodeUpdateManyMutationInput, MfaBackupCodeUncheckedUpdateManyInput>
    /**
     * Filter which MfaBackupCodes to update
     */
    where?: MfaBackupCodeWhereInput
    /**
     * Limit how many MfaBackupCodes to update.
     */
    limit?: number
  }

  /**
   * MfaBackupCode updateManyAndReturn
   */
  export type MfaBackupCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * The data used to update MfaBackupCodes.
     */
    data: XOR<MfaBackupCodeUpdateManyMutationInput, MfaBackupCodeUncheckedUpdateManyInput>
    /**
     * Filter which MfaBackupCodes to update
     */
    where?: MfaBackupCodeWhereInput
    /**
     * Limit how many MfaBackupCodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MfaBackupCode upsert
   */
  export type MfaBackupCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the MfaBackupCode to update in case it exists.
     */
    where: MfaBackupCodeWhereUniqueInput
    /**
     * In case the MfaBackupCode found by the `where` argument doesn't exist, create a new MfaBackupCode with this data.
     */
    create: XOR<MfaBackupCodeCreateInput, MfaBackupCodeUncheckedCreateInput>
    /**
     * In case the MfaBackupCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MfaBackupCodeUpdateInput, MfaBackupCodeUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode delete
   */
  export type MfaBackupCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter which MfaBackupCode to delete.
     */
    where: MfaBackupCodeWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * MfaBackupCode deleteMany
   */
  export type MfaBackupCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MfaBackupCodes to delete
     */
    where?: MfaBackupCodeWhereInput
    /**
     * Limit how many MfaBackupCodes to delete.
     */
    limit?: number
  }

  /**
   * MfaBackupCode without action
   */
  export type MfaBackupCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MfaBackupCode
     */
    omit?: MfaBackupCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
  }


  /**
   * Model TrustedDevice
   */

  export type AggregateTrustedDevice = {
    _count: TrustedDeviceCountAggregateOutputType | null
    _avg: TrustedDeviceAvgAggregateOutputType | null
    _sum: TrustedDeviceSumAggregateOutputType | null
    _min: TrustedDeviceMinAggregateOutputType | null
    _max: TrustedDeviceMaxAggregateOutputType | null
  }

  export type TrustedDeviceAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    sessionVersion: number | null
  }

  export type TrustedDeviceSumAggregateOutputType = {
    id: number | null
    userId: number | null
    sessionVersion: number | null
  }

  export type TrustedDeviceMinAggregateOutputType = {
    id: number | null
    userId: number | null
    tokenHash: string | null
    sessionVersion: number | null
    label: string | null
    createdAt: Date | null
    expiresAt: Date | null
    lastUsedAt: Date | null
  }

  export type TrustedDeviceMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    tokenHash: string | null
    sessionVersion: number | null
    label: string | null
    createdAt: Date | null
    expiresAt: Date | null
    lastUsedAt: Date | null
  }

  export type TrustedDeviceCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    sessionVersion: number
    label: number
    createdAt: number
    expiresAt: number
    lastUsedAt: number
    _all: number
  }


  export type TrustedDeviceAvgAggregateInputType = {
    id?: true
    userId?: true
    sessionVersion?: true
  }

  export type TrustedDeviceSumAggregateInputType = {
    id?: true
    userId?: true
    sessionVersion?: true
  }

  export type TrustedDeviceMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    sessionVersion?: true
    label?: true
    createdAt?: true
    expiresAt?: true
    lastUsedAt?: true
  }

  export type TrustedDeviceMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    sessionVersion?: true
    label?: true
    createdAt?: true
    expiresAt?: true
    lastUsedAt?: true
  }

  export type TrustedDeviceCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    sessionVersion?: true
    label?: true
    createdAt?: true
    expiresAt?: true
    lastUsedAt?: true
    _all?: true
  }

  export type TrustedDeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustedDevice to aggregate.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrustedDevices
    **/
    _count?: true | TrustedDeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrustedDeviceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrustedDeviceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrustedDeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrustedDeviceMaxAggregateInputType
  }

  export type GetTrustedDeviceAggregateType<T extends TrustedDeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateTrustedDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrustedDevice[P]>
      : GetScalarType<T[P], AggregateTrustedDevice[P]>
  }




  export type TrustedDeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrustedDeviceWhereInput
    orderBy?: TrustedDeviceOrderByWithAggregationInput | TrustedDeviceOrderByWithAggregationInput[]
    by: TrustedDeviceScalarFieldEnum[] | TrustedDeviceScalarFieldEnum
    having?: TrustedDeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrustedDeviceCountAggregateInputType | true
    _avg?: TrustedDeviceAvgAggregateInputType
    _sum?: TrustedDeviceSumAggregateInputType
    _min?: TrustedDeviceMinAggregateInputType
    _max?: TrustedDeviceMaxAggregateInputType
  }

  export type TrustedDeviceGroupByOutputType = {
    id: number
    userId: number
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt: Date
    expiresAt: Date
    lastUsedAt: Date | null
    _count: TrustedDeviceCountAggregateOutputType | null
    _avg: TrustedDeviceAvgAggregateOutputType | null
    _sum: TrustedDeviceSumAggregateOutputType | null
    _min: TrustedDeviceMinAggregateOutputType | null
    _max: TrustedDeviceMaxAggregateOutputType | null
  }

  type GetTrustedDeviceGroupByPayload<T extends TrustedDeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrustedDeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrustedDeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrustedDeviceGroupByOutputType[P]>
            : GetScalarType<T[P], TrustedDeviceGroupByOutputType[P]>
        }
      >
    >


  export type TrustedDeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    sessionVersion?: boolean
    label?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trustedDevice"]>

  export type TrustedDeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    sessionVersion?: boolean
    label?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trustedDevice"]>

  export type TrustedDeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    sessionVersion?: boolean
    label?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trustedDevice"]>

  export type TrustedDeviceSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    sessionVersion?: boolean
    label?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
  }

  export type TrustedDeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenHash" | "sessionVersion" | "label" | "createdAt" | "expiresAt" | "lastUsedAt", ExtArgs["result"]["trustedDevice"]>
  export type TrustedDeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TrustedDeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TrustedDeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TrustedDevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrustedDevice"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      tokenHash: string
      sessionVersion: number
      label: string
      createdAt: Date
      expiresAt: Date
      lastUsedAt: Date | null
    }, ExtArgs["result"]["trustedDevice"]>
    composites: {}
  }

  type TrustedDeviceGetPayload<S extends boolean | null | undefined | TrustedDeviceDefaultArgs> = $Result.GetResult<Prisma.$TrustedDevicePayload, S>

  type TrustedDeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrustedDeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit' | 'relationLoadStrategy'> & {
      select?: TrustedDeviceCountAggregateInputType | true
    }

  export interface TrustedDeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrustedDevice'], meta: { name: 'TrustedDevice' } }
    /**
     * Find zero or one TrustedDevice that matches the filter.
     * @param {TrustedDeviceFindUniqueArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrustedDeviceFindUniqueArgs>(args: SelectSubset<T, TrustedDeviceFindUniqueArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrustedDevice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrustedDeviceFindUniqueOrThrowArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrustedDeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, TrustedDeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrustedDevice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceFindFirstArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrustedDeviceFindFirstArgs>(args?: SelectSubset<T, TrustedDeviceFindFirstArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrustedDevice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceFindFirstOrThrowArgs} args - Arguments to find a TrustedDevice
     * @example
     * // Get one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrustedDeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, TrustedDeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrustedDevices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrustedDevices
     * const trustedDevices = await prisma.trustedDevice.findMany()
     * 
     * // Get first 10 TrustedDevices
     * const trustedDevices = await prisma.trustedDevice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trustedDeviceWithIdOnly = await prisma.trustedDevice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrustedDeviceFindManyArgs>(args?: SelectSubset<T, TrustedDeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrustedDevice.
     * @param {TrustedDeviceCreateArgs} args - Arguments to create a TrustedDevice.
     * @example
     * // Create one TrustedDevice
     * const TrustedDevice = await prisma.trustedDevice.create({
     *   data: {
     *     // ... data to create a TrustedDevice
     *   }
     * })
     * 
     */
    create<T extends TrustedDeviceCreateArgs>(args: SelectSubset<T, TrustedDeviceCreateArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrustedDevices.
     * @param {TrustedDeviceCreateManyArgs} args - Arguments to create many TrustedDevices.
     * @example
     * // Create many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrustedDeviceCreateManyArgs>(args?: SelectSubset<T, TrustedDeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrustedDevices and returns the data saved in the database.
     * @param {TrustedDeviceCreateManyAndReturnArgs} args - Arguments to create many TrustedDevices.
     * @example
     * // Create many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrustedDevices and only return the `id`
     * const trustedDeviceWithIdOnly = await prisma.trustedDevice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrustedDeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, TrustedDeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrustedDevice.
     * @param {TrustedDeviceDeleteArgs} args - Arguments to delete one TrustedDevice.
     * @example
     * // Delete one TrustedDevice
     * const TrustedDevice = await prisma.trustedDevice.delete({
     *   where: {
     *     // ... filter to delete one TrustedDevice
     *   }
     * })
     * 
     */
    delete<T extends TrustedDeviceDeleteArgs>(args: SelectSubset<T, TrustedDeviceDeleteArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrustedDevice.
     * @param {TrustedDeviceUpdateArgs} args - Arguments to update one TrustedDevice.
     * @example
     * // Update one TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrustedDeviceUpdateArgs>(args: SelectSubset<T, TrustedDeviceUpdateArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrustedDevices.
     * @param {TrustedDeviceDeleteManyArgs} args - Arguments to filter TrustedDevices to delete.
     * @example
     * // Delete a few TrustedDevices
     * const { count } = await prisma.trustedDevice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrustedDeviceDeleteManyArgs>(args?: SelectSubset<T, TrustedDeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustedDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrustedDeviceUpdateManyArgs>(args: SelectSubset<T, TrustedDeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrustedDevices and returns the data updated in the database.
     * @param {TrustedDeviceUpdateManyAndReturnArgs} args - Arguments to update many TrustedDevices.
     * @example
     * // Update many TrustedDevices
     * const trustedDevice = await prisma.trustedDevice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrustedDevices and only return the `id`
     * const trustedDeviceWithIdOnly = await prisma.trustedDevice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrustedDeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, TrustedDeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrustedDevice.
     * @param {TrustedDeviceUpsertArgs} args - Arguments to update or create a TrustedDevice.
     * @example
     * // Update or create a TrustedDevice
     * const trustedDevice = await prisma.trustedDevice.upsert({
     *   create: {
     *     // ... data to create a TrustedDevice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrustedDevice we want to update
     *   }
     * })
     */
    upsert<T extends TrustedDeviceUpsertArgs>(args: SelectSubset<T, TrustedDeviceUpsertArgs<ExtArgs>>): Prisma__TrustedDeviceClient<$Result.GetResult<Prisma.$TrustedDevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrustedDevices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceCountArgs} args - Arguments to filter TrustedDevices to count.
     * @example
     * // Count the number of TrustedDevices
     * const count = await prisma.trustedDevice.count({
     *   where: {
     *     // ... the filter for the TrustedDevices we want to count
     *   }
     * })
    **/
    count<T extends TrustedDeviceCountArgs>(
      args?: Subset<T, TrustedDeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrustedDeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrustedDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrustedDeviceAggregateArgs>(args: Subset<T, TrustedDeviceAggregateArgs>): Prisma.PrismaPromise<GetTrustedDeviceAggregateType<T>>

    /**
     * Group by TrustedDevice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrustedDeviceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrustedDeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrustedDeviceGroupByArgs['orderBy'] }
        : { orderBy?: TrustedDeviceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrustedDeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrustedDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrustedDevice model
   */
  readonly fields: TrustedDeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrustedDevice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrustedDeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrustedDevice model
   */
  interface TrustedDeviceFieldRefs {
    readonly id: FieldRef<"TrustedDevice", 'Int'>
    readonly userId: FieldRef<"TrustedDevice", 'Int'>
    readonly tokenHash: FieldRef<"TrustedDevice", 'String'>
    readonly sessionVersion: FieldRef<"TrustedDevice", 'Int'>
    readonly label: FieldRef<"TrustedDevice", 'String'>
    readonly createdAt: FieldRef<"TrustedDevice", 'DateTime'>
    readonly expiresAt: FieldRef<"TrustedDevice", 'DateTime'>
    readonly lastUsedAt: FieldRef<"TrustedDevice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrustedDevice findUnique
   */
  export type TrustedDeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where: TrustedDeviceWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice findUniqueOrThrow
   */
  export type TrustedDeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where: TrustedDeviceWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice findFirst
   */
  export type TrustedDeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustedDevices.
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustedDevices.
     */
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice findFirstOrThrow
   */
  export type TrustedDeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevice to fetch.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrustedDevices.
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustedDevices.
     */
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice findMany
   */
  export type TrustedDeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter, which TrustedDevices to fetch.
     */
    where?: TrustedDeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrustedDevices to fetch.
     */
    orderBy?: TrustedDeviceOrderByWithRelationInput | TrustedDeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrustedDevices.
     */
    cursor?: TrustedDeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrustedDevices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrustedDevices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrustedDevices.
     */
    distinct?: TrustedDeviceScalarFieldEnum | TrustedDeviceScalarFieldEnum[]
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice create
   */
  export type TrustedDeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a TrustedDevice.
     */
    data: XOR<TrustedDeviceCreateInput, TrustedDeviceUncheckedCreateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice createMany
   */
  export type TrustedDeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrustedDevices.
     */
    data: TrustedDeviceCreateManyInput | TrustedDeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrustedDevice createManyAndReturn
   */
  export type TrustedDeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * The data used to create many TrustedDevices.
     */
    data: TrustedDeviceCreateManyInput | TrustedDeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrustedDevice update
   */
  export type TrustedDeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a TrustedDevice.
     */
    data: XOR<TrustedDeviceUpdateInput, TrustedDeviceUncheckedUpdateInput>
    /**
     * Choose, which TrustedDevice to update.
     */
    where: TrustedDeviceWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice updateMany
   */
  export type TrustedDeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrustedDevices.
     */
    data: XOR<TrustedDeviceUpdateManyMutationInput, TrustedDeviceUncheckedUpdateManyInput>
    /**
     * Filter which TrustedDevices to update
     */
    where?: TrustedDeviceWhereInput
    /**
     * Limit how many TrustedDevices to update.
     */
    limit?: number
  }

  /**
   * TrustedDevice updateManyAndReturn
   */
  export type TrustedDeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * The data used to update TrustedDevices.
     */
    data: XOR<TrustedDeviceUpdateManyMutationInput, TrustedDeviceUncheckedUpdateManyInput>
    /**
     * Filter which TrustedDevices to update
     */
    where?: TrustedDeviceWhereInput
    /**
     * Limit how many TrustedDevices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrustedDevice upsert
   */
  export type TrustedDeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the TrustedDevice to update in case it exists.
     */
    where: TrustedDeviceWhereUniqueInput
    /**
     * In case the TrustedDevice found by the `where` argument doesn't exist, create a new TrustedDevice with this data.
     */
    create: XOR<TrustedDeviceCreateInput, TrustedDeviceUncheckedCreateInput>
    /**
     * In case the TrustedDevice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrustedDeviceUpdateInput, TrustedDeviceUncheckedUpdateInput>
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice delete
   */
  export type TrustedDeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
    /**
     * Filter which TrustedDevice to delete.
     */
    where: TrustedDeviceWhereUniqueInput
    relationLoadStrategy?: RelationLoadStrategy
  }

  /**
   * TrustedDevice deleteMany
   */
  export type TrustedDeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrustedDevices to delete
     */
    where?: TrustedDeviceWhereInput
    /**
     * Limit how many TrustedDevices to delete.
     */
    limit?: number
  }

  /**
   * TrustedDevice without action
   */
  export type TrustedDeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrustedDevice
     */
    select?: TrustedDeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrustedDevice
     */
    omit?: TrustedDeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrustedDeviceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OffenseScalarFieldEnum: {
    id: 'id',
    offenseDefinitionId: 'offenseDefinitionId',
    importKey: 'importKey',
    crimeType: 'crimeType',
    felonyStage: 'felonyStage',
    sourceFile: 'sourceFile',
    sourceSheet: 'sourceSheet',
    sourceRow: 'sourceRow',
    blotterNo: 'blotterNo',
    dateEncoded: 'dateEncoded',
    pro: 'pro',
    ppo: 'ppo',
    stn: 'stn',
    pcp: 'pcp',
    region: 'region',
    province: 'province',
    municipal: 'municipal',
    barangay: 'barangay',
    street: 'street',
    typeOfPlace: 'typeOfPlace',
    dateReported: 'dateReported',
    timeReported: 'timeReported',
    dateCommitted: 'dateCommitted',
    timeCommitted: 'timeCommitted',
    isCrime: 'isCrime',
    modeReporting: 'modeReporting',
    stageOfFelony: 'stageOfFelony',
    offense: 'offense',
    offenseType: 'offenseType',
    section: 'section',
    modus: 'modus',
    suspectMotive: 'suspectMotive',
    suspectSubMotive: 'suspectSubMotive',
    heinous: 'heinous',
    sensational: 'sensational',
    threatGrp: 'threatGrp',
    grpAffiliation: 'grpAffiliation',
    mrs: 'mrs',
    suspectIsEGO: 'suspectIsEGO',
    suspectEGOPosition: 'suspectEGOPosition',
    suspectEGOClass: 'suspectEGOClass',
    suspectCount: 'suspectCount',
    suspectArrested: 'suspectArrested',
    victimIsEGO: 'victimIsEGO',
    victimEGOPosition: 'victimEGOPosition',
    victimEGOClass: 'victimEGOClass',
    victimCount: 'victimCount',
    caseStatus: 'caseStatus',
    investigator: 'investigator',
    headInves: 'headInves',
    latitude: 'latitude',
    longitude: 'longitude',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OffenseScalarFieldEnum = (typeof OffenseScalarFieldEnum)[keyof typeof OffenseScalarFieldEnum]


  export const RelationLoadStrategy: {
    query: 'query',
    join: 'join'
  };

  export type RelationLoadStrategy = (typeof RelationLoadStrategy)[keyof typeof RelationLoadStrategy]


  export const OffenseDefinitionScalarFieldEnum: {
    id: 'id',
    code: 'code',
    label: 'label'
  };

  export type OffenseDefinitionScalarFieldEnum = (typeof OffenseDefinitionScalarFieldEnum)[keyof typeof OffenseDefinitionScalarFieldEnum]


  export const BarangayScalarFieldEnum: {
    id: 'id',
    name: 'name',
    coordinates: 'coordinates',
    population: 'population',
    area: 'area',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BarangayScalarFieldEnum = (typeof BarangayScalarFieldEnum)[keyof typeof BarangayScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    details: 'details',
    user: 'user',
    createdAt: 'createdAt',
    ip: 'ip',
    session: 'session',
    userAgent: 'userAgent',
    resource: 'resource',
    severity: 'severity',
    outcome: 'outcome',
    fileName: 'fileName',
    fileSize: 'fileSize',
    recordsImported: 'recordsImported',
    errorMessage: 'errorMessage'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    accountNumber: 'accountNumber',
    email: 'email',
    emailVerifiedAt: 'emailVerifiedAt',
    sessionVersion: 'sessionVersion',
    fullName: 'fullName',
    passwordHash: 'passwordHash',
    mustChangePassword: 'mustChangePassword',
    defaultLandingPage: 'defaultLandingPage',
    autoLogoutTimer: 'autoLogoutTimer',
    failedLoginAttempts: 'failedLoginAttempts',
    lockedAt: 'lockedAt',
    totpSecretEnc: 'totpSecretEnc',
    totpEnabledAt: 'totpEnabledAt',
    totpLastStep: 'totpLastStep',
    mfaFailedAttempts: 'mfaFailedAttempts',
    passwordResetViaEmailAt: 'passwordResetViaEmailAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AuthTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    purpose: 'purpose',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt',
    createdById: 'createdById'
  };

  export type AuthTokenScalarFieldEnum = (typeof AuthTokenScalarFieldEnum)[keyof typeof AuthTokenScalarFieldEnum]


  export const BackupScalarFieldEnum: {
    id: 'id',
    kind: 'kind',
    fileName: 'fileName',
    mimeType: 'mimeType',
    sizeBytes: 'sizeBytes',
    content: 'content',
    label: 'label',
    barangay: 'barangay',
    periodLabel: 'periodLabel',
    rowCount: 'rowCount',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
  };

  export type BackupScalarFieldEnum = (typeof BackupScalarFieldEnum)[keyof typeof BackupScalarFieldEnum]


  export const ExportScheduleScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    enabled: 'enabled',
    frequency: 'frequency',
    dayOfWeek: 'dayOfWeek',
    dayOfMonth: 'dayOfMonth',
    monthlyOn: 'monthlyOn',
    timeOfDay: 'timeOfDay',
    savedAt: 'savedAt',
    lastRunAt: 'lastRunAt',
    lastAttemptAt: 'lastAttemptAt',
    lastRunError: 'lastRunError',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExportScheduleScalarFieldEnum = (typeof ExportScheduleScalarFieldEnum)[keyof typeof ExportScheduleScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    permissionName: 'permissionName',
    description: 'description'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const UserPermissionScalarFieldEnum: {
    userId: 'userId',
    permissionId: 'permissionId',
    assignedBy: 'assignedBy',
    assignedAt: 'assignedAt'
  };

  export type UserPermissionScalarFieldEnum = (typeof UserPermissionScalarFieldEnum)[keyof typeof UserPermissionScalarFieldEnum]


  export const MfaBackupCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    codeHash: 'codeHash',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type MfaBackupCodeScalarFieldEnum = (typeof MfaBackupCodeScalarFieldEnum)[keyof typeof MfaBackupCodeScalarFieldEnum]


  export const TrustedDeviceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    sessionVersion: 'sessionVersion',
    label: 'label',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    lastUsedAt: 'lastUsedAt'
  };

  export type TrustedDeviceScalarFieldEnum = (typeof TrustedDeviceScalarFieldEnum)[keyof typeof TrustedDeviceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    
  /**
   * Deep Input Types
   */


  export type OffenseWhereInput = {
    AND?: OffenseWhereInput | OffenseWhereInput[]
    OR?: OffenseWhereInput[]
    NOT?: OffenseWhereInput | OffenseWhereInput[]
    id?: StringFilter<"Offense"> | string
    offenseDefinitionId?: StringFilter<"Offense"> | string
    importKey?: StringNullableFilter<"Offense"> | string | null
    crimeType?: StringFilter<"Offense"> | string
    felonyStage?: StringFilter<"Offense"> | string
    sourceFile?: StringNullableFilter<"Offense"> | string | null
    sourceSheet?: StringNullableFilter<"Offense"> | string | null
    sourceRow?: IntNullableFilter<"Offense"> | number | null
    blotterNo?: StringNullableFilter<"Offense"> | string | null
    dateEncoded?: DateTimeNullableFilter<"Offense"> | Date | string | null
    pro?: StringNullableFilter<"Offense"> | string | null
    ppo?: StringNullableFilter<"Offense"> | string | null
    stn?: StringNullableFilter<"Offense"> | string | null
    pcp?: StringNullableFilter<"Offense"> | string | null
    region?: StringNullableFilter<"Offense"> | string | null
    province?: StringNullableFilter<"Offense"> | string | null
    municipal?: StringNullableFilter<"Offense"> | string | null
    barangay?: StringFilter<"Offense"> | string
    street?: StringNullableFilter<"Offense"> | string | null
    typeOfPlace?: StringNullableFilter<"Offense"> | string | null
    dateReported?: DateTimeFilter<"Offense"> | Date | string
    timeReported?: StringFilter<"Offense"> | string
    dateCommitted?: DateTimeFilter<"Offense"> | Date | string
    timeCommitted?: StringFilter<"Offense"> | string
    isCrime?: BoolFilter<"Offense"> | boolean
    modeReporting?: StringNullableFilter<"Offense"> | string | null
    stageOfFelony?: StringNullableFilter<"Offense"> | string | null
    offense?: StringNullableFilter<"Offense"> | string | null
    offenseType?: StringNullableFilter<"Offense"> | string | null
    section?: StringNullableFilter<"Offense"> | string | null
    modus?: StringNullableFilter<"Offense"> | string | null
    suspectMotive?: StringNullableFilter<"Offense"> | string | null
    suspectSubMotive?: StringNullableFilter<"Offense"> | string | null
    heinous?: BoolFilter<"Offense"> | boolean
    sensational?: BoolFilter<"Offense"> | boolean
    threatGrp?: BoolFilter<"Offense"> | boolean
    grpAffiliation?: StringNullableFilter<"Offense"> | string | null
    mrs?: StringNullableFilter<"Offense"> | string | null
    suspectIsEGO?: BoolFilter<"Offense"> | boolean
    suspectEGOPosition?: StringNullableFilter<"Offense"> | string | null
    suspectEGOClass?: StringNullableFilter<"Offense"> | string | null
    suspectCount?: IntNullableFilter<"Offense"> | number | null
    suspectArrested?: BoolNullableFilter<"Offense"> | boolean | null
    victimIsEGO?: BoolFilter<"Offense"> | boolean
    victimEGOPosition?: StringNullableFilter<"Offense"> | string | null
    victimEGOClass?: StringNullableFilter<"Offense"> | string | null
    victimCount?: IntNullableFilter<"Offense"> | number | null
    caseStatus?: StringNullableFilter<"Offense"> | string | null
    investigator?: StringNullableFilter<"Offense"> | string | null
    headInves?: StringNullableFilter<"Offense"> | string | null
    latitude?: FloatNullableFilter<"Offense"> | number | null
    longitude?: FloatNullableFilter<"Offense"> | number | null
    createdAt?: DateTimeFilter<"Offense"> | Date | string
    updatedAt?: DateTimeFilter<"Offense"> | Date | string
    offenseDefinition?: XOR<OffenseDefinitionScalarRelationFilter, OffenseDefinitionWhereInput>
  }

  export type OffenseOrderByWithRelationInput = {
    id?: SortOrder
    offenseDefinitionId?: SortOrder
    importKey?: SortOrderInput | SortOrder
    crimeType?: SortOrder
    felonyStage?: SortOrder
    sourceFile?: SortOrderInput | SortOrder
    sourceSheet?: SortOrderInput | SortOrder
    sourceRow?: SortOrderInput | SortOrder
    blotterNo?: SortOrderInput | SortOrder
    dateEncoded?: SortOrderInput | SortOrder
    pro?: SortOrderInput | SortOrder
    ppo?: SortOrderInput | SortOrder
    stn?: SortOrderInput | SortOrder
    pcp?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    municipal?: SortOrderInput | SortOrder
    barangay?: SortOrder
    street?: SortOrderInput | SortOrder
    typeOfPlace?: SortOrderInput | SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrderInput | SortOrder
    stageOfFelony?: SortOrderInput | SortOrder
    offense?: SortOrderInput | SortOrder
    offenseType?: SortOrderInput | SortOrder
    section?: SortOrderInput | SortOrder
    modus?: SortOrderInput | SortOrder
    suspectMotive?: SortOrderInput | SortOrder
    suspectSubMotive?: SortOrderInput | SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrderInput | SortOrder
    mrs?: SortOrderInput | SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrderInput | SortOrder
    suspectEGOClass?: SortOrderInput | SortOrder
    suspectCount?: SortOrderInput | SortOrder
    suspectArrested?: SortOrderInput | SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrderInput | SortOrder
    victimEGOClass?: SortOrderInput | SortOrder
    victimCount?: SortOrderInput | SortOrder
    caseStatus?: SortOrderInput | SortOrder
    investigator?: SortOrderInput | SortOrder
    headInves?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    offenseDefinition?: OffenseDefinitionOrderByWithRelationInput
  }

  export type OffenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    importKey?: string
    AND?: OffenseWhereInput | OffenseWhereInput[]
    OR?: OffenseWhereInput[]
    NOT?: OffenseWhereInput | OffenseWhereInput[]
    offenseDefinitionId?: StringFilter<"Offense"> | string
    crimeType?: StringFilter<"Offense"> | string
    felonyStage?: StringFilter<"Offense"> | string
    sourceFile?: StringNullableFilter<"Offense"> | string | null
    sourceSheet?: StringNullableFilter<"Offense"> | string | null
    sourceRow?: IntNullableFilter<"Offense"> | number | null
    blotterNo?: StringNullableFilter<"Offense"> | string | null
    dateEncoded?: DateTimeNullableFilter<"Offense"> | Date | string | null
    pro?: StringNullableFilter<"Offense"> | string | null
    ppo?: StringNullableFilter<"Offense"> | string | null
    stn?: StringNullableFilter<"Offense"> | string | null
    pcp?: StringNullableFilter<"Offense"> | string | null
    region?: StringNullableFilter<"Offense"> | string | null
    province?: StringNullableFilter<"Offense"> | string | null
    municipal?: StringNullableFilter<"Offense"> | string | null
    barangay?: StringFilter<"Offense"> | string
    street?: StringNullableFilter<"Offense"> | string | null
    typeOfPlace?: StringNullableFilter<"Offense"> | string | null
    dateReported?: DateTimeFilter<"Offense"> | Date | string
    timeReported?: StringFilter<"Offense"> | string
    dateCommitted?: DateTimeFilter<"Offense"> | Date | string
    timeCommitted?: StringFilter<"Offense"> | string
    isCrime?: BoolFilter<"Offense"> | boolean
    modeReporting?: StringNullableFilter<"Offense"> | string | null
    stageOfFelony?: StringNullableFilter<"Offense"> | string | null
    offense?: StringNullableFilter<"Offense"> | string | null
    offenseType?: StringNullableFilter<"Offense"> | string | null
    section?: StringNullableFilter<"Offense"> | string | null
    modus?: StringNullableFilter<"Offense"> | string | null
    suspectMotive?: StringNullableFilter<"Offense"> | string | null
    suspectSubMotive?: StringNullableFilter<"Offense"> | string | null
    heinous?: BoolFilter<"Offense"> | boolean
    sensational?: BoolFilter<"Offense"> | boolean
    threatGrp?: BoolFilter<"Offense"> | boolean
    grpAffiliation?: StringNullableFilter<"Offense"> | string | null
    mrs?: StringNullableFilter<"Offense"> | string | null
    suspectIsEGO?: BoolFilter<"Offense"> | boolean
    suspectEGOPosition?: StringNullableFilter<"Offense"> | string | null
    suspectEGOClass?: StringNullableFilter<"Offense"> | string | null
    suspectCount?: IntNullableFilter<"Offense"> | number | null
    suspectArrested?: BoolNullableFilter<"Offense"> | boolean | null
    victimIsEGO?: BoolFilter<"Offense"> | boolean
    victimEGOPosition?: StringNullableFilter<"Offense"> | string | null
    victimEGOClass?: StringNullableFilter<"Offense"> | string | null
    victimCount?: IntNullableFilter<"Offense"> | number | null
    caseStatus?: StringNullableFilter<"Offense"> | string | null
    investigator?: StringNullableFilter<"Offense"> | string | null
    headInves?: StringNullableFilter<"Offense"> | string | null
    latitude?: FloatNullableFilter<"Offense"> | number | null
    longitude?: FloatNullableFilter<"Offense"> | number | null
    createdAt?: DateTimeFilter<"Offense"> | Date | string
    updatedAt?: DateTimeFilter<"Offense"> | Date | string
    offenseDefinition?: XOR<OffenseDefinitionScalarRelationFilter, OffenseDefinitionWhereInput>
  }, "id" | "importKey">

  export type OffenseOrderByWithAggregationInput = {
    id?: SortOrder
    offenseDefinitionId?: SortOrder
    importKey?: SortOrderInput | SortOrder
    crimeType?: SortOrder
    felonyStage?: SortOrder
    sourceFile?: SortOrderInput | SortOrder
    sourceSheet?: SortOrderInput | SortOrder
    sourceRow?: SortOrderInput | SortOrder
    blotterNo?: SortOrderInput | SortOrder
    dateEncoded?: SortOrderInput | SortOrder
    pro?: SortOrderInput | SortOrder
    ppo?: SortOrderInput | SortOrder
    stn?: SortOrderInput | SortOrder
    pcp?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    municipal?: SortOrderInput | SortOrder
    barangay?: SortOrder
    street?: SortOrderInput | SortOrder
    typeOfPlace?: SortOrderInput | SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrderInput | SortOrder
    stageOfFelony?: SortOrderInput | SortOrder
    offense?: SortOrderInput | SortOrder
    offenseType?: SortOrderInput | SortOrder
    section?: SortOrderInput | SortOrder
    modus?: SortOrderInput | SortOrder
    suspectMotive?: SortOrderInput | SortOrder
    suspectSubMotive?: SortOrderInput | SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrderInput | SortOrder
    mrs?: SortOrderInput | SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrderInput | SortOrder
    suspectEGOClass?: SortOrderInput | SortOrder
    suspectCount?: SortOrderInput | SortOrder
    suspectArrested?: SortOrderInput | SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrderInput | SortOrder
    victimEGOClass?: SortOrderInput | SortOrder
    victimCount?: SortOrderInput | SortOrder
    caseStatus?: SortOrderInput | SortOrder
    investigator?: SortOrderInput | SortOrder
    headInves?: SortOrderInput | SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OffenseCountOrderByAggregateInput
    _avg?: OffenseAvgOrderByAggregateInput
    _max?: OffenseMaxOrderByAggregateInput
    _min?: OffenseMinOrderByAggregateInput
    _sum?: OffenseSumOrderByAggregateInput
  }

  export type OffenseScalarWhereWithAggregatesInput = {
    AND?: OffenseScalarWhereWithAggregatesInput | OffenseScalarWhereWithAggregatesInput[]
    OR?: OffenseScalarWhereWithAggregatesInput[]
    NOT?: OffenseScalarWhereWithAggregatesInput | OffenseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Offense"> | string
    offenseDefinitionId?: StringWithAggregatesFilter<"Offense"> | string
    importKey?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    crimeType?: StringWithAggregatesFilter<"Offense"> | string
    felonyStage?: StringWithAggregatesFilter<"Offense"> | string
    sourceFile?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    sourceSheet?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    sourceRow?: IntNullableWithAggregatesFilter<"Offense"> | number | null
    blotterNo?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    dateEncoded?: DateTimeNullableWithAggregatesFilter<"Offense"> | Date | string | null
    pro?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    ppo?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    stn?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    pcp?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    region?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    province?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    municipal?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    barangay?: StringWithAggregatesFilter<"Offense"> | string
    street?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    typeOfPlace?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    dateReported?: DateTimeWithAggregatesFilter<"Offense"> | Date | string
    timeReported?: StringWithAggregatesFilter<"Offense"> | string
    dateCommitted?: DateTimeWithAggregatesFilter<"Offense"> | Date | string
    timeCommitted?: StringWithAggregatesFilter<"Offense"> | string
    isCrime?: BoolWithAggregatesFilter<"Offense"> | boolean
    modeReporting?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    stageOfFelony?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    offense?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    offenseType?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    section?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    modus?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    suspectMotive?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    suspectSubMotive?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    heinous?: BoolWithAggregatesFilter<"Offense"> | boolean
    sensational?: BoolWithAggregatesFilter<"Offense"> | boolean
    threatGrp?: BoolWithAggregatesFilter<"Offense"> | boolean
    grpAffiliation?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    mrs?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    suspectIsEGO?: BoolWithAggregatesFilter<"Offense"> | boolean
    suspectEGOPosition?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    suspectEGOClass?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    suspectCount?: IntNullableWithAggregatesFilter<"Offense"> | number | null
    suspectArrested?: BoolNullableWithAggregatesFilter<"Offense"> | boolean | null
    victimIsEGO?: BoolWithAggregatesFilter<"Offense"> | boolean
    victimEGOPosition?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    victimEGOClass?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    victimCount?: IntNullableWithAggregatesFilter<"Offense"> | number | null
    caseStatus?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    investigator?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    headInves?: StringNullableWithAggregatesFilter<"Offense"> | string | null
    latitude?: FloatNullableWithAggregatesFilter<"Offense"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Offense"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Offense"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Offense"> | Date | string
  }

  export type OffenseDefinitionWhereInput = {
    AND?: OffenseDefinitionWhereInput | OffenseDefinitionWhereInput[]
    OR?: OffenseDefinitionWhereInput[]
    NOT?: OffenseDefinitionWhereInput | OffenseDefinitionWhereInput[]
    id?: StringFilter<"OffenseDefinition"> | string
    code?: StringFilter<"OffenseDefinition"> | string
    label?: StringFilter<"OffenseDefinition"> | string
    records?: OffenseListRelationFilter
  }

  export type OffenseDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    label?: SortOrder
    records?: OffenseOrderByRelationAggregateInput
  }

  export type OffenseDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: OffenseDefinitionWhereInput | OffenseDefinitionWhereInput[]
    OR?: OffenseDefinitionWhereInput[]
    NOT?: OffenseDefinitionWhereInput | OffenseDefinitionWhereInput[]
    label?: StringFilter<"OffenseDefinition"> | string
    records?: OffenseListRelationFilter
  }, "id" | "code">

  export type OffenseDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    label?: SortOrder
    _count?: OffenseDefinitionCountOrderByAggregateInput
    _max?: OffenseDefinitionMaxOrderByAggregateInput
    _min?: OffenseDefinitionMinOrderByAggregateInput
  }

  export type OffenseDefinitionScalarWhereWithAggregatesInput = {
    AND?: OffenseDefinitionScalarWhereWithAggregatesInput | OffenseDefinitionScalarWhereWithAggregatesInput[]
    OR?: OffenseDefinitionScalarWhereWithAggregatesInput[]
    NOT?: OffenseDefinitionScalarWhereWithAggregatesInput | OffenseDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OffenseDefinition"> | string
    code?: StringWithAggregatesFilter<"OffenseDefinition"> | string
    label?: StringWithAggregatesFilter<"OffenseDefinition"> | string
  }

  export type BarangayWhereInput = {
    AND?: BarangayWhereInput | BarangayWhereInput[]
    OR?: BarangayWhereInput[]
    NOT?: BarangayWhereInput | BarangayWhereInput[]
    id?: StringFilter<"Barangay"> | string
    name?: StringFilter<"Barangay"> | string
    coordinates?: JsonNullableFilter<"Barangay">
    population?: IntNullableFilter<"Barangay"> | number | null
    area?: FloatNullableFilter<"Barangay"> | number | null
    createdAt?: DateTimeFilter<"Barangay"> | Date | string
    updatedAt?: DateTimeFilter<"Barangay"> | Date | string
  }

  export type BarangayOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    coordinates?: SortOrderInput | SortOrder
    population?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangayWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: BarangayWhereInput | BarangayWhereInput[]
    OR?: BarangayWhereInput[]
    NOT?: BarangayWhereInput | BarangayWhereInput[]
    coordinates?: JsonNullableFilter<"Barangay">
    population?: IntNullableFilter<"Barangay"> | number | null
    area?: FloatNullableFilter<"Barangay"> | number | null
    createdAt?: DateTimeFilter<"Barangay"> | Date | string
    updatedAt?: DateTimeFilter<"Barangay"> | Date | string
  }, "id" | "name">

  export type BarangayOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    coordinates?: SortOrderInput | SortOrder
    population?: SortOrderInput | SortOrder
    area?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BarangayCountOrderByAggregateInput
    _avg?: BarangayAvgOrderByAggregateInput
    _max?: BarangayMaxOrderByAggregateInput
    _min?: BarangayMinOrderByAggregateInput
    _sum?: BarangaySumOrderByAggregateInput
  }

  export type BarangayScalarWhereWithAggregatesInput = {
    AND?: BarangayScalarWhereWithAggregatesInput | BarangayScalarWhereWithAggregatesInput[]
    OR?: BarangayScalarWhereWithAggregatesInput[]
    NOT?: BarangayScalarWhereWithAggregatesInput | BarangayScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Barangay"> | string
    name?: StringWithAggregatesFilter<"Barangay"> | string
    coordinates?: JsonNullableWithAggregatesFilter<"Barangay">
    population?: IntNullableWithAggregatesFilter<"Barangay"> | number | null
    area?: FloatNullableWithAggregatesFilter<"Barangay"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Barangay"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Barangay"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    action?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    user?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    ip?: StringNullableFilter<"AuditLog"> | string | null
    session?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    resource?: StringNullableFilter<"AuditLog"> | string | null
    severity?: StringNullableFilter<"AuditLog"> | string | null
    outcome?: StringNullableFilter<"AuditLog"> | string | null
    fileName?: StringNullableFilter<"AuditLog"> | string | null
    fileSize?: IntNullableFilter<"AuditLog"> | number | null
    recordsImported?: IntNullableFilter<"AuditLog"> | number | null
    errorMessage?: StringNullableFilter<"AuditLog"> | string | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    ip?: SortOrderInput | SortOrder
    session?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    resource?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    recordsImported?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    action?: StringNullableFilter<"AuditLog"> | string | null
    details?: StringNullableFilter<"AuditLog"> | string | null
    user?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    ip?: StringNullableFilter<"AuditLog"> | string | null
    session?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    resource?: StringNullableFilter<"AuditLog"> | string | null
    severity?: StringNullableFilter<"AuditLog"> | string | null
    outcome?: StringNullableFilter<"AuditLog"> | string | null
    fileName?: StringNullableFilter<"AuditLog"> | string | null
    fileSize?: IntNullableFilter<"AuditLog"> | number | null
    recordsImported?: IntNullableFilter<"AuditLog"> | number | null
    errorMessage?: StringNullableFilter<"AuditLog"> | string | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    user?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    ip?: SortOrderInput | SortOrder
    session?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    resource?: SortOrderInput | SortOrder
    severity?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    fileName?: SortOrderInput | SortOrder
    fileSize?: SortOrderInput | SortOrder
    recordsImported?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    user?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    ip?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    session?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    resource?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    severity?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    outcome?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    fileName?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    fileSize?: IntNullableWithAggregatesFilter<"AuditLog"> | number | null
    recordsImported?: IntNullableWithAggregatesFilter<"AuditLog"> | number | null
    errorMessage?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    accountNumber?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    sessionVersion?: IntFilter<"User"> | number
    fullName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    mustChangePassword?: BoolFilter<"User"> | boolean
    defaultLandingPage?: StringFilter<"User"> | string
    autoLogoutTimer?: IntFilter<"User"> | number
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    totpSecretEnc?: StringNullableFilter<"User"> | string | null
    totpEnabledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    totpLastStep?: IntNullableFilter<"User"> | number | null
    mfaFailedAttempts?: IntFilter<"User"> | number
    passwordResetViaEmailAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    deletedBy?: StringNullableFilter<"User"> | string | null
    permissions?: UserPermissionListRelationFilter
    exportSchedules?: ExportScheduleListRelationFilter
    authTokens?: AuthTokenListRelationFilter
    mfaBackupCodes?: MfaBackupCodeListRelationFilter
    trustedDevices?: TrustedDeviceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    email?: SortOrderInput | SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    sessionVersion?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    defaultLandingPage?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    totpSecretEnc?: SortOrderInput | SortOrder
    totpEnabledAt?: SortOrderInput | SortOrder
    totpLastStep?: SortOrderInput | SortOrder
    mfaFailedAttempts?: SortOrder
    passwordResetViaEmailAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    permissions?: UserPermissionOrderByRelationAggregateInput
    exportSchedules?: ExportScheduleOrderByRelationAggregateInput
    authTokens?: AuthTokenOrderByRelationAggregateInput
    mfaBackupCodes?: MfaBackupCodeOrderByRelationAggregateInput
    trustedDevices?: TrustedDeviceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    accountNumber?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    emailVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    sessionVersion?: IntFilter<"User"> | number
    fullName?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    mustChangePassword?: BoolFilter<"User"> | boolean
    defaultLandingPage?: StringFilter<"User"> | string
    autoLogoutTimer?: IntFilter<"User"> | number
    failedLoginAttempts?: IntFilter<"User"> | number
    lockedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    totpSecretEnc?: StringNullableFilter<"User"> | string | null
    totpEnabledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    totpLastStep?: IntNullableFilter<"User"> | number | null
    mfaFailedAttempts?: IntFilter<"User"> | number
    passwordResetViaEmailAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    deletedBy?: StringNullableFilter<"User"> | string | null
    permissions?: UserPermissionListRelationFilter
    exportSchedules?: ExportScheduleListRelationFilter
    authTokens?: AuthTokenListRelationFilter
    mfaBackupCodes?: MfaBackupCodeListRelationFilter
    trustedDevices?: TrustedDeviceListRelationFilter
  }, "id" | "accountNumber" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    email?: SortOrderInput | SortOrder
    emailVerifiedAt?: SortOrderInput | SortOrder
    sessionVersion?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    defaultLandingPage?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    totpSecretEnc?: SortOrderInput | SortOrder
    totpEnabledAt?: SortOrderInput | SortOrder
    totpLastStep?: SortOrderInput | SortOrder
    mfaFailedAttempts?: SortOrder
    passwordResetViaEmailAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    accountNumber?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    sessionVersion?: IntWithAggregatesFilter<"User"> | number
    fullName?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    mustChangePassword?: BoolWithAggregatesFilter<"User"> | boolean
    defaultLandingPage?: StringWithAggregatesFilter<"User"> | string
    autoLogoutTimer?: IntWithAggregatesFilter<"User"> | number
    failedLoginAttempts?: IntWithAggregatesFilter<"User"> | number
    lockedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    totpSecretEnc?: StringNullableWithAggregatesFilter<"User"> | string | null
    totpEnabledAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    totpLastStep?: IntNullableWithAggregatesFilter<"User"> | number | null
    mfaFailedAttempts?: IntWithAggregatesFilter<"User"> | number
    passwordResetViaEmailAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    deletedBy?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type AuthTokenWhereInput = {
    AND?: AuthTokenWhereInput | AuthTokenWhereInput[]
    OR?: AuthTokenWhereInput[]
    NOT?: AuthTokenWhereInput | AuthTokenWhereInput[]
    id?: IntFilter<"AuthToken"> | number
    userId?: IntFilter<"AuthToken"> | number
    purpose?: StringFilter<"AuthToken"> | string
    tokenHash?: StringFilter<"AuthToken"> | string
    expiresAt?: DateTimeFilter<"AuthToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthToken"> | Date | string
    createdById?: IntNullableFilter<"AuthToken"> | number | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuthTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdById?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuthTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    tokenHash?: string
    AND?: AuthTokenWhereInput | AuthTokenWhereInput[]
    OR?: AuthTokenWhereInput[]
    NOT?: AuthTokenWhereInput | AuthTokenWhereInput[]
    userId?: IntFilter<"AuthToken"> | number
    purpose?: StringFilter<"AuthToken"> | string
    expiresAt?: DateTimeFilter<"AuthToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthToken"> | Date | string
    createdById?: IntNullableFilter<"AuthToken"> | number | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "tokenHash">

  export type AuthTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdById?: SortOrderInput | SortOrder
    _count?: AuthTokenCountOrderByAggregateInput
    _avg?: AuthTokenAvgOrderByAggregateInput
    _max?: AuthTokenMaxOrderByAggregateInput
    _min?: AuthTokenMinOrderByAggregateInput
    _sum?: AuthTokenSumOrderByAggregateInput
  }

  export type AuthTokenScalarWhereWithAggregatesInput = {
    AND?: AuthTokenScalarWhereWithAggregatesInput | AuthTokenScalarWhereWithAggregatesInput[]
    OR?: AuthTokenScalarWhereWithAggregatesInput[]
    NOT?: AuthTokenScalarWhereWithAggregatesInput | AuthTokenScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AuthToken"> | number
    userId?: IntWithAggregatesFilter<"AuthToken"> | number
    purpose?: StringWithAggregatesFilter<"AuthToken"> | string
    tokenHash?: StringWithAggregatesFilter<"AuthToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"AuthToken"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthToken"> | Date | string
    createdById?: IntNullableWithAggregatesFilter<"AuthToken"> | number | null
  }

  export type BackupWhereInput = {
    AND?: BackupWhereInput | BackupWhereInput[]
    OR?: BackupWhereInput[]
    NOT?: BackupWhereInput | BackupWhereInput[]
    id?: StringFilter<"Backup"> | string
    kind?: StringFilter<"Backup"> | string
    fileName?: StringFilter<"Backup"> | string
    mimeType?: StringFilter<"Backup"> | string
    sizeBytes?: IntFilter<"Backup"> | number
    content?: BytesFilter<"Backup"> | Bytes
    label?: StringNullableFilter<"Backup"> | string | null
    barangay?: StringNullableFilter<"Backup"> | string | null
    periodLabel?: StringNullableFilter<"Backup"> | string | null
    rowCount?: IntNullableFilter<"Backup"> | number | null
    createdBy?: StringFilter<"Backup"> | string
    createdAt?: DateTimeFilter<"Backup"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Backup"> | Date | string | null
    deletedBy?: StringNullableFilter<"Backup"> | string | null
  }

  export type BackupOrderByWithRelationInput = {
    id?: SortOrder
    kind?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    content?: SortOrder
    label?: SortOrderInput | SortOrder
    barangay?: SortOrderInput | SortOrder
    periodLabel?: SortOrderInput | SortOrder
    rowCount?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
  }

  export type BackupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BackupWhereInput | BackupWhereInput[]
    OR?: BackupWhereInput[]
    NOT?: BackupWhereInput | BackupWhereInput[]
    kind?: StringFilter<"Backup"> | string
    fileName?: StringFilter<"Backup"> | string
    mimeType?: StringFilter<"Backup"> | string
    sizeBytes?: IntFilter<"Backup"> | number
    content?: BytesFilter<"Backup"> | Bytes
    label?: StringNullableFilter<"Backup"> | string | null
    barangay?: StringNullableFilter<"Backup"> | string | null
    periodLabel?: StringNullableFilter<"Backup"> | string | null
    rowCount?: IntNullableFilter<"Backup"> | number | null
    createdBy?: StringFilter<"Backup"> | string
    createdAt?: DateTimeFilter<"Backup"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Backup"> | Date | string | null
    deletedBy?: StringNullableFilter<"Backup"> | string | null
  }, "id">

  export type BackupOrderByWithAggregationInput = {
    id?: SortOrder
    kind?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    content?: SortOrder
    label?: SortOrderInput | SortOrder
    barangay?: SortOrderInput | SortOrder
    periodLabel?: SortOrderInput | SortOrder
    rowCount?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    _count?: BackupCountOrderByAggregateInput
    _avg?: BackupAvgOrderByAggregateInput
    _max?: BackupMaxOrderByAggregateInput
    _min?: BackupMinOrderByAggregateInput
    _sum?: BackupSumOrderByAggregateInput
  }

  export type BackupScalarWhereWithAggregatesInput = {
    AND?: BackupScalarWhereWithAggregatesInput | BackupScalarWhereWithAggregatesInput[]
    OR?: BackupScalarWhereWithAggregatesInput[]
    NOT?: BackupScalarWhereWithAggregatesInput | BackupScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Backup"> | string
    kind?: StringWithAggregatesFilter<"Backup"> | string
    fileName?: StringWithAggregatesFilter<"Backup"> | string
    mimeType?: StringWithAggregatesFilter<"Backup"> | string
    sizeBytes?: IntWithAggregatesFilter<"Backup"> | number
    content?: BytesWithAggregatesFilter<"Backup"> | Bytes
    label?: StringNullableWithAggregatesFilter<"Backup"> | string | null
    barangay?: StringNullableWithAggregatesFilter<"Backup"> | string | null
    periodLabel?: StringNullableWithAggregatesFilter<"Backup"> | string | null
    rowCount?: IntNullableWithAggregatesFilter<"Backup"> | number | null
    createdBy?: StringWithAggregatesFilter<"Backup"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Backup"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Backup"> | Date | string | null
    deletedBy?: StringNullableWithAggregatesFilter<"Backup"> | string | null
  }

  export type ExportScheduleWhereInput = {
    AND?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    OR?: ExportScheduleWhereInput[]
    NOT?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    id?: StringFilter<"ExportSchedule"> | string
    userId?: IntFilter<"ExportSchedule"> | number
    enabled?: BoolFilter<"ExportSchedule"> | boolean
    frequency?: StringFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableFilter<"ExportSchedule"> | string | null
    savedAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastRunAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastAttemptAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastRunError?: StringNullableFilter<"ExportSchedule"> | string | null
    createdAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ExportScheduleOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrderInput | SortOrder
    dayOfMonth?: SortOrderInput | SortOrder
    monthlyOn?: SortOrderInput | SortOrder
    timeOfDay?: SortOrderInput | SortOrder
    savedAt?: SortOrderInput | SortOrder
    lastRunAt?: SortOrderInput | SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    lastRunError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ExportScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    OR?: ExportScheduleWhereInput[]
    NOT?: ExportScheduleWhereInput | ExportScheduleWhereInput[]
    userId?: IntFilter<"ExportSchedule"> | number
    enabled?: BoolFilter<"ExportSchedule"> | boolean
    frequency?: StringFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableFilter<"ExportSchedule"> | string | null
    savedAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastRunAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastAttemptAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastRunError?: StringNullableFilter<"ExportSchedule"> | string | null
    createdAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ExportScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrderInput | SortOrder
    dayOfMonth?: SortOrderInput | SortOrder
    monthlyOn?: SortOrderInput | SortOrder
    timeOfDay?: SortOrderInput | SortOrder
    savedAt?: SortOrderInput | SortOrder
    lastRunAt?: SortOrderInput | SortOrder
    lastAttemptAt?: SortOrderInput | SortOrder
    lastRunError?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExportScheduleCountOrderByAggregateInput
    _avg?: ExportScheduleAvgOrderByAggregateInput
    _max?: ExportScheduleMaxOrderByAggregateInput
    _min?: ExportScheduleMinOrderByAggregateInput
    _sum?: ExportScheduleSumOrderByAggregateInput
  }

  export type ExportScheduleScalarWhereWithAggregatesInput = {
    AND?: ExportScheduleScalarWhereWithAggregatesInput | ExportScheduleScalarWhereWithAggregatesInput[]
    OR?: ExportScheduleScalarWhereWithAggregatesInput[]
    NOT?: ExportScheduleScalarWhereWithAggregatesInput | ExportScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExportSchedule"> | string
    userId?: IntWithAggregatesFilter<"ExportSchedule"> | number
    enabled?: BoolWithAggregatesFilter<"ExportSchedule"> | boolean
    frequency?: StringWithAggregatesFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    savedAt?: DateTimeNullableWithAggregatesFilter<"ExportSchedule"> | Date | string | null
    lastRunAt?: DateTimeNullableWithAggregatesFilter<"ExportSchedule"> | Date | string | null
    lastAttemptAt?: DateTimeNullableWithAggregatesFilter<"ExportSchedule"> | Date | string | null
    lastRunError?: StringNullableWithAggregatesFilter<"ExportSchedule"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExportSchedule"> | Date | string
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: IntFilter<"Permission"> | number
    permissionName?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    users?: UserPermissionListRelationFilter
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrderInput | SortOrder
    users?: UserPermissionOrderByRelationAggregateInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    permissionName?: string
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    description?: StringNullableFilter<"Permission"> | string | null
    users?: UserPermissionListRelationFilter
  }, "id" | "permissionName">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _avg?: PermissionAvgOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
    _sum?: PermissionSumOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Permission"> | number
    permissionName?: StringWithAggregatesFilter<"Permission"> | string
    description?: StringNullableWithAggregatesFilter<"Permission"> | string | null
  }

  export type UserPermissionWhereInput = {
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    userId?: IntFilter<"UserPermission"> | number
    permissionId?: IntFilter<"UserPermission"> | number
    assignedBy?: IntNullableFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeFilter<"UserPermission"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }

  export type UserPermissionOrderByWithRelationInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    permission?: PermissionOrderByWithRelationInput
  }

  export type UserPermissionWhereUniqueInput = Prisma.AtLeast<{
    userId_permissionId?: UserPermissionUserIdPermissionIdCompoundUniqueInput
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    userId?: IntFilter<"UserPermission"> | number
    permissionId?: IntFilter<"UserPermission"> | number
    assignedBy?: IntNullableFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeFilter<"UserPermission"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }, "userId_permissionId">

  export type UserPermissionOrderByWithAggregationInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    _count?: UserPermissionCountOrderByAggregateInput
    _avg?: UserPermissionAvgOrderByAggregateInput
    _max?: UserPermissionMaxOrderByAggregateInput
    _min?: UserPermissionMinOrderByAggregateInput
    _sum?: UserPermissionSumOrderByAggregateInput
  }

  export type UserPermissionScalarWhereWithAggregatesInput = {
    AND?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    OR?: UserPermissionScalarWhereWithAggregatesInput[]
    NOT?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    userId?: IntWithAggregatesFilter<"UserPermission"> | number
    permissionId?: IntWithAggregatesFilter<"UserPermission"> | number
    assignedBy?: IntNullableWithAggregatesFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeWithAggregatesFilter<"UserPermission"> | Date | string
  }

  export type MfaBackupCodeWhereInput = {
    AND?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    OR?: MfaBackupCodeWhereInput[]
    NOT?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    id?: IntFilter<"MfaBackupCode"> | number
    userId?: IntFilter<"MfaBackupCode"> | number
    codeHash?: StringFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaBackupCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MfaBackupCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MfaBackupCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    OR?: MfaBackupCodeWhereInput[]
    NOT?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    userId?: IntFilter<"MfaBackupCode"> | number
    codeHash?: StringFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaBackupCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MfaBackupCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MfaBackupCodeCountOrderByAggregateInput
    _avg?: MfaBackupCodeAvgOrderByAggregateInput
    _max?: MfaBackupCodeMaxOrderByAggregateInput
    _min?: MfaBackupCodeMinOrderByAggregateInput
    _sum?: MfaBackupCodeSumOrderByAggregateInput
  }

  export type MfaBackupCodeScalarWhereWithAggregatesInput = {
    AND?: MfaBackupCodeScalarWhereWithAggregatesInput | MfaBackupCodeScalarWhereWithAggregatesInput[]
    OR?: MfaBackupCodeScalarWhereWithAggregatesInput[]
    NOT?: MfaBackupCodeScalarWhereWithAggregatesInput | MfaBackupCodeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MfaBackupCode"> | number
    userId?: IntWithAggregatesFilter<"MfaBackupCode"> | number
    codeHash?: StringWithAggregatesFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MfaBackupCode"> | Date | string
  }

  export type TrustedDeviceWhereInput = {
    AND?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    OR?: TrustedDeviceWhereInput[]
    NOT?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    id?: IntFilter<"TrustedDevice"> | number
    userId?: IntFilter<"TrustedDevice"> | number
    tokenHash?: StringFilter<"TrustedDevice"> | string
    sessionVersion?: IntFilter<"TrustedDevice"> | number
    label?: StringFilter<"TrustedDevice"> | string
    createdAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TrustedDeviceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    sessionVersion?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TrustedDeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    tokenHash?: string
    AND?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    OR?: TrustedDeviceWhereInput[]
    NOT?: TrustedDeviceWhereInput | TrustedDeviceWhereInput[]
    userId?: IntFilter<"TrustedDevice"> | number
    sessionVersion?: IntFilter<"TrustedDevice"> | number
    label?: StringFilter<"TrustedDevice"> | string
    createdAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "tokenHash">

  export type TrustedDeviceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    sessionVersion?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    _count?: TrustedDeviceCountOrderByAggregateInput
    _avg?: TrustedDeviceAvgOrderByAggregateInput
    _max?: TrustedDeviceMaxOrderByAggregateInput
    _min?: TrustedDeviceMinOrderByAggregateInput
    _sum?: TrustedDeviceSumOrderByAggregateInput
  }

  export type TrustedDeviceScalarWhereWithAggregatesInput = {
    AND?: TrustedDeviceScalarWhereWithAggregatesInput | TrustedDeviceScalarWhereWithAggregatesInput[]
    OR?: TrustedDeviceScalarWhereWithAggregatesInput[]
    NOT?: TrustedDeviceScalarWhereWithAggregatesInput | TrustedDeviceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TrustedDevice"> | number
    userId?: IntWithAggregatesFilter<"TrustedDevice"> | number
    tokenHash?: StringWithAggregatesFilter<"TrustedDevice"> | string
    sessionVersion?: IntWithAggregatesFilter<"TrustedDevice"> | number
    label?: StringWithAggregatesFilter<"TrustedDevice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"TrustedDevice"> | Date | string
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"TrustedDevice"> | Date | string | null
  }

  export type OffenseCreateInput = {
    id?: string
    importKey?: string | null
    crimeType: string
    felonyStage?: string
    sourceFile?: string | null
    sourceSheet?: string | null
    sourceRow?: number | null
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    offenseDefinition: OffenseDefinitionCreateNestedOneWithoutRecordsInput
  }

  export type OffenseUncheckedCreateInput = {
    id?: string
    offenseDefinitionId: string
    importKey?: string | null
    crimeType: string
    felonyStage?: string
    sourceFile?: string | null
    sourceSheet?: string | null
    sourceRow?: number | null
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OffenseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    offenseDefinition?: OffenseDefinitionUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type OffenseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    offenseDefinitionId?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OffenseCreateManyInput = {
    id?: string
    offenseDefinitionId: string
    importKey?: string | null
    crimeType: string
    felonyStage?: string
    sourceFile?: string | null
    sourceSheet?: string | null
    sourceRow?: number | null
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OffenseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OffenseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    offenseDefinitionId?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OffenseDefinitionCreateInput = {
    id?: string
    code: string
    label: string
    records?: OffenseCreateNestedManyWithoutOffenseDefinitionInput
  }

  export type OffenseDefinitionUncheckedCreateInput = {
    id?: string
    code: string
    label: string
    records?: OffenseUncheckedCreateNestedManyWithoutOffenseDefinitionInput
  }

  export type OffenseDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    records?: OffenseUpdateManyWithoutOffenseDefinitionNestedInput
  }

  export type OffenseDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    records?: OffenseUncheckedUpdateManyWithoutOffenseDefinitionNestedInput
  }

  export type OffenseDefinitionCreateManyInput = {
    id?: string
    code: string
    label: string
  }

  export type OffenseDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type OffenseDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type BarangayCreateInput = {
    id?: string
    name: string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: number | null
    area?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BarangayUncheckedCreateInput = {
    id?: string
    name: string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: number | null
    area?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BarangayUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayCreateManyInput = {
    id?: string
    name: string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: number | null
    area?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BarangayUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BarangayUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    coordinates?: NullableJsonNullValueInput | InputJsonValue
    population?: NullableIntFieldUpdateOperationsInput | number | null
    area?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    userAgent?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    userAgent?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogCreateManyInput = {
    id?: string
    action?: string | null
    details?: string | null
    user?: string | null
    createdAt?: Date | string
    ip?: string | null
    session?: string | null
    userAgent?: string | null
    resource?: string | null
    severity?: string | null
    outcome?: string | null
    fileName?: string | null
    fileSize?: number | null
    recordsImported?: number | null
    errorMessage?: string | null
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    user?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    session?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    resource?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: NullableStringFieldUpdateOperationsInput | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: NullableStringFieldUpdateOperationsInput | string | null
    fileSize?: NullableIntFieldUpdateOperationsInput | number | null
    recordsImported?: NullableIntFieldUpdateOperationsInput | number | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateInput = {
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type UserUpdateManyMutationInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuthTokenCreateInput = {
    purpose: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    createdById?: number | null
    user: UserCreateNestedOneWithoutAuthTokensInput
  }

  export type AuthTokenUncheckedCreateInput = {
    id?: number
    userId: number
    purpose: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    createdById?: number | null
  }

  export type AuthTokenUpdateInput = {
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
    user?: UserUpdateOneRequiredWithoutAuthTokensNestedInput
  }

  export type AuthTokenUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AuthTokenCreateManyInput = {
    id?: number
    userId: number
    purpose: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    createdById?: number | null
  }

  export type AuthTokenUpdateManyMutationInput = {
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AuthTokenUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type BackupCreateInput = {
    id?: string
    kind: string
    fileName: string
    mimeType: string
    sizeBytes: number
    content: Bytes
    label?: string | null
    barangay?: string | null
    periodLabel?: string | null
    rowCount?: number | null
    createdBy: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type BackupUncheckedCreateInput = {
    id?: string
    kind: string
    fileName: string
    mimeType: string
    sizeBytes: number
    content: Bytes
    label?: string | null
    barangay?: string | null
    periodLabel?: string | null
    rowCount?: number | null
    createdBy: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type BackupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    content?: BytesFieldUpdateOperationsInput | Bytes
    label?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    periodLabel?: NullableStringFieldUpdateOperationsInput | string | null
    rowCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BackupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    content?: BytesFieldUpdateOperationsInput | Bytes
    label?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    periodLabel?: NullableStringFieldUpdateOperationsInput | string | null
    rowCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BackupCreateManyInput = {
    id?: string
    kind: string
    fileName: string
    mimeType: string
    sizeBytes: number
    content: Bytes
    label?: string | null
    barangay?: string | null
    periodLabel?: string | null
    rowCount?: number | null
    createdBy: string
    createdAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type BackupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    content?: BytesFieldUpdateOperationsInput | Bytes
    label?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    periodLabel?: NullableStringFieldUpdateOperationsInput | string | null
    rowCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BackupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    content?: BytesFieldUpdateOperationsInput | Bytes
    label?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    periodLabel?: NullableStringFieldUpdateOperationsInput | string | null
    rowCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExportScheduleCreateInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    savedAt?: Date | string | null
    lastRunAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    lastRunError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutExportSchedulesInput
  }

  export type ExportScheduleUncheckedCreateInput = {
    id?: string
    userId: number
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    savedAt?: Date | string | null
    lastRunAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    lastRunError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutExportSchedulesNestedInput
  }

  export type ExportScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleCreateManyInput = {
    id?: string
    userId: number
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    savedAt?: Date | string | null
    lastRunAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    lastRunError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionCreateInput = {
    permissionName: string
    description?: string | null
    users?: UserPermissionCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: number
    permissionName: string
    description?: string | null
    users?: UserPermissionUncheckedCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUpdateInput = {
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserPermissionUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    users?: UserPermissionUncheckedUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionCreateManyInput = {
    id?: number
    permissionName: string
    description?: string | null
  }

  export type PermissionUpdateManyMutationInput = {
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserPermissionCreateInput = {
    assignedBy?: number | null
    assignedAt?: Date | string
    user: UserCreateNestedOneWithoutPermissionsInput
    permission: PermissionCreateNestedOneWithoutUsersInput
  }

  export type UserPermissionUncheckedCreateInput = {
    userId: number
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionUpdateInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPermissionsNestedInput
    permission?: PermissionUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserPermissionUncheckedUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateManyInput = {
    userId: number
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionUpdateManyMutationInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyInput = {
    userId?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeCreateInput = {
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMfaBackupCodesInput
  }

  export type MfaBackupCodeUncheckedCreateInput = {
    id?: number
    userId: number
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeUpdateInput = {
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMfaBackupCodesNestedInput
  }

  export type MfaBackupCodeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeCreateManyInput = {
    id?: number
    userId: number
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeUpdateManyMutationInput = {
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceCreateInput = {
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt?: Date | string
    expiresAt: Date | string
    lastUsedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTrustedDevicesInput
  }

  export type TrustedDeviceUncheckedCreateInput = {
    id?: number
    userId: number
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt?: Date | string
    expiresAt: Date | string
    lastUsedAt?: Date | string | null
  }

  export type TrustedDeviceUpdateInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTrustedDevicesNestedInput
  }

  export type TrustedDeviceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrustedDeviceCreateManyInput = {
    id?: number
    userId: number
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt?: Date | string
    expiresAt: Date | string
    lastUsedAt?: Date | string | null
  }

  export type TrustedDeviceUpdateManyMutationInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrustedDeviceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type OffenseDefinitionScalarRelationFilter = {
    is?: OffenseDefinitionWhereInput
    isNot?: OffenseDefinitionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OffenseCountOrderByAggregateInput = {
    id?: SortOrder
    offenseDefinitionId?: SortOrder
    importKey?: SortOrder
    crimeType?: SortOrder
    felonyStage?: SortOrder
    sourceFile?: SortOrder
    sourceSheet?: SortOrder
    sourceRow?: SortOrder
    blotterNo?: SortOrder
    dateEncoded?: SortOrder
    pro?: SortOrder
    ppo?: SortOrder
    stn?: SortOrder
    pcp?: SortOrder
    region?: SortOrder
    province?: SortOrder
    municipal?: SortOrder
    barangay?: SortOrder
    street?: SortOrder
    typeOfPlace?: SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrder
    stageOfFelony?: SortOrder
    offense?: SortOrder
    offenseType?: SortOrder
    section?: SortOrder
    modus?: SortOrder
    suspectMotive?: SortOrder
    suspectSubMotive?: SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrder
    mrs?: SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrder
    suspectEGOClass?: SortOrder
    suspectCount?: SortOrder
    suspectArrested?: SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrder
    victimEGOClass?: SortOrder
    victimCount?: SortOrder
    caseStatus?: SortOrder
    investigator?: SortOrder
    headInves?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OffenseAvgOrderByAggregateInput = {
    sourceRow?: SortOrder
    suspectCount?: SortOrder
    victimCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type OffenseMaxOrderByAggregateInput = {
    id?: SortOrder
    offenseDefinitionId?: SortOrder
    importKey?: SortOrder
    crimeType?: SortOrder
    felonyStage?: SortOrder
    sourceFile?: SortOrder
    sourceSheet?: SortOrder
    sourceRow?: SortOrder
    blotterNo?: SortOrder
    dateEncoded?: SortOrder
    pro?: SortOrder
    ppo?: SortOrder
    stn?: SortOrder
    pcp?: SortOrder
    region?: SortOrder
    province?: SortOrder
    municipal?: SortOrder
    barangay?: SortOrder
    street?: SortOrder
    typeOfPlace?: SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrder
    stageOfFelony?: SortOrder
    offense?: SortOrder
    offenseType?: SortOrder
    section?: SortOrder
    modus?: SortOrder
    suspectMotive?: SortOrder
    suspectSubMotive?: SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrder
    mrs?: SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrder
    suspectEGOClass?: SortOrder
    suspectCount?: SortOrder
    suspectArrested?: SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrder
    victimEGOClass?: SortOrder
    victimCount?: SortOrder
    caseStatus?: SortOrder
    investigator?: SortOrder
    headInves?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OffenseMinOrderByAggregateInput = {
    id?: SortOrder
    offenseDefinitionId?: SortOrder
    importKey?: SortOrder
    crimeType?: SortOrder
    felonyStage?: SortOrder
    sourceFile?: SortOrder
    sourceSheet?: SortOrder
    sourceRow?: SortOrder
    blotterNo?: SortOrder
    dateEncoded?: SortOrder
    pro?: SortOrder
    ppo?: SortOrder
    stn?: SortOrder
    pcp?: SortOrder
    region?: SortOrder
    province?: SortOrder
    municipal?: SortOrder
    barangay?: SortOrder
    street?: SortOrder
    typeOfPlace?: SortOrder
    dateReported?: SortOrder
    timeReported?: SortOrder
    dateCommitted?: SortOrder
    timeCommitted?: SortOrder
    isCrime?: SortOrder
    modeReporting?: SortOrder
    stageOfFelony?: SortOrder
    offense?: SortOrder
    offenseType?: SortOrder
    section?: SortOrder
    modus?: SortOrder
    suspectMotive?: SortOrder
    suspectSubMotive?: SortOrder
    heinous?: SortOrder
    sensational?: SortOrder
    threatGrp?: SortOrder
    grpAffiliation?: SortOrder
    mrs?: SortOrder
    suspectIsEGO?: SortOrder
    suspectEGOPosition?: SortOrder
    suspectEGOClass?: SortOrder
    suspectCount?: SortOrder
    suspectArrested?: SortOrder
    victimIsEGO?: SortOrder
    victimEGOPosition?: SortOrder
    victimEGOClass?: SortOrder
    victimCount?: SortOrder
    caseStatus?: SortOrder
    investigator?: SortOrder
    headInves?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OffenseSumOrderByAggregateInput = {
    sourceRow?: SortOrder
    suspectCount?: SortOrder
    victimCount?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type OffenseListRelationFilter = {
    every?: OffenseWhereInput
    some?: OffenseWhereInput
    none?: OffenseWhereInput
  }

  export type OffenseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OffenseDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    label?: SortOrder
  }

  export type OffenseDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    label?: SortOrder
  }

  export type OffenseDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    label?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BarangayCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    coordinates?: SortOrder
    population?: SortOrder
    area?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangayAvgOrderByAggregateInput = {
    population?: SortOrder
    area?: SortOrder
  }

  export type BarangayMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    population?: SortOrder
    area?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangayMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    population?: SortOrder
    area?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BarangaySumOrderByAggregateInput = {
    population?: SortOrder
    area?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    user?: SortOrder
    createdAt?: SortOrder
    ip?: SortOrder
    session?: SortOrder
    userAgent?: SortOrder
    resource?: SortOrder
    severity?: SortOrder
    outcome?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    errorMessage?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    recordsImported?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    user?: SortOrder
    createdAt?: SortOrder
    ip?: SortOrder
    session?: SortOrder
    userAgent?: SortOrder
    resource?: SortOrder
    severity?: SortOrder
    outcome?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    errorMessage?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    details?: SortOrder
    user?: SortOrder
    createdAt?: SortOrder
    ip?: SortOrder
    session?: SortOrder
    userAgent?: SortOrder
    resource?: SortOrder
    severity?: SortOrder
    outcome?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    recordsImported?: SortOrder
    errorMessage?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    fileSize?: SortOrder
    recordsImported?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserPermissionListRelationFilter = {
    every?: UserPermissionWhereInput
    some?: UserPermissionWhereInput
    none?: UserPermissionWhereInput
  }

  export type ExportScheduleListRelationFilter = {
    every?: ExportScheduleWhereInput
    some?: ExportScheduleWhereInput
    none?: ExportScheduleWhereInput
  }

  export type AuthTokenListRelationFilter = {
    every?: AuthTokenWhereInput
    some?: AuthTokenWhereInput
    none?: AuthTokenWhereInput
  }

  export type MfaBackupCodeListRelationFilter = {
    every?: MfaBackupCodeWhereInput
    some?: MfaBackupCodeWhereInput
    none?: MfaBackupCodeWhereInput
  }

  export type TrustedDeviceListRelationFilter = {
    every?: TrustedDeviceWhereInput
    some?: TrustedDeviceWhereInput
    none?: TrustedDeviceWhereInput
  }

  export type UserPermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExportScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MfaBackupCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrustedDeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    email?: SortOrder
    emailVerifiedAt?: SortOrder
    sessionVersion?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    defaultLandingPage?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedAt?: SortOrder
    totpSecretEnc?: SortOrder
    totpEnabledAt?: SortOrder
    totpLastStep?: SortOrder
    mfaFailedAttempts?: SortOrder
    passwordResetViaEmailAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    sessionVersion?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    totpLastStep?: SortOrder
    mfaFailedAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    email?: SortOrder
    emailVerifiedAt?: SortOrder
    sessionVersion?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    defaultLandingPage?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedAt?: SortOrder
    totpSecretEnc?: SortOrder
    totpEnabledAt?: SortOrder
    totpLastStep?: SortOrder
    mfaFailedAttempts?: SortOrder
    passwordResetViaEmailAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    accountNumber?: SortOrder
    email?: SortOrder
    emailVerifiedAt?: SortOrder
    sessionVersion?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    mustChangePassword?: SortOrder
    defaultLandingPage?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedAt?: SortOrder
    totpSecretEnc?: SortOrder
    totpEnabledAt?: SortOrder
    totpLastStep?: SortOrder
    mfaFailedAttempts?: SortOrder
    passwordResetViaEmailAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    sessionVersion?: SortOrder
    autoLogoutTimer?: SortOrder
    failedLoginAttempts?: SortOrder
    totpLastStep?: SortOrder
    mfaFailedAttempts?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AuthTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
  }

  export type AuthTokenAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdById?: SortOrder
  }

  export type AuthTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
  }

  export type AuthTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
    createdById?: SortOrder
  }

  export type AuthTokenSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdById?: SortOrder
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type BackupCountOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    content?: SortOrder
    label?: SortOrder
    barangay?: SortOrder
    periodLabel?: SortOrder
    rowCount?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type BackupAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
    rowCount?: SortOrder
  }

  export type BackupMaxOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    content?: SortOrder
    label?: SortOrder
    barangay?: SortOrder
    periodLabel?: SortOrder
    rowCount?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type BackupMinOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    fileName?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    content?: SortOrder
    label?: SortOrder
    barangay?: SortOrder
    periodLabel?: SortOrder
    rowCount?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type BackupSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
    rowCount?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type ExportScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrder
    dayOfMonth?: SortOrder
    monthlyOn?: SortOrder
    timeOfDay?: SortOrder
    savedAt?: SortOrder
    lastRunAt?: SortOrder
    lastAttemptAt?: SortOrder
    lastRunError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExportScheduleAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ExportScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrder
    dayOfMonth?: SortOrder
    monthlyOn?: SortOrder
    timeOfDay?: SortOrder
    savedAt?: SortOrder
    lastRunAt?: SortOrder
    lastAttemptAt?: SortOrder
    lastRunError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExportScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    enabled?: SortOrder
    frequency?: SortOrder
    dayOfWeek?: SortOrder
    dayOfMonth?: SortOrder
    monthlyOn?: SortOrder
    timeOfDay?: SortOrder
    savedAt?: SortOrder
    lastRunAt?: SortOrder
    lastAttemptAt?: SortOrder
    lastRunError?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExportScheduleSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrder
  }

  export type PermissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    permissionName?: SortOrder
    description?: SortOrder
  }

  export type PermissionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionScalarRelationFilter = {
    is?: PermissionWhereInput
    isNot?: PermissionWhereInput
  }

  export type UserPermissionUserIdPermissionIdCompoundUniqueInput = {
    userId: number
    permissionId: number
  }

  export type UserPermissionCountOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserPermissionAvgOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
  }

  export type UserPermissionMaxOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserPermissionMinOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
    assignedAt?: SortOrder
  }

  export type UserPermissionSumOrderByAggregateInput = {
    userId?: SortOrder
    permissionId?: SortOrder
    assignedBy?: SortOrder
  }

  export type MfaBackupCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaBackupCodeAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type MfaBackupCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaBackupCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaBackupCodeSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type TrustedDeviceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    sessionVersion?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type TrustedDeviceAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionVersion?: SortOrder
  }

  export type TrustedDeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    sessionVersion?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type TrustedDeviceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    sessionVersion?: SortOrder
    label?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type TrustedDeviceSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionVersion?: SortOrder
  }

  export type OffenseDefinitionCreateNestedOneWithoutRecordsInput = {
    create?: XOR<OffenseDefinitionCreateWithoutRecordsInput, OffenseDefinitionUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: OffenseDefinitionCreateOrConnectWithoutRecordsInput
    connect?: OffenseDefinitionWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OffenseDefinitionUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<OffenseDefinitionCreateWithoutRecordsInput, OffenseDefinitionUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: OffenseDefinitionCreateOrConnectWithoutRecordsInput
    upsert?: OffenseDefinitionUpsertWithoutRecordsInput
    connect?: OffenseDefinitionWhereUniqueInput
    update?: XOR<XOR<OffenseDefinitionUpdateToOneWithWhereWithoutRecordsInput, OffenseDefinitionUpdateWithoutRecordsInput>, OffenseDefinitionUncheckedUpdateWithoutRecordsInput>
  }

  export type OffenseCreateNestedManyWithoutOffenseDefinitionInput = {
    create?: XOR<OffenseCreateWithoutOffenseDefinitionInput, OffenseUncheckedCreateWithoutOffenseDefinitionInput> | OffenseCreateWithoutOffenseDefinitionInput[] | OffenseUncheckedCreateWithoutOffenseDefinitionInput[]
    connectOrCreate?: OffenseCreateOrConnectWithoutOffenseDefinitionInput | OffenseCreateOrConnectWithoutOffenseDefinitionInput[]
    createMany?: OffenseCreateManyOffenseDefinitionInputEnvelope
    connect?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
  }

  export type OffenseUncheckedCreateNestedManyWithoutOffenseDefinitionInput = {
    create?: XOR<OffenseCreateWithoutOffenseDefinitionInput, OffenseUncheckedCreateWithoutOffenseDefinitionInput> | OffenseCreateWithoutOffenseDefinitionInput[] | OffenseUncheckedCreateWithoutOffenseDefinitionInput[]
    connectOrCreate?: OffenseCreateOrConnectWithoutOffenseDefinitionInput | OffenseCreateOrConnectWithoutOffenseDefinitionInput[]
    createMany?: OffenseCreateManyOffenseDefinitionInputEnvelope
    connect?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
  }

  export type OffenseUpdateManyWithoutOffenseDefinitionNestedInput = {
    create?: XOR<OffenseCreateWithoutOffenseDefinitionInput, OffenseUncheckedCreateWithoutOffenseDefinitionInput> | OffenseCreateWithoutOffenseDefinitionInput[] | OffenseUncheckedCreateWithoutOffenseDefinitionInput[]
    connectOrCreate?: OffenseCreateOrConnectWithoutOffenseDefinitionInput | OffenseCreateOrConnectWithoutOffenseDefinitionInput[]
    upsert?: OffenseUpsertWithWhereUniqueWithoutOffenseDefinitionInput | OffenseUpsertWithWhereUniqueWithoutOffenseDefinitionInput[]
    createMany?: OffenseCreateManyOffenseDefinitionInputEnvelope
    set?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    disconnect?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    delete?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    connect?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    update?: OffenseUpdateWithWhereUniqueWithoutOffenseDefinitionInput | OffenseUpdateWithWhereUniqueWithoutOffenseDefinitionInput[]
    updateMany?: OffenseUpdateManyWithWhereWithoutOffenseDefinitionInput | OffenseUpdateManyWithWhereWithoutOffenseDefinitionInput[]
    deleteMany?: OffenseScalarWhereInput | OffenseScalarWhereInput[]
  }

  export type OffenseUncheckedUpdateManyWithoutOffenseDefinitionNestedInput = {
    create?: XOR<OffenseCreateWithoutOffenseDefinitionInput, OffenseUncheckedCreateWithoutOffenseDefinitionInput> | OffenseCreateWithoutOffenseDefinitionInput[] | OffenseUncheckedCreateWithoutOffenseDefinitionInput[]
    connectOrCreate?: OffenseCreateOrConnectWithoutOffenseDefinitionInput | OffenseCreateOrConnectWithoutOffenseDefinitionInput[]
    upsert?: OffenseUpsertWithWhereUniqueWithoutOffenseDefinitionInput | OffenseUpsertWithWhereUniqueWithoutOffenseDefinitionInput[]
    createMany?: OffenseCreateManyOffenseDefinitionInputEnvelope
    set?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    disconnect?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    delete?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    connect?: OffenseWhereUniqueInput | OffenseWhereUniqueInput[]
    update?: OffenseUpdateWithWhereUniqueWithoutOffenseDefinitionInput | OffenseUpdateWithWhereUniqueWithoutOffenseDefinitionInput[]
    updateMany?: OffenseUpdateManyWithWhereWithoutOffenseDefinitionInput | OffenseUpdateManyWithWhereWithoutOffenseDefinitionInput[]
    deleteMany?: OffenseScalarWhereInput | OffenseScalarWhereInput[]
  }

  export type UserPermissionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type ExportScheduleCreateNestedManyWithoutUserInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
  }

  export type AuthTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthTokenCreateWithoutUserInput, AuthTokenUncheckedCreateWithoutUserInput> | AuthTokenCreateWithoutUserInput[] | AuthTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutUserInput | AuthTokenCreateOrConnectWithoutUserInput[]
    createMany?: AuthTokenCreateManyUserInputEnvelope
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
  }

  export type MfaBackupCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
  }

  export type TrustedDeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
  }

  export type UserPermissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type ExportScheduleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
  }

  export type AuthTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthTokenCreateWithoutUserInput, AuthTokenUncheckedCreateWithoutUserInput> | AuthTokenCreateWithoutUserInput[] | AuthTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutUserInput | AuthTokenCreateOrConnectWithoutUserInput[]
    createMany?: AuthTokenCreateManyUserInputEnvelope
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
  }

  export type MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
  }

  export type TrustedDeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserPermissionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutUserInput | UserPermissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutUserInput | UserPermissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutUserInput | UserPermissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type ExportScheduleUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    upsert?: ExportScheduleUpsertWithWhereUniqueWithoutUserInput | ExportScheduleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    set?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    disconnect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    delete?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    update?: ExportScheduleUpdateWithWhereUniqueWithoutUserInput | ExportScheduleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExportScheduleUpdateManyWithWhereWithoutUserInput | ExportScheduleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
  }

  export type AuthTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthTokenCreateWithoutUserInput, AuthTokenUncheckedCreateWithoutUserInput> | AuthTokenCreateWithoutUserInput[] | AuthTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutUserInput | AuthTokenCreateOrConnectWithoutUserInput[]
    upsert?: AuthTokenUpsertWithWhereUniqueWithoutUserInput | AuthTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthTokenCreateManyUserInputEnvelope
    set?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    disconnect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    delete?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    update?: AuthTokenUpdateWithWhereUniqueWithoutUserInput | AuthTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthTokenUpdateManyWithWhereWithoutUserInput | AuthTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
  }

  export type MfaBackupCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput | MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    set?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    disconnect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    delete?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    update?: MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput | MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MfaBackupCodeUpdateManyWithWhereWithoutUserInput | MfaBackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
  }

  export type TrustedDeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    upsert?: TrustedDeviceUpsertWithWhereUniqueWithoutUserInput | TrustedDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    set?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    disconnect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    delete?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    update?: TrustedDeviceUpdateWithWhereUniqueWithoutUserInput | TrustedDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TrustedDeviceUpdateManyWithWhereWithoutUserInput | TrustedDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
  }

  export type UserPermissionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput> | UserPermissionCreateWithoutUserInput[] | UserPermissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput | UserPermissionCreateOrConnectWithoutUserInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutUserInput | UserPermissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserPermissionCreateManyUserInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutUserInput | UserPermissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutUserInput | UserPermissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type ExportScheduleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput> | ExportScheduleCreateWithoutUserInput[] | ExportScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ExportScheduleCreateOrConnectWithoutUserInput | ExportScheduleCreateOrConnectWithoutUserInput[]
    upsert?: ExportScheduleUpsertWithWhereUniqueWithoutUserInput | ExportScheduleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ExportScheduleCreateManyUserInputEnvelope
    set?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    disconnect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    delete?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    connect?: ExportScheduleWhereUniqueInput | ExportScheduleWhereUniqueInput[]
    update?: ExportScheduleUpdateWithWhereUniqueWithoutUserInput | ExportScheduleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ExportScheduleUpdateManyWithWhereWithoutUserInput | ExportScheduleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
  }

  export type AuthTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthTokenCreateWithoutUserInput, AuthTokenUncheckedCreateWithoutUserInput> | AuthTokenCreateWithoutUserInput[] | AuthTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutUserInput | AuthTokenCreateOrConnectWithoutUserInput[]
    upsert?: AuthTokenUpsertWithWhereUniqueWithoutUserInput | AuthTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthTokenCreateManyUserInputEnvelope
    set?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    disconnect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    delete?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    update?: AuthTokenUpdateWithWhereUniqueWithoutUserInput | AuthTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthTokenUpdateManyWithWhereWithoutUserInput | AuthTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
  }

  export type MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput | MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    set?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    disconnect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    delete?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    update?: MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput | MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MfaBackupCodeUpdateManyWithWhereWithoutUserInput | MfaBackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
  }

  export type TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput> | TrustedDeviceCreateWithoutUserInput[] | TrustedDeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TrustedDeviceCreateOrConnectWithoutUserInput | TrustedDeviceCreateOrConnectWithoutUserInput[]
    upsert?: TrustedDeviceUpsertWithWhereUniqueWithoutUserInput | TrustedDeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TrustedDeviceCreateManyUserInputEnvelope
    set?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    disconnect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    delete?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    connect?: TrustedDeviceWhereUniqueInput | TrustedDeviceWhereUniqueInput[]
    update?: TrustedDeviceUpdateWithWhereUniqueWithoutUserInput | TrustedDeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TrustedDeviceUpdateManyWithWhereWithoutUserInput | TrustedDeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAuthTokensInput = {
    create?: XOR<UserCreateWithoutAuthTokensInput, UserUncheckedCreateWithoutAuthTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAuthTokensNestedInput = {
    create?: XOR<UserCreateWithoutAuthTokensInput, UserUncheckedCreateWithoutAuthTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuthTokensInput
    upsert?: UserUpsertWithoutAuthTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuthTokensInput, UserUpdateWithoutAuthTokensInput>, UserUncheckedUpdateWithoutAuthTokensInput>
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Bytes
  }

  export type UserCreateNestedOneWithoutExportSchedulesInput = {
    create?: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutExportSchedulesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutExportSchedulesNestedInput = {
    create?: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutExportSchedulesInput
    upsert?: UserUpsertWithoutExportSchedulesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExportSchedulesInput, UserUpdateWithoutExportSchedulesInput>, UserUncheckedUpdateWithoutExportSchedulesInput>
  }

  export type UserPermissionCreateNestedManyWithoutPermissionInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type UserPermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
  }

  export type UserPermissionUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutPermissionInput | UserPermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutPermissionInput | UserPermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutPermissionInput | UserPermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type UserPermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput> | UserPermissionCreateWithoutPermissionInput[] | UserPermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: UserPermissionCreateOrConnectWithoutPermissionInput | UserPermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: UserPermissionUpsertWithWhereUniqueWithoutPermissionInput | UserPermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: UserPermissionCreateManyPermissionInputEnvelope
    set?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    disconnect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    delete?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    connect?: UserPermissionWhereUniqueInput | UserPermissionWhereUniqueInput[]
    update?: UserPermissionUpdateWithWhereUniqueWithoutPermissionInput | UserPermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: UserPermissionUpdateManyWithWhereWithoutPermissionInput | UserPermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPermissionsInput
    connect?: UserWhereUniqueInput
  }

  export type PermissionCreateNestedOneWithoutUsersInput = {
    create?: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutUsersInput
    connect?: PermissionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPermissionsInput
    upsert?: UserUpsertWithoutPermissionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPermissionsInput, UserUpdateWithoutPermissionsInput>, UserUncheckedUpdateWithoutPermissionsInput>
  }

  export type PermissionUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutUsersInput
    upsert?: PermissionUpsertWithoutUsersInput
    connect?: PermissionWhereUniqueInput
    update?: XOR<XOR<PermissionUpdateToOneWithWhereWithoutUsersInput, PermissionUpdateWithoutUsersInput>, PermissionUncheckedUpdateWithoutUsersInput>
  }

  export type UserCreateNestedOneWithoutMfaBackupCodesInput = {
    create?: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMfaBackupCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMfaBackupCodesNestedInput = {
    create?: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMfaBackupCodesInput
    upsert?: UserUpsertWithoutMfaBackupCodesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMfaBackupCodesInput, UserUpdateWithoutMfaBackupCodesInput>, UserUncheckedUpdateWithoutMfaBackupCodesInput>
  }

  export type UserCreateNestedOneWithoutTrustedDevicesInput = {
    create?: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTrustedDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTrustedDevicesNestedInput = {
    create?: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTrustedDevicesInput
    upsert?: UserUpsertWithoutTrustedDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTrustedDevicesInput, UserUpdateWithoutTrustedDevicesInput>, UserUncheckedUpdateWithoutTrustedDevicesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Bytes[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type OffenseDefinitionCreateWithoutRecordsInput = {
    id?: string
    code: string
    label: string
  }

  export type OffenseDefinitionUncheckedCreateWithoutRecordsInput = {
    id?: string
    code: string
    label: string
  }

  export type OffenseDefinitionCreateOrConnectWithoutRecordsInput = {
    where: OffenseDefinitionWhereUniqueInput
    create: XOR<OffenseDefinitionCreateWithoutRecordsInput, OffenseDefinitionUncheckedCreateWithoutRecordsInput>
  }

  export type OffenseDefinitionUpsertWithoutRecordsInput = {
    update: XOR<OffenseDefinitionUpdateWithoutRecordsInput, OffenseDefinitionUncheckedUpdateWithoutRecordsInput>
    create: XOR<OffenseDefinitionCreateWithoutRecordsInput, OffenseDefinitionUncheckedCreateWithoutRecordsInput>
    where?: OffenseDefinitionWhereInput
  }

  export type OffenseDefinitionUpdateToOneWithWhereWithoutRecordsInput = {
    where?: OffenseDefinitionWhereInput
    data: XOR<OffenseDefinitionUpdateWithoutRecordsInput, OffenseDefinitionUncheckedUpdateWithoutRecordsInput>
  }

  export type OffenseDefinitionUpdateWithoutRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type OffenseDefinitionUncheckedUpdateWithoutRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type OffenseCreateWithoutOffenseDefinitionInput = {
    id?: string
    importKey?: string | null
    crimeType: string
    felonyStage?: string
    sourceFile?: string | null
    sourceSheet?: string | null
    sourceRow?: number | null
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OffenseUncheckedCreateWithoutOffenseDefinitionInput = {
    id?: string
    importKey?: string | null
    crimeType: string
    felonyStage?: string
    sourceFile?: string | null
    sourceSheet?: string | null
    sourceRow?: number | null
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OffenseCreateOrConnectWithoutOffenseDefinitionInput = {
    where: OffenseWhereUniqueInput
    create: XOR<OffenseCreateWithoutOffenseDefinitionInput, OffenseUncheckedCreateWithoutOffenseDefinitionInput>
  }

  export type OffenseCreateManyOffenseDefinitionInputEnvelope = {
    data: OffenseCreateManyOffenseDefinitionInput | OffenseCreateManyOffenseDefinitionInput[]
    skipDuplicates?: boolean
  }

  export type OffenseUpsertWithWhereUniqueWithoutOffenseDefinitionInput = {
    where: OffenseWhereUniqueInput
    update: XOR<OffenseUpdateWithoutOffenseDefinitionInput, OffenseUncheckedUpdateWithoutOffenseDefinitionInput>
    create: XOR<OffenseCreateWithoutOffenseDefinitionInput, OffenseUncheckedCreateWithoutOffenseDefinitionInput>
  }

  export type OffenseUpdateWithWhereUniqueWithoutOffenseDefinitionInput = {
    where: OffenseWhereUniqueInput
    data: XOR<OffenseUpdateWithoutOffenseDefinitionInput, OffenseUncheckedUpdateWithoutOffenseDefinitionInput>
  }

  export type OffenseUpdateManyWithWhereWithoutOffenseDefinitionInput = {
    where: OffenseScalarWhereInput
    data: XOR<OffenseUpdateManyMutationInput, OffenseUncheckedUpdateManyWithoutOffenseDefinitionInput>
  }

  export type OffenseScalarWhereInput = {
    AND?: OffenseScalarWhereInput | OffenseScalarWhereInput[]
    OR?: OffenseScalarWhereInput[]
    NOT?: OffenseScalarWhereInput | OffenseScalarWhereInput[]
    id?: StringFilter<"Offense"> | string
    offenseDefinitionId?: StringFilter<"Offense"> | string
    importKey?: StringNullableFilter<"Offense"> | string | null
    crimeType?: StringFilter<"Offense"> | string
    felonyStage?: StringFilter<"Offense"> | string
    sourceFile?: StringNullableFilter<"Offense"> | string | null
    sourceSheet?: StringNullableFilter<"Offense"> | string | null
    sourceRow?: IntNullableFilter<"Offense"> | number | null
    blotterNo?: StringNullableFilter<"Offense"> | string | null
    dateEncoded?: DateTimeNullableFilter<"Offense"> | Date | string | null
    pro?: StringNullableFilter<"Offense"> | string | null
    ppo?: StringNullableFilter<"Offense"> | string | null
    stn?: StringNullableFilter<"Offense"> | string | null
    pcp?: StringNullableFilter<"Offense"> | string | null
    region?: StringNullableFilter<"Offense"> | string | null
    province?: StringNullableFilter<"Offense"> | string | null
    municipal?: StringNullableFilter<"Offense"> | string | null
    barangay?: StringFilter<"Offense"> | string
    street?: StringNullableFilter<"Offense"> | string | null
    typeOfPlace?: StringNullableFilter<"Offense"> | string | null
    dateReported?: DateTimeFilter<"Offense"> | Date | string
    timeReported?: StringFilter<"Offense"> | string
    dateCommitted?: DateTimeFilter<"Offense"> | Date | string
    timeCommitted?: StringFilter<"Offense"> | string
    isCrime?: BoolFilter<"Offense"> | boolean
    modeReporting?: StringNullableFilter<"Offense"> | string | null
    stageOfFelony?: StringNullableFilter<"Offense"> | string | null
    offense?: StringNullableFilter<"Offense"> | string | null
    offenseType?: StringNullableFilter<"Offense"> | string | null
    section?: StringNullableFilter<"Offense"> | string | null
    modus?: StringNullableFilter<"Offense"> | string | null
    suspectMotive?: StringNullableFilter<"Offense"> | string | null
    suspectSubMotive?: StringNullableFilter<"Offense"> | string | null
    heinous?: BoolFilter<"Offense"> | boolean
    sensational?: BoolFilter<"Offense"> | boolean
    threatGrp?: BoolFilter<"Offense"> | boolean
    grpAffiliation?: StringNullableFilter<"Offense"> | string | null
    mrs?: StringNullableFilter<"Offense"> | string | null
    suspectIsEGO?: BoolFilter<"Offense"> | boolean
    suspectEGOPosition?: StringNullableFilter<"Offense"> | string | null
    suspectEGOClass?: StringNullableFilter<"Offense"> | string | null
    suspectCount?: IntNullableFilter<"Offense"> | number | null
    suspectArrested?: BoolNullableFilter<"Offense"> | boolean | null
    victimIsEGO?: BoolFilter<"Offense"> | boolean
    victimEGOPosition?: StringNullableFilter<"Offense"> | string | null
    victimEGOClass?: StringNullableFilter<"Offense"> | string | null
    victimCount?: IntNullableFilter<"Offense"> | number | null
    caseStatus?: StringNullableFilter<"Offense"> | string | null
    investigator?: StringNullableFilter<"Offense"> | string | null
    headInves?: StringNullableFilter<"Offense"> | string | null
    latitude?: FloatNullableFilter<"Offense"> | number | null
    longitude?: FloatNullableFilter<"Offense"> | number | null
    createdAt?: DateTimeFilter<"Offense"> | Date | string
    updatedAt?: DateTimeFilter<"Offense"> | Date | string
  }

  export type UserPermissionCreateWithoutUserInput = {
    assignedBy?: number | null
    assignedAt?: Date | string
    permission: PermissionCreateNestedOneWithoutUsersInput
  }

  export type UserPermissionUncheckedCreateWithoutUserInput = {
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionCreateOrConnectWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    create: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
  }

  export type UserPermissionCreateManyUserInputEnvelope = {
    data: UserPermissionCreateManyUserInput | UserPermissionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ExportScheduleCreateWithoutUserInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    savedAt?: Date | string | null
    lastRunAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    lastRunError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleUncheckedCreateWithoutUserInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    savedAt?: Date | string | null
    lastRunAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    lastRunError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExportScheduleCreateOrConnectWithoutUserInput = {
    where: ExportScheduleWhereUniqueInput
    create: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput>
  }

  export type ExportScheduleCreateManyUserInputEnvelope = {
    data: ExportScheduleCreateManyUserInput | ExportScheduleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AuthTokenCreateWithoutUserInput = {
    purpose: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    createdById?: number | null
  }

  export type AuthTokenUncheckedCreateWithoutUserInput = {
    id?: number
    purpose: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    createdById?: number | null
  }

  export type AuthTokenCreateOrConnectWithoutUserInput = {
    where: AuthTokenWhereUniqueInput
    create: XOR<AuthTokenCreateWithoutUserInput, AuthTokenUncheckedCreateWithoutUserInput>
  }

  export type AuthTokenCreateManyUserInputEnvelope = {
    data: AuthTokenCreateManyUserInput | AuthTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MfaBackupCodeCreateWithoutUserInput = {
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeUncheckedCreateWithoutUserInput = {
    id?: number
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeCreateOrConnectWithoutUserInput = {
    where: MfaBackupCodeWhereUniqueInput
    create: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput>
  }

  export type MfaBackupCodeCreateManyUserInputEnvelope = {
    data: MfaBackupCodeCreateManyUserInput | MfaBackupCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TrustedDeviceCreateWithoutUserInput = {
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt?: Date | string
    expiresAt: Date | string
    lastUsedAt?: Date | string | null
  }

  export type TrustedDeviceUncheckedCreateWithoutUserInput = {
    id?: number
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt?: Date | string
    expiresAt: Date | string
    lastUsedAt?: Date | string | null
  }

  export type TrustedDeviceCreateOrConnectWithoutUserInput = {
    where: TrustedDeviceWhereUniqueInput
    create: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput>
  }

  export type TrustedDeviceCreateManyUserInputEnvelope = {
    data: TrustedDeviceCreateManyUserInput | TrustedDeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPermissionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    update: XOR<UserPermissionUpdateWithoutUserInput, UserPermissionUncheckedUpdateWithoutUserInput>
    create: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
  }

  export type UserPermissionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    data: XOR<UserPermissionUpdateWithoutUserInput, UserPermissionUncheckedUpdateWithoutUserInput>
  }

  export type UserPermissionUpdateManyWithWhereWithoutUserInput = {
    where: UserPermissionScalarWhereInput
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserPermissionScalarWhereInput = {
    AND?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
    OR?: UserPermissionScalarWhereInput[]
    NOT?: UserPermissionScalarWhereInput | UserPermissionScalarWhereInput[]
    userId?: IntFilter<"UserPermission"> | number
    permissionId?: IntFilter<"UserPermission"> | number
    assignedBy?: IntNullableFilter<"UserPermission"> | number | null
    assignedAt?: DateTimeFilter<"UserPermission"> | Date | string
  }

  export type ExportScheduleUpsertWithWhereUniqueWithoutUserInput = {
    where: ExportScheduleWhereUniqueInput
    update: XOR<ExportScheduleUpdateWithoutUserInput, ExportScheduleUncheckedUpdateWithoutUserInput>
    create: XOR<ExportScheduleCreateWithoutUserInput, ExportScheduleUncheckedCreateWithoutUserInput>
  }

  export type ExportScheduleUpdateWithWhereUniqueWithoutUserInput = {
    where: ExportScheduleWhereUniqueInput
    data: XOR<ExportScheduleUpdateWithoutUserInput, ExportScheduleUncheckedUpdateWithoutUserInput>
  }

  export type ExportScheduleUpdateManyWithWhereWithoutUserInput = {
    where: ExportScheduleScalarWhereInput
    data: XOR<ExportScheduleUpdateManyMutationInput, ExportScheduleUncheckedUpdateManyWithoutUserInput>
  }

  export type ExportScheduleScalarWhereInput = {
    AND?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
    OR?: ExportScheduleScalarWhereInput[]
    NOT?: ExportScheduleScalarWhereInput | ExportScheduleScalarWhereInput[]
    id?: StringFilter<"ExportSchedule"> | string
    userId?: IntFilter<"ExportSchedule"> | number
    enabled?: BoolFilter<"ExportSchedule"> | boolean
    frequency?: StringFilter<"ExportSchedule"> | string
    dayOfWeek?: StringNullableFilter<"ExportSchedule"> | string | null
    dayOfMonth?: StringNullableFilter<"ExportSchedule"> | string | null
    monthlyOn?: StringNullableFilter<"ExportSchedule"> | string | null
    timeOfDay?: StringNullableFilter<"ExportSchedule"> | string | null
    savedAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastRunAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastAttemptAt?: DateTimeNullableFilter<"ExportSchedule"> | Date | string | null
    lastRunError?: StringNullableFilter<"ExportSchedule"> | string | null
    createdAt?: DateTimeFilter<"ExportSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"ExportSchedule"> | Date | string
  }

  export type AuthTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthTokenWhereUniqueInput
    update: XOR<AuthTokenUpdateWithoutUserInput, AuthTokenUncheckedUpdateWithoutUserInput>
    create: XOR<AuthTokenCreateWithoutUserInput, AuthTokenUncheckedCreateWithoutUserInput>
  }

  export type AuthTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthTokenWhereUniqueInput
    data: XOR<AuthTokenUpdateWithoutUserInput, AuthTokenUncheckedUpdateWithoutUserInput>
  }

  export type AuthTokenUpdateManyWithWhereWithoutUserInput = {
    where: AuthTokenScalarWhereInput
    data: XOR<AuthTokenUpdateManyMutationInput, AuthTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type AuthTokenScalarWhereInput = {
    AND?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
    OR?: AuthTokenScalarWhereInput[]
    NOT?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
    id?: IntFilter<"AuthToken"> | number
    userId?: IntFilter<"AuthToken"> | number
    purpose?: StringFilter<"AuthToken"> | string
    tokenHash?: StringFilter<"AuthToken"> | string
    expiresAt?: DateTimeFilter<"AuthToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthToken"> | Date | string
    createdById?: IntNullableFilter<"AuthToken"> | number | null
  }

  export type MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: MfaBackupCodeWhereUniqueInput
    update: XOR<MfaBackupCodeUpdateWithoutUserInput, MfaBackupCodeUncheckedUpdateWithoutUserInput>
    create: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput>
  }

  export type MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: MfaBackupCodeWhereUniqueInput
    data: XOR<MfaBackupCodeUpdateWithoutUserInput, MfaBackupCodeUncheckedUpdateWithoutUserInput>
  }

  export type MfaBackupCodeUpdateManyWithWhereWithoutUserInput = {
    where: MfaBackupCodeScalarWhereInput
    data: XOR<MfaBackupCodeUpdateManyMutationInput, MfaBackupCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type MfaBackupCodeScalarWhereInput = {
    AND?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
    OR?: MfaBackupCodeScalarWhereInput[]
    NOT?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
    id?: IntFilter<"MfaBackupCode"> | number
    userId?: IntFilter<"MfaBackupCode"> | number
    codeHash?: StringFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaBackupCode"> | Date | string
  }

  export type TrustedDeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: TrustedDeviceWhereUniqueInput
    update: XOR<TrustedDeviceUpdateWithoutUserInput, TrustedDeviceUncheckedUpdateWithoutUserInput>
    create: XOR<TrustedDeviceCreateWithoutUserInput, TrustedDeviceUncheckedCreateWithoutUserInput>
  }

  export type TrustedDeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: TrustedDeviceWhereUniqueInput
    data: XOR<TrustedDeviceUpdateWithoutUserInput, TrustedDeviceUncheckedUpdateWithoutUserInput>
  }

  export type TrustedDeviceUpdateManyWithWhereWithoutUserInput = {
    where: TrustedDeviceScalarWhereInput
    data: XOR<TrustedDeviceUpdateManyMutationInput, TrustedDeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type TrustedDeviceScalarWhereInput = {
    AND?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
    OR?: TrustedDeviceScalarWhereInput[]
    NOT?: TrustedDeviceScalarWhereInput | TrustedDeviceScalarWhereInput[]
    id?: IntFilter<"TrustedDevice"> | number
    userId?: IntFilter<"TrustedDevice"> | number
    tokenHash?: StringFilter<"TrustedDevice"> | string
    sessionVersion?: IntFilter<"TrustedDevice"> | number
    label?: StringFilter<"TrustedDevice"> | string
    createdAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    expiresAt?: DateTimeFilter<"TrustedDevice"> | Date | string
    lastUsedAt?: DateTimeNullableFilter<"TrustedDevice"> | Date | string | null
  }

  export type UserCreateWithoutAuthTokensInput = {
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuthTokensInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuthTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuthTokensInput, UserUncheckedCreateWithoutAuthTokensInput>
  }

  export type UserUpsertWithoutAuthTokensInput = {
    update: XOR<UserUpdateWithoutAuthTokensInput, UserUncheckedUpdateWithoutAuthTokensInput>
    create: XOR<UserCreateWithoutAuthTokensInput, UserUncheckedCreateWithoutAuthTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuthTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuthTokensInput, UserUncheckedUpdateWithoutAuthTokensInput>
  }

  export type UserUpdateWithoutAuthTokensInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuthTokensInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutExportSchedulesInput = {
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExportSchedulesInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExportSchedulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
  }

  export type UserUpsertWithoutExportSchedulesInput = {
    update: XOR<UserUpdateWithoutExportSchedulesInput, UserUncheckedUpdateWithoutExportSchedulesInput>
    create: XOR<UserCreateWithoutExportSchedulesInput, UserUncheckedCreateWithoutExportSchedulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExportSchedulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExportSchedulesInput, UserUncheckedUpdateWithoutExportSchedulesInput>
  }

  export type UserUpdateWithoutExportSchedulesInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExportSchedulesInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserPermissionCreateWithoutPermissionInput = {
    assignedBy?: number | null
    assignedAt?: Date | string
    user: UserCreateNestedOneWithoutPermissionsInput
  }

  export type UserPermissionUncheckedCreateWithoutPermissionInput = {
    userId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionCreateOrConnectWithoutPermissionInput = {
    where: UserPermissionWhereUniqueInput
    create: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput>
  }

  export type UserPermissionCreateManyPermissionInputEnvelope = {
    data: UserPermissionCreateManyPermissionInput | UserPermissionCreateManyPermissionInput[]
    skipDuplicates?: boolean
  }

  export type UserPermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: UserPermissionWhereUniqueInput
    update: XOR<UserPermissionUpdateWithoutPermissionInput, UserPermissionUncheckedUpdateWithoutPermissionInput>
    create: XOR<UserPermissionCreateWithoutPermissionInput, UserPermissionUncheckedCreateWithoutPermissionInput>
  }

  export type UserPermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: UserPermissionWhereUniqueInput
    data: XOR<UserPermissionUpdateWithoutPermissionInput, UserPermissionUncheckedUpdateWithoutPermissionInput>
  }

  export type UserPermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: UserPermissionScalarWhereInput
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyWithoutPermissionInput>
  }

  export type UserCreateWithoutPermissionsInput = {
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPermissionsInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPermissionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
  }

  export type PermissionCreateWithoutUsersInput = {
    permissionName: string
    description?: string | null
  }

  export type PermissionUncheckedCreateWithoutUsersInput = {
    id?: number
    permissionName: string
    description?: string | null
  }

  export type PermissionCreateOrConnectWithoutUsersInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
  }

  export type UserUpsertWithoutPermissionsInput = {
    update: XOR<UserUpdateWithoutPermissionsInput, UserUncheckedUpdateWithoutPermissionsInput>
    create: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPermissionsInput, UserUncheckedUpdateWithoutPermissionsInput>
  }

  export type UserUpdateWithoutPermissionsInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPermissionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PermissionUpsertWithoutUsersInput = {
    update: XOR<PermissionUpdateWithoutUsersInput, PermissionUncheckedUpdateWithoutUsersInput>
    create: XOR<PermissionCreateWithoutUsersInput, PermissionUncheckedCreateWithoutUsersInput>
    where?: PermissionWhereInput
  }

  export type PermissionUpdateToOneWithWhereWithoutUsersInput = {
    where?: PermissionWhereInput
    data: XOR<PermissionUpdateWithoutUsersInput, PermissionUncheckedUpdateWithoutUsersInput>
  }

  export type PermissionUpdateWithoutUsersInput = {
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionName?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateWithoutMfaBackupCodesInput = {
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMfaBackupCodesInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenUncheckedCreateNestedManyWithoutUserInput
    trustedDevices?: TrustedDeviceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMfaBackupCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
  }

  export type UserUpsertWithoutMfaBackupCodesInput = {
    update: XOR<UserUpdateWithoutMfaBackupCodesInput, UserUncheckedUpdateWithoutMfaBackupCodesInput>
    create: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMfaBackupCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMfaBackupCodesInput, UserUncheckedUpdateWithoutMfaBackupCodesInput>
  }

  export type UserUpdateWithoutMfaBackupCodesInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMfaBackupCodesInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUncheckedUpdateManyWithoutUserNestedInput
    trustedDevices?: TrustedDeviceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutTrustedDevicesInput = {
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTrustedDevicesInput = {
    id?: number
    accountNumber: string
    email?: string | null
    emailVerifiedAt?: Date | string | null
    sessionVersion?: number
    fullName: string
    passwordHash: string
    mustChangePassword?: boolean
    defaultLandingPage?: string
    autoLogoutTimer?: number
    failedLoginAttempts?: number
    lockedAt?: Date | string | null
    totpSecretEnc?: string | null
    totpEnabledAt?: Date | string | null
    totpLastStep?: number | null
    mfaFailedAttempts?: number
    passwordResetViaEmailAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    deletedBy?: string | null
    permissions?: UserPermissionUncheckedCreateNestedManyWithoutUserInput
    exportSchedules?: ExportScheduleUncheckedCreateNestedManyWithoutUserInput
    authTokens?: AuthTokenUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTrustedDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
  }

  export type UserUpsertWithoutTrustedDevicesInput = {
    update: XOR<UserUpdateWithoutTrustedDevicesInput, UserUncheckedUpdateWithoutTrustedDevicesInput>
    create: XOR<UserCreateWithoutTrustedDevicesInput, UserUncheckedCreateWithoutTrustedDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTrustedDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTrustedDevicesInput, UserUncheckedUpdateWithoutTrustedDevicesInput>
  }

  export type UserUpdateWithoutTrustedDevicesInput = {
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTrustedDevicesInput = {
    id?: IntFieldUpdateOperationsInput | number
    accountNumber?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionVersion?: IntFieldUpdateOperationsInput | number
    fullName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    mustChangePassword?: BoolFieldUpdateOperationsInput | boolean
    defaultLandingPage?: StringFieldUpdateOperationsInput | string
    autoLogoutTimer?: IntFieldUpdateOperationsInput | number
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    totpEnabledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totpLastStep?: NullableIntFieldUpdateOperationsInput | number | null
    mfaFailedAttempts?: IntFieldUpdateOperationsInput | number
    passwordResetViaEmailAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: UserPermissionUncheckedUpdateManyWithoutUserNestedInput
    exportSchedules?: ExportScheduleUncheckedUpdateManyWithoutUserNestedInput
    authTokens?: AuthTokenUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OffenseCreateManyOffenseDefinitionInput = {
    id?: string
    importKey?: string | null
    crimeType: string
    felonyStage?: string
    sourceFile?: string | null
    sourceSheet?: string | null
    sourceRow?: number | null
    blotterNo?: string | null
    dateEncoded?: Date | string | null
    pro?: string | null
    ppo?: string | null
    stn?: string | null
    pcp?: string | null
    region?: string | null
    province?: string | null
    municipal?: string | null
    barangay: string
    street?: string | null
    typeOfPlace?: string | null
    dateReported: Date | string
    timeReported: string
    dateCommitted: Date | string
    timeCommitted: string
    isCrime?: boolean
    modeReporting?: string | null
    stageOfFelony?: string | null
    offense?: string | null
    offenseType?: string | null
    section?: string | null
    modus?: string | null
    suspectMotive?: string | null
    suspectSubMotive?: string | null
    heinous?: boolean
    sensational?: boolean
    threatGrp?: boolean
    grpAffiliation?: string | null
    mrs?: string | null
    suspectIsEGO?: boolean
    suspectEGOPosition?: string | null
    suspectEGOClass?: string | null
    suspectCount?: number | null
    suspectArrested?: boolean | null
    victimIsEGO?: boolean
    victimEGOPosition?: string | null
    victimEGOClass?: string | null
    victimCount?: number | null
    caseStatus?: string | null
    investigator?: string | null
    headInves?: string | null
    latitude?: number | null
    longitude?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OffenseUpdateWithoutOffenseDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OffenseUncheckedUpdateWithoutOffenseDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OffenseUncheckedUpdateManyWithoutOffenseDefinitionInput = {
    id?: StringFieldUpdateOperationsInput | string
    importKey?: NullableStringFieldUpdateOperationsInput | string | null
    crimeType?: StringFieldUpdateOperationsInput | string
    felonyStage?: StringFieldUpdateOperationsInput | string
    sourceFile?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSheet?: NullableStringFieldUpdateOperationsInput | string | null
    sourceRow?: NullableIntFieldUpdateOperationsInput | number | null
    blotterNo?: NullableStringFieldUpdateOperationsInput | string | null
    dateEncoded?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pro?: NullableStringFieldUpdateOperationsInput | string | null
    ppo?: NullableStringFieldUpdateOperationsInput | string | null
    stn?: NullableStringFieldUpdateOperationsInput | string | null
    pcp?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    municipal?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: StringFieldUpdateOperationsInput | string
    street?: NullableStringFieldUpdateOperationsInput | string | null
    typeOfPlace?: NullableStringFieldUpdateOperationsInput | string | null
    dateReported?: DateTimeFieldUpdateOperationsInput | Date | string
    timeReported?: StringFieldUpdateOperationsInput | string
    dateCommitted?: DateTimeFieldUpdateOperationsInput | Date | string
    timeCommitted?: StringFieldUpdateOperationsInput | string
    isCrime?: BoolFieldUpdateOperationsInput | boolean
    modeReporting?: NullableStringFieldUpdateOperationsInput | string | null
    stageOfFelony?: NullableStringFieldUpdateOperationsInput | string | null
    offense?: NullableStringFieldUpdateOperationsInput | string | null
    offenseType?: NullableStringFieldUpdateOperationsInput | string | null
    section?: NullableStringFieldUpdateOperationsInput | string | null
    modus?: NullableStringFieldUpdateOperationsInput | string | null
    suspectMotive?: NullableStringFieldUpdateOperationsInput | string | null
    suspectSubMotive?: NullableStringFieldUpdateOperationsInput | string | null
    heinous?: BoolFieldUpdateOperationsInput | boolean
    sensational?: BoolFieldUpdateOperationsInput | boolean
    threatGrp?: BoolFieldUpdateOperationsInput | boolean
    grpAffiliation?: NullableStringFieldUpdateOperationsInput | string | null
    mrs?: NullableStringFieldUpdateOperationsInput | string | null
    suspectIsEGO?: BoolFieldUpdateOperationsInput | boolean
    suspectEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    suspectEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    suspectCount?: NullableIntFieldUpdateOperationsInput | number | null
    suspectArrested?: NullableBoolFieldUpdateOperationsInput | boolean | null
    victimIsEGO?: BoolFieldUpdateOperationsInput | boolean
    victimEGOPosition?: NullableStringFieldUpdateOperationsInput | string | null
    victimEGOClass?: NullableStringFieldUpdateOperationsInput | string | null
    victimCount?: NullableIntFieldUpdateOperationsInput | number | null
    caseStatus?: NullableStringFieldUpdateOperationsInput | string | null
    investigator?: NullableStringFieldUpdateOperationsInput | string | null
    headInves?: NullableStringFieldUpdateOperationsInput | string | null
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateManyUserInput = {
    permissionId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type ExportScheduleCreateManyUserInput = {
    id?: string
    enabled?: boolean
    frequency?: string
    dayOfWeek?: string | null
    dayOfMonth?: string | null
    monthlyOn?: string | null
    timeOfDay?: string | null
    savedAt?: Date | string | null
    lastRunAt?: Date | string | null
    lastAttemptAt?: Date | string | null
    lastRunError?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthTokenCreateManyUserInput = {
    id?: number
    purpose: string
    tokenHash: string
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    createdById?: number | null
  }

  export type MfaBackupCodeCreateManyUserInput = {
    id?: number
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TrustedDeviceCreateManyUserInput = {
    id?: number
    tokenHash: string
    sessionVersion: number
    label: string
    createdAt?: Date | string
    expiresAt: Date | string
    lastUsedAt?: Date | string | null
  }

  export type UserPermissionUpdateWithoutUserInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    permission?: PermissionUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserPermissionUncheckedUpdateWithoutUserInput = {
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyWithoutUserInput = {
    permissionId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExportScheduleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    frequency?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: NullableStringFieldUpdateOperationsInput | string | null
    dayOfMonth?: NullableStringFieldUpdateOperationsInput | string | null
    monthlyOn?: NullableStringFieldUpdateOperationsInput | string | null
    timeOfDay?: NullableStringFieldUpdateOperationsInput | string | null
    savedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastAttemptAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastRunError?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenUpdateWithoutUserInput = {
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AuthTokenUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AuthTokenUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    purpose?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdById?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type MfaBackupCodeUpdateWithoutUserInput = {
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrustedDeviceUpdateWithoutUserInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrustedDeviceUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrustedDeviceUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    sessionVersion?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserPermissionCreateManyPermissionInput = {
    userId: number
    assignedBy?: number | null
    assignedAt?: Date | string
  }

  export type UserPermissionUpdateWithoutPermissionInput = {
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type UserPermissionUncheckedUpdateWithoutPermissionInput = {
    userId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionUncheckedUpdateManyWithoutPermissionInput = {
    userId?: IntFieldUpdateOperationsInput | number
    assignedBy?: NullableIntFieldUpdateOperationsInput | number | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}