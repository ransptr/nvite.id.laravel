import {Head, Link, useForm} from '@inertiajs/react';
import {LoaderCircle} from 'lucide-react';

export default function Register() {
    const { data, setData, transform, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        transform((current) => ({
            ...current,
            name: current.email.split('@')[0] || current.email,
            password_confirmation: current.password,
        }));
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const error = errors.email ?? errors.password ?? errors.name ?? errors.password_confirmation ?? null;

    return (
        <>
            <Head title="Register" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfaf6] px-4">
                <Link href="/" className="mb-10 text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
                    nvite.id
                </Link>

                <div className="w-full max-w-sm">
                    <h1 className="mb-1 font-display text-4xl italic text-[#1a1612]">Create account</h1>
                    <p className="mb-8 text-sm text-[#6b5e52]">Start building your invitation for free</p>

                    <form onSubmit={submit} className="space-y-4">
                        <label className="block space-y-1.5">
                            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">Email</span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-3 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
                            />
                        </label>

                        <label className="block space-y-1.5">
                            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">Password</span>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                required
                                className="w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-3 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
                            />
                        </label>

                        {error ? <p className="text-sm text-red-600">{error}</p> : null}

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9974a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#b8863b] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                            Create account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-[#8a7a6e]">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-[#c9974a] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
