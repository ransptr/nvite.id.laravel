import {useEffect, useMemo, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ArrowLeft, Send} from 'lucide-react';
import {generateGuestKey, normalizeIdPhone, parseGuestCsv, mapGuestRows} from '@/lib/guestManager';

export default function GuestManager() {
    const {id} = useParams();
    const [guests, setGuests] = useState([]);
    const [meta, setMeta] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selected, setSelected] = useState({});
    const [importReport, setImportReport] = useState({added: 0, skipped: 0, errors: []});
    const [blastLogs, setBlastLogs] = useState([]);

    useEffect(() => {
        if (!id) return;

        Promise.all([
            window.axios.get('/api/invitations'),
            window.axios.get(`/api/invitations/${id}/guests`),
            window.axios.get(`/api/invitations/${id}/blast/logs`),
        ]).then(([invRes, guestsRes, logsRes]) => {
            const invitation = (invRes.data ?? []).find((item) => String(item.id) === String(id)) ?? null;
            setMeta(invitation);
            setGuests(guestsRes.data ?? []);
            setBlastLogs(logsRes.data ?? []);
        });
    }, [id]);

    const selectedIds = useMemo(() => Object.keys(selected).filter((key) => selected[key]), [selected]);

    const reload = async () => {
        if (!id) return;
        const [guestsRes, logsRes] = await Promise.all([
            window.axios.get(`/api/invitations/${id}/guests`),
            window.axios.get(`/api/invitations/${id}/blast/logs`),
        ]);
        setGuests(guestsRes.data ?? []);
        setBlastLogs(logsRes.data ?? []);
    };

    const addGuest = async () => {
        if (!id) return;
        const normalized = normalizeIdPhone(phone);
        if (!name.trim() || !normalized) return;
        await window.axios.post(`/api/invitations/${id}/guests`, {
            name: name.trim(),
            phone_raw: phone.trim(),
            phone_normalized: normalized,
            guest_key: generateGuestKey(name, normalized),
        });
        setName('');
        setPhone('');
        await reload();
    };

    const importCsv = async (file) => {
        if (!id) return;
        let rows = [];
        if (file.name.toLowerCase().endsWith('.xlsx')) {
            const {read, utils} = await import('xlsx');
            const ab = await file.arrayBuffer();
            const wb = read(ab, {type: 'array'});
            const ws = wb.Sheets[wb.SheetNames[0]];
            const jsonRows = utils.sheet_to_json(ws, {defval: ''});
            rows = mapGuestRows(jsonRows);
        } else {
            rows = parseGuestCsv(await file.text());
        }

        const errors = [];
        const seen = new Set();
        const valid = rows.map((row) => {
            const normalized = normalizeIdPhone(row.phone);
            if (!row.name) {
                errors.push(`Row ${row.row}: missing name`);
                return null;
            }
            if (!normalized) {
                errors.push(`Row ${row.row}: invalid phone`);
                return null;
            }
            if (seen.has(normalized)) {
                errors.push(`Row ${row.row}: duplicate phone in file`);
                return null;
            }
            seen.add(normalized);
            return {
                name: row.name,
                phone_raw: row.phone,
                phone_normalized: normalized,
                guest_key: generateGuestKey(row.name, normalized),
            };
        }).filter(Boolean);

        if (valid.length === 0) {
            setImportReport({added: 0, skipped: rows.length, errors});
            return;
        }

        try {
            await window.axios.post(`/api/invitations/${id}/guests/import`, {guests: valid});
            await reload();
            setImportReport({added: valid.length, skipped: rows.length - valid.length, errors});
        } catch (error) {
            setImportReport({added: 0, skipped: rows.length, errors: [...errors, error?.response?.data?.message ?? 'Import failed']});
        }
    };

    const blast = async (mode) => {
        if (!id) return;
        if (mode === 'selected') {
            if (selectedIds.length === 0) return;
            await window.axios.post(`/api/invitations/${id}/blast`, {guest_ids: selectedIds});
        } else {
            await window.axios.post(`/api/invitations/${id}/blast/mode`, {mode: 'all'});
        }
        await reload();
    };

    const retryFailed = async () => {
        if (!id) return;
        await window.axios.post(`/api/invitations/${id}/blast/mode`, {mode: 'retry_failed'});
        await reload();
    };

    const downloadTemplate = async () => {
        const {utils, writeFile} = await import('xlsx');
        const rows = [
            {name: 'Budi Santoso', phone: '081234567890'},
            {name: 'Siti Rahma', phone: '6281234567891'},
        ];
        const ws = utils.json_to_sheet(rows);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Guests');
        writeFile(wb, 'guest-import-template.xlsx');
    };

    return (
        <div className="min-h-screen bg-[#fdfaf6]">
            <header className="border-b border-[#e8ddd4] bg-white/80">
                <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
                    <Link to="/" className="flex items-center gap-1.5 text-sm text-[#8a7a6e] hover:text-[#1a1612]">
                        <ArrowLeft className="h-4 w-4" /> Dashboard
                    </Link>
                    <span className="text-sm font-medium text-[#1a1612]">{meta?.content?.couple?.joinedName ?? 'Guest Manager'}</span>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest name" className="rounded-xl border border-[#e8ddd4] bg-white p-3 text-[#1a1612] placeholder:text-[#b9ada2]" />
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxx" className="rounded-xl border border-[#e8ddd4] bg-white p-3 text-[#1a1612] placeholder:text-[#b9ada2]" />
                    <button onClick={() => void addGuest()} className="rounded-xl bg-[#c9974a] px-4 text-white">Add guest</button>
                </div>
                <div className="mb-6 flex flex-wrap items-center gap-3 text-[#6b5e52]">
                    <input type="file" accept=".csv,.xlsx" className="text-sm text-[#6b5e52] file:mr-3 file:rounded-lg file:border file:border-[#e8ddd4] file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#6b5e52] hover:file:border-[#c9974a]" onChange={(e) => e.target.files?.[0] && void importCsv(e.target.files[0])} />
                    <button onClick={() => void downloadTemplate()} className="rounded-xl border border-[#d9cfc5] bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6b5e52] hover:border-[#c9974a] hover:text-[#c9974a]">Download template</button>
                    <button onClick={() => void blast('selected')} className="rounded-xl border border-[#d9cfc5] bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6b5e52] hover:border-[#c9974a] hover:text-[#c9974a]">Send selected</button>
                    <button onClick={() => void blast('all')} className="inline-flex items-center gap-2 rounded-xl bg-[#1a1612] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"><Send className="h-3.5 w-3.5" />Send all</button>
                    <button onClick={() => void retryFailed()} className="rounded-xl border border-[#d9cfc5] bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6b5e52] hover:border-[#c9974a] hover:text-[#c9974a]">Retry failed</button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-[#e8ddd4] bg-white">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#efe7df] bg-[#fcfaf7]">
                                <th className="p-3" />
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7a6e]">Name</th>
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7a6e]">Phone</th>
                                <th className="p-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7a6e]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest) => (
                                <tr key={guest.id} className="border-t border-[#f1e9e2]">
                                    <td className="p-3"><input type="checkbox" checked={!!selected[guest.id]} onChange={(e) => setSelected((prev) => ({...prev, [guest.id]: e.target.checked}))} /></td>
                                    <td className="p-3 text-[#1a1612]">{guest.name}</td>
                                    <td className="p-3 text-[#5f5348]">{guest.phone_normalized}</td>
                                    <td className="p-3">
                                        <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${guest.send_status === 'sent' ? 'bg-emerald-50 text-emerald-700' : guest.send_status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
                                            {guest.send_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(importReport.added > 0 || importReport.skipped > 0 || importReport.errors.length > 0) ? (
                    <div className="mt-4 rounded-xl border border-[#e8ddd4] bg-white p-4 text-sm text-[#6b5e52]">
                        <p>Imported: {importReport.added} • Skipped: {importReport.skipped}</p>
                        {importReport.errors.length > 0 ? <p className="mt-2 text-xs text-red-600">{importReport.errors.slice(0, 5).join(' | ')}</p> : null}
                    </div>
                ) : null}
                {blastLogs.length > 0 ? (
                    <div className="mt-4 rounded-xl border border-[#e8ddd4] bg-white p-4 text-sm text-[#6b5e52]">
                        <p className="mb-2 font-medium text-[#1a1612]">Recent blast runs</p>
                        {blastLogs.map((log) => (
                            <p key={log.id} className="text-xs">
                                {new Date(log.created_at).toLocaleString('id-ID')} - total {log.total}, success {log.success}, failed {log.failed}
                            </p>
                        ))}
                    </div>
                ) : null}
            </main>
        </div>
    );
}
