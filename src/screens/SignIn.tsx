import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { VStack, Heading, Icon, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg'

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Credenciais não informadas', 'Uma ou mais credenciais não foram informadas.');
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((e) => {
        console.log(e);
        setIsLoading(false);

        if (e.code === 'auth/invalid-email') {
          return Alert.alert('E-mail inválido', 'O e-mail informado é inválido.');
        }

        if (e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
          return Alert.alert('Usuário incorreto', 'Uma ou mais crendenciais informadas estão incorretas');
        }

        return;
      })
  }

  return (
    <VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24}>
      <Logo />

      <Heading color='gray.100' fontSize='xl' mt={20} mb={6}>
        Olá!
      </Heading>

      <Input
        placeholder='E-mail'
        mb={4}
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} /> } ml={4} />}
        onChangeText={setEmail}
        />
      <Input
        placeholder='Senha'
        mb={8}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title='Entrar' w='full' onPress={handleSignIn} isLoading={isLoading} />
    </VStack>
  )
}
