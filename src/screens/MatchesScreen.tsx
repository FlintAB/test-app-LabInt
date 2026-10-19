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
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, type MatchesFilter } from '../utils/matchesFilter';

type HeaderProps = {
  round: number | null;
  updatedAt?: Date | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

function Header({
  round,
  updatedAt = null,
  isRefreshing = false,
  onRefresh,
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Матчи тура</Text>
          {round !== null && <Text style={styles.subtitle}>Тур {round}</Text>}
        </View>

        {onRefresh !== undefined && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Обновить матчи"
            accessibilityState={{ disabled: isRefreshing }}
            disabled={isRefreshing}
            onPress={onRefresh}
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.refreshButtonPressed,
              isRefreshing && styles.refreshButtonDisabled,
            ]}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#2563eb" />
            ) : (
              <Text style={styles.refreshLabel}>Обновить</Text>
            )}
          </Pressable>
        )}
      </View>

      {updatedAt !== null && (
        <View style={styles.updatedRow}>
          <UpdatedAgo since={updatedAt} />
        </View>
      )}
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

function RefreshError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.inlineError}>
      <Text style={styles.inlineErrorText} numberOfLines={2}>
        Не удалось обновить: {message}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Повторить обновление матчей"
        hitSlop={8}
        onPress={onRetry}
      >
        <Text style={styles.inlineRetryLabel}>Повторить</Text>
      </Pressable>
    </View>
  );
}

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const {
    matches,
    round,
    isInitialLoading,
    isRefreshing,
    error,
    updatedAt,
    reload,
  } = useMatches();
  const { favorites, isFavorite, toggle } = useFavorites();
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
      <Header
        round={round}
        updatedAt={updatedAt}
        isRefreshing={isRefreshing}
        onRefresh={() => void reload()}
      />
      <FilterBar value={filter} onChange={setFilter} />

      {error !== null && <RefreshError message={error} onRetry={() => void reload()} />}

      <FlatList
        style={styles.list}
        data={visibleMatches}
        extraData={favorites}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggle}
          />
        )}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={<EmptyState title={emptyTitle} text={emptyText} />}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={() => void reload()}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleBlock: {
    flexShrink: 1,
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
  updatedRow: {
    marginTop: 6,
  },
  refreshButton: {
    minWidth: 96,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  refreshButtonPressed: {
    backgroundColor: '#f9fafb',
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  inlineErrorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#b91c1c',
  },
  inlineRetryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b91c1c',
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
