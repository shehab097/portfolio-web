import React, { useMemo, useState } from 'react';

const buttonClass =
    'font-instrument text-sm px-3.5 py-1.5 rounded-md border border-white/15 text-bg-light/70 hover:border-primary-dark hover:text-primary-dark transition-colors disabled:opacity-40 disabled:hover:text-bg-light/70 disabled:hover:border-white/15';

/**
 * Raw JSON view of the whole portfolio — read it, copy it, download it,
 * paste a new version in. Invalid JSON is reported before it can be applied.
 */
export default function JsonEditor({ content, onApply }) {
    const serialized = useMemo(() => JSON.stringify(content, null, 2), [content]);
    const [text, setText] = useState(serialized);
    const [syncedFrom, setSyncedFrom] = useState(serialized);
    const [parseError, setParseError] = useState(null);
    const [message, setMessage] = useState(null);

    // Follow external changes (field editor, revert, server) unless the user is
    // mid-edit with text that no longer matches the current content.
    if (serialized !== syncedFrom && text === syncedFrom) {
        setSyncedFrom(serialized);
        setText(serialized);
    }

    const validate = (value) => {
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
                throw new Error('Top level must be a JSON object.');
            }
            setParseError(null);
            return parsed;
        } catch (error) {
            setParseError(error.message);
            return null;
        }
    };

    const handleChange = (value) => {
        setText(value);
        setMessage(null);
        validate(value);
    };

    const handleFormat = () => {
        const parsed = validate(text);
        if (parsed) {
            const formatted = JSON.stringify(parsed, null, 2);
            setText(formatted);
            setSyncedFrom(formatted);
        }
    };

    const handleApply = () => {
        const parsed = validate(text);
        if (!parsed) return;
        const formatted = JSON.stringify(parsed, null, 2);
        setText(formatted);
        setSyncedFrom(formatted);
        onApply(parsed);
        setMessage('JSON applied to the draft. Press Save to publish.');
    };

    const handleDownload = () => {
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'portfolio.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleUpload = (event) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => handleChange(String(reader.result));
        reader.readAsText(file);
        event.currentTarget.value = '';
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setMessage('JSON copied to clipboard.');
        } catch {
            setMessage('Clipboard unavailable — select the text and copy manually.');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={handleFormat} className={buttonClass}>
                    Format
                </button>
                <button
                    type="button"
                    onClick={handleApply}
                    disabled={Boolean(parseError)}
                    className={buttonClass}
                >
                    Apply to draft
                </button>
                <button type="button" onClick={handleCopy} className={buttonClass}>
                    Copy
                </button>
                <button type="button" onClick={handleDownload} className={buttonClass}>
                    Download .json
                </button>
                <label className={`${buttonClass} cursor-pointer`}>
                    Import .json
                    <input type="file" accept="application/json,.json" className="hidden" onChange={handleUpload} />
                </label>
            </div>

            <textarea
                spellCheck={false}
                value={text}
                onInput={(event) => handleChange(event.currentTarget.value)}
                className={`w-full h-[60vh] bg-black/40 border rounded-lg p-4 font-mono text-sm leading-relaxed text-bg-light/90 focus:outline-none resize-y ${parseError ? 'border-red-400/60' : 'border-white/10 focus:border-primary-dark/60'
                    }`}
            />

            <div className="min-h-[1.5rem] font-instrument text-sm">
                {parseError ? (
                    <span className="text-red-400">Invalid JSON: {parseError}</span>
                ) : message ? (
                    <span className="text-primary-dark">{message}</span>
                ) : (
                    <span className="text-bg-light/35">Valid JSON · {serialized.length} characters in the live document</span>
                )}
            </div>
        </div>
    );
}
