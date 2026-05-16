import {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {ArrowLeft, Download, Trash2, Users} from 'lucide-react';

export default function RsvpManager() {
    const {id} = useParams();
    const [rsvps, setRsvps] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        Promise.all([
            window.axios.get('/api/invitations'),
            window.axios.get(`/api/invitations/${id}/rsvps`),
        ]).then(([invRes, rsvpRes]) => {
            const invitation = (invRes.data ?? []).find((item) => String(item.id) === String(id)) ?? null;
            setMeta(invitation);
            setRsvps(rsvpRes.data ?? []);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [id]);

    const handleDelete = async (rsvpId) => {
        if (!window.confirm('Delete this RSVP?')) return;
        setDeletingId(rsvpId);
        await window.axios.delete(`/api/rsvps/${rsvpId}`);
        setRsvps((prev) => prev.filter((r) => r.id !== rsvpId));
        setDeletingId(null);
    };

    const exportCsv = () => {
        window.location.href = `/api/invitations/${id}/rsvps/export`;
    };

    const attending = rsvps.filter((r) => r.attendance === 'attending');
    const notAttending = rsvps.filter((r) => r.attendance === 'not_attending');
    const totalGuests = attending.reduce((sum, r) => sum + (r.guest_count ?? 1), 0);
    const coupleName = meta?.content?.couple?.joinedName ?? meta?.slug ?? '';

    return (
        <div className="min-h-screen bg-[#fdfaf6]">
            <header className="border-b border-[#e8ddd4] bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-1.5 text-sm text-[#8a7a6e] hover:text-[#1a1612]">
                            <ArrowLeft className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <span className="text-[#e8ddd4]">/</span>
                        <span className="text-sm font-medium text-[#1a1612]">
                            {coupleName || meta?.slug || 'RSVPs'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={exportCsv}
                        disabled={rsvps.length === 0}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#e8ddd4] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#6b5e52] transition hover:border-[#c9974a] hover:text-[#c9974a] disabled:opacity-40"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-10">
                <h1 className="mb-6 font-display text-4xl italic text-[#1a1612]">RSVP Responses</h1>

                <div className="mb-8 grid grid-cols-3 gap-4">
                    {[
                        {label: 'Attending', value: attending.length, sub: `${totalGuests} total guests`},
                        {label: 'Not attending', value: notAttending.length, sub: ''},
                        {label: 'Total responses', value: rsvps.length, sub: ''},
                    ].map((card) => (
                        <div key={card.label} className="rounded-2xl border border-[#e8ddd4] bg-white p-5">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a7a6e]">{card.label}</p>
                            <p className="mt-2 font-display text-4xl italic text-[#1a1612]">{card.value}</p>
                            {card.sub ? <p className="mt-1 text-xs text-[#c4b9af]">{card.sub}</p> : null}
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
                    </div>
                ) : null}

                {!loading && rsvps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e8ddd4] py-20 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4ede3]">
                            <Users className="h-6 w-6 text-[#c9974a]" />
                        </div>
                        <h2 className="mb-2 font-display text-2xl italic text-[#1a1612]">No responses yet</h2>
                        <p className="max-w-xs text-sm text-[#8a7a6e]">RSVPs will appear here once guests submit their response.</p>
                    </div>
                ) : null}

                {!loading && rsvps.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-[#e8ddd4] bg-white">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#f0ebe4]">
                                    {['Name', 'Attendance', 'Guests', 'Wishes', 'Date', ''].map((heading) => (
                                        <th key={heading} className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.28em] text-[#8a7a6e]">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rsvps.map((rsvp, index) => (
                                    <tr key={rsvp.id} className={`border-b border-[#f0ebe4] last:border-0 ${index % 2 === 1 ? 'bg-[#fdfaf6]' : ''}`}>
                                        <td className="px-5 py-4 font-medium text-[#1a1612]">{rsvp.guest_name}</td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] ${rsvp.attendance === 'attending' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {rsvp.attendance === 'attending' ? 'Attending' : 'Not attending'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[#6b5e52]">{rsvp.attendance === 'attending' ? rsvp.guest_count : '—'}</td>
                                        <td className="max-w-[240px] px-5 py-4 text-[#6b5e52]"><p className="line-clamp-2">{rsvp.wishes || '—'}</p></td>
                                        <td className="whitespace-nowrap px-5 py-4 text-xs text-[#c4b9af]">
                                            {new Date(rsvp.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() => void handleDelete(rsvp.id)}
                                                disabled={deletingId === rsvp.id}
                                                className="rounded-lg p-1.5 text-[#c4b9af] transition hover:text-red-500 disabled:opacity-40"
                                                title="Delete RSVP"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
