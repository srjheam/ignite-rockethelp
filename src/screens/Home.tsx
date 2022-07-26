import { useEffect, useState } from "react";

import { Alert } from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { useNavigation } from "@react-navigation/native";

import { Center, HStack, IconButton, VStack, useTheme, Text, Heading, FlatList } from "native-base";

import { SignOut, ChatTeardropText } from "phosphor-react-native";

import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import { Loading } from "../components/Loading";

import { dateFormat } from "../utils/firestoreDateFormat";

import { OrderStatus } from "../types";

import Logo from '../assets/logo_secondary.svg'

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<OrderStatus>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleLogout() {
    auth()
      .signOut()
      .catch(() =>
        Alert.alert('Ops', 'Parece que ocorreu algum problema. Por favor, tente novamente mais tarde.'));
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleNewOrder() {
    navigation.navigate('new');
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
          }
        })

        setOrders(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg='gray.700'>
      <HStack
        w='full'
        justifyContent='space-between'
        alignItems='center'
        bg='gray.600'
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={ <SignOut size={26} color={colors.gray[300]} /> }
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack width='full' mt={8} mb={4} justifyContent='space-between' alignItems='center'>
          <Heading color='gray.100'>
            Minhas solicitações
          </Heading>
          <Text color='gray.200'>
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            type='open'
            title='Em andamento'
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
            />

          <Filter
            type='closed'
            title='Concluído'
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {isLoading
          ? <Loading />
          : <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color='gray.300' fontSize='xl' mt={6} textAlign='center'>
                  Nenhuma solicitação {'\n'}
                  {statusSelected === 'open' ? 'em andamento' : 'concluída'}
                </Text>
              </Center>
              }
            />
        }

        <Button title="Nova solicitação" mt={4} onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
