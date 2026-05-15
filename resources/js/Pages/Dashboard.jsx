import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        const res = await window.axios.get('/api/invitations');
        setItems(res.data ?? []);
    };

    useEffect(() => {
        void load();
    }, []);

    const createInvitation = async () => {
        if (!slug.trim()) return;
        setLoading(true);
        setError('');
        try {
            await window.axios.post('/api/invitations', {
                slug: slug.trim(),
                is_published: false,
                content: {
                    seo: { title: 'New Invitation', description: '' },
                    media: {},
                    couple: { joinedName: '' },
                    rsvp: { maxGuestsDefault: 1, comments: [], qr_enabled: true },
                },
            });
            setSlug('');
            await load();
        } catch (e) {
            setError(e?.response?.data?.error ?? 'Failed to create invitation');
        } finally {
            setLoading(false);
        }
    };

    const removeInvitation = async (id) => {
        await window.axios.delete(`/api/invitations/${id}`);
        await load();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4 flex items-center gap-3">
                                <TextInput
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="invitation-slug"
                                />
                                <PrimaryButton
                                    onClick={createInvitation}
                                    disabled={loading}
                                >
                                    Create
                                </PrimaryButton>
                            </div>
                            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                            <div className="space-y-2">
                                {items.map((inv) => (
                                    <div key={inv.id} className="flex items-center justify-between rounded border p-3">
                                        <div>
                                            <p className="font-medium">/{inv.slug}</p>
                                            <p className="text-xs text-gray-500">
                                                {inv.is_published ? 'Published' : 'Draft'}
                                            </p>
                                            <div className="mt-1 flex gap-3 text-xs">
                                                <Link href={`/invitations/${inv.id}/rsvps`} className="text-blue-600">RSVPs</Link>
                                                <Link href={`/invitations/${inv.id}/guests`} className="text-blue-600">Guests</Link>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="text-sm text-red-600"
                                            onClick={() => void removeInvitation(inv.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-sm text-gray-500">No invitations yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
