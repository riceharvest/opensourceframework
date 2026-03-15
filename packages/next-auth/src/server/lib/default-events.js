/** Event triggered on successful sign in */
export async function signIn (_message) {}

/** Event triggered on sign out */
export async function signOut (_message) {}

/** Event triggered on user creation */
export async function createUser (_message) {}

/** Event triggered when a user object is updated */
export async function updateUser (_message) {}

/** Event triggered when an account is linked to a user */
export async function linkAccount (_message) {}

/** Event triggered when a session is active */
export async function session (_message) {}

/**
 * @TODO Event triggered when something goes wrong in an authentication flow
 * This event may be fired multiple times when an error occurs
 */
export async function error (_message) {}
