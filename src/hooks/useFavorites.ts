import { useCallback, useEffect, useState } from 'react';

import { loadFavorites, saveFavorites } from '../storage/favorites';

// Избранные матчи (по id). Сохраняются в AsyncStorage и переживают перезапуск.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  // Пока не прочитали сохранённое, нельзя записывать пустой список обратно.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadFavorites()
      .then((stored) => {
        if (cancelled) {
          return;
        }

        setFavorites(stored);
        setIsHydrated(true);
      })
      .catch((error: unknown) => {
        console.warn('Не удалось загрузить избранное', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveFavorites(favorites).catch((error: unknown) => {
      console.warn('Не удалось сохранить избранное', error);
    });
  }, [favorites, isHydrated]);

  // includes() вместо Boolean(indexOf()): indexOf() возвращает 0 для первого
  // элемента и -1 для отсутствующего — оба значения легко перепутать.
  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  // Обновляем состояние иммутабельно и через функцию: push/splice меняли
  // массив на месте, а setFavorites получал ту же ссылку и не перерисовывал UI.
  const toggle = useCallback((id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  }, []);

  return { favorites, isFavorite, toggle };
}
