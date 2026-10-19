import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../types/match';

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

/**
 * Проверяем только то, без чего экран не сможет работать.
 * Остальные поля разбирает карточка матча — она умеет жить с неполными данными.
 */
function isMatchesResponse(value: unknown): value is MatchesResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return Array.isArray((value as { matches?: unknown }).matches);
}

export async function fetchMatches(signal?: AbortSignal): Promise<MatchesResponse> {
  let response: Response;

  try {
    response = await fetch(MATCHES_URL, { signal });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new Error('Не удалось связаться с сервером. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    throw new Error(`Сервер вернул ошибку ${response.status}. Попробуйте ещё раз.`);
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }

    throw new Error('Сервер вернул ответ в неожиданном формате.');
  }

  if (!isMatchesResponse(data)) {
    throw new Error('В ответе сервера нет списка матчей.');
  }

  return data;
}
