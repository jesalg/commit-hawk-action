const core = require('@actions/core');

// https://github.com/lots0logs/gh-action-get-changed-files/blob/master/index.js#L36:16
// https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestpaths
async function run() {
  try {
    const slack_webhook_url = core.getInput('slack_webhook_url');
    core.info(`Ping: ${slack_webhook_url}`);

    core.setOutput('changes', []);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
