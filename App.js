import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { styles } from "./components/styles";
import { theme } from "./components/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
      alert("데이터 기록에 실패했습니다.");
      return;
    }
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (error) {
      console.log(error);
      alert("데이터 불러오기를 실패했습니다.");
      return;
    }
  };

  const addToDo = async () => {
    try {
      if (text === "") return;
      const newToDos = { ...toDos, [Date.now()]: { text, work: working } };
      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
    } catch (error) {
      console.log(error);
      alert("데이터 추가를 실패했습니다.");
      return;
    }
  };

  const deleteToDo = (key) => {
    if (working) {
      Alert.alert("정말로 일이 끝났나요?", "삭제하시면 복구할 수 없습니다.", [
        { text: "손이 미끄러져서요", style: "destructive" },
        {
          text: "당연하지",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(toDos);
          },
        },
      ]);
    } else {
      Alert.alert("정말로 볼 일 다 봤나요?", "삭제하시면 복구할 수 없습니다.", [
        { text: "아직이요", style: "cancel" },
        {
          text: "다 봤어요",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(toDos);
          },
        },
      ]);
    }
  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? "해야 할일을 입력해주세요" : "가고 싶은 곳을 저장해주세요"}
          style={styles.input}></TextInput>
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            toDos[key].work === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color="grey" />
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}
