import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'matches:favorites:v1';

/**
 * Читает избранное из AsyncStorage.
 * Битые данные не роняют приложение — считаем, что избранного нет.
 */
export async function loadFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const ids = parsed.filter(
      (value): value is string => typeof value === 'string' && value.length > 0,
    );

    return Array.from(new Set(ids));
  } catch {
    return [];
  }
}

export async function saveFavorites(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
}
