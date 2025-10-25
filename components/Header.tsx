import {
  Box,
  Button,
  Container,
  Flex,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import type { ComponentProps } from "react";

type HeaderProps = ComponentProps<typeof Box>;

const Header = (props: HeaderProps) => (
  <Box
    as="header"
    position="fixed"
    top={0}
    left={0}
    right={0}
    zIndex={10}
    borderBottomWidth="1px"
    bg="white"
    {...props}
  >
    <Container maxW="6xl" py={2}>
      <Flex align="center" justify="space-between">
        <ChakraLink
          as={NextLink}
          href="/"
          display="inline-flex"
          alignItems="center"
        >
          <Image
            src="/header_footer/img_logo.png"
            alt="Portal COVID-19 Paraná"
            width={120}
            height={32}
          />
        </ChakraLink>

        <Flex align="center" color="gray.600" gap={2}>
          <NextLink href="/evolution" passHref legacyBehavior>
            <Button as="a" variant="ghost">
              Monitoramento
            </Button>
          </NextLink>
          <NextLink href="/about" passHref legacyBehavior>
            <Button as="a" variant="ghost">
              Projeções
            </Button>
          </NextLink>
          <ChakraLink
            href="https://www.ufpr.br/portalufpr/"
            target="_blank"
            rel="noopener noreferrer"
            display="inline-flex"
            alignItems="center"
          >
            <Image
              src="/header_footer/img_ufpr.png"
              alt="UFPR"
              width={80}
              height={24}
            />
          </ChakraLink>
        </Flex>
      </Flex>
    </Container>
  </Box>
);

export default Header;
