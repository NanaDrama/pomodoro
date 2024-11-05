import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Vibration, StyleSheet } from 'react-native';

const App = () => {
  const [workTime, setWorkTime] = useState(25); // Робочий час в хвилинах
  const [breakTime, setBreakTime] = useState(5); // Час перерви в хвилинах
  const [time, setTime] = useState(1500); // Таймер у секундах
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // Статус: робота чи перерва

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    if (time === 0) {
      Vibration.vibrate();
      if (!isBreak) {
        setTime(breakTime * 60); // Переходимо на час перерви
      } else {
        setTime(workTime * 60); // Повертаємось до робочого часу
      }
      setIsBreak(!isBreak); // Змінюємо статус
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, workTime, breakTime]);

  const startTimer = () => {
    setTime(workTime * 60); // Запускаємо таймер з робочого часу
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(workTime * 60); // Скидаємо на робочий час
    setIsBreak(false); // Скидаємо статус
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>
      
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Робочий час (хв)"
        value={String(workTime)}
        onChangeText={text => setWorkTime(Number(text))}
      />
      
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Час перерви (хв)"
        value={String(breakTime)}
        onChangeText={text => setBreakTime(Number(text))}
      />
      
      <Button title={isActive ? "Pause" : "Start"} onPress={isActive ? stopTimer : startTimer} />
      <Button title="Reset" onPress={resetTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
});

export default App;


