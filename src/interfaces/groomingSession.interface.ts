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

type GroomingSessionUser = Record<string, GroomingSessionUserData>;

type GroomingEstimation = Record<string, number>;

export {
  GroomingSessionUser,
  GroomingSessionUserMode,
  GroomingState,
  GroomingEstimation,
};
