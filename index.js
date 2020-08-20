const core = require('@actions/core');

async function run() {
  try {
    const watching = core.getInput('watching');
    core.info(`Watching: ${watching}`);

    core.setOutput('changes', []);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
