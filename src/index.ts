import { Probot } from "probot";
import {getCheckSummary, getCheckTitle, getDayDefinition, getShortCircuits, TimekeeperConfig, Weekday} from './config';

export = (app: Probot) => {
  app.on("pull_request", async (context) => {
    context.log.info('Actioning pull request', {pr: context.pullRequest.name});

    const checkList = await context.octokit.checks.listForRef(
      context.repo({
        ref: context.payload.pull_request.head.sha,
        check_name: 'timekeeper',
      })
    );
    const {data: {check_runs: checkRuns}} = checkList;

    const loadedConfig = await context.config<TimekeeperConfig>('timekeeper.yml');
    if (loadedConfig === null) {
      context.log.warn('No config loaded');
      return;
    }

    const shortCircuits = getShortCircuits(loadedConfig);
    const shouldShortCircuit = !!shortCircuits.find(word => context.payload.pull_request.title.includes(word));

    const now = (new Date()).toLocaleTimeString('en-GB', {timeZone: loadedConfig.timezone});
    const today = (new Date()).toLocaleDateString('en-GB', {timeZone: loadedConfig.timezone, weekday: 'long'}).toLowerCase();

    const todayDefinition = getDayDefinition(loadedConfig, today as Weekday);

    const noExistingCheck = checkRuns.length === 0;
    const lastIsGood = checkRuns[0]?.conclusion === 'success';

    const deployAllowed = (now >= todayDefinition.from && now <= todayDefinition.to && !todayDefinition.closed) || shouldShortCircuit;

    if (noExistingCheck || lastIsGood !== deployAllowed) {
      context.octokit.checks.create(context.repo({
        name: "timekeeper",
        head_branch: "",
        head_sha: context.payload.pull_request.head.sha,
        status: deployAllowed ? 'completed' : 'in_progress',
        conclusion: deployAllowed ? 'success' : 'failure',
        started_at: (new Date()).toISOString(),
        output: {
          title: getCheckTitle(loadedConfig, deployAllowed),
          summary: getCheckSummary(loadedConfig, deployAllowed),
          text: "",
        },
        request: {
          retries: 3,
          retryAfter: 3,
        }
      }));
    }
  });
};
