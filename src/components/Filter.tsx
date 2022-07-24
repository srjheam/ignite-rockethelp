import { Button, IButtonProps, Text, useTheme } from "native-base";

import { OrderStatus } from "../types";

type Props = IButtonProps & {
  title: string,
  isActive?: boolean,
  type: OrderStatus
}

export function Filter({ title, isActive = false, type, ...rest }: Props) {
  const { colors } = useTheme();

  const widthActive = isActive ? 1 : 0;
  const colorType = type === 'open' ? colors.secondary[700] : colors.green[300];
  const colorActive = isActive ? colorType : 'gray.300';

  return (
    <Button
      variant='outline'
      borderWidth={widthActive}
      borderColor={colorType}
      bg='gray.600'
      flex={1}
      size='sm'
      {...rest}
    >
      <Text color={colorActive} fontSize='xs' textTransform='uppercase'>
        {title}
      </Text>
    </Button>
  );
}
