// ============================================================
// Shared Sidebar Component — Single Source of Truth
// Auto-detects current page and renders the sidebar
// Version 2.1.1 - Definitive Clean Build (No AI PDF Renamer)
// ============================================================
console.log("Sidebar Version 2.1.1 - Clean Build Executed");

(function () {
    const activePage = window.location.pathname.split('/').pop() || 'dashboard.html';

    const menuItems = [
        { section: 'Menu Utama' },
        { href: 'dashboard.html', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', guard: 'data-role="super_admin"' },

        {
            isDropdown: true,
            id: 'dd-upload',
            label: 'Upload',
            icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
            children: [
                { href: 'upload.html', label: 'Invoice Merah', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', guard: 'data-permission="upload_single"' },
                { href: 'piutang.html', label: 'Bukti Pembayaran Piutang', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', guard: 'data-permission="view_piutang"' },
                { href: 'history.html', label: 'Riwayat Batch', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', guard: 'data-role="super_admin"' },
            ]
        },
        {
            isDropdown: true,
            id: 'dd-manajemen',
            label: 'Manajemen',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            children: [
                { href: 'users.html', label: 'Manajemen User', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', guard: 'data-permission="manage_users"' },
                { href: 'tokos.html', label: 'Manajemen Toko', icon: 'M19 21V5a2 2 0 012-2H9a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', guard: 'data-permission="manage_toko"' },
                { href: 'zonas.html', label: 'Manajemen Zona', iconPaths: ['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'], guard: 'data-permission="manage_zonas"' },
            ]
        },
        {
            isDropdown: true,
            id: 'dd-sistem',
            label: 'Sistem',
            iconPaths: ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
            children: [
                { href: 'audit.html', label: 'Log Aktivitas', iconPaths: ['M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'], guard: 'data-role="super_admin"' },
                { href: 'requests.html', label: 'Antrean Request', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', guard: '' },
                { href: 'trash.html', label: 'Tong Sampah', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', guard: 'data-permission="restore_trash"' },
                { href: 'cleanup.html', label: 'Optimasi Penyimpanan', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.051.046M15.571 8.572a2 2 0 011.022.547l2.387.477a6 6 0 013.86-.517l.318-.158a6 6 0 003.86-.517L20.95 8.79a2 2 0 011.051-.046M12 7v10m0 0l-1.5-1.5M12 17l1.5-1.5', guard: 'data-role="super_admin"' },
            ]
        }
    ];

    // Global toggle function
    window.toggleSidebarDropdown = function (id) {
        const container = document.getElementById(id);
        const parent = document.getElementById(id + '-parent');
        if (!container || !parent) return;

        const isExpanded = parent.classList.contains('expanded');
        if (isExpanded) {
            container.style.maxHeight = '0px';
            parent.classList.remove('expanded');
        } else {
            container.style.maxHeight = container.scrollHeight + 'px';
            parent.classList.add('expanded');
        }
    };

    function renderIcon(iconStr, iconPathsArr) {
        if (iconPathsArr) {
            return iconPathsArr.map(p => `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p}" />`).join('');
        }
        return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="${iconStr}" />`;
    }

    let navHTML = '';
    for (const item of menuItems) {
        if (item.section) {
            navHTML += `<p class="text-[10px] text-gray-600 uppercase tracking-widest mt-6 mb-1 px-4">${item.section}</p>`;
            continue;
        }

        if (item.isDropdown) {
            // Check if any child is active
            const hasActiveChild = item.children.some(child => activePage === child.href);
            const parentClass = hasActiveChild ? 'expanded' : '';
            const maxH = hasActiveChild ? '1000px' : '0px';

            let childrenHTML = '';
            for (const child of item.children) {
                const isActive = activePage === child.href;
                const activeClass = isActive
                    ? 'active text-white bg-white/10 ring-1 ring-white/10 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5';

                childrenHTML += `
                    <a href="${child.href}" ${child.guard || ''}
                        class="sidebar-link flex items-center gap-3 px-4 py-2.5 mt-1 mx-2 rounded-xl text-sm transition-all group ${activeClass}">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${renderIcon(child.icon, child.iconPaths)}
                        </svg>
                        ${child.label}
                    </a>
                 `;
            }

            navHTML += `
                <div id="${item.id}-parent" class="sidebar-dropdown ${parentClass} mt-4 mb-1">
                    <button onclick="toggleSidebarDropdown('${item.id}')" class="sidebar-dropdown-btn w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white group">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${renderIcon(item.icon, item.iconPaths)}
                            </svg>
                            <span class="font-medium">${item.label}</span>
                        </div>
                        <svg class="sidebar-dropdown-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div id="${item.id}" class="sidebar-dropdown-content" style="max-height: ${maxH};">
                        <div class="py-1">
                            ${childrenHTML}
                        </div>
                    </div>
                </div>
            `;

        } else {
            const isActive = activePage === item.href;
            const activeClass = isActive
                ? 'active text-white bg-white/10 ring-1 ring-white/10 shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5';

            navHTML += `
                <a href="${item.href}" ${item.guard || ''}
                    class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group ${activeClass}">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${renderIcon(item.icon, item.iconPaths)}
                    </svg>
                    ${item.label}
                </a>`;
        }
    }

    function inject() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        sidebar.innerHTML = `
            <div class="p-5 border-b border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-sm font-bold text-white">Pusat Arsip Anka</h1>
                        <span class="text-xs text-gray-500">Multi-Zona System</span>
                    </div>
                </div>
            </div>

            <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
                ${navHTML}
            </nav>

            <div class="p-4 border-t border-white/5">
                <div class="flex items-center gap-3">
                    <img data-user-avatar src="" alt="avatar" class="w-9 h-9 rounded-full ring-2 ring-indigo-500/30">
                    <div class="flex-1 min-w-0">
                        <p data-user-name class="text-sm font-medium text-white truncate">Loading...</p>
                        <span data-user-role class="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">-</span>
                    </div>
                    <button onclick="logout()" title="Logout"
                        class="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const mainContent = document.getElementById('main-content');
        if (mainContent && !document.getElementById('global-broadcast-bar')) {
            const bar = document.createElement('div');
            bar.id = 'global-broadcast-bar';
            bar.className = 'modern-broadcast-bar hidden';
            bar.innerHTML = `
                <div class="broadcast-badge">
                    <span class="flex items-center gap-1.5">
                        <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Broadcast
                    </span>
                </div>
                <div class="broadcast-content-wrapper">
                    <div id="global-broadcast-ticker" class="broadcast-ticker">Memuat pengumuman terbaru...</div>
                </div>
            `;
            mainContent.prepend(bar);
            loadGlobalBroadcast();
        }

        if (typeof updateUserUI === 'function') {
            updateUserUI();
        }
    }

    async function loadGlobalBroadcast() {
        try {
            if (typeof API === 'undefined') return;
            const { broadcast } = await API.get('/api/broadcasts/latest');
            const bar = document.getElementById('global-broadcast-bar');
            const ticker = document.getElementById('global-broadcast-ticker');

            if (broadcast && broadcast.content && bar && ticker) {
                ticker.textContent = broadcast.content;
                bar.classList.remove('hidden');
                const speed = Math.max(20, broadcast.content.length / 5);
                ticker.style.animationDuration = `${speed}s`;
            }
        } catch (err) {
            console.warn('Global broadcast failed:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
    window.loadGlobalBroadcast = loadGlobalBroadcast;
})();
