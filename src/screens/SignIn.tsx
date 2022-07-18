import { VStack, Heading } from 'native-base';

import Logo from '../assets/logo_primary.svg'

export function SignIn() {
  return (
    <VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24}>
      <Logo />

      <Heading color='gray.100' fontSize='xl' mt={6} mb={20}>
        Olá, mundo!
      </Heading>
    </VStack>
  )
}
