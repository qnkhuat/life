export const DATE_FORMAT="DD/MM/YYYY";

// https://stackoverflow.com/a/12019115
export const usernameRegex = /^((?!.*?(fuck|nigga|admin)).)(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+$/;
export const usernameBlacklist = ["admin", "client", "server", "settings", "setting", "account", "accounts", "about"]
