/**
 * AI PDF Renamer Logic - v2.0
 * Ultra-robust metadata extraction for MEGA BAJA invoices.
 */

let PT_MAPPING = [
    // ZONA 1
    { store: "Balaraja", secondary: "YADI SURYADI", pt: "PT. MEGA BAJA" },
    { store: "Bitung", secondary: "HENDIANA, FARID, ADIN", pt: "PT. BITUNG BAJA UTAMA" },
    { store: "Cilegon", secondary: "HAROR, SOLIHIN", pt: "CV. SEMESTA GEMILANG CILEGON" },
    { store: "Cipondoh", secondary: "KUSTIAWATI, TIYA", pt: "PT. INDOTAMA BAJA MAKMUR" },
    { store: "Ciruas", secondary: "WAHYUDIN, ENTIS SUTISNA", pt: "PT. BAJA LAMPUNG BAROKAH" },
    { store: "Kutabumi", secondary: "YOGA PRADITA", pt: "PT. KUTABUMI JAYA LESTARI" },
    { store: "Serang Timur", secondary: "FATUR", pt: "PT. MEGA SERANG WAJATAMA" },
    { store: "Mega Matrial Pasar Kamis", secondary: "HENDIANA, HENDIYANA, HENDI", pt: "PT. BITUNG BAJA UTAMA" },

    // ZONA 2
    { store: "Bintaro", secondary: "SARIP", pt: "CV. MEGA BAJA" },
    { store: "Cengkareng", secondary: "ICHA", pt: "CV. MEGA BAJA" },
    { store: "Ciledug", secondary: "YENI", pt: "PT. MEGA BAJA" },
    { store: "Gading Serpong", secondary: "ABDUL YASIR, HOLIP MUNANDAR", pt: "PT. MEGA BAJA" },
    { store: "Joglo", secondary: "AJIS", pt: "PT. INDOTAMA BAJA MAKMUR" },
    { store: "Karang Tengah", secondary: "ERIS MARWAN, ARIF IRFAN", pt: "CV. KARANG TENGAH MANDALA" },
    { store: "Pinang", secondary: "ALI YADI", pt: "CV. MEGA BAJA" },
    { store: "Sawangan", secondary: "BAYU, RAMDANI, ALPIAN", pt: "PT. MEGA SAWANGAN WAJATAMA" },
    { store: "Sawangan 2", secondary: "EKY, EKI, ARMAN", pt: "PT. DEPOK UNGGUL MANDIRI" },

    // ZONA 3
    { store: "Condet", secondary: "FIKRI", pt: "CV. MEGA BAJA" },
    { store: "Duren Sawit", secondary: "HENGKI HERNIAWAN", pt: "PT. PONDOKGEDE MAKMUR ABADI" },
    { store: "Harapan Indah", secondary: "MUHAMMAD", pt: "PT. PONDOKGEDE MAKMUR ABADI" },
    { store: "Jatiwaringin", secondary: "ACENG", pt: "PT. MEGA BAJA" },
    { store: "Pondok Gede", secondary: "", pt: "PT. PONDOKGEDE MAKMUR ABADI" },
    { store: "Rorotan", secondary: "WAWAN, DEDE", pt: "PT. Rorotan Makmur Sentosa" },
    { store: "Mega Alumunium", secondary: "PANJI, RIDWAN", pt: "PT. FITRAH JAYA STAINLES" },
    { store: "Mega Alumunium Karawang", secondary: "PANJI", pt: "PT. FITRAH JAYA STAINLES" },
    { store: "Mega Alumunium Leuwi Liang", secondary: "PANJI", pt: "PT. LEWILIANG MEKAR JAYA" },
    { store: "Mega Granit", secondary: "ANISA", pt: "PT. MEGA GRUP INDONESIA" },
    { store: "Mega Warna kalimalang", secondary: "EDI", pt: "PT. MEGA WARNA Indonesia" },

    // ZONA 4
    { store: "Bantar Gebang", secondary: "LILIS, ANTO, NEGA, MITA, DENI, DEN", pt: "CV. DUNIA BAJA" },
    { store: "Cibubur", secondary: "ANWAR", pt: "CV. CILEGON STEEL" },
    { store: "Cikeas", secondary: "RUDIYANTO", pt: "PT CIBUBUR RAYA INDOSTEEL (CIKEAS)" },
    { store: "Cimanggis", secondary: "BAHTIAR, YUNUS", pt: "PT. TRIGALUH MAS CIMANGGIS" },
    { store: "Pedurenan", secondary: "RAHMAT", pt: "PT. SETU SUMBER BERKAH" },
    { store: "Setu", secondary: "SUPANDI", pt: "PT CIBUBUR RAYA INDOSTEEL" },
    { store: "Cibubur Raya", secondary: "MENUN, YOGI", pt: "PT CIBUBUR RAYA INDOSTEEL" },

    // ZONA 5
    { store: "Dramaga", secondary: "IRWAN, CHAIRIL ALIF", pt: "CV. MEGA BAJA" },
    { store: "Jasinga", secondary: "HILMAN", pt: "PT. MEGA BAJA BOGOR" },
    { store: "Karadenan", secondary: "AHMAD", pt: "PT. MEGA BAJA BOGOR" },
    { store: "Leuwi Liang", secondary: "ENDIK SUDIKNA", pt: "PT. LEWILIANG MEKAR JAYA" },
    { store: "Rangkas Bitung", secondary: "HUSNAN, ADE WAWAN", pt: "PT. RANGKAS BITUNG MAJU BERSAMA" },
    { store: "Sentul", secondary: "AHMAD NURSIDIK", pt: "CV. GEMILANG BAJA KENCANA" },

    // ZONA 6
    { store: "Cianjur", secondary: "AGIT, WANDI, ARDI", pt: "PT. CIANJUR BAJA MANDIRI" },
    { store: "Ciawi", secondary: "AHMAD MUHAERY", pt: "CV. DUNIA BETON" },
    { store: "Cigombong", secondary: "INDRA MAULANA", pt: "CV. DUNIA BETON" },
    { store: "Cikalong", secondary: "CEPI MAULANA", pt: "PT. TRIPUSAKA PRIMAS CIKALONG" },
    { store: "Ciluer", secondary: "ALFIYANSAH, ALFIYANSYAH", pt: "PT. MEGA BAJA BOGOR" },
    { store: "Cimahi", secondary: "ALWI, AHMAD", pt: "CV. ANUGRAH BAJATAMA" },
    { store: "Cipeuyeum", secondary: "SUHENDAR", pt: "PT. CIANJUR BAJA MANDIRI" },
    { store: "Garut", secondary: "HARIS", pt: "CV. BAINIT UNGGUL" },
    { store: "Majalaya", secondary: "CHANDRA, ELOK MEI", pt: "PT. BANDUNG LAUTAN BAJA" },
    { store: "Rancaekek", secondary: "MAHROM", pt: "CV. NUSA BAJA SENTOSA" },
    { store: "Soreang", secondary: "FIKI MULYANA", pt: "PT. SOREANG SUKSES SEJATI" },
    { store: "Sukabumi", secondary: "JADIN", pt: "PT. SUKABUMI BAJA SANTANA" },
    { store: "Sumedang", secondary: "NABILA", pt: "PT. SUMEDANG GALUH NUSANTARA" },
    { store: "Sukaraja", secondary: "RIFKI ROYANI", pt: "PT. SUKABUMI BAJA SANTANA" },
    { store: "Pelabuhan Ratu", secondary: "WANDI", pt: "PT. SUKABUMI BAJA SANTANA" },

    // ZONA 7
    { store: "Cikampek", secondary: "DENI", pt: "PT CIKAMPEK BAJA MAKMUR" },
    { store: "Cirebon", secondary: "ASEP SOLIKHIN", pt: "CV. MEGA BAJA (KARAWANG)" },
    { store: "Karawang Barat", secondary: "ANDI, ENDANG JUANDA", pt: "CV. MEGA BAJA (KARAWANG)" },
    { store: "Karawang Timur", secondary: "DARUL HIDAYAT", pt: "CV. MEGA BAJA (KARAWANG)" },
    { store: "Kedawung", secondary: "UZEM, FIRMAN", pt: "PT. PALIMANAN BAJA SUKSES" },
    { store: "Kuningan", secondary: "DEDE SUHADA", pt: "CV. KUNINGAN MAKMUR SENTOSA" },
    { store: "Palimanan", secondary: "RIYAN", pt: "PT. PALIMANAN BAJA SUKSES" },
    { store: "Purwakarta", secondary: "RIZKI, ADE NURJAMAN", pt: "PT CIKAMPEK BAJA MAKMUR" },
    { store: "Rengas Dengklok", secondary: "ADE WAWAN", pt: "PT BAJA MAKMUR PEKALONGAN" },
    { store: "Subang", secondary: "RENDI, CANDRA", pt: "PT. SUBANG BAJA GEMILANG" },
    { store: "Majalengka", secondary: "", pt: "PT. SUBANG BAJA GEMILANG" },

    // ZONA 8
    { store: "Brebes", secondary: "", pt: "CV. MEGA BAJA (KARAWANG)" },
    { store: "Kendal", secondary: "", pt: "PT INDAH JAYA KENDAL" },
    { store: "Kudus", secondary: "", pt: "PT BAJA MAKMUR PEKALONGAN" },
    { store: "Pemalang", secondary: "", pt: "PT. MAKMUR JAYA PEMALANG" },
    { store: "Semarang Unggaran", secondary: "", pt: "CV. SEMARANG UNGGUL" },
    { store: "Slawi", secondary: "", pt: "PT SLAWI BUDI UTAMA" },
    { store: "Semarang", secondary: "", pt: "PT MEGA BAJA MAGELANG" },

    // ZONA 9
    { store: "Magelang", secondary: "", pt: "PT. MEGA BAJA MAGELANG" },
    { store: "Solo", secondary: "", pt: "PT. SOLO INTI BAJA" },
    { store: "Yogyakarta", secondary: "", pt: "PT. SINAR AGUNG Yogyakarta" },

    // ZONA 10
    { store: "Jember", secondary: "", pt: "PT. KRAKATAU MEGATAMA Indonesia" },
    { store: "Madiun", secondary: "", pt: "PT. KRAKATAU MEGATAMA Indonesia" },
    { store: "Malang", secondary: "", pt: "PT. KRAKATAU MEGATAMA Indonesia" },
    { store: "Mojokerto", secondary: "", pt: "PT. MOJOKERTO BAJA SAKTI" },
    { store: "Surabaya", secondary: "", pt: "PT. KRAKATAU MEGATAMA Indonesia" },

    // ZONA 11
    { store: "Bandar jaya", secondary: "", pt: "CV. BANDARJAYA CAHAYA LAUTAN" },
    { store: "Kotabumi", secondary: "TENDI", pt: "PT. BAJA LAMPUNG BAROKAH" },
    { store: "Lampung", secondary: "ROBI", pt: "PT. BAJA LAMPUNG BAROKAH" },
    { store: "Palembang", secondary: "BAGUS", pt: "CV. Sejahtera Nusa Internasional" },

    // ZONA 12
    { store: "Banjarnegara", secondary: "", pt: "PT. BANJARNEGARA MEGA UTAMA" },
    { store: "Purwokerto", secondary: "", pt: "PT. PURWOKERTO BAJA UTAMA" },
    { store: "Tasikmalaya", secondary: "DANI KUSMAWAN", pt: "PT. PUSAKA BAJA PRIANGAN" },
    { store: "Singaparna", secondary: "", pt: "PT. PUSAKA BAJA PRIANGAN" },

    // ZONA 13
    { store: "Makassar", secondary: "TRI", pt: "CV. MANDIRI MAKMUR MAKASAR" },

    // ZONA 14
    { store: "Kariangau", secondary: "", pt: "CV. BERKAH BAJA BALIKPAPAN" },
    { store: "Samarinda", secondary: "FAHMI", pt: "CV. BERKAH BAJA BALIKPAPAN" },
    { store: "Sepinggan", secondary: "", pt: "CV. BERKAH BAJA BALIKPAPAN" },

    // ZONA 15
    { store: "Kalimalang", secondary: "ANDI", pt: "CV. Pusat Baja" },

    // ZONA 16
    { store: "Cibitung", secondary: "NANDANG", pt: "CV. DUNIA BAJA" },
    { store: "Deltamas", secondary: "RAHAYU", pt: "CV. Mega Baja Deltamas" },
    { store: "Pulo Gebang", secondary: "YAYAT", pt: "CV. MEGA BAJA" },
    { store: "Sukatani", secondary: "YAYAT", pt: "CV. Mega Baja Deltamas" },

    // ZONA 17
    { store: "Cikarang 1", secondary: "INDRA KURNIAWAN", pt: "CV. CILEGON STEEL" },
    { store: "Sukadami", secondary: "GAN GAN", pt: "CV. CILEGON STEEL" },
    { store: "Cibarusah", secondary: "REZA", pt: "CV. CILEGON STEEL" }
];

const MONTHS_MAP = {
    'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MEI': '05', 'MAY': '05',
    'JUN': '06', 'JUL': '07', 'AGU': '08', 'AUG': '08', 'SEP': '09', 'OKT': '10',
    'OCT': '10', 'NOV': '11', 'DES': '12', 'DEC': '12'
};

let filesToProcess = [];
let isProcessing = false;

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    loadMapping();
    setupDropZone();
});

function loadMapping() {
    const saved = localStorage.getItem('pt_mapping_final');
    if (saved) {
        try {
            PT_MAPPING = JSON.parse(saved);
        } catch (e) { console.warn("Failed to load mapping", e); }
    }
    renderMappingUI();
}

function renderMappingUI() {
    const list = document.getElementById('mapping-list');
    const countBadge = document.getElementById('mapping-count');
    if (!list) return;

    if (countBadge) countBadge.textContent = PT_MAPPING.length;

    list.innerHTML = PT_MAPPING.map(rule => `
        <div class="p-3 rounded-xl bg-white/5 border border-white/5">
            <p class="text-[10px] text-gray-500 mb-1">${rule.pt} ${rule.secondary ? `(${rule.secondary})` : ''}</p>
            <p class="text-xs font-semibold text-indigo-400">${rule.store}</p>
        </div>
    `).join('');
}

// ---- Drop Zone Logic ----
function setupDropZone() {
    const zone = document.getElementById('drop-zone');
    const input = document.getElementById('file-input');

    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => handleFiles(e.target.files));

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('active');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('active'));

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('active');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const newFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if (newFiles.length === 0) return;

    filesToProcess = [...filesToProcess, ...newFiles.map(f => ({
        file: f,
        status: 'pending',
        result: null
    }))];

    document.getElementById('process-card').classList.remove('hidden');
    renderResults();

    if (!isProcessing) processQueue();
}

// ---- Core Processing Logic ----
async function processQueue() {
    const pending = filesToProcess.find(f => f.status === 'pending');
    if (!pending) {
        isProcessing = false;
        checkDownloadAll();
        return;
    }

    isProcessing = true;
    pending.status = 'processing';
    renderResults();

    try {
        const text = await extractTextFromPDF(pending.file);
        const metadata = analyzeText(text, pending.file.name);

        pending.result = metadata;
        pending.status = 'done';

        if (metadata.needsReview) {
            if (typeof Toast !== 'undefined') {
                Toast.warning(`[${pending.file.name}] Perlu Dicek: ${metadata.fallbackCause}`, 6000);
            } else {
                console.warn(`[${pending.file.name}]`, metadata.fallbackCause);
            }
        }
    } catch (err) {
        console.error(err);
        pending.status = 'error';
    }

    renderResults();
    processQueue();
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
    }

    const lowerText = fullText.toLowerCase();
    if (fullText.trim().length < 50 || (!lowerText.includes('yth') && !lowerText.includes('bayar'))) {
        console.log(`[AI] Page text too short, using OCR (Scale 3.0)...`);
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 3.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const { data: { text } } = await Tesseract.recognize(canvas, 'ind+eng', {
            logger: m => console.log(m.status + ": " + Math.round(m.progress * 100) + "%")
        });
        fullText = text;
    }
    return fullText;
}

function analyzeText(text, originalName) {
    try {
        console.log("[AI] Analyzing:", originalName);

        // --- NPWP Immunity ---
        // Catch NPWP even if dots are mangled (e.g. 31.460.440...)
        const npwpFullPat = /\d{2}[.\s]?\d{3}[.\s]?\d{3}[.\s]?\d[.\s-]?\d{3}[.\s]?\d{3}/g;
        let sanitizedText = text.replace(npwpFullPat, ' [NPWP_HIDDEN] ');
        // Hide labeled NPWP too
        sanitizedText = sanitizedText.replace(/(?:NPWP|NWP|NPP)\s*[:;.]?\s*[\d. \t-]+/gi, ' [NPWP_LABELED_HIDDEN] ');

        const cleanText = sanitizedText.replace(/\r/g, '').replace(/[ \t]+/g, ' ');
        const upperText = cleanText.toUpperCase();

        // 1. PPN/NON
        let isPPN = false;
        let isNON = false;
        let ythText = "";
        let recSecText = "";

        const ythMatch = cleanText.match(/[Kk]epad[ae]\s*[Yy]th\s*[:.;]?\s*([^\n]+)/i);
        if (ythMatch) {
            ythText = ythMatch[1].trim().toUpperCase();
            const idx = cleanText.indexOf(ythMatch[0]);
            // Increase scope to 1000 to catch name/address on A4
            recSecText = cleanText.substring(idx, idx + 1000).toUpperCase();
        }

        const invMatch = cleanText.match(/[Ii]nvoice\s*[:;.]?\s*([\d]+)/);
        const invNum = invMatch ? invMatch[1] : "";
        if (invNum.startsWith("8351003110")) isPPN = true;
        else if (invNum.startsWith("8351003100")) isNON = true;

        if (!isPPN && !isNON && ythText) {
            const hasPT = ythText.match(/\b(PT\.?|P[TI1]\.?|CV\.?|[O0C][VF]\.?|C[TY7]\.?)\s/i);
            if (hasPT) {
                if (ythText.includes("GARUDA GEMILANG")) {
                    const otherPT = recSecText.replace(/GARUDA\s*GEMILANG[^\n]*/gi, '').match(/\b(PT\.?|CV\.?)\s*[A-Z]{3,}/i);
                    if (otherPT) isPPN = true;
                    else if (recSecText.includes("MEGA BAJA")) isNON = true;
                } else isPPN = true;
            } else if (ythText.includes("MEGA BAJA")) isNON = true;
        }

        const type = isPPN ? 'PPN' : 'NON';

        // 2. Store
        let store = "UNKNOWN";
        let review = false;
        let cause = "";

        const checkSec = (rule, txt) => {
            if (!rule.secondary) return false;
            const cleanTxt = txt.replace(/[^A-Z0-9]/g, '');
            return rule.secondary.split(',').some(k => {
                const cleanK = k.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (!cleanK) return false;
                return cleanTxt.includes(cleanK) || cleanK.includes(cleanTxt);
            });
        };
        const getPTMatch = (scope) => {
            const cleanScope = scope.replace(/[^A-Z0-9]/g, '');
            return PT_MAPPING.filter(r => {
                const name = r.pt.replace(/\b(PT\.?|P[TI1]\.?|CV\.?|[O0C][VF]\.?|C[TY7]\.?|NV\.?|C[TN1]\.?)\b/gi, '').toUpperCase();
                const tokens = name.split(/\s+/).filter(t => t.length > 2);
                if (tokens.length === 0) return false;

                // If 70% of words or at least 2 significant words match
                const matchedTokens = tokens.filter(t => cleanScope.includes(t.replace(/[^A-Z0-9]/g, '')));
                const ratio = matchedTokens.length / tokens.length;
                return ratio >= 0.7 || (tokens.length > 2 && matchedTokens.length >= 2);
            });
        };

        if (isPPN) {
            const scope = recSecText || ythText || upperText.substring(Math.floor(upperText.length * 0.15));
            let matches = getPTMatch(scope).filter(r => !r.pt.includes("GARUDA GEMILANG"));
            if (matches.length === 0) matches = getPTMatch(upperText).filter(r => !r.pt.includes("GARUDA GEMILANG"));

            // GLOBAL FALLBACK: If still unknown, scan entire document for Store Names directly
            if (matches.length === 0) {
                const cleanFull = upperText.replace(/[^A-Z0-9]/g, '');
                matches = PT_MAPPING.filter(r => {
                    const cleanStore = r.store.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    return cleanStore.length > 3 && cleanFull.includes(cleanStore);
                });
            }

            if (matches.length === 1) {
                const rule = matches[0];
                store = rule.store;
                if (rule.secondary && !checkSec(rule, upperText)) {
                    review = true; cause = `PT OK, tapi '${rule.secondary}' tidak ditemukan.`;
                }
            } else if (matches.length > 1) {
                // Disambiguate
                let exact = matches.filter(r => checkSec(r, upperText));
                if (exact.length === 0) {
                    exact = matches.filter(r => {
                        const cleanStore = r.store.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        return cleanStore && upperText.replace(/[^A-Z0-9]/g, '').includes(cleanStore);
                    });
                }

                if (exact.length === 1) {
                    store = exact[0].store;
                } else {
                    const bpk = cleanText.match(/(?:BPK|IBU|BAPAK|SDR|ATTN|UP|BP|PENERIMA)[.,:\s]+([A-Z\s]{3,20})/i);
                    store = exact.length > 1 ? exact[0].store : matches[0].store;
                    review = true;
                    cause = bpk ? `Cabang Ambigu, Deteksi: ${bpk[1].trim()}` : `${matches.length} cabang PT sama.`;
                }
            }
        } else {
            const mMatch = (ythText || recSecText || upperText).match(/MEGA\s*BAJA\s+([A-Z0-9][A-Z0-9\s]*)/i);
            if (mMatch) {
                const city = mMatch[1].trim().split(/\s+/)[0];
                const rule = PT_MAPPING.find(r => r.store.toUpperCase() === city.toUpperCase());
                if (rule) store = rule.store;
                else {
                    // Even for NON, scan whole document for secondary keywords
                    const sec = PT_MAPPING.filter(r => checkSec(r, upperText));
                    store = sec.length === 1 ? sec[0].store : city;
                }
            } else if (ythText) {
                // Final effort for NON: scan whole text for any secondary keywords
                const globalSec = PT_MAPPING.filter(r => checkSec(r, upperText));
                if (globalSec.length === 1) store = globalSec[0].store;
                else store = ythText.replace(/^(BPK|IBU|BAPAK|BP)\s*/i, '').trim().split(/[,\n]/)[0].trim();
            }
        }

        // 3. Nominal (Intelligent Proximity Scoring)
        let nominal = "0";
        let nominalCands = [];

        let nominalText = cleanText;
        if (invNum && invNum.length > 5) {
            nominalText = nominalText.replace(new RegExp(invNum, 'g'), ' [MASK] ');
            (invNum.match(/\d{5,}/g) || []).forEach(seg => {
                nominalText = nominalText.replace(new RegExp(seg, 'g'), ' [MASK] ');
            });
        }

        const labels = [
            { rx: /[Tt]otal\s*[Bb]ayar/i, weight: 1000 },
            { rx: /[Nn]etto|[Jj]umlah\s*[Bb]ayar|[Tt]otal/i, weight: 800 },
            { rx: /[Bb]ayar|sayar|ayar/i, weight: 600 },
            { rx: /[Rr][Pp]/i, weight: 300 }
        ];

        const brute = nominalText.matchAll(/(\d{1,3}(?:[.\s]\d{3})+)/g);
        for (const b of brute) {
            const v = b[1].replace(/[^0-9]/g, '');
            if (v.length >= 4 && v.length <= 9) {
                const num = Number(v);
                let maxScore = 0;

                // Find nearest label and calculate score
                labels.forEach(lb => {
                    const lMatch = [...nominalText.matchAll(new RegExp(lb.rx, 'gi'))];
                    lMatch.forEach(lm => {
                        const dist = Math.abs(b.index - lm.index);
                        if (dist < 40) maxScore = Math.max(maxScore, lb.weight);
                        else if (dist < 100) maxScore = Math.max(maxScore, lb.weight * 0.5);
                    });
                });

                if (maxScore > 0) nominalCands.push({ val: num, score: maxScore });
                else if (b.index > cleanText.length * 0.5) nominalCands.push({ val: num, score: 50 }); // Fallback for numbers in lower half
            }
        }

        if (nominalCands.length > 0) {
            nominalCands.sort((a, b) => b.score - a.score);
            nominal = nominalCands[0].val.toLocaleString('id-ID');
        }

        // 4. Date
        let date = "00-Unknown";
        const monMap = {
            'JAN': 'Januari', 'FEB': 'Februari', 'MAR': 'Maret', 'APR': 'April',
            'MEI': 'Mei', 'MAY': 'Mei', 'MEL': 'Mei', 'MEY': 'Mei', 'JUN': 'Juni', 'JUL': 'Juli',
            'AGU': 'Agustus', 'AUG': 'Agustus', 'SEP': 'September', 'OKT': 'Oktober', 'OCT': 'Oktober',
            'NOV': 'November', 'DES': 'Desember', 'DEC': 'Desember',
            '01': 'Januari', '1': 'Januari', '02': 'Februari', '2': 'Februari', '03': 'Maret', '3': 'Maret',
            '04': 'April', '4': 'April', '05': 'Mei', '5': 'Mei', '06': 'Juni', '6': 'Juni',
            '07': 'Juli', '7': 'Juli', '08': 'Agustus', '8': 'Agustus', '09': 'September', '9': 'September',
            '10': 'Oktober', '11': 'November', '12': 'Desember'
        };
        const dPat = /\b(\d{1,2})\s*[-/\s.,]+\s*([A-Za-z]{3,9}|\d{1,2})\s*[-/\s.,]+\s*(\d{4})\b/ig;
        const allD = [...cleanText.matchAll(dPat)];
        // Broaden prefix search to catch OCR typos: Tgl, Iyl, Tgi, Tg1, Tcl, Tcl., etc.
        const exp = cleanText.match(/(?:[Cc]etak|[Tt]gl|[Tt]gi|[Tt]g1|[Ii]yl|[Tt]cl|[Tt]anggal)\s*[:;.]?\s*(\d{1,2})\s*[-/\s.,]+\s*([A-Za-z]{3,9}|\d{1,2})\s*[-/\s.,]+\s*(\d{4})/i);

        // Priority Score Table
        let dateCandidates = [];
        for (const m of allD) {
            const dayNum = parseInt(m[1], 10);
            const mStr = m[2].substring(0, 3).toUpperCase();
            if (dayNum > 0 && dayNum <= 31 && monMap[mStr]) {
                let score = 50; // default
                const context = cleanText.substring(Math.max(0, m.index - 60), m.index + 60).toLowerCase();

                if (context.includes('cetak') || context.includes('tanggal') || context.includes('tgl') || context.includes('iyl')) score += 100;
                if (context.includes('retur') || context.includes('tempo') || context.includes('maksimal')) score -= 500;
                if (m.index < cleanText.length * 0.25) score += 100; // Top of page is likely the real date

                dateCandidates.push({ match: m, score });
            }
        }

        if (exp && parseInt(exp[1], 10) > 0 && parseInt(exp[1], 10) <= 31 && monMap[exp[2].substring(0, 3).toUpperCase()]) {
            dateCandidates.push({ match: exp, score: 200 }); // Explicit label is king
        }

        let chs = null;
        if (dateCandidates.length > 0) {
            dateCandidates.sort((a, b) => b.score - a.score);
            chs = dateCandidates[0].match;
        }
        if (chs) {
            const mon = monMap[chs[2].substring(0, 3).toUpperCase()];
            if (mon) date = `${parseInt(chs[1], 10)} ${mon}`;
        }

        const sug = `${type} ${store} ${nominal} ${date}.pdf`.toUpperCase().replace(/\s+/g, ' ');
        return { toko: store, nominal, date, type, suggestion: sug, needsReview: review, fallbackCause: cause, rawText: cleanText.substring(0, 1500) };
    } catch (e) {
        console.error(e);
        return { toko: "ERR", nominal, date: "00-Unknown", type: "???", suggestion: `ERR_${originalName}`, needsReview: true, fallbackCause: e.message, rawText: text.substring(0, 1000) };
    }
}

// ---- UI Rendering ----
function renderResults() {
    const body = document.getElementById('result-body');
    if (!body) return;
    body.innerHTML = filesToProcess.map((item, i) => {
        const res = item.result;
        const tokoClass = (res?.toko === 'UNKNOWN' || res?.needsReview) ? 'text-amber-400' : 'text-white';
        return `
            <tr class="hover:bg-white/5 transition-all border-b border-white/5">
                <td class="py-4 pr-4">
                    <p class="text-[11px] text-gray-300 font-medium truncate w-48">${item.file.name}</p>
                    ${res?.rawText ? `<button onclick="showDebugText(${i})" class="text-[9px] text-indigo-500 hover:text-indigo-400 mt-1 transition-all">🔍 Lihat Teks OCR</button>` : ''}
                </td>
                <td class="py-4 px-4 font-['Outfit'] font-bold ${tokoClass}">
                    ${res?.toko || '--'}
                    ${res?.needsReview ? `<p class="text-[9px] text-amber-500/70 font-normal mt-1 italic">⚠ ${res.fallbackCause}</p>` : ''}
                </td>
                <td class="py-4 px-4">
                    <p class="text-[10px] text-gray-300">💰 ${res?.nominal || '--'}</p>
                    <p class="text-[10px] text-gray-500">📅 ${res?.date || '--'}</p>
                </td>
                <td class="py-4 px-4">
                    <span class="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold">
                        ${res?.suggestion || 'Menganalisa...'}
                    </span>
                </td>
                <td class="py-4 pl-4 text-right">
                    ${renderStatus(item, i)}
                </td>
            </tr>
        `;
    }).join('');
}

function renderStatus(item, i) {
    if (item.status === 'pending') return '<span class="text-[10px] text-gray-600">Menunggu</span>';
    if (item.status === 'processing') return '<div class="loader-dots"><span></span><span></span><span></span></div>';
    if (item.status === 'done') return `
        <button onclick="downloadFile(${i})" class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </button>
    `;
    return '<span class="text-[10px] text-red-400">Error</span>';
}

async function downloadFile(index) {
    const item = filesToProcess[index];
    const blob = new Blob([await item.file.arrayBuffer()], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.result.suggestion;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
}

function checkDownloadAll() {
    const done = filesToProcess.filter(f => f.status === 'done');
    const btn = document.getElementById('download-all-btn');
    if (btn && done.length > 1) btn.classList.remove('hidden');
}

function showDebugText(index) {
    const item = filesToProcess[index];
    if (!item?.result?.rawText) return;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `
        <div class="premium-card rounded-3xl p-8 w-full max-w-3xl max-h-[80vh] flex flex-col bg-[#0d121f] border border-white/10 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-white">🔍 Hasil OCR: ${item.file.name}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-all text-2xl">&times;</button>
            </div>
            <pre class="flex-1 overflow-auto text-[10px] text-indigo-200/70 bg-black/40 rounded-2xl p-6 font-mono whitespace-pre-wrap custom-scrollbar border border-white/5">${item.result.rawText}</pre>
            <p class="text-[10px] text-gray-500 mt-4 text-center">Gunakan teks mentah di atas untuk menyesuaikan kata kunci pemetaan jika deteksi otomatis gagal.</p>
        </div>
    `;
    document.body.appendChild(modal);
}

// Mapping Modal Helpers
function editMapping() {
    const modal = document.getElementById('mapping-modal');
    const body = document.getElementById('mapping-editor-body');
    body.innerHTML = '';
    if (PT_MAPPING.length === 0) addMappingRow();
    else PT_MAPPING.forEach(r => addMappingRow(r.pt, r.secondary, r.store));
    modal.classList.remove('hidden');
}

function addMappingRow(pt = "", sec = "", st = "") {
    const body = document.getElementById('mapping-editor-body');
    const tr = document.createElement('tr');
    tr.className = 'group border-b border-white/5';
    tr.innerHTML = `
        <td class="py-2 px-2"><input type="text" value="${pt}" class="w-full bg-transparent border-none outline-none text-xs text-white focus:ring-0"></td>
        <td class="py-2 px-2"><input type="text" value="${sec}" class="w-full bg-transparent border-none outline-none text-xs text-indigo-300 focus:ring-0"></td>
        <td class="py-2 px-2"><input type="text" value="${st}" class="w-full bg-transparent border-none outline-none text-xs text-emerald-400 font-bold focus:ring-0"></td>
        <td class="py-2 px-2 text-right"><button onclick="this.closest('tr').remove()" class="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">&times;</button></td>
    `;
    body.appendChild(tr);
}

function saveMapping() {
    const rows = document.querySelectorAll('#mapping-editor-body tr');
    const newRules = [];
    rows.forEach(row => {
        const ins = row.querySelectorAll('input');
        if (ins[0].value.trim() && ins[2].value.trim()) {
            newRules.push({ pt: ins[0].value.trim(), secondary: ins[1].value.trim(), store: ins[2].value.trim() });
        }
    });
    PT_MAPPING = newRules;
    localStorage.setItem('pt_mapping_final', JSON.stringify(PT_MAPPING));
    renderMappingUI();
    document.getElementById('mapping-modal').classList.add('hidden');
    // Re-process
    filesToProcess.forEach(f => { f.status = 'pending'; f.result = null; });
    processQueue();
}
