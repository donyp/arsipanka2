/**
 * AI PDF Renamer Logic - v1.0
 * Uses Tesseract.js for OCR and regex for metadata extraction.
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
    { store: "Bantar Gebang", secondary: "LILIS, ANTO, NEGA, MITA", pt: "CV. DUNIA BAJA" },
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
    const saved = localStorage.getItem('pt_mapping_v4');
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

/**
 * Extracts text from PDF.
 * Uses pdf.js first, falls back to Tesseract OCR if text is empty (scanned image).
 */
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    // Try text extraction first
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
    }

    // If text is minimal or missing key anchor words, it's likely a scan. Use OCR on first page.
    const lowerText = fullText.toLowerCase();
    if (fullText.trim().length < 50 || (!lowerText.includes('yth') && !lowerText.includes('bayar'))) {
        console.log(`[AI] Page text too short or garbled (${fullText.length}), trigger OCR fallback...`);
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 3.0 }); // Higher scale for better OCR on full A4
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
    console.log("[AI] Raw Text:", text);
    // Normalize OCR quirks: collapse multiple spaces, fix common OCR errors
    const cleanText = text.replace(/\r/g, '').replace(/[ \t]+/g, ' ');
    const upperText = cleanText.toUpperCase();
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l);

    // ========== 1. PPN / NON Detection ==========
    // Rules:
    //   PPN = detected from PT./CV. in "Kepada Yth:" (EXCEPT PT. GARUDA GEMILANG) OR Invoice contains "8351003100"
    //   NON = detected when "Kepada Yth:" is directly followed by "MEGA BAJA X" (no PT.) OR Invoice contains "8351003110"
    let isPPN = false;
    let isNON = false;
    let ythText = "";
    let recipientSectionText = "";

    // Step 1a: Find "Kepada Yth" line
    const ythRegex = /[Kk]epad[ae]\s*[Yy]th\s*[:.;]?\s*([^\n]+)/i;
    const ythMatch = cleanText.match(ythRegex);

    if (ythMatch) {
        ythText = ythMatch[1].trim().toUpperCase();
        const matchIdx = cleanText.indexOf(ythMatch[0]);
        recipientSectionText = cleanText.substring(matchIdx, matchIdx + 250).toUpperCase();
    }

    // Step 1b: Check Invoice number for definitive PPN/NON signal
    const invoiceMatch = cleanText.match(/[Ii]nvoice\s*[:;.]?\s*([\d]+)/);
    const invoiceNum = invoiceMatch ? invoiceMatch[1] : "";

    if (invoiceNum.startsWith("8351003110")) {
        isPPN = true;
    } else if (invoiceNum.startsWith("8351003100")) {
        isNON = true;
    }

    // Step 1c: If invoice didn't decide, use "Kepada Yth" content
    if (!isPPN && !isNON && ythText) {
        // Check if ythText contains PT./CV. (with OCR typo support: OV, PI, P1, CF, C7)
        const hasPT = ythText.match(/\b(PT\.?|P[TI1]\.?|CV\.?|[O0C][VF]\.?|C[TY7]\.?)\s/i);
        if (hasPT) {
            // It's PPN... UNLESS it's PT. GARUDA GEMILANG (that's the sender, not recipient)
            const isGaruda = ythText.match(/GARUDA\s*GEMILANG/i);
            if (isGaruda) {
                // Garuda Gemilang is the SENDER company, not the recipient. This is likely an error in OCR.
                // Treat as unknown, check further in the recipient block
                const recipientHasOtherPT = recipientSectionText.replace(/GARUDA\s*GEMILANG[^\n]*/gi, '').match(/\b(PT\.?|CV\.?)\s*[A-Z]{3,}/i);
                if (recipientHasOtherPT) {
                    isPPN = true;
                } else {
                    // Check for MEGA BAJA pattern in recipient
                    const megaBajaInRecipient = recipientSectionText.match(/MEGA\s*BAJA\s+([A-Z0-9]+)/);
                    if (megaBajaInRecipient) {
                        isNON = true;
                    }
                }
            } else {
                isPPN = true;
            }
        } else {
            // No PT/CV found after Kepada Yth → Check for "MEGA BAJA X" pattern → NON
            const megaBajaMatch = ythText.match(/MEGA\s*BAJA/i);
            if (megaBajaMatch) {
                isNON = true;
            }
        }
    }

    // Step 1d: Final fallback — scan full text for PT/CV if still undecided
    if (!isPPN && !isNON) {
        // Skip first 10% (letterhead area) and look for PT./CV.
        const midText = cleanText.substring(Math.floor(cleanText.length * 0.1)).toUpperCase();
        const fallbackPT = midText.match(/\b(PT\.?|CV\.?)\s*[A-Z]{3,}/i);
        if (fallbackPT && !fallbackPT[0].match(/GARUDA\s*GEMILANG/i)) {
            isPPN = true;
        }
    }

    const type = isPPN ? 'PPN' : 'NON';

    // ========== 2. Store Name Detection ==========
    let detectedToko = "UNKNOWN";
    let needsReview = false;
    let fallbackCause = "";

    // Helper: check if any comma-separated secondary keyword is found in text
    const checkSecondary = (rule, searchText) => {
        if (!rule.secondary) return false;
        const keywords = rule.secondary.split(',').map(k => k.trim().toUpperCase()).filter(k => k);
        return keywords.some(k => searchText.includes(k));
    };

    // Helper: find mapping matches by stripping PT/CV from mapping key
    const findPTMatches = (scope) => {
        return PT_MAPPING.filter(r => {
            const cleanPtName = r.pt.replace(/\b(PT\.?|CV\.?)\b/gi, '').replace(/[()]/g, '').trim().toUpperCase();
            if (!cleanPtName || cleanPtName.length < 3) return false;
            return scope.includes(cleanPtName);
        });
    };

    if (isPPN) {
        // ----- PPN PATH: Look for PT/CV name in recipient, match against mapping -----
        const searchScope = recipientSectionText || ythText || upperText.substring(Math.floor(upperText.length * 0.15));

        let ptMatches = findPTMatches(searchScope);
        // Filter out GARUDA GEMILANG matches (sender company)
        ptMatches = ptMatches.filter(r => !r.pt.match(/GARUDA\s*GEMILANG/i));

        if (ptMatches.length === 0) {
            // Very loose fallback: search full text
            ptMatches = findPTMatches(upperText).filter(r => !r.pt.match(/GARUDA\s*GEMILANG/i));
        }

        if (ptMatches.length === 1) {
            const rule = ptMatches[0];
            if (rule.secondary && !checkSecondary(rule, upperText)) {
                // PT found but secondary keyword missing — still use it but flag
                detectedToko = rule.store;
                needsReview = true;
                fallbackCause = `PT '${rule.pt}' terdeteksi. Kata kunci sekunder '${rule.secondary}' tidak ditemukan.`;
            } else {
                detectedToko = rule.store;
            }
        } else if (ptMatches.length > 1) {
            // Multiple rules matched. Disambiguate via secondary keyword (BPK/IBU names)
            const exactMatches = ptMatches.filter(r => checkSecondary(r, upperText));
            if (exactMatches.length === 1) {
                detectedToko = exactMatches[0].store;
            } else {
                detectedToko = "Cek Manual (Ambigu)";
                needsReview = true;
                fallbackCause = `${ptMatches.length} toko memiliki PT yang sama. Cek nama BPK/IBU.`;
            }
        } else {
            // No mapping found. Extract PT/CV name raw from text
            const extractFrom = ythText || upperText;
            const ptExtract = extractFrom.match(/(?:PT|CV|OV|PI)[.\s]+([A-Z][A-Z0-9\s]{2,30})/);
            detectedToko = ptExtract ? ptExtract[1].trim() : "PT_UNKNOWN";
            if (detectedToko !== "PT_UNKNOWN") {
                needsReview = true;
                fallbackCause = `Pemetaan untuk '${detectedToko}' belum ada di sistem.`;
            }
        }
    } else {
        // ----- NON PATH: "MEGA BAJA X" → extract city name -----
        // First try to extract from "Kepada Yth" line
        const megaBajaSource = ythText || recipientSectionText || upperText;
        const mbMatch = megaBajaSource.match(/MEGA\s*BAJA\s+([A-Z0-9][A-Z0-9\s]*)/i);

        if (mbMatch) {
            const cityRaw = mbMatch[1].trim().split(/\s+/)[0]; // Take first word as city
            // Try to find in mapping by store name
            const storeMatch = PT_MAPPING.find(r => r.store.toUpperCase() === cityRaw.toUpperCase());
            if (storeMatch) {
                detectedToko = storeMatch.store;
            } else {
                // Check secondary keywords (BPK/IBU) for disambiguation
                const secondaryMatches = PT_MAPPING.filter(r => checkSecondary(r, upperText));
                if (secondaryMatches.length === 1) {
                    detectedToko = secondaryMatches[0].store;
                } else {
                    detectedToko = cityRaw;
                    // Check if cityRaw partially matches any store name
                    const partialMatch = PT_MAPPING.find(r => r.store.toUpperCase().includes(cityRaw.toUpperCase()));
                    if (partialMatch) {
                        detectedToko = partialMatch.store;
                    }
                }
            }
        } else if (ythText) {
            // No MEGA BAJA pattern — try direct name from Yth line
            const cleanYth = ythText.replace(/^(BPK|IBU|BAPAK)\s*/i, '').trim();
            detectedToko = cleanYth.split(/[,\n]/)[0].trim() || "UNKNOWN";
        }
    }

    // ========== 3. Nominal Detection ==========
    let nominal = "0";

    // Strategy 1: Look for "Total Bayar" or similar labels (incl. OCR garble like 'ayar')
    const nominalPatterns = [
        /[Tt]otal\s*[Bb]ayar\s*[:;.]?\s*[Rr]?[Pp]?[\s.]*(\d[\d.,\s-]+)/,
        /[Tt]otal\s*[Bb]ayar\s*[:;.]?\s*(\d[\d.,\s-]+)/,
        /[Bb]ayar\s*[:;.]?\s*[Rr]?[Pp]?[\s.]*(\d[\d.,\s-]+)/,
        /ayar\s*[:;.]?\s*[Rr]?[Pp]?[\s.]*(\d[\d.,\s-]+)/i,
        /[Nn]etto\s*[:;.]?\s*[Rr]?[Pp]?[\s.]*(\d[\d.,\s-]+)/,
        /[Tt]otal\s*[:;.]?\s*[Rr]?[Pp]?[\s.]*(\d[\d.,\s-]+)/,
        /[Rr][Pp][\s.]*(\d[\d.,\s-]+)/
    ];

    let candidates = [];
    for (const pat of nominalPatterns) {
        const allMatches = cleanText.matchAll(new RegExp(pat, 'g'));
        for (const m of allMatches) {
            let rawNum = m[1].replace(/[\s-]+/g, '').split(',')[0].replace(/[^0-9]/g, '');
            if (rawNum && rawNum.length >= 4) {
                candidates.push(Number(rawNum));
            }
        }
    }

    // Strategy 2: Brute-force fallback — find ALL formatted numbers (like 250.030 or 1.371.320)
    if (candidates.length === 0) {
        const allNums = cleanText.matchAll(/(\d{1,3}(?:[.\s]\d{3})+)/g);
        for (const m of allNums) {
            let rawNum = m[1].replace(/[^0-9]/g, '');
            // Limit to < 12 digits to avoid grabbing NPWP (15 digits) or Phone Numbers (12-13 digits).
            // 11 digits allows up to 99 billion, which is extremely safe for invoices. 
            if (rawNum && rawNum.length >= 5 && rawNum.length <= 11) {
                candidates.push(Number(rawNum));
            }
        }
    }

    // Strategy 3: SUM all subtotals from invoice line items
    // Pattern: numbers at end of lines like "250.030,50,-" or "189.000.00,-"
    if (candidates.length === 0) {
        let subtotalSum = 0;
        const lineItemPattern = /(\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?[.,]?\s*-\s*$/gm;
        const lineMatches = cleanText.matchAll(lineItemPattern);
        for (const m of lineMatches) {
            let rawNum = m[1].replace(/[^0-9]/g, '');
            if (rawNum && rawNum.length >= 4) {
                subtotalSum += Number(rawNum);
            }
        }
        if (subtotalSum > 0) {
            candidates.push(subtotalSum);
        }
    }

    // Strategy 4: (Ultimate Fallback) Terbilang Parser
    // Often amounts are explicitly spelled out as "empat juta sembilan ratus ribu rupiah"
    if (candidates.length === 0 || Math.max(...candidates) < 1000) {
        // Find index of the word 'terbilang' and grab the next 150 characters (ignores newlines and noise)
        const tIdx = cleanText.toLowerCase().indexOf('terbilang');
        if (tIdx !== -1) {
            const rawTerbilangText = cleanText.substring(tIdx, tIdx + 150);
            let parseTerbilang = (text) => {
                const map = {
                    'satu': 1, 'se': 1, 'dua': 2, 'tiga': 3, 'empat': 4, 'lima': 5,
                    'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9, 'sepuluh': 10, 'sebelas': 11
                };
                let words = text.toLowerCase().match(/[a-z]+/g);
                if (!words) return 0;
                let total = 0; let current = 0;
                for (let w of words) {
                    if (map[w]) current += map[w];
                    else if (w === 'belas') current = Math.max(1, current) + 10;
                    else if (w === 'puluh') current = Math.max(1, current) * 10;
                    else if (w === 'ratus') current = Math.max(1, current) * 100;
                    else if (w === 'ribu') { total += Math.max(1, current) * 1000; current = 0; }
                    else if (w === 'juta') { total += Math.max(1, current) * 1000000; current = 0; }
                    else if (w === 'milyar') { total += Math.max(1, current) * 1000000000; current = 0; }
                }
                total += current;
                // If it ends with "ratus" but total < 100000, probably meant "ratus ribu" in OCR cuts
                if (words[words.length - 1] === 'ratus' && total > 1000 && (total % 1000 !== 0) && total < 100000) {
                    // "empat juta sembilan ratus" -> 4000900 -> probably 4900000
                    const jutaPart = Math.floor(total / 1000000) * 1000000;
                    const rem = total - jutaPart;
                    if (rem > 0 && rem < 1000) total = jutaPart + (rem * 1000);
                }
                return total;
            };
            const tbVal = parseTerbilang(rawTerbilangText);
            if (tbVal > 0) candidates.push(tbVal);
        }
    }

    if (candidates.length > 0) {
        const highest = Math.max(...candidates);
        nominal = highest.toLocaleString('id-ID');
    }

    // ========== 4. Date Detection ==========
    let dateStr = "00-Unknown";
    const datePatterns = [
        /[Cc]etak\s*[:;.]?\s*(\d{1,2})\s*[-/\s.,]+\s*([A-Za-z]{3,9}|\d{1,2})/,
        /[Tt]anggal\s*[:;.]?\s*(\d{1,2})\s*[-/\s.,]+\s*([A-Za-z]{3,9}|\d{1,2})/,
        /(\d{1,2})\s*[-/]\s*([A-Za-z]{3,9}|\d{1,2})\s*[-/]\s*\d{2,4}/
    ];
    for (const pat of datePatterns) {
        const m = cleanText.match(pat);
        if (m) {
            const day = parseInt(m[1], 10).toString(); // removes leading zero if present
            const rawMonth = m[2].substring(0, 3).toUpperCase();
            const indMonthMap = {
                'JAN': 'Januari', 'FEB': 'Februari', 'MAR': 'Maret', 'APR': 'April',
                'MEI': 'Mei', 'MAY': 'Mei', 'JUN': 'Juni', 'JUL': 'Juli',
                'AGU': 'Agustus', 'AUG': 'Agustus', 'SEP': 'September', 'OKT': 'Oktober',
                'OCT': 'Oktober', 'NOV': 'November', 'DES': 'Desember', 'DEC': 'Desember',
                '01': 'Januari', '1': 'Januari', '02': 'Februari', '2': 'Februari',
                '03': 'Maret', '3': 'Maret', '04': 'April', '4': 'April',
                '05': 'Mei', '5': 'Mei', '06': 'Juni', '6': 'Juni',
                '07': 'Juli', '7': 'Juli', '08': 'Agustus', '8': 'Agustus',
                '09': 'September', '9': 'September', '10': 'Oktober',
                '11': 'November', '12': 'Desember'
            };
            const month = indMonthMap[rawMonth];
            if (month) {
                dateStr = `${day} ${month}`;
                break;
            }
        }
    }

    const suggestion = `${type} ${detectedToko} ${nominal} ${dateStr}.pdf`.replace(/\s+/g, ' ');

    return {
        toko: detectedToko,
        nominal: nominal,
        date: dateStr,
        type: type,
        suggestion: suggestion.toUpperCase(),
        needsReview: needsReview,
        fallbackCause: fallbackCause,
        rawText: cleanText.substring(0, 1500) // Debug: first 1500 chars of OCR text
    };
}

// ---- UI Rendering ----
function renderResults() {
    const body = document.getElementById('result-body');
    body.innerHTML = filesToProcess.map((item, i) => {
        const res = item.result;
        const reviewClass = res?.needsReview ? 'text-amber-400' : 'text-white';
        const tokoClass = (res?.toko === 'UNKNOWN' || res?.needsReview) ? 'text-amber-400' : 'text-white';
        return `
            <tr class="hover:bg-white/5 transition-all">
                <td class="py-4 pr-4">
                    <p class="text-xs text-gray-300 font-medium truncate w-48">${item.file.name}</p>
                    ${res?.rawText ? `<button onclick="showDebugText(${i})" class="text-[9px] text-indigo-500 hover:text-indigo-400 mt-1 transition-all">🔍 Lihat Teks OCR</button>` : ''}
                </td>
                <td class="py-4 px-4 font-['Outfit'] font-bold ${tokoClass}">
                    ${res?.toko || '--'}
                    ${res?.needsReview ? `<p class="text-[9px] text-amber-500/70 font-normal mt-1">⚠ ${res.fallbackCause}</p>` : ''}
                </td>
                <td class="py-4 px-4">
                    <p class="text-[10px] text-gray-300">💰 ${res?.nominal || '--'}</p>
                    <p class="text-[10px] text-gray-500">📅 ${res?.date || '--'}</p>
                </td>
                <td class="py-4 px-4">
                    <span class="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold">
                        ${res?.suggestion || 'Analyzing...'}
                    </span>
                </td>
                <td class="py-4 pl-4">
                    ${renderStatus(item, i)}
                </td>
            </tr>
        `;
    }).join('');
}

function showDebugText(index) {
    const item = filesToProcess[index];
    if (!item?.result?.rawText) return;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `
        <div class="premium-card rounded-3xl p-8 w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-white">🔍 Teks OCR: ${item.file.name}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white transition-all text-xl">&times;</button>
            </div>
            <pre class="flex-1 overflow-auto text-xs text-gray-300 bg-[#0a0f1a] rounded-2xl p-4 font-mono whitespace-pre-wrap custom-scrollbar">${item.result.rawText}</pre>
            <p class="text-[10px] text-gray-600 mt-3 text-center">Gunakan teks ini sebagai referensi untuk mengisi kata kunci di Pemetaan.</p>
        </div>
    `;
    document.body.appendChild(modal);
}

function renderStatus(item, i) {
    if (item.status === 'pending') return '<span class="text-[10px] text-gray-600">Pending</span>';
    if (item.status === 'processing') return `
        <div class="flex items-center gap-1 loader-dots">
            <div class="w-1 h-1 rounded-full bg-indigo-400"></div>
            <div class="w-1 h-1 rounded-full bg-indigo-400"></div>
            <div class="w-1 h-1 rounded-full bg-indigo-400"></div>
        </div>
    `;
    if (item.status === 'done') return `
        <button onclick="downloadFile(${i})" class="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
        </button>
    `;
    return '<span class="text-[10px] text-red-400 font-bold">Error</span>';
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
    const doneCount = filesToProcess.filter(f => f.status === 'done').length;
    if (doneCount > 1) {
        document.getElementById('download-all-btn').classList.remove('hidden');
    }
}

// ---- Mapping Editor ----
function editMapping() {
    const modal = document.getElementById('mapping-modal');
    const body = document.getElementById('mapping-editor-body');
    body.innerHTML = ''; // Clear

    if (PT_MAPPING.length === 0) {
        addMappingRow();
    } else {
        PT_MAPPING.forEach(rule => addMappingRow(rule.pt, rule.secondary, rule.store));
    }

    modal.classList.remove('hidden');
}

function addMappingRow(pt = "", secondary = "", store = "") {
    const body = document.getElementById('mapping-editor-body');
    const row = document.createElement('tr');
    row.className = 'group hover:bg-white/5 transition-all transition-all';
    row.innerHTML = `
        <td class="py-2 px-2">
            <input type="text" placeholder="Contoh: PT. DUNIA BAJA" value="${pt}" class="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-gray-600 focus:ring-0">
        </td>
        <td class="py-2 px-2">
            <input type="text" placeholder="Contoh: BEKASI" value="${secondary}" class="w-full bg-transparent border-none outline-none text-xs text-indigo-300 placeholder:text-gray-600 focus:ring-0">
        </td>
        <td class="py-2 px-2">
            <input type="text" placeholder="Contoh: MB_BEKASI" value="${store}" class="w-full bg-transparent border-none outline-none text-xs text-emerald-400 placeholder:text-gray-600 focus:ring-0 font-bold">
        </td>
        <td class="py-2 px-2 text-right">
            <button onclick="this.closest('tr').remove()" class="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
        </td>
    `;
    body.appendChild(row);
}

function closeMapping() {
    document.getElementById('mapping-modal').classList.add('hidden');
}

function saveMapping() {
    const rows = document.querySelectorAll('#mapping-editor-body tr');
    const newRules = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const pt = inputs[0].value.trim();
        const secondary = inputs[1].value.trim();
        const store = inputs[2].value.trim();

        if (pt && store) {
            newRules.push({ pt, secondary, store });
        }
    });

    PT_MAPPING = newRules;
    localStorage.setItem('pt_mapping_v2', JSON.stringify(PT_MAPPING));
    renderMappingUI();
    closeMapping();

    // Auto re-analyze ALL files already in the queue
    if (filesToProcess.length > 0) {
        filesToProcess.forEach(f => {
            f.status = 'pending';
            f.result = null;
        });
        const dlBtn = document.getElementById('download-all-btn');
        if (dlBtn) dlBtn.classList.add('hidden');
        if (!isProcessing) processQueue();
    }

    if (typeof Toast !== 'undefined') {
        Toast.success('Pemetaan disimpan & file dianalisa ulang!');
    } else {
        alert('Pemetaan disimpan & file dianalisa ulang!');
    }
}
