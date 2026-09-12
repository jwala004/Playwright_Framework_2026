import dotenv from 'dotenv';
import path from 'path';

const allowedEnvironments = ['dev', 'uat', 'prod'] as const; 
/* 
Why as const? 
With: const allowedEnvironments = ['dev', 'uat', 'prod'] as const;

TypeScript understands:
readonly ['dev', 'uat', 'prod']
which allows us to derive:
type Environment = typeof allowedEnvironments[number];
giving:
type Environment = 'dev' | 'uat' | 'prod';
This is a nice example of TypeScript doing actual framework-level work for us rather than merely annotating variables. 
*/

type Environment = typeof allowedEnvironments[number];

function getEnvironment(): Environment {
    const environment = process.env.TEST_ENV || 'dev';

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

const result = dotenv.config({
    path: envFilePath
});

if (result.error) {
    throw new Error(
        `Unable to load environment file for environment "${environment}".\n` +
        `Expected file: ${envFilePath}`
    );
}

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
            `for environment "${environment}". ` +
            `Please check env-files/.env.${environment}`
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

// import dotenv from 'dotenv';
// import path from 'path';

// const environment = process.env.TEST_ENV || 'dev';

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