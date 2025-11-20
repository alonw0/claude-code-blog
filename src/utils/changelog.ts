import { marked } from 'marked';

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

const CHANGELOG_URL = 'https://raw.githubusercontent.com/anthropics/claude-code/refs/heads/main/CHANGELOG.md';

export async function fetchChangelogHTML(): Promise<string> {
  try {
    const response = await fetch(CHANGELOG_URL, {
      cache: 'default', // Use browser cache when available
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch changelog: ${response.status}`);
    }

    const markdown = await response.text();
    return marked.parse(markdown) as string;
  } catch (error) {
    console.error('Error fetching changelog:', error);
    throw error;
  }
}
