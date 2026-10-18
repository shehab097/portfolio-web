import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useContent } from '../lib/content';
import { navigate } from '../lib/router';
import { isFirebaseConfigured, missingFirebaseVariables } from '../lib/firebase';
import { ADMIN_EMAILS, ADMIN_EMAILS_CONFIGURED } from '../config';
import { CONTENT_SECTIONS, defaultContent } from '../data/defaultContent';
import JsonField from '../components/admin/JsonField';
import JsonEditor from '../components/admin/JsonEditor';

const SECTION_LABELS = {
    site: 'Site & SEO',
    navbar: 'Navigation',
    hero: 'Hero',
    projects: 'Projects',
    skills: 'Skills',
    about: 'About',
    contact: 'Contact',
};

const buttonBase =
    'font-instrument text-base px-4 py-2 rounded-lg border transition-colors disabled:opacity-40 whitespace-nowrap';
const buttonGhost = `${buttonBase} border-white/15 text-bg-light/70 hover:border-primary-dark hover:text-primary-dark`;
const buttonPrimary = `${buttonBase} border-primary-dark/60 bg-primary-dark/10 text-primary-dark hover:bg-primary-dark/20`;

export default function Admin() {
    const { user, email, isAdmin, loading, signOutUser } = useAuth();
    const {
        content,
        status,
        error,
        saving,
        dirty,
        lastSavedAt,
        updateContent,
        replaceContent,
        saveContent,
        revert,
        resetToDefaults,
    } = useContent();

    const [tab, setTab] = useState('fields');
    const [section, setSection] = useState(CONTENT_SECTIONS[0]);
    const [saveError, setSaveError] = useState(null);
    const [savedFlash, setSavedFlash] = useState(false);

    const handleSave = async () => {
        setSaveError(null);
        try {
            await saveContent();
            setSavedFlash(true);
        } catch (saveFailure) {
            setSaveError(saveFailure?.message ?? 'Could not save.');
        }
    };

    useEffect(() => {
        if (!savedFlash) return undefined;
        const timeout = setTimeout(() => setSavedFlash(false), 2500);
        return () => clearTimeout(timeout);
    }, [savedFlash]);

    // Cmd/Ctrl+S publishes.
    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
                event.preventDefault();
                if (dirty && !saving && isAdmin) handleSave();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    });

    // Warn before leaving with unpublished edits.
    useEffect(() => {
        const onBeforeUnload = (event) => {
            if (!dirty) return undefined;
            event.preventDefault();
            event.returnValue = '';
            return ''
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [dirty]);

    /* ---------- gates ---------- */
    if (!isFirebaseConfigured) {
        return (
            <Gate
                title="Firebase is not configured"
                body={`Add ${missingFirebaseVariables.join(', ') || 'your Firebase keys'} to .env (copy .env.example) and restart the dev server.`}
            />
        );
    }
    if (loading) {
        return <Gate title="Checking your session…" body="One moment." />;
    }
    if (!user) {
        return (
            <Gate
                title="Sign in required"
                body="This dashboard is private. Continue with the owner's Google account."
                action={
                    <button type="button" onClick={() => navigate('/login')} className={buttonPrimary}>
                        Go to login
                    </button>
                }
            />
        );
    }
    if (!isAdmin) {
        return (
            <Gate
                title="Not authorized"
                body={`${email} is not allowed to edit this portfolio. Sign in with the owner account instead.`}
                action={
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => navigate('/login')} className={buttonGhost}>
                            Switch account
                        </button>
                        <button type="button" onClick={signOutUser} className={buttonGhost}>
                            Sign out
                        </button>
                    </div>
                }
            />
        );
    }

    const activeValue = content[section] ?? {};
    const sectionIsEmpty = activeValue === null || activeValue === undefined;

    return (
        <div className="min-h-screen bg-bg-dark text-bg-light flex flex-col">
            {/* ---------- Top bar ---------- */}
            <header className="sticky top-0 z-40 bg-bg-dark/95 backdrop-blur border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <a href="/" className="font-oranienbaum text-2xl tracking-tight hover:text-primary-dark transition-colors shrink-0">
                            Admin
                        </a>
                        <span className="hidden md:inline text-bg-light/20">/</span>
                        <span className="hidden md:inline font-instrument text-base text-bg-light/50 truncate">
                            {email}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <span className="hidden sm:inline">
                            <StatusPill status={status} dirty={dirty} saving={saving} savedFlash={savedFlash} lastSavedAt={lastSavedAt} />
                        </span>
                        <button type="button" onClick={revert} disabled={!dirty || saving} className={buttonGhost}>
                            Revert
                        </button>
                        <button type="button" onClick={handleSave} disabled={!dirty || saving} className={buttonPrimary}>
                            {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
                        </button>
                        <button type="button" onClick={signOutUser} className={buttonGhost} title="Sign out">
                            Sign out
                        </button>
                    </div>
                </div>
                <div className="sm:hidden px-4 pb-3">
                    <StatusPill status={status} dirty={dirty} saving={saving} savedFlash={savedFlash} lastSavedAt={lastSavedAt} />
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-8">
                {/* ---------- Sidebar ---------- */}
                <aside className="space-y-6">
                    <div className="space-y-3">
                        <span className="font-instrument text-sm uppercase tracking-wider text-bg-light/40">Tab</span>
                        <div className="flex gap-2">
                            {[
                                ['fields', 'Fields'],
                                ['json', 'JSON'],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setTab(key)}
                                    className={`flex-1 font-instrument text-base px-3 py-2 rounded-lg border transition-colors ${tab === key
                                        ? 'border-primary-dark/60 bg-primary-dark/10 text-primary-dark'
                                        : 'border-white/10 text-bg-light/60 hover:text-primary-dark hover:border-primary-dark/40'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {tab === 'fields' && (
                        <div className="space-y-2">
                            <span className="font-instrument text-sm uppercase tracking-wider text-bg-light/40">Sections</span>
                            <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-1">
                                {CONTENT_SECTIONS.map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setSection(key)}
                                        className={`text-left font-instrument text-lg px-3 py-2 rounded-lg border whitespace-nowrap lg:whitespace-normal transition-colors ${section === key
                                            ? 'border-primary-dark/60 bg-primary-dark/10 text-primary-dark'
                                            : 'border-transparent text-bg-light/70 hover:text-primary-dark hover:bg-white/[0.03]'
                                            }`}
                                    >
                                        {SECTION_LABELS[key] ?? key}
                                        <span className="block font-instrument text-xs text-bg-light/30">{key}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}

                    <div className="space-y-2 border-t border-white/10 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm('Replace every field with the built-in defaults? This only changes the draft until you save.')) {
                                    resetToDefaults();
                                }
                            }}
                            className={`${buttonGhost} w-full`}
                        >
                            Reset to defaults
                        </button>
                        <p className="font-instrument text-xs text-bg-light/35 leading-relaxed">
                            {Object.keys(defaultContent).length} sections ·{' '}
                            {(defaultContent.projects?.items ?? []).length} default projects
                        </p>
                    </div>
                </aside>

                {/* ---------- Editor ---------- */}
                <section className="space-y-6 min-w-0">
                    {saveError && (
                        <div className="border border-red-400/40 bg-red-400/5 rounded-lg px-4 py-3 font-instrument text-sm text-red-200/90">
                            {saveError}
                        </div>
                    )}
                    {error && (
                        <div className="border border-red-400/40 bg-red-400/5 rounded-lg px-4 py-3 font-instrument text-sm text-red-200/90">
                            Firestore: {error}
                        </div>
                    )}
                    {!ADMIN_EMAILS_CONFIGURED && (
                        <div className="border border-amber-400/40 bg-amber-400/5 rounded-lg px-4 py-3 font-instrument text-sm text-amber-200/90">
                            You are signed in, but no real owner address is configured yet. Set{' '}
                            <code>VITE_ADMIN_EMAILS</code> in <code>.env</code> and mirror it in{' '}
                            <code>firestore.rules</code> so only your account can publish.
                        </div>
                    )}

                    {tab === 'fields' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
                                <div className="space-y-2">
                                    <span className="font-instrument text-lg text-primary-dark tracking-wide">
                                        {section}
                                    </span>
                                    <h1 className="font-oranienbaum text-3xl md:text-4xl tracking-tight">
                                        {SECTION_LABELS[section] ?? section}
                                    </h1>
                                </div>
                                <p className="font-instrument text-sm text-bg-light/45 max-w-sm">
                                    Edits appear on the site immediately as a draft. Nothing is public until you press
                                    Save.
                                </p>
                            </div>

                            {sectionIsEmpty ? (
                                <p className="font-instrument text-base text-bg-light/50">This section does not exist yet.</p>
                            ) : (
                                <JsonField
                                    name={section}
                                    value={activeValue}
                                    onChange={(next) => updateContent((current) => ({ ...current, [section]: next }))}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
                                <div className="space-y-2">
                                    <span className="font-instrument text-lg text-primary-dark tracking-wide">Raw data</span>
                                    <h1 className="font-oranienbaum text-3xl md:text-4xl tracking-tight">Portfolio JSON</h1>
                                </div>
                                <p className="font-instrument text-sm text-bg-light/45 max-w-sm">
                                    The exact document stored in Firestore <code>portfolio/content</code>.
                                </p>
                            </div>
                            <JsonEditor content={content} onApply={replaceContent} />
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function StatusPill({ status, dirty, saving, savedFlash, lastSavedAt }) {
    let label = 'Loading…';
    let tone = 'text-bg-light/50 border-white/15';

    if (status === 'local') {
        label = 'Offline mode — defaults only';
        tone = 'text-amber-200/80 border-amber-400/40';
    } else if (status === 'error') {
        label = 'Database unreachable';
        tone = 'text-red-200/80 border-red-400/40';
    } else if (saving) {
        label = 'Saving…';
    } else if (savedFlash) {
        label = 'Published';
        tone = 'text-primary-dark border-primary-dark/50';
    } else if (dirty) {
        label = 'Unpublished changes';
        tone = 'text-amber-200/80 border-amber-400/40';
    } else if (status === 'empty') {
        label = 'No document yet — press Save';
        tone = 'text-amber-200/80 border-amber-400/40';
    } else if (status === 'live') {
        const when = lastSavedAt?.toDate ? lastSavedAt.toDate() : lastSavedAt instanceof Date ? lastSavedAt : null;
        label = when ? `Live · saved ${when.toLocaleString()}` : 'Live';
        tone = 'text-primary-dark border-primary-dark/40';
    }

    return (
        <span className={`inline-block font-instrument text-sm px-3 py-1 rounded-full border whitespace-nowrap ${tone}`}>
            {label}
        </span>
    );
}

function Gate({ title, body, action }) {
    return (
        <main className="min-h-screen bg-bg-dark text-bg-light flex items-center justify-center px-6">
            <div className="w-full max-w-lg bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-5 text-center">
                <h1 className="font-oranienbaum text-3xl tracking-tight">{title}</h1>
                <p className="font-instrument text-lg text-bg-light/60 leading-relaxed">{body}</p>
                <div className="flex justify-center gap-3 pt-2">
                    {action ?? (
                        <a href="/" className={buttonGhost}>
                            Back to site
                        </a>
                    )}
                </div>
                <p className="font-instrument text-xs text-bg-light/30">
                    {ADMIN_EMAILS.length > 0
                        ? `Allowed accounts: ${ADMIN_EMAILS.join(', ')}`
                        : 'No owner account configured — set VITE_ADMIN_EMAILS in .env'}
                </p>
            </div>
        </main>
    );
}
