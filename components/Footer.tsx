import {
  Box,
  Container,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

const partners = [
  {
    href: "https://www.c3sl.ufpr.br/",
    src: "/header_footer/img_c3sl.png",
    alt: "C3SL",
  },
  {
    href: "http://www.exatas.ufpr.br/portal/en/",
    src: "/header_footer/img_exatas.png",
    alt: "Setor de Ciências Exatas UFPR",
  },
  {
    href: "http://web.leg.ufpr.br/",
    src: "/header_footer/img_leg.png",
    alt: "Laboratório de Estatística e Geoinformação",
  },
  {
    href: undefined,
    src: "/header_footer/img_labdsi.png",
    alt: "Laboratório de Design de Sistemas de Informação",
  },
];

const Footer = () => (
  <Box as="footer" borderTopWidth="1px" bg="white" py={6}>
    <Container maxW="6xl">
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        gap={8}
      >
        {partners.map(({ href, src, alt }) => {
          const logo = (
            <Image src={src} alt={alt} width={120} height={40} priority />
          );

          return href ? (
            <ChakraLink
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {logo}
            </ChakraLink>
          ) : (
            <Box key={alt}>{logo}</Box>
          );
        })}
      </Stack>

      <Box textAlign="center" mt={6}>
        <Text fontSize="xs" color="gray.600" lineHeight="tall">
          Developed &amp; designed by{" "}
          <ChakraLink
            href="https://github.com/bernaferrari"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bernardo Ferrari
          </ChakraLink>{" "}
          &amp; Rafael Ancara.
          <br />
          Mantido por Fernanda Yukari Kawasaki (IC voluntária), Natália Yada e
          Tamy Beppler (com financiamento da bolsa CAPES para combate ao
          COVID-19).
          <br />
          Administrado por André Grégio.
        </Text>
      </Box>
    </Container>
  </Box>
);

export default Footer;
