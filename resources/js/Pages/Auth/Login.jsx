import {useState} from 'react';
import {Head, Link, useForm} from '@inertiajs/react';
import {LoaderCircle} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [tab, setTab] = useState('password');
    const [magicSent, setMagicSent] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const submitMagicFallback = (e) => {
        e.preventDefault();
        if (!data.email) return;
        setMagicSent(true);
    };

    const error = errors.email ?? errors.password ?? null;

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfaf6] px-4">
                <Link href="/" className="mb-10 text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
                    nvite.id
                </Link>

                <div className="w-full max-w-sm">
                    <h1 className="mb-1 font-display text-4xl italic text-[#1a1612]">Welcome back</h1>
                    <p className="mb-8 text-sm text-[#6b5e52]">Sign in to your account</p>

                    <div className="mb-6 flex rounded-xl bg-[#f0ebe4] p-1">
                        {['password', 'magic'].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    setTab(value);
                                    setMagicSent(false);
                                }}
                                className={`flex-1 rounded-lg py-2 text-[11px] uppercase tracking-[0.28em] transition ${
                                    tab === value
                                        ? 'bg-white text-[#1a1612] shadow-sm'
                                        : 'text-[#8a7a6e] hover:text-[#1a1612]'
                                }`}
                            >
                                {value === 'password' ? 'Password' : 'Magic Link'}
                            </button>
                        ))}
                    </div>

                    {status ? <p className="mb-4 text-sm text-emerald-600">{status}</p> : null}

                    {tab === 'password' ? (
                        <form onSubmit={submit} className="space-y-4">
                            <AuthInput
                                id="email"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                placeholder="you@example.com"
                            />
                            <AuthInput
                                id="password"
                                label="Password"
                                type="password"
                                value={data.password}
                                onChange={(value) => setData('password', value)}
                                placeholder="••••••••"
                            />
                            {error ? <p className="text-sm text-red-600">{error}</p> : null}
                            {canResetPassword ? (
                                <div className="text-right">
                                    <Link href={route('password.request')} className="text-sm text-[#8a7a6e] hover:text-[#1a1612]">
                                        Forgot your password?
                                    </Link>
                                </div>
                            ) : null}
                            <AuthButton loading={processing}>Sign in</AuthButton>
                        </form>
                    ) : magicSent ? (
                        <div className="rounded-xl border border-[#e8ddd4] bg-white p-6 text-center">
                            <h2 className="mb-3 font-display text-3xl italic text-[#1a1612]">Check your inbox</h2>
                            <p className="text-sm leading-relaxed text-[#6b5e52]">
                                We kept the v1 layout here, but v2 uses Laravel password authentication. Use your password to sign in, or reset your password if needed.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={submitMagicFallback} className="space-y-4">
                            <AuthInput
                                id="magic-email"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                                placeholder="you@example.com"
                            />
                            <AuthButton loading={false}>Send magic link</AuthButton>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-[#8a7a6e]">
                        Don&apos;t have an account?{' '}
                        <Link href={route('register')} className="text-[#c9974a] hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

function AuthInput({ id, label, type, value, onChange, placeholder }) {
    return (
        <label className="block space-y-1.5">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">{label}</span>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required
                className="w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-3 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
            />
        </label>
    );
}

function AuthButton({children, loading}) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9974a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#b8863b] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {children}
        </button>
    );
}
