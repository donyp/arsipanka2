// ============================================================
// Secret Manager Integration — Google Cloud Secret Manager
// ============================================================
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

let secretCache = {};
let secretClient = null;

/**
 * Initialize the Secret Manager client (only if running on Cloud Run)
 */
function initializeClient() {
    const projectId = process.env.GCP_PROJECT_ID;
    if (projectId) {
        try {
            secretClient = new SecretManagerServiceClient();
            console.log('[SecretManager] Client initialized for project:', projectId);
            return true;
        } catch (err) {
            console.warn('[SecretManager] Failed to initialize client:', err.message);
            return false;
        }
    }
    return false;
}

/**
 * Fetch a secret from Google Secret Manager with fallback to environment variables.
 * 
 * @param {string} secretName - The name of the secret (e.g., 'arsip-alist-password')
 * @param {string} fallbackEnvVar - Optional fallback environment variable name
 * @param {string} fallbackValue - Optional hardcoded fallback value (for dev only)
 * @returns {Promise<string>} - The secret value
 */
async function getSecret(secretName, fallbackEnvVar = null, fallbackValue = null) {
    const projectId = process.env.GCP_PROJECT_ID;

    // Return cached value if available
    if (secretCache[secretName]) {
        console.log(`[SecretManager] Using cached value for: ${secretName}`);
        return secretCache[secretName];
    }

    // Try to fetch from Secret Manager if running on Cloud Run
    if (projectId && secretClient) {
        try {
            console.log(`[SecretManager] Fetching ${secretName} from Secret Manager...`);
            const secretPath = `projects/${projectId}/secrets/${secretName}/versions/latest`;
            const [version] = await secretClient.accessSecretVersion({ name: secretPath });
            const secretValue = version.payload.data.toString('utf8');
            
            // Cache it
            secretCache[secretName] = secretValue;
            console.log(`[SecretManager] ✅ Successfully fetched ${secretName} from Secret Manager`);
            
            return secretValue;
        } catch (err) {
            console.warn(`[SecretManager] Failed to fetch ${secretName} from Secret Manager:`, err.message);
            // Fall through to fallback options
        }
    }

    // Try fallback environment variable
    if (fallbackEnvVar && process.env[fallbackEnvVar]) {
        console.log(`[SecretManager] Using fallback environment variable: ${fallbackEnvVar}`);
        const envValue = process.env[fallbackEnvVar];
        secretCache[secretName] = envValue;
        return envValue;
    }

    // Try hardcoded fallback (dev only)
    if (fallbackValue) {
        console.log(`[SecretManager] Using fallback hardcoded value for: ${secretName} (development only)`);
        secretCache[secretName] = fallbackValue;
        return fallbackValue;
    }

    // No secret found
    throw new Error(`Secret not found: ${secretName} (no env var, no fallback value)`);
}

/**
 * Clear secret cache (useful for testing or manual refresh)
 */
function clearCache() {
    secretCache = {};
    console.log('[SecretManager] Cache cleared');
}

module.exports = {
    initializeClient,
    getSecret,
    clearCache,
    secretCache: () => secretCache
};
