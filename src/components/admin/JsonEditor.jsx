import React, { useMemo, useState } from 'react';
import { GhostButton, GhostLabel } from './controls';

const iconClass = 'w-4 h-4';

const Icon = ({ children }) => (
    <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </svg>
);

const CheckIcon = () => (
    <Icon>
        <polyline points="20 6 9 17 4 12" />
    </Icon>
);
const CopyTextIcon = () => (
    <Icon>
        <rect x="9" y="9" width="12" height="12" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Icon>
);
const DownloadIcon = () => (
    <Icon>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
);
const UploadIcon = () => (
    <Icon>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </Icon>
);
const WandIcon = () => (
    <Icon>
        <path d="M15 4V2M15 22v-2M8.5 8.5 7 7M21 15h2M2 9h2M17.5 8.5 19 7" />
        <path d="M14 14 3 3l1-1 11 11z" />
    </Icon>
);

/**
 * Raw JSON view of the whole portfolio — read it, copy it, download it,
 * import it, and apply it to the draft once it is valid.
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
        if (!parsed) return;
        const formatted = JSON.stringify(parsed, null, 2);
        setText(formatted);
        setSyncedFrom(formatted);
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
                <GhostButton onClick={handleFormat}>
                    <WandIcon /> Format
                </GhostButton>
                <GhostButton onClick={handleApply} disabled={Boolean(parseError)}>
                    <CheckIcon /> Apply to draft
                </GhostButton>
                <GhostButton onClick={handleCopy}>
                    <CopyTextIcon /> Copy
                </GhostButton>
                <GhostButton onClick={handleDownload}>
                    <DownloadIcon /> Download
                </GhostButton>
                <GhostLabel>
                    <UploadIcon /> Import
                    <input type="file" accept="application/json,.json" className="hidden" onChange={handleUpload} />
                </GhostLabel>
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
                    <span className="text-bg-light/35">
                        Valid JSON · {serialized.length} characters in the live document
                    </span>
                )}
            </div>
        </div>
    );
}
