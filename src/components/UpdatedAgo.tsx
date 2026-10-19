import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Новый since (например, после обновления) сразу сбрасывает счётчик,
    // а интервал пересоздаётся, чтобы не копить старые таймеры.
    setNow(Date.now());

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [since]);

  // Считаем от since, а не инкрементом: значение не зависит от пропущенных
  // тиков и не уходит вперёд/назад при смене since.
  const seconds = Math.max(0, Math.floor((now - since.getTime()) / 1000));

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
