import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function GuestManager({ invitationId, slug }) {
    const [rows, setRows] = useState([]);
    const [name, setName] = useState('');
    const [phoneRaw, setPhoneRaw] = useState('');
    const [phoneNormalized, setPhoneNormalized] = useState('');
    const [guestKey, setGuestKey] = useState('');

    const load = async () => {
        const res = await window.axios.get(`/api/invitations/${invitationId}/guests`);
        setRows(res.data ?? []);
    };

    useEffect(() => {
        void load();
    }, [invitationId]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Guest Manager</h2>}>
            <Head title="Guest Manager" />
            <div className="mx-auto max-w-5xl py-8">
                <div className="mb-4"><Link href={route('dashboard')} className="text-sm text-gray-600">Back</Link></div>
                <div className="mb-4 grid grid-cols-5 gap-2">
                    <input className="rounded border p-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="rounded border p-2 text-sm" placeholder="Raw" value={phoneRaw} onChange={(e) => setPhoneRaw(e.target.value)} />
                    <input className="rounded border p-2 text-sm" placeholder="Normalized" value={phoneNormalized} onChange={(e) => setPhoneNormalized(e.target.value)} />
                    <input className="rounded border p-2 text-sm" placeholder="Guest key" value={guestKey} onChange={(e) => setGuestKey(e.target.value)} />
                    <button className="rounded bg-gray-900 px-3 py-2 text-sm text-white" onClick={async () => { await window.axios.post(`/api/invitations/${invitationId}/guests`, { name, phone_raw: phoneRaw, phone_normalized: phoneNormalized, guest_key: guestKey }); setName(''); setPhoneRaw(''); setPhoneNormalized(''); setGuestKey(''); await load(); }}>Add</button>
                </div>
                <div className="mb-4 flex gap-2">
                    <button className="rounded border px-3 py-2 text-sm" onClick={async () => { await window.axios.post(`/api/invitations/${invitationId}/blast/mode`, { mode: 'all' }); }}>Send all</button>
                    <button className="rounded border px-3 py-2 text-sm" onClick={async () => { await window.axios.post(`/api/invitations/${invitationId}/blast/mode`, { mode: 'retry_failed' }); }}>Retry failed</button>
                </div>
                <div className="rounded border bg-white">
                    {rows.map((g) => (
                        <div key={g.id} className="flex items-center justify-between border-b p-3 text-sm last:border-b-0">
                            <div>
                                <div className="font-medium">{g.name}</div>
                                <div className="text-gray-500">{g.phone_normalized} · {g.send_status}</div>
                            </div>
                            <div className="text-xs text-gray-500">{g.guest_key}</div>
                        </div>
                    ))}
                    {rows.length === 0 && <div className="p-4 text-sm text-gray-500">No guests yet.</div>}
                </div>
                <p className="mt-4 text-xs text-gray-500">Slug: /{slug}</p>
            </div>
        </AuthenticatedLayout>
    );
}
