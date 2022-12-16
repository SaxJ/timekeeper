interface DayDefinition {
  from?: string;
  to?: string;
  closed?: boolean;
}

interface WeekDefinition {
  monday?: DayDefinition;
  tuesday?: DayDefinition;
  wednesday?: DayDefinition;
  thursday?: DayDefinition;
  friday?: DayDefinition;
  saturday?: DayDefinition;
  sunday?: DayDefinition;
}

interface CheckCase {
  allowed?: string;
  declined?: string;
}

export interface TimekeeperConfig {
  timezone: string;
  shortcircuit?: string;
  checkTitle?: CheckCase;
  checkSummary?: CheckCase;
  days?: WeekDefinition;
};

export type Weekday = keyof WeekDefinition;

export const getShortCircuits = (config:TimekeeperConfig): string[] => {
  const defaultValue = 'hotfix;fix;urgent';
  const shortCircuit = config.shortcircuit ?? defaultValue;

  return shortCircuit.split(';').map(it => it.trim().toLocaleLowerCase());
}

export const getDayDefinition = (config:TimekeeperConfig, key : keyof WeekDefinition) => {
  const userDay = config.days?.[key];
  return {
    closed: userDay?.closed ?? false,
    from: userDay?.from ?? '00:00',
    to: userDay?.to ?? '24:00'
  };
}

export const getCheckTitle = (config: TimekeeperConfig, allowedDeploy: boolean): string =>
  allowedDeploy
    ? config.checkTitle?.allowed ?? 'Timekeeper Allowed'
    : config.checkTitle?.declined ?? 'Timekeeper Blocked';

export const getCheckSummary = (config: TimekeeperConfig, allowedDeploy: boolean): string =>
  allowedDeploy
    ? config.checkSummary?.allowed ?? 'Deployment is allowed at this time.'
    : config.checkSummary?.declined ?? 'Deployment is not allowed at this time.';
