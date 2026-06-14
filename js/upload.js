// ============================================================
// Upload Logic — v2.0 (JWT + Backend API + Rclone Storage)
// Replaces direct Google Drive uploads
// ============================================================

let selectedFiles = [];

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
    const user = await initAuth();
    if (!user) return;

    // Allow only authorized roles
    const allowedRoles = ['super_admin', 'moderator', 'admin_zona'];
    if (!allowedRoles.includes(user.role)) {
        Toast.error('Akses ditolak.');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }

    await loadAllTokos();
    setupDragDrop();
    setupForm();
    loadRecentUploads();
});



// ---- Load Toko List (for dropdown selection) ----
async function loadAllTokos() {
    try {
        const { tokos: toko } = await API.get('/api/toko');
        window._allTokos = toko || [];
    } catch (err) {
        window._allTokos = [];
    }
}



// ---- Drag & Drop Setup ----
function setupDragDrop() {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.add('border-indigo-500', 'bg-indigo-500/5');
        });
    });
    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-indigo-500', 'bg-indigo-500/5');
        });
    });
    dropZone.addEventListener('drop', (e) => {
        addFiles(e.dataTransfer.files);
    });
}

// ---- File Selection ----
function handleFileSelect(input) {
    if (input.files.length > 0) {
        addFiles(input.files);
    }
}

function addFiles(files) {
    const newFiles = Array.from(files).filter(f => {
        if (f.type !== 'application/pdf') {
            Toast.warning(`File "${f.name}" bukan PDF, dilewati.`);
            return false;
        }
        // Check duplicate
        if (selectedFiles.some(sf => sf.file.name === f.name)) {
            Toast.warning(`File "${f.name}" sudah ada dalam antrian.`);
            return false;
        }
        return true;
    }).map(f => {
    }).map(f => {
        return {
            file: f,
            toko: null,
            date: null,
            tipe_ppn: null
        };
    });

    selectedFiles = [...selectedFiles, ...newFiles];
    updateFileUI();
}

// ---- Meta Extraction (REMOVED) ----

function removeFile(index, e) {
    e.stopPropagation();
    selectedFiles.splice(index, 1);
    updateFileUI();
}

function clearFile(e) {
    e.preventDefault();
    selectedFiles = [];
    updateFileUI();
    // Clear detection badge if any
    const badge = document.getElementById('toko-detect-badge');
    if (badge) badge.remove();
}



function updateFileUI() {
    const listDisplay = document.getElementById('file-list-display');
    const fileInfo = document.getElementById('file-info');
    const dropZoneContent = document.getElementById('drop-zone-content');
    const submitBtn = document.getElementById('upload-btn');

    if (!listDisplay || !fileInfo || !dropZoneContent) return;

    if (selectedFiles.length === 0) {
        fileInfo.classList.add('hidden');
        dropZoneContent.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = true;
        return;
    }

    // Show file info, hide drop prompt
    fileInfo.classList.remove('hidden');
    dropZoneContent.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = false;

    listDisplay.innerHTML = selectedFiles.map((item, i) => {
        const tokoOptions = window._allTokos.map(t => `<option value="${t.id}" ${item.toko && item.toko.id === t.id ? 'selected' : ''}>${t.nama}</option>`).join('');

        return `
        <li class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all group/item shadow-sm">
            <div class="flex items-center gap-4 min-w-0 flex-1 w-full">
                <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 group-hover/item:border-red-500/40 transition-colors">
                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div class="flex flex-col truncate flex-1 min-w-0">
                    <p class="text-sm font-bold text-gray-900 truncate mb-2 group-hover/item:text-blue-600 transition-colors">${item.file.name}</p>
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="relative w-full sm:w-auto">
                            <select onchange="setFileToko(${i}, this.value)" class="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 text-[11px] font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-4 focus:ring-blue-100 hover:bg-gray-50 transition-all cursor-pointer appearance-none">
                                <option value="">-- Pilih Toko --</option>
                                ${tokoOptions}
                            </select>
                        </div>
                        <div class="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">${item.date || '<span class="text-red-400">?</span>'}</span>
                        </div>
                        <span class="px-2 py-1 rounded text-[10px] ${item.tipe_ppn === 'PPN' ? 'bg-blue-100 text-blue-700 border border-blue-200' : item.tipe_ppn === 'NON' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'} font-black italic tracking-tighter">
                            ${item.tipe_ppn || 'REGULAR'}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-end w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4">
                <button type="button" onclick="removeFile(${i}, event)" class="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20" title="Hapus dari antrean">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </li>`;
    }).join('');
}

function setFileToko(index, tokoId) {
    if (!tokoId) {
        selectedFiles[index].toko = null;
    } else {
        const toko = window._allTokos.find(t => t.id === tokoId);
        selectedFiles[index].toko = toko;
    }
    updateFileUI();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

// ---- Form Submit (Bulk Upload via Backend API) ----
function setupForm() {
    const form = document.getElementById('upload-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('upload-category')?.value || 'INVOICE';

        if (selectedFiles.length === 0) {
            Toast.warning('Pilih file PDF terlebih dahulu.');
            return;
        }

        // Validate all files have detected toko and date
        const undetectedToko = selectedFiles.filter(f => !f.toko).length;
        const undetectedDate = selectedFiles.filter(f => !f.date).length;

        if (undetectedToko > 0 || undetectedDate > 0) {
            let msg = 'Mohon perbaiki file berikut:\n';
            if (undetectedToko > 0) msg += `- ${undetectedToko} file toko tidak terdeteksi\n`;
            if (undetectedDate > 0) msg += `- ${undetectedDate} file tanggal tidak terdeteksi\n`;
            Toast.error(msg + 'Lengkapi data manual untuk melanjutkan.');
            return;
        }

        const btn = document.getElementById('upload-btn');
        btn.disabled = true;
        btn.innerHTML = `
            <div class="loader-mini">
                <div class="loader-ring"></div>
                <div class="loader-ring"></div>
                <div class="loader-ring"></div>
            </div>
            <span class="ml-2">Mengupload...</span>
        `;

        const progressContainer = document.getElementById('upload-progress-container');
        const progressPct = document.getElementById('upload-progress-pct');
        const progressBar = document.getElementById('upload-progress-bar');

        if (progressContainer) progressContainer.classList.remove('hidden');

        const CONCURRENCY_LIMIT = 5;
        let uploaded = 0;
        const total = selectedFiles.length;

        const uploadTask = async (item) => {
            try {
                // Ambil nilai nominal dari frontend
                const nominalValue = document.getElementById('upload-nominal')?.value;

                const formData = new FormData();
                formData.append('file', item.file);
                formData.append('zona_id', item.toko.zona_id);
                formData.append('toko_id', item.toko.id);
                formData.append('category', category);
                formData.append('tanggal_dokumen', item.date);
                formData.append('tipe_ppn', item.tipe_ppn || '');
                if (nominalValue !== undefined && nominalValue !== '') {
                    formData.append('total_jual', nominalValue);
                }
                formData.append('tanggal_upload', new Date().toISOString().split('T')[0]);

                await API.upload('/api/files/upload', formData);
                uploaded++;

                const pct = Math.round((uploaded / total) * 100);
                if (progressPct) progressPct.textContent = `${pct}%`;
                if (progressBar) progressBar.style.width = pct + '%';
            } catch (err) {
                console.error('Upload error:', err);
                Toast.error(`Gagal upload "${item.file.name}": ${err.message}`);
                throw err; // Allow Promise.all to catch if needed, though we handle individually
            }
        };

        // Process in chunks of 5
        for (let i = 0; i < selectedFiles.length; i += CONCURRENCY_LIMIT) {
            const chunk = selectedFiles.slice(i, i + CONCURRENCY_LIMIT);
            await Promise.all(chunk.map(item => uploadTask(item).catch(err => {
                // Individual error caught, loop continues to next chunk
                console.error(`Chunk error for ${item.file.name}:`, err);
            })));
        }

        Toast.success(`${uploaded}/${total} file berhasil diupload!`);

        // Reset
        selectedFiles = [];
        updateFileUI();
        if (progressContainer) progressContainer.classList.add('hidden');
        btn.disabled = false;
        btn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Semua File
        `;
        loadRecentUploads();
    });
}

// ---- Load Recent Uploads ----
async function loadRecentUploads() {
    const container = document.getElementById('recent-uploads');
    if (!container) return;

    try {
        const { files } = await API.get('/api/files');
        const recent = (files || []).slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Belum ada upload terbaru</p>';
            return;
        }

        container.innerHTML = recent.map((a, i) => `
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all group/recent shadow-sm animate-fade-in" style="animation-delay: ${i * 50}ms">
                <div class="flex items-center gap-4 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/recent:border-emerald-500/40 transition-colors">
                        <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-bold text-gray-900 truncate group-hover/recent:text-emerald-700 transition-colors">${a.nama_file.toUpperCase()}</p>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">${a.zonas?.nama || 'Tanpa Zona'}</span>
                            <span class="text-[10px] text-gray-300">•</span>
                            <span class="text-[10px] font-medium text-gray-500 italic">${new Date(a.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>
                </div>
                <div class="hidden sm:flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold tracking-widest uppercase">Berhasil</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p class="text-sm text-red-400 text-center py-4">Gagal memuat data.</p>';
    }
}
