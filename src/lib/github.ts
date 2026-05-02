import { siteConfig } from '../config/site';

export interface CommitEntry {
  date: string;
  message: string;
  hash: string;
}

export async function fetchRecentCommits(): Promise<CommitEntry[]> {
  const { githubUsername: user, githubRepo: repo } = siteConfig.about;

  if (!user || !repo) return [];

  try {
    const res = await fetch(
      `https://api.github.com/repos/${user}/${repo}/commits?per_page=20`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      }
    );

    if (!res.ok) return [];

    const data = (await res.json()) as Array<{
      sha: string;
      commit: { message: string; author: { date: string } };
    }>;

    return data.map((c) => ({
      hash: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      date: c.commit.author.date,
    }));
  } catch {
    return [];
  }
}
