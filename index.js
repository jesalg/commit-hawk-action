const core = require('@actions/core');
const github = require('@actions/github');
const { IncomingWebhook } = require('@slack/webhook');
const context = github.context;

function toJSON(value, pretty=true) {
	return pretty
		? JSON.stringify(value, null, 4)
		: JSON.stringify(value);
}

function formatLogMessage(msg, obj = null) {
	return obj ? `${msg}: ${toJSON(obj)}` : msg;
}

function info(msg, obj = null) {
	core.info(formatLogMessage(msg, obj));
}

function debug(msg, obj = null) {
	core.debug(formatLogMessage(msg, obj));
}

function notifySlack(commits) {
  const slack_webhook_url = core.getInput('slack_webhook_url');
  const webhook = new IncomingWebhook(slack_webhook_url);
  const attachments = commits.map((commit) => {
    return { 
      fallback: commit['message'],
      author_name: commit['author']['name'],
      author_link: `https://github.com/${commit['author']['username']}`,
      title: commit['message'],
      title_link: commit['url'],
      footer: 'Commit Hawk',
      footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
      ts: commit['timestamp'] 
    }
  });
  info(`Ping: ${slack_webhook_url}`, attachments);

  return webhook.send({
    text: 'Contents of #{watching} were changed in:',
    attachments: attachments, 
    icon_emoji: ':eagle:'
  });
}

async function getCommits() {
	let commits;

	info('Getting commits...');

	switch(context.eventName) {
		case 'push':
			commits = context.payload.commits;
		break;
		default:
			info(`${context.eventName} event is not supported by this action.`);
			commits = [];
		break;
	}

	return commits;
}

async function run() {
  try {
    getCommits().then(commits => {
      // Exclude merge commits
      commits = commits.filter(c => !c.parents || 1 === c.parents.length);
    
      if ('push' === context.eventName) {
        commits = commits.filter(c => c.distinct);
      }
    
      info('All Commits', commits);
      info('github', github)
      info('context', context)
    
      core.setOutput('commits', commits);

      notifySlack(commits)
        .then(() => process.exitCode = 0)
        .catch(err => core.error(err) && (process.exitCode = 1));
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
