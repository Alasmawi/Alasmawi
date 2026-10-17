// Live numbers from the GitHub GraphQL API, with a committed snapshot as the
// fallback, so a build without a token (or with the API down) still renders.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const CACHE = new URL('../cache/github.json', import.meta.url);

function token() {
  if (process.env.PROFILE_OFFLINE) return null;
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

async function gql(query, variables, tok) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${tok}`, 'content-type': 'application/json', 'user-agent': 'alasmawi-profile-build' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? json).slice(0, 400));
  return json.data;
}

const PROFILE = `query($login:String!){ user(login:$login){
  createdAt followers{totalCount}
  contributionsCollection{
    totalCommitContributions totalPullRequestContributions totalIssueContributions
    totalPullRequestReviewContributions totalRepositoriesWithContributedCommits
    contributionYears
    contributionCalendar{ totalContributions weeks{ contributionDays{ date weekday contributionCount } } }
  }
  repositories(ownerAffiliations:OWNER, privacy:PUBLIC, isFork:false, first:100, orderBy:{field:PUSHED_AT,direction:DESC}){
    totalCount
    nodes{ name stargazerCount forkCount pushedAt primaryLanguage{name}
      languages(first:10, orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name } } } }
  }
}}`;

const YEAR = `query($login:String!,$from:DateTime!,$to:DateTime!){ user(login:$login){
  contributionsCollection(from:$from,to:$to){ contributionCalendar{ totalContributions } } }}`;

export async function loadGithub(login) {
  const tok = token();
  if (tok) {
    try {
      const { user } = await gql(PROFILE, { login }, tok);
      const years = {};
      for (const y of user.contributionsCollection.contributionYears) {
        const d = await gql(YEAR, { login, from: `${y}-01-01T00:00:00Z`, to: `${y}-12-31T23:59:59Z` }, tok);
        years[y] = d.user.contributionsCollection.contributionCalendar.totalContributions;
      }
      const data = summarize(user, years);
      mkdirSync(new URL('.', CACHE), { recursive: true });
      writeFileSync(CACHE, JSON.stringify(data, null, 1) + '\n');
      return { ...data, source: 'live' };
    } catch (e) {
      console.warn(`  ! GitHub API failed, using the cached snapshot: ${e.message}`);
    }
  } else console.warn('  ! no token (GITHUB_TOKEN or gh auth), using the cached snapshot');
  if (!existsSync(CACHE)) throw new Error('no GitHub data: no token and no cache/github.json');
  return { ...JSON.parse(readFileSync(CACHE, 'utf8')), source: 'cache' };
}

function summarize(user, years) {
  const cc = user.contributionsCollection;
  const days = cc.contributionCalendar.weeks.flatMap((w) => w.contributionDays.map((d) => ({ date: d.date, wd: d.weekday, n: d.contributionCount })));
  const weeks = cc.contributionCalendar.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, wd: d.weekday, n: d.contributionCount })));

  // Streaks over the calendar year shown. Today not being counted yet doesn't break the current one.
  let longest = 0, run = 0;
  for (const d of days) { run = d.n > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].n > 0) current++;
    else if (i === days.length - 1) continue;
    else break;
  }
  const busiest = days.reduce((a, b) => (b.n > a.n ? b : a), days[0]);
  const activeDays = days.filter((d) => d.n > 0).length;

  // Language share by bytes across public, non-fork repos.
  const bytes = {};
  for (const r of user.repositories.nodes) for (const e of r.languages.edges) bytes[e.node.name] = (bytes[e.node.name] ?? 0) + e.size;
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(bytes).sort((a, b) => b[1] - a[1]).map(([name, b]) => ({ name, share: b / total }));

  // Day-of-week rhythm, for the "when I commit" strip.
  const byWeekday = [0, 0, 0, 0, 0, 0, 0];
  for (const d of days) byWeekday[d.wd] += d.n;

  return {
    fetchedAt: new Date().toISOString(),
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    repos: user.repositories.totalCount,
    stars: user.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0),
    lastYear: cc.contributionCalendar.totalContributions,
    lifetime: Object.values(years).reduce((a, b) => a + b, 0),
    years,
    commits: cc.totalCommitContributions,
    prs: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    reviews: cc.totalPullRequestReviewContributions,
    contributedRepos: cc.totalRepositoriesWithContributedCommits,
    streak: { current, longest },
    busiest,
    activeDays,
    byWeekday,
    languages,
    weeks,
    recent: user.repositories.nodes.slice(0, 6).map((r) => ({ name: r.name, pushedAt: r.pushedAt, lang: r.primaryLanguage?.name ?? null })),
  };
}
