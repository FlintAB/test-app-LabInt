export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  /** ISO-дата начала матча. null — дата ещё не назначена (например, матч перенесён). */
  startsAt: string | null;
  /**
   * Статус матча. Сейчас сервер отдаёт scheduled / live / finished / postponed,
   * но список может расшириться, поэтому тип — string.
   */
  status: string;
  /** Минута матча, приходит только для status === 'live'. */
  minute?: number;
  home: Team;
  away: Team;
  /** null, пока матч не начался (или если счёт неизвестен). */
  score: Score | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};
