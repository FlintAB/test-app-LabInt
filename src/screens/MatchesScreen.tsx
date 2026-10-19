import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';

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

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.stateTitle}>Матчей пока нет</Text>
      <Text style={styles.stateText}>
        Когда в туре появятся матчи, они отобразятся здесь.
      </Text>
    </View>
  );
}

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, round, isInitialLoading, error, reload } = useMatches();

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

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={<Header round={round} />}
        ListEmptyComponent={<EmptyState />}
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
