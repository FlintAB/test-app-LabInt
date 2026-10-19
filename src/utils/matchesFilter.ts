import type { Match } from '../types/match';

export type MatchesFilter = 'all' | 'upcoming' | 'finished';

export const FILTER_OPTIONS: ReadonlyArray<{ value: MatchesFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

/**
 * «Предстоящие» — матчи, которые ещё не начались: scheduled и postponed.
 * «Завершённые» — только finished.
 *
 * live и незнакомые статусы не попадают ни в одну из этих категорий
 * и видны только во «Все»: идущий матч неверно называть предстоящим,
 * а переносить его в завершённые — тем более.
 */
export function filterMatches(matches: Match[], filter: MatchesFilter): Match[] {
  switch (filter) {
    case 'upcoming':
      return matches.filter(
        (match) => match.status === 'scheduled' || match.status === 'postponed',
      );
    case 'finished':
      return matches.filter((match) => match.status === 'finished');
    case 'all':
    default:
      return matches;
  }
}
