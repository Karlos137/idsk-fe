export const USER_STATES = {
  NOT_ACTIVATED: 'not_activated',
  ACTIVE: 'active',
  DISABLED: 'disabled',
  LOCKED: 'locked',
}

export const USER_STATES_LABEL = {
  [USER_STATES.NOT_ACTIVATED]: 'Neaktivní',
  [USER_STATES.ACTIVE]: 'Aktivní',
  [USER_STATES.DISABLED]: 'Zrušený',
  [USER_STATES.LOCKED]: 'Pozastavený',
}

export const userStatesAllOptions = Object.values(USER_STATES).map((value) => ({
  label: USER_STATES_LABEL[value],
  value: value,
}))

export const userStatesOptions = [USER_STATES.ACTIVE, USER_STATES.LOCKED, USER_STATES.DISABLED].map((value) => ({
  label: USER_STATES_LABEL[value],
  value: value,
}))
