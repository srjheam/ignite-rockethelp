import { useState } from "react";

import { Alert } from "react-native";

import firestore from "@react-native-firebase/firestore";

import { useNavigation } from "@react-navigation/native";

import { VStack } from "native-base";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleSubmit() {
    if (!patrimony || !description) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() =>
        Alert.alert('Cadastro', 'Solicitação cadastrada com sucesso.'))
      .then(() =>
        navigation.goBack())
      .catch(e => {
        setIsLoading(false);
        Alert.alert('Erro', 'Não foi possível cadastrar a solicitação.');
      })
  }

  return (
    <VStack flex={1} p={6} bg='gray.600'>
      <Header title='Nova solicitação' />

      <Input
        placeholder='Número do patrimônio'
        mt={4}
        onChangeText={setPatrimony}
        />

      <Input
        placeholder='Descrição do problema'
        flex={1}
        mt={5}
        textAlignVertical='top'
        onChangeText={setDescription}
        multiline
      />

      <Button
        title='Cadastrar'
        mt={5}
        isLoading={isLoading}
        onPress={handleSubmit}
      />
    </VStack>
  );
}
