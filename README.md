# GitHub Action: Commit Hawk 🦅

<p align="center">
  <a href="https://github.com/actions/commit-hawk-action/actions"><img alt="javscript-action status" src="https://github.com/actions/commit-hawk-action/workflows/units-test/badge.svg"></a>
</p>

### WHY?

Watching a repository on GitHub tells you about social activity (e.g. PRs, issues, etc.), but it doesn't notify you about file-level changes that you and your team might care about. 

For example, when an external vendor merges in their work, or when a critical part of the codebase is changed, or when new dependencies are added, etc 

Commit Hawk Action fills that gap. 

## Usage

Install the [Incoming Slack Webhook](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) app to your Slack workspace. Reference that webhook URL in `slack_webhook_url` param in your action's yml as shown below.

Actions can be setup to run conditionally when a specific file(s) on a particular branch are changed. 

The `paths` keywords accept glob patterns that use the * and ** wildcard characters to match more than one path name. For more information, see the [documentation](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#onpushpull_requestpaths).

```yaml
name: "units-test"
on:
  push:
    branches:
      - main
    paths:
      - '/some/important/file'
jobs:
  commit-hawk:
    uses: actions/commit-hawk-action@v1
    with:
      slack_webhook_url: 'https://slack.webhook'
```
