import { useCallback, useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

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
