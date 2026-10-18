import React, { useEffect, useRef, useState } from 'react';

/**
 * Renders GitHub-flavoured markdown (a repository README) as sanitised HTML.
 *
 * `marked` and `dompurify` are imported on demand, so visitors only download them
 * once they actually open a project popup that has a repository behind it.
 */

let pipelinePromise = null;

const loadPipeline = () => {
    if (!pipelinePromise) {
        pipelinePromise = Promise.all([import('marked'), import('dompurify')]).then(([markedModule, purifyModule]) => {
            const { marked } = markedModule;
            const DOMPurify = purifyModule.default;
            return (source) =>
                DOMPurify.sanitize(marked.parse(String(source ?? ''), { gfm: true, breaks: false, async: false }), {
                    /* READMEs are third-party input: strip anything interactive or stylistic. */
                    FORBID_TAGS: ['style', 'iframe', 'form', 'object', 'embed', 'link', 'base'],
                    FORBID_ATTR: ['style', 'srcset', 'onerror', 'onload'],
                });
        });
    }
    return pipelinePromise;
};

export default function Markdown({ source, repoKey }) {
    const containerRef = useRef(null);
    const [html, setHtml] = useState('');
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        loadPipeline()
            .then((render) => {
                if (!cancelled) setHtml(render(source));
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });
        return () => {
            cancelled = true;
        };
    }, [source]);

    /**
     * READMEs use repo-relative paths for screenshots and docs links, which would
     * 404 from our origin. Resolve them against GitHub, and make every link open
     * in a new tab. Runs after the HTML lands, so it never fights the renderer.
     */
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !html) return;

        const rawBase = repoKey ? `https://github.com/${repoKey}/raw/HEAD/` : null;
        const blobBase = repoKey ? `https://github.com/${repoKey}/blob/HEAD/` : null;
        const isAbsolute = (value) => /^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//');

        const absolute = (value, base) => {
            if (!base) return null;
            try {
                return new URL(value.replace(/^\/+/, ''), base).href;
            } catch {
                return null;
            }
        };

        container.querySelectorAll('a[href]').forEach((anchor) => {
            const href = anchor.getAttribute('href') ?? '';
            if (href.startsWith('#')) return;
            if (!isAbsolute(href)) {
                const resolved = absolute(href, blobBase);
                if (resolved) anchor.setAttribute('href', resolved);
            }
            anchor.setAttribute('target', '_blank');
            anchor.setAttribute('rel', 'noopener noreferrer');
        });

        container.querySelectorAll('img[src]').forEach((image) => {
            const src = image.getAttribute('src') ?? '';
            if (!isAbsolute(src)) {
                const resolved = absolute(src, rawBase);
                if (resolved) image.setAttribute('src', resolved);
            }
            image.setAttribute('loading', 'lazy');
        });
    }, [html, repoKey]);

    /* Table-of-contents links target heading ids we do not render — stop them jumping the page. */
    const swallowHashLinks = (event) => {
        const anchor = event.target?.closest?.('a[href^="#"]');
        if (anchor) event.preventDefault();
    };

    if (failed) return null;

    return (
        <div
            ref={containerRef}
            className="md-body"
            onClick={swallowHashLinks}
            /* eslint-disable-next-line react/no-danger -- sanitised by DOMPurify above */
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
