import React, { useState } from 'react';
import {
    clearStorageUnavailable,
    isStorageAvailable,
    isStorageConfigured,
    MAX_IMAGE_BYTES,
    storageUpgradeUrl,
    UPLOADS_ENABLED,
    uploadPortfolioImage,
} from '../../lib/storage';
import { projectThumbnail } from '../../lib/media';
import { Caret, GhostButton, GhostLabel, ghostClass, inputClass, Labeled } from './controls';
import { Icon } from '../../lib/icons';

/**
 * Thumbnail preview + image source for a project.
 *
 * Image uploads are currently switched off (`UPLOADS_ENABLED` in lib/storage.js)
 * because Cloud Storage for Firebase needs the Blaze plan — so the upload control
 * renders disabled and the URL field is always visible.
 *
 * When uploads are switched back on, this same component uploads by drag-and-drop
 * or file picker, and falls back to the URL field if Firebase refuses the upload.
 */
export default function ImageField({ project, onImage }) {
    const uploadsAvailable = UPLOADS_ENABLED && isStorageConfigured && isStorageAvailable();

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [showUrl, setShowUrl] = useState(!uploadsAvailable);
    const [storageBlocked, setStorageBlocked] = useState(!uploadsAvailable && UPLOADS_ENABLED);

    const thumbnail = projectThumbnail(project);
    const uploadsDisabled = !UPLOADS_ENABLED;
    const canDrop = !uploadsDisabled && !storageBlocked;
    const urlAlwaysVisible = uploadsDisabled;

    const handleFile = async (file) => {
        if (!file || uploadsDisabled) return;
        setError(null);
        setUploading(true);
        setProgress(0);
        try {
            const url = await uploadPortfolioImage(file, { onProgress: setProgress });
            onImage(url);
        } catch (uploadError) {
            setError({ kind: uploadError?.kind, message: uploadError?.message ?? 'Upload failed.' });
            if (uploadError?.kind === 'pricing' || uploadError?.kind === 'setup') {
                setStorageBlocked(true);
                setShowUrl(true);
            }
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const onDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        handleFile(event.dataTransfer?.files?.[0]);
    };

    const retryUploads = () => {
        clearStorageUnavailable();
        setStorageBlocked(false);
        setError(null);
    };

    const limitLabel = `${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB`;
    const showUrlInput = showUrl || urlAlwaysVisible;

    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* ---------- Preview ---------- */}
                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        if (canDrop) setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                        if (!canDrop) {
                            event.preventDefault();
                            return;
                        }
                        onDrop(event);
                    }}
                    className={`relative w-full sm:w-52 aspect-video shrink-0 rounded-lg overflow-hidden border bg-white/5 flex items-center justify-center transition-colors ${
                        dragging ? 'border-primary-dark bg-primary-dark/10' : 'border-white/10'
                    }`}
                >
                    {thumbnail ? (
                        <>
                            <img src={thumbnail.url} alt="" className="w-full h-full object-cover" />
                            {thumbnail.type === 'video' && (
                                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 font-instrument text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg-dark/80 border border-white/20 text-bg-light/80">
                                    video
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="flex flex-col items-center gap-2 text-bg-light/25">
                            <Icon name="image" className="w-6 h-6" />
                            <span className="font-instrument text-xs uppercase tracking-wider">
                                {canDrop ? 'Drop an image' : 'No image yet'}
                            </span>
                        </span>
                    )}

                    {uploading && (
                        <span className="absolute inset-0 bg-bg-dark/80 flex flex-col items-center justify-center gap-2">
                            <span className="font-instrument text-sm text-bg-light/80">{progress}%</span>
                            <span className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                                <span
                                    className="block h-full bg-primary-dark transition-all duration-200"
                                    style={{ width: `${progress}%` }}
                                />
                            </span>
                        </span>
                    )}
                </div>

                {/* ---------- Controls ---------- */}
                <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        {uploadsDisabled ? (
                            <span
                                aria-disabled="true"
                                title="Image uploads are disabled — paste an image URL instead"
                                className={`${ghostClass} opacity-40 cursor-not-allowed`}
                            >
                                <Icon name="upload" className="w-4 h-4" /> Upload image
                            </span>
                        ) : storageBlocked ? (
                            <GhostButton onClick={retryUploads}>
                                <Icon name="upload" className="w-4 h-4" /> Retry uploading
                            </GhostButton>
                        ) : (
                            <GhostLabel className={uploading ? 'opacity-50 pointer-events-none' : ''}>
                                <Icon name="upload" className="w-4 h-4" />
                                {uploading ? 'Uploading…' : project.image ? 'Replace image' : 'Upload image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => {
                                        handleFile(event.currentTarget.files?.[0]);
                                        event.currentTarget.value = '';
                                    }}
                                />
                            </GhostLabel>
                        )}

                        {!urlAlwaysVisible && (
                            <GhostButton onClick={() => setShowUrl((current) => !current)}>
                                <Caret open={showUrl} /> URL
                            </GhostButton>
                        )}

                        {(project.image || project.video) && (
                            <GhostButton
                                className="hover:!text-red-400 hover:!border-red-400/50"
                                onClick={() => {
                                    if (project.image) onImage('');
                                    setError(null);
                                }}
                                disabled={!project.image}
                            >
                                Remove image
                            </GhostButton>
                        )}
                    </div>

                    <p className="font-instrument text-xs text-bg-light/35 leading-relaxed">
                        {uploadsDisabled
                            ? 'Uploads are disabled for now — paste an image URL below.'
                            : storageBlocked
                                ? 'Uploads are off — paste an image URL below instead.'
                                : `PNG, JPG, WEBP or GIF up to ${limitLabel}. Drag a file onto the preview to upload.`}
                    </p>

                    {project.video && (
                        <p className="font-instrument text-xs text-bg-light/35">
                            The video above wins on the public card — remove it if you want this image to show.
                        </p>
                    )}

                    {error && (
                        <div className="rounded-md border border-red-400/30 bg-red-400/5 px-3 py-2 space-y-1.5">
                            <p className="font-instrument text-sm text-red-300/90 leading-relaxed">{error.message}</p>
                            {error.kind === 'pricing' && (
                                <a
                                    href={storageUpgradeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block font-instrument text-xs text-primary-dark hover:underline"
                                >
                                    Open the upgrade page →
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showUrlInput && (
                <Labeled label="Image URL" hint={urlAlwaysVisible ? 'the only way to set a thumbnail right now' : 'used instead of an upload'}>
                    <input
                        className={inputClass}
                        value={project.image ?? ''}
                        placeholder="https://images…"
                        onInput={(event) => onImage(event.currentTarget.value)}
                    />
                </Labeled>
            )}
        </div>
    );
}
