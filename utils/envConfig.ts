// export const BASE_URL = "https://www.saucedemo.com";
const Env_URL = {
    dev: "https://www.saucedemo.com",
    qa: "https://www.saucedemo.com",
    stage: "https://www.saucedemo.com",
    prod: "https://www.saucedemo.com"
}
declare const process: { env: Record<string, string | undefined> };
const ENV = process.env.ENV || "prod"
export const BASE_URL = (Env_URL as any)[ENV]

export const USERNAME = "standard_user";
export const PASSWORD = "secret_sauce";