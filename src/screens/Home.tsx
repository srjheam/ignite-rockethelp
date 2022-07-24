import { useState } from "react";

import { useNavigation } from "@react-navigation/native";

import { Center, HStack, IconButton, VStack, useTheme, Text, Heading, FlatList } from "native-base";

import { SignOut, ChatTeardropText } from "phosphor-react-native";

import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";

import { OrderStatus } from "../types";

import Logo from '../assets/logo_secondary.svg'

export function Home() {
  const [statusSelected, setStatusSelected] = useState<OrderStatus>('open');
  const [orders, setOrders] = useState<OrderProps[]>([{
    id: '12',
    patrimony: '1231',
    status: 'open',
    when: '12/12/1212 às 12:23'
  }]);

  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleNewOrder() {
    navigation.navigate('new');
  }

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

        <FlatList
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

        <Button title="Nova solicitação" mt={4} onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
