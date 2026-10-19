import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FilterBar } from '../components/FilterBar';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, type MatchesFilter } from '../utils/matchesFilter';

function Header({ round }: { round: number | null }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Матчи тура</Text>
      {round !== null && <Text style={styles.subtitle}>Тур {round}</Text>}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function LoadingState() {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.stateText}>Загружаем матчи…</Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.stateTitle}>Не удалось загрузить матчи</Text>
      <Text style={styles.stateText}>{message}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Повторить загрузку матчей"
        onPress={onRetry}
        style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
      >
        <Text style={styles.retryLabel}>Повторить</Text>
      </Pressable>
    </View>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{text}</Text>
    </View>
  );
}

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, round, isInitialLoading, error, reload } = useMatches();
  const [filter, setFilter] = useState<MatchesFilter>('all');

  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <Header round={null} />
        <LoadingState />
      </View>
    );
  }

  if (error !== null && matches.length === 0) {
    return (
      <View style={styles.container}>
        <Header round={null} />
        <ErrorState message={error} onRetry={() => void reload()} />
      </View>
    );
  }

  const visibleMatches = filterMatches(matches, filter);
  const emptyTitle = matches.length === 0 ? 'Матчей пока нет' : 'Здесь матчей нет';
  const emptyText =
    matches.length === 0
      ? 'Когда в туре появятся матчи, они отобразятся здесь.'
      : 'В этой категории нет матчей. Выберите другой фильтр.';

  return (
    <View style={styles.container}>
      <Header round={round} />
      <FilterBar value={filter} onChange={setFilter} />

      <FlatList
        style={styles.list}
        data={visibleMatches}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={<EmptyState title={emptyTitle} text={emptyText} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#f3f4f6',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: '#6b7280',
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
    gap: 12,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#2563eb',
  },
  retryButtonPressed: {
    opacity: 0.75,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
