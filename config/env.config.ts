import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const allowedEnvironments = ['qa', 'uat', 'prod'] as const;

/*
Why as const?

With:
const allowedEnvironments = ['qa', 'uat', 'prod'] as const;

TypeScript understands:
readonly ['qa', 'uat', 'prod']

which allows us to derive:

type Environment = typeof allowedEnvironments[number];

giving:

type Environment = 'qa' | 'uat' | 'prod';
*/

type Environment = typeof allowedEnvironments[number];

/**
 * Determines the environment in which the tests should run.
 */
function getEnvironment(): Environment {

    const environment = process.env.TEST_ENV || 'uat';

    if (!allowedEnvironments.includes(environment as Environment)) {

        throw new Error(
            `Invalid TEST_ENV: "${environment}". ` +
            `Allowed environments are: ${allowedEnvironments.join(', ')}`
        );
    }

    return environment as Environment;
}

const environment = getEnvironment();

/**
 * Local environment file path.
 *
 * Example:
 * env-files/.env.qa
 * env-files/.env.uat
 * env-files/.env.prod
 */
const envFilePath = path.resolve(
    process.cwd(),
    `env-files/.env.${environment}`
);

/**
 * Load local .env file only if it exists.
 *
 * Local execution:
 *   .env.qa / .env.uat / .env.prod
 *   will be loaded.
 *
 * GitHub Actions:
 *   If the .env file does not exist, execution continues
 *   because GitHub Actions already provides configuration
 *   through environment variables and secrets.
 */
if (fs.existsSync(envFilePath)) {

    dotenv.config({
        path: envFilePath
    });

} else {

    console.log(
        `Local environment file not found: ${envFilePath}`
    );

    console.log(
        `Using environment variables provided externally.`
    );
}

interface EnvironmentConfig {

    readonly environment: Environment;

    readonly baseUrl: string;

    readonly username: string;

    readonly password: string;
}

/**
 * Retrieves a required environment variable.
 *
 * The value may come from:
 *
 * 1. Local .env file
 * 2. GitHub Actions environment variables
 * 3. Another CI/CD system
 */
function getRequiredEnvVariable(name: string): string {

    const value = process.env[name];

    if (!value) {

        throw new Error(
            `Missing required environment variable "${name}" ` +
            `for environment "${environment}". ` +
            `Please provide "${name}" through the local `.env` file ` +
            `or the CI/CD environment configuration.`
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