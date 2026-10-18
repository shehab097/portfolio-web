/** Shared media helpers — used by the public site and the admin thumbnails. */

const ID_PATTERNS = [
    /embed\/([A-Za-z0-9_-]{6,})/,
    /watch\?v=([A-Za-z0-9_-]{6,})/,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /shorts\/([A-Za-z0-9_-]{6,})/,
    /v=([A-Za-z0-9_-]{6,})/,
];

/** Extracts a YouTube video id from any common URL shape. */
export function youtubeId(url = '') {
    if (!url) return '';
    for (const pattern of ID_PATTERNS) {
        const match = String(url).match(pattern);
        if (match) return match[1];
    }
    return '';
}

/** Converts any YouTube URL into an embeddable URL; passes others through. */
export function toYouTubeEmbed(url) {
    const id = youtubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : url;
}

/** Poster frame for a YouTube video (no iframe needed). */
export function videoThumbnail(url) {
    const id = youtubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

/**
 * What should stand in for a project in a list/summary?
 * A video wins over an image, matching the public card behaviour.
 */
export function projectThumbnail(project = {}) {
    if (project.video) {
        const poster = videoThumbnail(project.video);
        if (poster) return { type: 'video', url: poster };
    }
    if (project.image) return { type: 'image', url: project.image };
    return null;
}
