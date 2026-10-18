import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { isFirebaseConfigured, missingFirebaseVariables } from '../lib/firebase';
import { navigate } from '../lib/router';
import { ADMIN_EMAILS, ADMIN_EMAILS_CONFIGURED } from '../config';

const GoogleMark = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a11.97 11.97 0 0 0 0 10.76l3.98-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
);

export default function Login() {
    const { user, email, isAdmin, loading, error, signInWithGoogle, signOutUser } = useAuth();
    const [busy, setBusy] = useState(false);
    const [failure, setFailure] = useState(null);

    // Already the owner? Go straight to the dashboard.
    useEffect(() => {
        if (!loading && user && isAdmin) navigate('/admin', { replace: true });
    }, [loading, user, isAdmin]);

    const handleSignIn = async () => {
        setBusy(true);
        setFailure(null);
        try {
            await signInWithGoogle();
        } catch (signInError) {
            setFailure(signInError?.message ?? 'Sign-in failed.');
        } finally {
            setBusy(false);
        }
    };

    const denied = Boolean(user) && !isAdmin;

    return (
        <main className="min-h-screen bg-bg-dark text-bg-light flex flex-col">
            {/* Header */}
            <header className="max-w-6xl w-full mx-auto px-6 h-20 flex items-center justify-between">
                <a href="/" className="font-oranienbaum text-2xl tracking-tight hover:text-primary-dark transition-colors">
                    Shehab Sarder
                </a>
                <a
                    href="/"
                    className="font-instrument text-lg text-bg-light/50 hover:text-primary-dark transition-colors"
                >
                    ← Back to site
                </a>
            </header>

            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-8">

                        <div className="space-y-3">
                            <span className="font-instrument text-xl text-primary-dark tracking-wide">Admin Access</span>
                            <h1 className="font-oranienbaum text-4xl tracking-tight leading-none">
                                Sign in to manage the portfolio
                            </h1>
                            <p className="font-instrument text-base text-bg-light/60">
                                Google sign-in only. Access is limited to the owner&apos;s account.
                            </p>
                        </div>

                        {!isFirebaseConfigured && (
                            <Notice tone="error">
                                Firebase is not configured, so sign-in is unavailable. Add{' '}
                                {missingFirebaseVariables.length > 0 ? (
                                    <>
                                        <code>{missingFirebaseVariables.join(', ')}</code> to
                                    </>
                                ) : (
                                    'the Firebase keys to'
                                )}{' '}
                                <code>.env</code> (copy <code>.env.example</code>) and restart the dev server.
                            </Notice>
                        )}

                        {!ADMIN_EMAILS_CONFIGURED && (
                            <Notice tone="warn">
                                No owner account is set yet, so nobody can reach the dashboard. Add your Google
                                address to <code>VITE_ADMIN_EMAILS</code> in <code>.env</code> (and mirror it in{' '}
                                <code>firestore.rules</code>).
                            </Notice>
                        )}

                        {denied && (
                            <Notice tone="error">
                                <span className="text-bg-light/80">{email}</span> is not authorized for this dashboard.
                            </Notice>
                        )}

                        {(failure || error) && <Notice tone="error">{failure || error}</Notice>}

                        {loading ? (
                            <p className="font-instrument text-base text-bg-light/50">Checking your session…</p>
                        ) : user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-primary-dark/20 border border-primary-dark/40" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-instrument text-base truncate">{user.displayName || 'Signed in'}</p>
                                        <p className="font-instrument text-sm text-bg-light/50 truncate">{email}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={signOutUser}
                                    className="w-full font-instrument text-lg px-6 py-3 rounded-lg border border-white/20 text-bg-light hover:border-primary-dark hover:text-primary-dark transition-colors"
                                >
                                    Use a different account
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSignIn}
                                disabled={busy || !isFirebaseConfigured}
                                className="w-full flex items-center justify-center gap-3 font-instrument text-lg px-6 py-3.5 rounded-lg bg-bg-light text-bg-dark hover:bg-white transition-colors disabled:opacity-50"
                            >
                                <GoogleMark />
                                {busy ? 'Opening Google…' : 'Continue with Google'}
                            </button>
                        )}

                        <p className="font-instrument text-sm text-bg-light/35 leading-relaxed">
                            Only the account listed in <code>.env</code> and <code>firestore.rules</code> can edit
                            content. Everyone else is signed straight back out.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Notice({ tone = 'warn', children }) {
    const tones = {
        warn: 'border-amber-400/40 bg-amber-400/5 text-amber-200/90',
        error: 'border-red-400/40 bg-red-400/5 text-red-200/90',
        info: 'border-primary-dark/40 bg-primary-dark/5 text-bg-light/80',
    };
    return (
        <div className={`border rounded-lg px-4 py-3 font-instrument text-sm leading-relaxed ${tones[tone]}`}>
            {children}
        </div>
    );
}
