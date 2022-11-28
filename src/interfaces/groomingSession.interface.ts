import { UserIDType } from './common.interface';

enum GroomingSessionUserMode {
  SPECTATOR = 'spectator',
  VOTER = 'voter',
}

enum GroomingState {
  INIT = 'init',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

type GroomingSessionUserData = {
  mode: GroomingSessionUserMode;
  email: string;
};

type GroomingSessionUser = Record<UserIDType, GroomingSessionUserData>;

type GroomingEstimation = Record<UserIDType, number | null>;

export {
  GroomingSessionUser,
  GroomingSessionUserMode,
  GroomingState,
  GroomingEstimation,
};
