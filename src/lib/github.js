/**
 * Reads a repository README straight from GitHub's public API.
 *
 * No token: the anonymous API allows 60 requests/hour per visitor IP, which is
 * plenty for a portfolio popup. Everything degrades to a friendly message plus a
 * link to the repository, so the popup is never a dead end.
 */

const GITHUB_HOSTS = new Set(['github.com', 'www.github.com'])

/** Pulls `owner/repo` out of any common GitHub URL shape (…/tree/main, .git, trailing slash). */
export function parseRepoRef(url) {
    if (!url) return null
    let parsed
    try {
        parsed = new URL(String(url).trim())
    } catch {
        return null
    }
    if (!GITHUB_HOSTS.has(parsed.hostname.toLowerCase())) return null

    const segments = parsed.pathname.split('/').filter(Boolean)
    if (segments.length < 2) return null

    const owner = segments[0]
    const repo = segments[1].replace(/\.git$/i, '')
    if (!owner || !repo) return null

    return { owner, repo, key: `${owner}/${repo}`, htmlUrl: `https://github.com/${owner}/${repo}` }
}

/**
 * @returns {Promise<
 *   | { status: 'ok', markdown: string, repo: object }
 *   | { status: 'missing' | 'rate-limited' | 'unsupported' | 'error', message: string, repo?: object }
 * >}
 */
export async function fetchRepoReadme(url, { signal } = {}) {
    const repo = parseRepoRef(url)
    if (!repo) {
        return { status: 'unsupported', message: 'That GitHub link does not point at a repository.' }
    }

    let response
    try {
        response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/readme`, {
            headers: { Accept: 'application/vnd.github.v3.raw' },
            signal,
        })
    } catch (error) {
        if (error?.name === 'AbortError') throw error
        return { status: 'error', message: 'Could not reach GitHub. Check your connection and try again.', repo }
    }

    if (response.ok) {
        return { status: 'ok', markdown: await response.text(), repo }
    }

    if (response.status === 404) {
        return {
            status: 'missing',
            message: 'No README found — the repository may be private, renamed or empty.',
            repo,
        }
    }

    if (response.status === 403 || response.status === 429) {
        return {
            status: 'rate-limited',
            message: 'GitHub is throttling anonymous requests right now. Open the repository to read the README.',
            repo,
        }
    }

    return { status: 'error', message: `GitHub returned an unexpected response (${response.status}).`, repo }
}
