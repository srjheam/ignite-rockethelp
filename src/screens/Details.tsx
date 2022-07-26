import { useEffect, useState } from "react";

import { Alert } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import firestore from "@react-native-firebase/firestore";

import { VStack, HStack, Text, useTheme, ScrollView } from "native-base";

import { ClipboardText, CircleWavyCheck, DesktopTower, Hourglass } from "phosphor-react-native";

import { Button } from "../components/Button";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import { Loading } from "../components/Loading";

import { OrderDTO } from "../DTOs/OrderDTO";

import { dateFormat } from "../utils/firestoreDateFormat";

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string,
  solution: string,
  closed: string
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();

  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  function handleCloseOrder() {
    if (!solution) {
      return Alert.alert('Atenção', 'Não é possível concluir solicitação sem solução.');
    }

    firestore()
      .collection<OrderDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação concluída com sucesso.');
        navigation.goBack();
      })
      .catch(() =>
        Alert.alert('Erro', 'Não foi possível concluir a solicitação.'));
  }

  useEffect(() => {
    firestore()
      .collection<OrderDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const { patrimony, description, status, created_at, closed_at, solution } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          when: dateFormat(created_at),
          closed,
          solution
        });
        setIsLoading(false);
      });

  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack
      flex={1}
      bg='gray.700'
    >
      <Header title='Solicitação' />
      <HStack bg='gray.500' justifyContent='center' p={4}>
        {
          order.status === 'closed'
          ? <CircleWavyCheck size={22} color={colors.green[300]} />
          : <Hourglass size={22} color={colors.secondary[300]} />
        }

        <Text
          fontSize='sm'
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform='uppercase'
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CardDetails
          title='Equipamento'
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          />

        <CardDetails
          title='Descrição do problema'
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title='Solução'
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
              placeholder='Descrição da solução'
              h={24}
              textAlignVertical='top'
              bg='transparent'
              _focus={{ bg: 'transparent' }}
              onChangeText={setSolution}
              multiline
            />
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' &&
        <Button
          title='Concluir solicitação'
          m={5}
          onPress={handleCloseOrder}
        />
      }
    </VStack>
  );
}
