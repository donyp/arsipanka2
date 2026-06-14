/**
 * Patch script v2 — handles CRLF line endings properly
 */
const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(serverPath, 'utf8');

let patched = 0;

// 1. Bug status update trigger
if (content.includes("if (error) throw error;\r\n        res.json({ success: true, message: 'Laporan bug berhasil diupdate.' });")) {
    content = content.replace(
        "if (error) throw error;\r\n        res.json({ success: true, message: 'Laporan bug berhasil diupdate.' });",
        `if (error) throw error;

        // Notification: Bug status changed
        try {
            const { data: bugData } = await supabase.from('bug_reports').select('user_id').eq('id', req.params.id).single();
            if (bugData && bugData.user_id) {
                createNotification({ user_id: bugData.user_id, title: '🔄 Status Bug Diperbarui', message: 'Laporan bug Anda kini berstatus "' + status + '".', type: 'info' });
            }
        } catch (ne) {}

        res.json({ success: true, message: 'Laporan bug berhasil diupdate.' });`
    );
    patched++;
    console.log('✅ Bug trigger added');
}

// 2. Broadcast trigger
if (content.includes("if (error) throw error;\r\n        res.json({ success: true, message: 'Pengumuman berhasil disiarkan.' });")) {
    content = content.replace(
        "if (error) throw error;\r\n        res.json({ success: true, message: 'Pengumuman berhasil disiarkan.' });",
        `if (error) throw error;

        // Notification: New broadcast
        createNotification({ role: target_zona_id ? 'admin_zona' : null, zona_id: target_zona_id || null, title: '📢 Pengumuman Baru', message: content.length > 50 ? content.substring(0, 47) + '...' : content, type: 'warning' });

        res.json({ success: true, message: 'Pengumuman berhasil disiarkan.' });`
    );
    patched++;
    console.log('✅ Broadcast trigger added');
}

// 3. Maintenance finished trigger
if (content.includes("res.json({ success: true, status });\r\n    } catch (err) {\r\n        res.status(500).json({ error: 'Gagal memperbarui status sistem: ' + err.message });")) {
    content = content.replace(
        "res.json({ success: true, status });\r\n    } catch (err) {\r\n        res.status(500).json({ error: 'Gagal memperbarui status sistem: ' + err.message });",
        `// Notification: Maintenance status change
        if (!isMaintenance && result) {
            createNotification({ title: '✅ Perbaikan Selesai', message: 'Sistem kembali online: ' + (result.title || 'Selesai'), type: 'success' });
        }

        res.json({ success: true, status });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memperbarui status sistem: ' + err.message });`
    );
    patched++;
    console.log('✅ Maintenance trigger added');
}

fs.writeFileSync(serverPath, content, 'utf8');
console.log(`\n✅ ${patched} notification triggers applied to server.js`);
