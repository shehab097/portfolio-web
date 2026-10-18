import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useContent } from '../lib/content';
import { navigate } from '../lib/router';
import { isFirebaseConfigured, missingFirebaseVariables } from '../lib/firebase';
import { ADMIN_EMAILS, ADMIN_EMAILS_CONFIGURED } from '../config';
import { CONTENT_SECTIONS, defaultContent } from '../data/defaultContent';
import ProjectsEditor from '../components/admin/ProjectsEditor';
import JsonField from '../components/admin/JsonField';
import JsonEditor from '../components/admin/JsonEditor';

const SECTIONS = [
    { key: 'site', label: 'Site & SEO', hint: 'Title and description' },
    { key: 'navbar', label: 'Navigation', hint: 'Menu links' },
    { key: 'hero', label: 'Hero', hint: 'Name, intro, links' },
    { key: 'projects', label: 'Projects', hint: 'Cards, sorting, pinning' },
    { key: 'skills', label: 'Skills', hint: 'Groups and tags' },
    { key: 'about', label: 'About', hint: 'Background rows' },
    { key: 'contact', label: 'Contact', hint: 'Links and intro' },
];

const countOf = (content, key) => {
    const value = content[key];
    if (!value) return null;
    if (key === 'projects') return (value.items ?? []).length;
    if (key === 'skills') return (value.categories ?? []).length;
    if (key === 'about') return (value.sections ?? []).length;
    if (Array.isArray(value.links)) return value.links.length;
    return null;
};

const buttonBase = 'font-instrument text-base px-4 py-2 rounded-lg border transition-colors disabled:opacity-40 whitespace-nowrap';
const buttonGhost = `${buttonBase} border-white/15 text-bg-light/70 hover:border-primary-dark hover:text-primary-dark`;
const buttonPrimary = `${buttonBase} border-primary-dark/60 bg-primary-dark/10 text-primary-dark hover:bg-primary-dark/20`;

/**
 * "Reset to defaults" is switched off for now. Flip this to `true` to re-enable
 * the button (it replaces the whole draft with the bundled default content).
 */
const RESET_TO_DEFAULTS_ENABLED = false;

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

    const [section, setSection] = useState(CONTENT_SECTIONS[0]);
    const [rawJson, setRawJson] = useState(false);
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
            return '';
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
    if (loading) return <Gate title="Checking your session…" body="One moment." />;
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
                    <div className="flex flex-wrap justify-center gap-3">
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

    const active = SECTIONS.find((item) => item.key === section) ?? SECTIONS[0];
    const value = content[active.key];

    return (
        <div className="min-h-screen bg-bg-dark text-bg-light">
            {/* ---------- Header ---------- */}
            <header className="sticky top-0 z-40 bg-bg-dark/95 backdrop-blur border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
                    <a href="/" className="font-oranienbaum text-xl hover:text-primary-dark transition-colors shrink-0">
                        ← Site
                    </a>
                    <span className="text-bg-light/15">|</span>
                    <span className="font-oranienbaum text-xl shrink-0">Portfolio Admin</span>

                    <div className="ml-auto flex items-center gap-2 md:gap-3 min-w-0">
                        <span className="hidden md:inline">
                            <StatusPill
                                status={status}
                                dirty={dirty}
                                saving={saving}
                                savedFlash={savedFlash}
                                lastSavedAt={lastSavedAt}
                            />
                        </span>
                        <button type="button" onClick={revert} disabled={!dirty || saving} className={buttonGhost}>
                            Revert
                        </button>
                        <button type="button" onClick={handleSave} disabled={!dirty || saving} className={buttonPrimary}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={signOutUser}
                            title={email}
                            aria-label="Sign out"
                            className={`${buttonGhost} px-2.5`}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="md:hidden px-4 pb-3">
                    <StatusPill status={status} dirty={dirty} saving={saving} savedFlash={savedFlash} lastSavedAt={lastSavedAt} />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-[15rem_1fr] gap-8">
                {/* ---------- Section rail ---------- */}
                <aside>
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible">
                        {SECTIONS.map((item) => {
                            const count = countOf(content, item.key);
                            const activeItem = !rawJson && item.key === section;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => {
                                        setSection(item.key);
                                        setRawJson(false);
                                    }}
                                    className={`flex items-center gap-2 text-left font-instrument text-base px-3 py-2 rounded-lg border whitespace-nowrap lg:whitespace-normal transition-colors ${activeItem
                                        ? 'border-primary-dark/60 bg-primary-dark/10 text-primary-dark'
                                        : 'border-transparent text-bg-light/65 hover:text-primary-dark hover:bg-white/[0.03]'
                                        }`}
                                >
                                    <span className="flex-1">{item.label}</span>
                                    {count !== null && (
                                        <span className={`font-instrument text-xs ${activeItem ? 'text-primary-dark/80' : 'text-bg-light/30'}`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        <div className="hidden lg:block border-t border-white/10 mt-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setRawJson((current) => !current)}
                                className={`w-full flex items-center gap-2 text-left font-instrument text-base px-3 py-2 rounded-lg border transition-colors ${rawJson
                                    ? 'border-primary-dark/60 bg-primary-dark/10 text-primary-dark'
                                    : 'border-transparent text-bg-light/65 hover:text-primary-dark hover:bg-white/[0.03]'
                                    }`}
                            >
                                <span className="flex-1">Raw JSON</span>
                                <span className="font-instrument text-xs text-bg-light/30">{'{}'}</span>
                            </button>
                            <span
                                className="block"
                                title={
                                    RESET_TO_DEFAULTS_ENABLED
                                        ? undefined
                                        : 'Disabled for now — re-enable it in src/pages/Admin.jsx'
                                }
                            >
                                <button
                                    type="button"
                                    disabled={!RESET_TO_DEFAULTS_ENABLED}
                                    onClick={() => {
                                        if (!RESET_TO_DEFAULTS_ENABLED) return;
                                        if (
                                            window.confirm(
                                                'Replace every field with the built-in defaults? This only changes the draft until you save.',
                                            )
                                        ) {
                                            resetToDefaults();
                                        }
                                    }}
                                    className={`w-full text-left font-instrument text-sm px-3 py-2 rounded-lg transition-colors ${RESET_TO_DEFAULTS_ENABLED
                                        ? 'text-bg-light/40 hover:text-primary-dark'
                                        : 'text-bg-light/20 cursor-not-allowed'
                                        }`}
                                >
                                    Reset to defaults
                                </button>
                            </span>
                        </div>
                    </nav>

                    <button
                        type="button"
                        onClick={() => setRawJson((current) => !current)}
                        className={`lg:hidden mt-2 w-full font-instrument text-base px-3 py-2 rounded-lg border transition-colors ${rawJson
                            ? 'border-primary-dark/60 bg-primary-dark/10 text-primary-dark'
                            : 'border-white/15 text-bg-light/65'
                            }`}
                    >
                        {rawJson ? 'Back to editor' : 'Raw JSON'}
                    </button>
                </aside>

                {/* ---------- Editor ---------- */}
                <main className="min-w-0 space-y-6">
                    {saveError && <Banner tone="error">{saveError}</Banner>}
                    {error && <Banner tone="error">Firestore: {error}</Banner>}
                    {!ADMIN_EMAILS_CONFIGURED && (
                        <Banner tone="warn">
                            You are signed in, but no owner address is configured. Set <code>VITE_ADMIN_EMAILS</code> in{' '}
                            <code>.env</code> and mirror it in <code>firestore.rules</code> so only your account can publish.
                        </Banner>
                    )}

                    {rawJson ? (
                        <>
                            <PanelHeader eyebrow="Raw data" title="Portfolio JSON">
                                The exact document stored in Firestore <code>portfolio/content</code>.
                            </PanelHeader>
                            <JsonEditor content={content} onApply={replaceContent} />
                        </>
                    ) : (
                        <>
                            <PanelHeader eyebrow={active.key} title={active.label}>
                                {active.hint}. Edits are a draft until you press <span className="text-bg-light/75">Save</span>.
                            </PanelHeader>

                            {active.key === 'projects' ? (
                                <ProjectsEditor
                                    value={value ?? {}}
                                    onChange={(next) => updateContent((current) => ({ ...current, projects: next }))}
                                />
                            ) : value === undefined ? (
                                <p className="font-instrument text-base text-bg-light/50">This section does not exist yet.</p>
                            ) : (
                                <JsonField
                                    name={active.key}
                                    value={value}
                                    onChange={(next) => updateContent((current) => ({ ...current, [active.key]: next }))}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

function PanelHeader({ eyebrow, title, children }) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div className="space-y-1.5">
                <span className="font-instrument text-base text-primary-dark tracking-wide">{eyebrow}</span>
                <h1 className="font-oranienbaum text-3xl md:text-4xl tracking-tight">{title}</h1>
            </div>
            {children && <p className="font-instrument text-sm text-bg-light/45 max-w-sm">{children}</p>}
        </div>
    );
}

function Banner({ tone = 'warn', children }) {
    const tones = {
        warn: 'border-amber-400/40 bg-amber-400/5 text-amber-200/90',
        error: 'border-red-400/40 bg-red-400/5 text-red-200/90',
    };
    return <div className={`border rounded-lg px-4 py-3 font-instrument text-sm ${tones[tone]}`}>{children}</div>;
}

function StatusPill({ status, dirty, saving, savedFlash, lastSavedAt }) {
    let label = 'Loading…';
    let tone = 'text-bg-light/50 border-white/15';

    if (status === 'local') {
        label = 'Offline — defaults only';
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
