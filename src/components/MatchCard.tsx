import { StyleSheet, Text, View } from 'react-native';

import type { Match } from '../types/match';

type Props = {
  match: Match;
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Запланирован',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

function getStatusLabel(match: Match): string {
  const label = STATUS_LABELS[match.status] ?? match.status;

  if (match.status === 'live' && typeof match.minute === 'number') {
    return `${label} · ${match.minute}′`;
  }

  return label;
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'live':
      return styles.statusLive;
    case 'scheduled':
      return styles.statusScheduled;
    case 'postponed':
      return styles.statusPostponed;
    default:
      return styles.statusFinished;
  }
}

function getScoreText(match: Match): string {
  // Проверяем именно null: счёт 0:0 — валидный результат, а не отсутствие счёта.
  if (match.score === null) {
    return '—';
  }

  return `${match.score.home} : ${match.score.away}`;
}

function getStartsAtText(startsAt: string | null): string {
  if (startsAt === null) {
    return 'Дата уточняется';
  }

  const date = new Date(startsAt);

  if (Number.isNaN(date.getTime())) {
    return 'Дата уточняется';
  }

  // timeZone не передаём — date.toLocale* использует часовой пояс устройства.
  const day = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${day}, ${time}`;
}

export function MatchCard({ match }: Props) {
  const hasScore = match.score !== null;

  return (
    <View style={styles.card}>
      <View style={styles.meta}>
        <Text style={[styles.status, getStatusStyle(match.status)]}>
          {getStatusLabel(match)}
        </Text>
        <Text style={styles.date}>{getStartsAtText(match.startsAt)}</Text>
      </View>

      <View style={styles.teams}>
        <Text style={[styles.team, styles.homeTeam]} numberOfLines={2}>
          {match.home.name}
        </Text>

        <View style={styles.scoreBox}>
          <Text style={[styles.score, !hasScore && styles.scoreEmpty]}>
            {getScoreText(match)}
          </Text>
        </View>

        <Text style={[styles.team, styles.awayTeam]} numberOfLines={2}>
          {match.away.name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusFinished: {
    color: '#6b7280',
  },
  statusLive: {
    color: '#dc2626',
  },
  statusScheduled: {
    color: '#2563eb',
  },
  statusPostponed: {
    color: '#d97706',
  },
  date: {
    flexShrink: 1,
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'right',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  team: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  homeTeam: {
    textAlign: 'right',
  },
  awayTeam: {
    textAlign: 'left',
  },
  scoreBox: {
    minWidth: 72,
    alignItems: 'center',
  },
  score: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    fontVariant: ['tabular-nums'],
  },
  scoreEmpty: {
    color: '#9ca3af',
    fontWeight: '500',
  },
});
