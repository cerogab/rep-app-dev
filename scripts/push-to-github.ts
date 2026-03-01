import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    },
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function main() {
  const owner = 'cerogab';
  const repo = 'rep-app-dev';

  console.log('Authenticating with GitHub...');
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  const user = await octokit.rest.users.getAuthenticated();
  console.log(`Authenticated as: ${user.data.login}`);

  const remoteUrl = `https://x-access-token:${accessToken}@github.com/${owner}/${repo}.git`;
  const cwd = '/home/runner/workspace';

  const run = (cmd: string) => {
    console.log(`> ${cmd.replace(accessToken, '***')}`);
    return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  };

  try {
    run('git config user.email "replit-agent@users.noreply.github.com"');
    run('git config user.name "Replit Agent"');

    try {
      run('git remote remove github-push');
    } catch {}
    run(`git remote add github-push ${remoteUrl}`);

    console.log('\nPushing to GitHub...');
    const output = run('git push github-push HEAD:main --force');
    console.log(output);

    run('git remote remove github-push');

    console.log(`\nDone! All code pushed to https://github.com/${owner}/${repo}`);
  } catch (err: any) {
    console.error('Error:', err.stderr || err.message);
    try { run('git remote remove github-push'); } catch {}
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
