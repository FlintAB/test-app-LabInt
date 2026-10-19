import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchMatches } from '../api/matches';
import type { MatchesResponse } from '../types/match';

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Не удалось загрузить матчи. Попробуйте ещё раз.';
}

/**
 * Загружает матчи и хранит состояние запроса.
 *
 * reload() можно вызывать повторно (кнопка «Повторить», обновление):
 * предыдущий запрос отменяется, а его результат игнорируется, чтобы
 * устаревший ответ не перезаписал более свежий.
 */
export function useMatches() {
  const [data, setData] = useState<MatchesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const requestId = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;

    const currentId = ++requestId.current;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchMatches(controller.signal);

      if (currentId !== requestId.current) {
        return;
      }

      setData(response);
      setUpdatedAt(new Date());
    } catch (requestError) {
      if (isAbortError(requestError) || currentId !== requestId.current) {
        return;
      }

      setError(getErrorMessage(requestError));
    } finally {
      if (currentId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    reload();

    return () => {
      // Результат запроса, который завершится после размонтирования, уже не нужен.
      requestId.current += 1;
      activeRequest.current?.abort();
    };
  }, [reload]);

  return {
    matches: data?.matches ?? [],
    round: data?.round ?? null,
    /** Первая загрузка: данных ещё нет, показываем загрузку на весь экран. */
    isInitialLoading: isLoading && data === null,
    /** Обновление поверх уже загруженного списка. */
    isRefreshing: isLoading && data !== null,
    error,
    updatedAt,
    reload,
  };
}
