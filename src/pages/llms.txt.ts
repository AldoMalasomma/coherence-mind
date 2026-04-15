import type { APIRoute } from 'astro';
import { getBlogPosts, getNotes, getSiteSettings, getStaticPageBySlug } from '../lib/sanityQueries';

const site = 'https://www.coherencemind.net';

const toUrl = (path: string) => new URL(path, site).toString();

const bullet = (title: string, url: string, description: string) =>
  `- [${title}](${url}): ${description}`;

const summarizeTags = (tags?: string[]) => {
  if (!tags?.length) return null;
  return `Themes: ${tags.slice(0, 3).join(', ')}`;
};

export const GET: APIRoute = async () => {
  const [settings, modelPage, posts, notes] = await Promise.all([
    getSiteSettings(),
    getStaticPageBySlug('model'),
    getBlogPosts(),
    getNotes()
  ]);

  const projectName = settings?.title ?? 'CoherenceMind';
  const modelTitle = 'The Model';
  const modelSubtitle =
    modelPage?.heroSubtitle ?? 'Inside the architecture of reflexive coherence.';
  const modelDescription = `${modelSubtitle.replace(/[.?!]+$/, '')}. The main conceptual map of the RCM, including its core claim, limits, and related frameworks.`;

  const latestPosts = (posts ?? [])
    .filter((post) => Boolean(post?.slug))
    .slice(0, 3);

  const latestNotes = (notes ?? [])
    .filter((note) => Boolean(note?.slug))
    .slice(0, 3);

  const lines = [
    `# ${projectName}`,
    '',
    `> Independent research site for the Reflexive Coherence Model (RCM). Use the pages below to find the model overview, definitions, publication record, and stable citation sources; notes and articles are living material.`,
    '',
    '## Core pages',
    bullet('Home', toUrl('/'), 'Overview of the project and entry point to the research site.'),
    bullet(
      modelTitle,
      toUrl('/model'),
      modelDescription
    ),
    bullet(
      'Glossary',
      toUrl('/glossary'),
      'Core vocabulary with concise definitions and cross-links between concepts.'
    ),
    bullet(
      'Timeline',
      toUrl('/timeline'),
      'Chronological development of the model from early sketches to formal publication.'
    ),
    bullet(
      'Papers & Preprints',
      toUrl('/papers'),
      'Stable reference page with Zenodo DOIs and downloadable PDFs for citation.'
    ),
    bullet(
      'FAQ',
      toUrl('/faq'),
      'Short answers about the theory, methodology, and intended scope of the model.'
    ),
    '',
    '## Citation sources',
    bullet(
      'The Reflexive Coherence Model: A Physico-Informational Framework for Consciousness',
      'https://doi.org/10.5281/zenodo.17342603',
      'Primary citable preprint and archival record.'
    ),
    bullet(
      'The Expansion Hypothesis: Dynamical Regimes of Reflexive Coherence',
      'https://doi.org/10.5281/zenodo.18045464',
      'Follow-up preprint extending the model.'
    ),
    bullet(
      'RCM v1.1 PDF',
      toUrl('/papers/rcm-v1.1.pdf'),
      'Direct PDF copy of the primary paper for offline reading and citation support.'
    ),
    bullet(
      'Expansion Hypothesis PDF',
      toUrl('/papers/teh-v1.1.pdf'),
      'Direct PDF copy of the expansion paper.'
    ),
    '',
    '## Policies',
    bullet(
      'Accessibility Statement',
      toUrl('/accessibility'),
      'Accessibility commitments, limitations, and contact information.'
    ),
    bullet(
      'Imprint',
      toUrl('/imprint'),
      'Project identity, responsibility, licensing, and scope notes.'
    ),
    bullet(
      'Privacy Policy',
      toUrl('/privacy'),
      'Data handling, cookie, hosting, and analytics disclosures.'
    ),
    '',
    '## Optional',
    'Skip this section if you only want stable reference material.',
    bullet(
      'Articles',
      toUrl('/blog'),
      'Long-form clarifications and context notes that evolve over time.'
    ),
    bullet(
      'Lab Notes',
      toUrl('/notes'),
      'Working fragments and in-progress research notes; useful background, but not core reference material.'
    )
  ];

  if (latestPosts.length) {
    lines.push('');
    lines.push('Recent articles:');
    for (const post of latestPosts) {
      const description = post.excerpt ?? 'Recent article from the Reflexive Coherence lab.';
      lines.push(bullet(post.title, toUrl(`/blog/${post.slug}`), description));
    }
  }

  if (latestNotes.length) {
    lines.push('');
    lines.push('Recent notes:');
    for (const note of latestNotes) {
      const description =
        summarizeTags(note.tags) ?? 'Field note from the reflexive coherence lab.';
      lines.push(bullet(note.title, toUrl(`/notes/${note.slug}`), description));
    }
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
