import dotenv from 'dotenv';
import path from 'path';

const allowedEnvironments = ['qa', 'uat', 'prod'] as const;

type Environment = typeof allowedEnvironments[number];

function getEnvironment(): Environment {
    const environment = process.env.TEST_ENV || 'qa';

    if (!allowedEnvironments.includes(environment as Environment)) {
        throw new Error(
            `Invalid TEST_ENV: "${environment}". ` +
            `Allowed environments are: ${allowedEnvironments.join(', ')}`
        );
    }

    return environment as Environment;
}

const environment = getEnvironment();

const envFilePath = path.resolve(
    process.cwd(),
    `env-files/.env.${environment}`
);

/*
 * Local execution:
 * Loads .env.qa / .env.uat / .env.prod
 *
 * GitHub Actions:
 * GitHub Environment variables/secrets are already
 * available in process.env.
 *
 * override: false ensures externally supplied
 * environment variables are never overwritten.
 */
dotenv.config({
    path: envFilePath,
    override: false
});

interface EnvironmentConfig {
    readonly environment: Environment;
    readonly baseUrl: string;
    readonly username: string;
    readonly password: string;
}

function getRequiredEnvVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable "${name}" ` +
            `for environment "${environment}".`
        );
    }

    return value;
}

export const config: EnvironmentConfig = {
    environment,

    baseUrl: getRequiredEnvVariable('BASE_URL'),

    username: getRequiredEnvVariable('APP_USERNAME'),

    password: getRequiredEnvVariable('APP_PASSWORD')
};
/* 
Why as const? 
With: const allowedEnvironments = ['qa', 'uat', 'prod'] as const;

TypeScript understands:
readonly ['qa', 'uat', 'prod']
which allows us to derive:
type Environment = typeof allowedEnvironments[number];
giving:
type Environment = 'qa' | 'uat' | 'prod';
This is a nice example of TypeScript doing actual framework-level work for us rather than merely annotating variables. 
*/


// import dotenv from 'dotenv';
// import path from 'path';

// const environment = process.env.TEST_ENV || 'qa';

// const envFilePath = path.resolve(
//     process.cwd(),
//     `env-files/.env.${environment}`
// );

// const result = dotenv.config({
//     path: envFilePath
// });

// if (result.error) {
//     throw new Error(
//         `Unable to load environment file: ${envFilePath}`
//     );
// }

// interface EnvironmentConfig {
//     environment: string;
//     baseUrl: string;
//     username: string;
//     password: string;
// }

// function getRequiredEnvVariable(name: string): string {
//     const value = process.env[name];

//     if (!value) {
//         throw new Error(
//             `Missing required environment variable: ${name} for environment: ${environment}`
//         );
//     }

//     return value;
// }

// export const config: EnvironmentConfig = {
//     environment,
//     baseUrl: getRequiredEnvVariable('BASE_URL'),
//     username: getRequiredEnvVariable('APP_USERNAME'),
//     password: getRequiredEnvVariable('APP_PASSWORD')
// };