import { Probot } from "probot";

interface TimekeeperConfig {
  timezone: string;
  monday: {
    from: string;
    to: string;
  };
  tuesday: {
    from: string;
    to: string;
  };
  wednesday: {
    from: string;
    to: string;
  };
  thursday: {
    from: string;
    to: string;
  };
  friday: {
    from: string;
    to: string;
  };
  saturday: {
    from: string;
    to: string;
  };
  sunday: {
    from: string;
    to: string;
  };
};

export = (app: Probot) => {
  app.on("pull_request", async (context) => {
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

    const now = (new Date()).toLocaleTimeString('en-GB', {timeZone: loadedConfig.timezone});
    const today = (new Date()).toLocaleDateString('en-GB', {timeZone: loadedConfig.timezone, weekday: 'long'}).toLowerCase();

    let from = '09:00:00';
    let to = '17:00:00';

    switch (today) {
        case 'sunday':
          from = loadedConfig.sunday.from;
          to = loadedConfig.sunday.to;
          break;
        case 'monday':
          from = loadedConfig.monday.from;
          to = loadedConfig.monday.to;
          break;
        case 'tuesday':
          from = loadedConfig.tuesday.from;
          to = loadedConfig.tuesday.to;
          break;
        case 'wednesday':
          from = loadedConfig.wednesday.from;
          to = loadedConfig.wednesday.to;
          break;
        case 'thursday':
          from = loadedConfig.thursday.from;
          to = loadedConfig.thursday.to;
          break;
        case 'friday':
          from = loadedConfig.friday.from;
          to = loadedConfig.friday.to;
          break;
        case 'saturday':
          from = loadedConfig.saturday.from;
          to = loadedConfig.saturday.to;
          break;
    }

    const noExistingCheck = checkRuns.length === 0;
    const lastIsGood = checkRuns[0]?.conclusion === 'success';

    const currentIsGood = now >= from && now <= to;

    if (noExistingCheck || lastIsGood !== currentIsGood) {
      context.octokit.checks.create(context.repo({
        name: "timekeeper",
        head_branch: "",
        head_sha: context.payload.pull_request.head.sha,
        status: currentIsGood ? 'success' : 'in_progress',
        started_at: (new Date()).toISOString(),
        output: {
          title: currentIsGood ? 'The time is right' : "Don't deploy after-hours!",
          summary: currentIsGood ? 'All g' : "The time is not right",
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
