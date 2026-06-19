const axios = require('axios');

/**
 * GitHub API Service
 * Fetches public profile, repository, and event data using GitHub REST API.
 */
const fetchGithubData = async (username) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }

  const headers = {
    'User-Agent': 'VitaCore-Career-Tracker',
    'Accept': 'application/vnd.github.v3+json',
  };

  // If a GITHUB_TOKEN is configured in environment, use it to avoid rate limits
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch main user profile to verify user exists and get total public repos
    let userResponse;
    try {
      userResponse = await axios.get(`https://api.github.com/users/${username}`, { headers });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new Error('GitHub username not found');
      }
      throw err;
    }

    const profile = userResponse.data;
    const publicReposCount = profile.public_repos || 0;

    // 2. Fetch public repos (limit to 100 for performance/rate-limits)
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );
    const repos = reposResponse.data || [];

    // Calculate top languages
    const languageCounts = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang)
      .slice(0, 5); // top 5 languages

    // 3. Fetch public events (last 100 events) to analyze recent activity
    const eventsResponse = await axios.get(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers }
    );
    const events = eventsResponse.data || [];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let commitsThisWeek = 0;
    const activeDaysSet = new Set();
    let reposUpdatedThisWeek = 0;
    const updatedReposSet = new Set();

    events.forEach((event) => {
      const eventDate = new Date(event.created_at);
      if (eventDate >= oneWeekAgo) {
        const dateStr = eventDate.toISOString().split('T')[0];

        if (event.type === 'PushEvent') {
          // Track commits
          const commitCount = Math.max(
            event.payload?.size || 0,
            event.payload?.commits?.length || 0
          );
          commitsThisWeek += commitCount;
          activeDaysSet.add(dateStr);

          if (event.repo && event.repo.name) {
            updatedReposSet.add(event.repo.name);
          }
        } else if (event.type === 'CreateEvent' || event.type === 'PullRequestEvent') {
          activeDaysSet.add(dateStr);
          if (event.repo && event.repo.name) {
            updatedReposSet.add(event.repo.name);
          }
        }
      }
    });

    reposUpdatedThisWeek = updatedReposSet.size;

    return {
      repositories: publicReposCount,
      commitsThisWeek,
      activeDays: activeDaysSet.size,
      topLanguages,
      reposUpdatedThisWeek,
      avatarUrl: profile.avatar_url,
      htmlUrl: profile.html_url,
      name: profile.name || username,
    };
  } catch (error) {
    console.error('[GitHubService] Error fetching GitHub data:', error.message);
    throw error;
  }
};

module.exports = {
  fetchGithubData,
};
