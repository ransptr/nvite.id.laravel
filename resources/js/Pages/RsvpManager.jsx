import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function RsvpManager({ invitationId, slug }) {
    const [rows, setRows] = useState([]);
    const [summary, setSummary] = useState(null);

    const load = async () => {
        const [listRes, sumRes] = await Promise.all([
            window.axios.get(`/api/invitations/${invitationId}/rsvps`),
            window.axios.get(`/api/invitations/${invitationId}/rsvps/summary`),
        ]);
        setRows(listRes.data ?? []);
        setSummary(sumRes.data ?? null);
    };

    useEffect(() => {
        void load();
    }, [invitationId]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">RSVP Manager</h2>}>
            <Head title="RSVP Manager" />
            <div className="mx-auto max-w-5xl py-8">
                <div className="mb-4 flex items-center justify-between">
                    <Link href={route('dashboard')} className="text-sm text-gray-600">Back</Link>
                    <a href={`/api/invitations/${invitationId}/rsvps/export`} className="text-sm text-blue-600">Export CSV</a>
                </div>
                {summary && (
                    <div className="mb-4 grid grid-cols-4 gap-3 text-sm">
                        <div className="rounded border p-3">Attending: {summary.attending_count}</div>
                        <div className="rounded border p-3">Not attending: {summary.not_attending_count}</div>
                        <div className="rounded border p-3">Responses: {summary.total_responses}</div>
                        <div className="rounded border p-3">Guests: {summary.total_guests}</div>
                    </div>
                )}
                <div className="rounded border bg-white">
                    {rows.map((r) => (
                        <div key={r.id} className="flex items-center justify-between border-b p-3 text-sm last:border-b-0">
                            <div>
                                <div className="font-medium">{r.guest_name}</div>
                                <div className="text-gray-500">{r.attendance} · {r.guest_count}</div>
                            </div>
                            <button className="text-red-600" onClick={async () => { await window.axios.delete(`/api/rsvps/${r.id}`); await load(); }}>Delete</button>
                        </div>
                    ))}
                    {rows.length === 0 && <div className="p-4 text-sm text-gray-500">No RSVP yet.</div>}
                </div>
                <p className="mt-4 text-xs text-gray-500">Slug: /{slug}</p>
            </div>
        </AuthenticatedLayout>
    );
}
