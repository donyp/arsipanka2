// ============================================================
// Rclone Storage Wrapper — Terabox Primary (Direct WebDAV)
// Direct Rclone connection to Terabox (no Alist middleware needed)
// ============================================================
const { execFile, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getSecret } = require('./secretManager');

// Configuration for direct Rclone WebDAV connection
let rcloneConfig = {
    teraboxUser: process.env.TERABOX_USER || 'terabox_user',
    teraboxPass: process.env.TERABOX_PASS || 'terabox_pass',
    source: 'ENV_VAR_OR_HARDCODED'
};

const createdDirsCache = new Set();

/**
 * Diagnostic logging helper with context information.
 * @param {string} operation - Name of the operation (e.g., 'upload', 'listFiles')
 * @param {object} details - Custom details to include in log
 */
function logOperation(operation, details = {}) {
    const context = {
        operation,
        timestamp: new Date().toISOString(),
        config_source: rcloneConfig.source,
        ...details
    };
    console.log(`[Operation]`, JSON.stringify(context));
}

// Rclone remote names (must match rclone.conf)
const PRIMARY_REMOTE = process.env.RCLONE_PRIMARY_REMOTE || 'terabox_direct';
const BACKUP_REMOTE = process.env.RCLONE_BACKUP_REMOTE || 'storj';
const BASE_PATH = process.env.RCLONE_BASE_PATH || '/arsip';

const isWindows = process.platform === 'win32';
const rclonePath = isWindows ? path.resolve(__dirname, '..', 'rclone.exe') : 'rclone';
const configPath = process.env.RCLONE_CONFIG || path.resolve(__dirname, '..', 'rclone.conf');

/**
 * Execute an rclone command and return a promise.
 */
function rcloneExec(args) {
    return new Promise((resolve, reject) => {
        const finalArgs = ['--config', configPath, ...args];

        execFile(rclonePath, finalArgs, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error('[Rclone Error]', stderr || error.message);
                return reject(new Error(stderr || error.message));
            }
            resolve(stdout.trim());
        });
    });
}

function rcloneSpawn(args) {
    const finalArgs = ['--config', configPath, ...args];
    const logMsg = `[Rclone Spawn] ${rclonePath} ${finalArgs.join(' ')}\n`;
    const logPath = path.join(__dirname, 'debug_rclone_spawn.log');
    try { fs.appendFileSync(logPath, logMsg); } catch (_) { }
    console.log('[Rclone Spawn]', finalArgs.join(' '));
    return spawn(rclonePath, finalArgs);
}

const RcloneStorage = {
    /**
     * Get a file from Terabox via Rclone.
     * Returns stream for use in downloads/previews.
     */
    async getStream(storagePath) {
        logOperation('getStream', { 
            action: 'Getting file stream',
            storagePath: storagePath
        });

        const remotePath = `${PRIMARY_REMOTE}:${storagePath}`;
        return rcloneSpawn(['cat', remotePath]);
    },

    /**
     * Build the storage path synchronously
     */
    buildStoragePath(zonaKode, tokoKode, category, originalName) {
        return `${BASE_PATH}/${zonaKode}/${tokoKode}/${category}/${originalName}`;
    },

    /**
     * Build the full remote path: terabox_direct:/arsip/zona-01/toko-a/PPN/file.pdf
     */
    buildPath(remote, zonaKode, tokoKode, category, fileName) {
        const parts = [remote + ':' + BASE_PATH];
        if (zonaKode) parts.push(zonaKode);
        if (tokoKode) parts.push(tokoKode);
        if (category) parts.push(category);
        if (fileName) parts.push(fileName);
        return parts.join('/');
    },

    /**
     * Upload a file buffer to primary storage (Terabox via direct Rclone) and optional backup (Storj).
     * Keeps retrying infinitely if connection drops.
     */
    async uploadInBackground(fileBuffer, originalName, zonaKode, tokoKode, category) {
        const storagePath = this.buildStoragePath(zonaKode, tokoKode, category, originalName);

        for (let masterAttempt = 1; masterAttempt <= 100; masterAttempt++) {
            try {
                console.log(`[Background Upload] Attempt ${masterAttempt} for ${originalName}...`);
                await this.uploadDirect(fileBuffer, originalName, storagePath);
                console.log(`[Background Upload] SUCCESS for ${originalName} after ${masterAttempt} attempts`);
                return { storagePath, size: fileBuffer.length };
            } catch (e) {
                console.warn(`[Background Upload] Failed attempt ${masterAttempt} for ${originalName}:`, e.message);
                // Wait 15 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 15000));
            }
        }
        console.error(`[Background Upload] GAVE UP on ${originalName} after 100 attempts!`);
    },

    /**
     * The internal upload method using Rclone directly
     */
    async uploadDirect(fileBuffer, originalName, storagePath) {
        try {
            logOperation('uploadDirect', { 
                action: 'Starting upload',
                operation_type: 'upload',
                filename: originalName, 
                storagePath: storagePath 
            });

            // 1. Create Parent Directory using rclone
            const parentFolderPath = storagePath.substring(0, storagePath.lastIndexOf('/'));

            if (!createdDirsCache.has(parentFolderPath)) {
                logOperation('uploadDirect', { 
                    action: 'Creating directory',
                    path: parentFolderPath 
                });
                try {
                    await rcloneExec(['mkdir', `${PRIMARY_REMOTE}:${parentFolderPath}`]);
                    createdDirsCache.add(parentFolderPath);
                } catch (err) {
                    const errMsg = err.message || '';
                    console.warn(`[Upload] rclone mkdir returned an error: ${errMsg}`);
                    if (errMsg.toLowerCase().includes('409') || errMsg.toLowerCase().includes('conflict')) {
                        console.log(`[Upload] Detected 409/Conflict for ${parentFolderPath}, treating as existing directory.`);
                        createdDirsCache.add(parentFolderPath);
                    } else {
                        throw err;
                    }
                }
            }

            // 2. Upload file using rclone rcat (pipe content)
            logOperation('uploadDirect', { 
                action: 'Uploading file via rclone',
                filename: originalName,
                storagePath: storagePath
            });

            const remotePath = `${PRIMARY_REMOTE}:${storagePath}`;
            
            await new Promise((resolve, reject) => {
                const child = spawn(rclonePath, ['--config', configPath, 'rcat', remotePath]);
                let errorOutput = '';
                
                child.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });
                
                child.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Rclone upload failed with code ${code}: ${errorOutput}`));
                    }
                });

                child.on('error', reject);
                child.stdin.write(fileBuffer);
                child.stdin.end();
            });

            logOperation('uploadDirect', { 
                status: '✅ Upload successful',
                filename: originalName,
                storagePath: storagePath 
            });

            // 3. Backup to Storj (fire and forget via rcat)
            const backupDest = `${BACKUP_REMOTE}:${storagePath}`;
            const backupPromise = new Promise((resolve, reject) => {
                const child = spawn(rclonePath, ['--config', configPath, 'rcat', backupDest]);
                child.on('close', (code) => code === 0 ? resolve() : reject(new Error('Backup rcat failed')));
                child.on('error', reject);
                child.stdin.write(fileBuffer);
                child.stdin.end();
            });
            backupPromise
                .then(() => console.log(`[Rclone] Backup to Storj complete.`))
                .catch(err => console.warn(`[Rclone] Backup failed (non-critical):`, err.message));

            return { storagePath, size: fileBuffer.length };
        } catch (err) {
            logOperation('uploadDirect', { 
                status: '❌ Upload failed',
                error: err.message,
                storagePath: storagePath 
            });
            console.error(`[Upload Error]`, err);
            throw err;
        }
    },

    /**
     * Upload a media file (Ads) to primary storage.
     */
    async uploadMedia(fileBuffer, originalName, category) {
        const storagePath = `/ads-media/${category}/${originalName}`;

        try {
            logOperation('uploadMedia', { 
                action: 'Starting media upload',
                operation_type: 'upload-media',
                category: category,
                filename: originalName, 
                storagePath: storagePath 
            });

            // 1. Create Parent Directory
            const parentFolderPath = storagePath.substring(0, storagePath.lastIndexOf('/'));

            if (!createdDirsCache.has(parentFolderPath)) {
                logOperation('uploadMedia', { 
                    action: 'Creating directory',
                    path: parentFolderPath 
                });
                try {
                    await rcloneExec(['mkdir', `${PRIMARY_REMOTE}:${parentFolderPath}`]);
                    createdDirsCache.add(parentFolderPath);
                } catch (err) {
                    const errMsg = err.message || '';
                    console.warn(`[Upload Media] rclone mkdir error: ${errMsg}`);
                    if (errMsg.toLowerCase().includes('409') || errMsg.toLowerCase().includes('conflict')) {
                        console.log(`[Upload Media] Detected 409/Conflict for ${parentFolderPath}, continuing...`);
                        createdDirsCache.add(parentFolderPath);
                    } else {
                        throw err;
                    }
                }
            }

            // 2. Upload file
            logOperation('uploadMedia', { 
                action: 'Uploading file',
                filename: originalName,
                category: category
            });

            const remotePath = `${PRIMARY_REMOTE}:${storagePath}`;
            
            await new Promise((resolve, reject) => {
                const child = spawn(rclonePath, ['--config', configPath, 'rcat', remotePath]);
                let errorOutput = '';
                
                child.stderr.on('data', (data) => {
                    errorOutput += data.toString();
                });
                
                child.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Rclone upload failed with code ${code}: ${errorOutput}`));
                    }
                });

                child.on('error', reject);
                child.stdin.write(fileBuffer);
                child.stdin.end();
            });

            logOperation('uploadMedia', { 
                status: '✅ Media upload successful',
                filename: originalName,
                category: category,
                storagePath: storagePath 
            });

            // 3. Backup (fire and forget)
            const backupDest = `${BACKUP_REMOTE}:${storagePath}`;
            const backupPromise = new Promise((resolve, reject) => {
                const child = spawn(rclonePath, ['--config', configPath, 'rcat', backupDest]);
                child.on('close', (code) => code === 0 ? resolve() : reject(new Error('Backup rcat failed')));
                child.on('error', reject);
                child.stdin.write(fileBuffer);
                child.stdin.end();
            });
            backupPromise.catch(err => console.warn(`[Rclone] Media backup failed:`, err.message));

            return { storagePath, size: fileBuffer.length };
        } catch (err) {
            logOperation('uploadMedia', { 
                status: '❌ Media upload failed',
                error: err.message,
                storagePath: storagePath 
            });
            console.error(`[Upload Media Error]`, err);
            throw err;
        }
    },

    /**
     * Create an empty directory for a media category
     */
    async createMediaFolder(category) {
        const primaryDest = `${PRIMARY_REMOTE}:/ads-media/${category}`;
        await rcloneExec(['mkdir', primaryDest]);
        console.log(`[Rclone] Category folder created: ${primaryDest}`);

        // Backup
        const backupDest = `${BACKUP_REMOTE}:/ads-media/${category}`;
        rcloneExec(['mkdir', backupDest]).catch(() => { });
    },

    /**
     * Download a file from storage to temporary location
     * Uses rclone copyto with better error handling
     */
    async download(storagePath) {
        const tmpDir = path.join(__dirname, 'tmp');
        
        // Ensure tmp directory exists
        if (!fs.existsSync(tmpDir)) {
            try {
                fs.mkdirSync(tmpDir, { recursive: true });
                console.log(`[Download] Created tmp directory: ${tmpDir}`);
            } catch (err) {
                console.error(`[Download] Failed to create tmp directory:`, err);
                throw new Error(`Cannot create tmp directory: ${err.message}`);
            }
        }

        const tempFileName = `download-${Date.now()}-${path.basename(storagePath)}`;
        const tempFilePath = path.join(tmpDir, tempFileName);
        const remotePath = `${PRIMARY_REMOTE}:${storagePath}`;
        
        logOperation('download', { 
            storagePath: storagePath,
            tempPath: tempFilePath,
            tmpDir: tmpDir,
            action: 'Starting download via rclone copyto'
        });

        return new Promise((resolve, reject) => {
            // Use rclone copyto with verbose logging
            const args = [
                '--config', configPath,
                '--verbose',
                '--progress',
                '--timeout=10m',
                '--retries=3',
                'copyto',
                remotePath,
                tempFilePath
            ];
            
            const child = spawn(rclonePath, args);
            let stderr = '';
            let stdout = '';
            
            const timeout = 600000; // 10 minutes
            let timeoutHandle = setTimeout(() => {
                child.kill('SIGTERM');
                fs.unlink(tempFilePath, () => {});
                reject(new Error('Download timeout after 10 minutes'));
            }, timeout);
            
            child.stderr.on('data', (data) => {
                const msg = data.toString();
                stderr += msg;
                console.log('[Rclone stderr]', msg);
            });
            
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            
            child.on('error', (err) => {
                clearTimeout(timeoutHandle);
                fs.unlink(tempFilePath, () => {});
                logOperation('download', { 
                    status: '❌ Download spawn error',
                    error: err.message,
                    storagePath
                });
                reject(err);
            });
            
            child.on('close', (code) => {
                clearTimeout(timeoutHandle);
                
                if (code !== 0) {
                    fs.unlink(tempFilePath, () => {});
                    logOperation('download', { 
                        status: '❌ Download failed',
                        code: code,
                        stderr: stderr.substring(0, 500),
                        storagePath
                    });
                    reject(new Error(`Rclone copyto exited with code ${code}: ${stderr}`));
                    return;
                }
                
                // Verify file exists and has content
                try {
                    if (!fs.existsSync(tempFilePath)) {
                        reject(new Error('Downloaded file does not exist after rclone copyto completed'));
                        return;
                    }
                    
                    const stats = fs.statSync(tempFilePath);
                    if (stats.size === 0) {
                        fs.unlink(tempFilePath, () => {});
                        reject(new Error('Downloaded file is empty (0 bytes)'));
                        return;
                    }
                    
                    logOperation('download', { 
                        status: '✅ Download successful',
                        storagePath,
                        fileSize: stats.size,
                        tempPath: tempFilePath
                    });
                    resolve(tempFilePath);
                } catch (err) {
                    fs.unlink(tempFilePath, () => {});
                    reject(new Error('Failed to verify downloaded file: ' + err.message));
                }
            });
        });
    },

    /**
     * Delete a file from storage via Rclone
     */
    async deleteFile(storagePath) {
        let cleanPath = storagePath.startsWith('/') ? storagePath : '/' + storagePath;

        logOperation('deleteFile', { 
            action: 'Starting file deletion',
            operation_type: 'delete',
            storagePath: storagePath 
        });

        const remotePath = `${PRIMARY_REMOTE}:${cleanPath}`;

        try {
            logOperation('deleteFile', { 
                action: 'Deleting file',
                remotePath: remotePath
            });

            await rcloneExec(['delete', remotePath]);
            
            logOperation('deleteFile', { 
                status: '✅ Delete successful',
                storagePath: storagePath 
            });
            return true;
        } catch (err) {
            logOperation('deleteFile', { 
                status: '❌ Delete failed',
                error: err.message,
                storagePath: storagePath 
            });
            console.error(`[RcloneStorage] Delete failed:`, err);
            throw err;
        }
    },

    /**
     * Check if a file exists on primary storage.
     */
    async checkFileExists(storagePath) {
        try {
            const remotePath = `${PRIMARY_REMOTE}:${storagePath}`;
            await rcloneExec(['ls', remotePath]);
            return true;
        } catch (err) {
            return false;
        }
    },

    /**
     * List all files in a directory via Rclone
     */
    async listFiles(storagePath) {
        let cleanPath = storagePath.startsWith('/') ? storagePath : '/' + storagePath;

        logOperation('listFiles', { 
            action: 'Listing files',
            operation_type: 'list',
            path: storagePath 
        });

        try {
            const remotePath = `${PRIMARY_REMOTE}:${cleanPath}`;
            const output = await rcloneExec(['lsjson', remotePath]);
            
            let files = [];
            try {
                files = JSON.parse(output);
            } catch (e) {
                console.warn('[Rclone] Could not parse JSON output, returning empty list');
                files = [];
            }

            const fileCount = files ? files.length : 0;
            logOperation('listFiles', { 
                status: '✅ List successful',
                path: storagePath,
                file_count: fileCount 
            });

            return files || [];
        } catch (err) {
            logOperation('listFiles', { 
                status: '❌ List failed',
                error: err.message,
                path: storagePath 
            });
            console.error(`[RcloneStorage] List failed:`, err);
            throw err;
        }
    }
};

/**
 * Initialize Rclone credentials at server startup.
 * This function should be called from server.js during initialization.
 * 
 * @returns {Promise<Object>} - Status object: { success, source, message }
 */
async function initializeRcloneCredentials() {
    console.log('🔐 [RcloneStorage] Initializing storage credentials...');

    try {
        // For direct Rclone WebDAV, credentials are handled by rclone.conf
        // This is a placeholder for future Secret Manager integration if needed
        
        rcloneConfig.source = 'RCLONE_CONF';
        
        logOperation('initializeRcloneCredentials', { 
            status: '✅ Rclone configured via rclone.conf',
            config_source: 'RCLONE_CONF'
        });
        console.log('✅ [RcloneStorage] Rclone configured and ready (Direct WebDAV to Terabox)');

        return {
            success: true,
            source: 'RCLONE_CONF',
            message: 'Rclone Direct WebDAV configured'
        };
    } catch (err) {
        logOperation('initializeRcloneCredentials', { 
            status: '❌ Initialization failed',
            error: err.message
        });
        console.error('❌ [RcloneStorage] Initialization failed:', err.message);

        return {
            success: false,
            source: 'RCLONE_CONF',
            message: `Initialization failed: ${err.message}`
        };
    }
}

module.exports = RcloneStorage;
module.exports.initializeRcloneCredentials = initializeRcloneCredentials;

/**
 * Reset cache for testing purposes
 */
module.exports.__resetCache = function() {
    createdDirsCache.clear();
};
