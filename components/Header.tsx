import { Box, Button, Container, Flex, Link as ChakraLink } from "@chakra-ui/react";
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
        <ChakraLink as={NextLink} href="/" display="inline-flex" alignItems="center">
          <Image
            src="/header_footer/img_logo.png"
            alt="Portal COVID-19 Paraná"
            width={216}
            height={107}
            style={{ width: 120, height: "auto" }}
          />
        </ChakraLink>

        <Flex align="center" color="gray.600" gap={2}>
          <Button asChild variant="ghost">
            <NextLink href="/evolution">Monitoramento</NextLink>
          </Button>
          <Button asChild variant="ghost">
            <NextLink href="/about">Projeções</NextLink>
          </Button>
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
              width={182}
              height={118}
              style={{ width: 80, height: "auto" }}
            />
          </ChakraLink>
        </Flex>
      </Flex>
    </Container>
  </Box>
);

export default Header;
