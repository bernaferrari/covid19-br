import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Link,
  Separator,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import ArchiveBanner from "../components/ArchiveBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import OtherSources from "../components/OtherSources";
import RelatedLinksList from "../components/RelatedLinksList";
import { SectionTitleAbout } from "../components/SectionTitles";

type AccessOtherSiteProps = {
  title: string;
  subtitle: string;
  access: string;
  src: string;
  url: string;
};

const AccessOtherSite = ({
  title,
  subtitle,
  access,
  src,
  url,
}: AccessOtherSiteProps) => (
  <Box p={2} w={{ base: "100%", md: "50%" }}>
    <Box
      display="inline-flex"
      rounded="lg"
      bg="white"
      borderWidth={1}
      p={2}
      w="100%"
      transition="all 0.2s ease"
      _hover={{ borderColor: "purple.400", shadow: "md" }}
    >
      <Box w="100%">
        <Link href={url} target="_blank" rel="noopener noreferrer" display="block">
          <Flex align="center">
            <Box flex="none">
              <Image
                rounded="lg"
                boxSize="96px"
                objectFit="cover"
                src={src}
                alt={`Preview ${title}`}
              />
            </Box>
            <Box ml={4} flex="1 1 auto">
              <Text fontSize="lg" fontWeight="semibold" lineHeight="short">
                {title}
              </Text>
              <Text mt={2} color="gray.500" fontSize="sm">
                {subtitle}
              </Text>
            </Box>
          </Flex>

          <Button mt={3} w="100%" colorScheme="purple" variant="outline">
            {access}
          </Button>
        </Link>
      </Box>
    </Box>
  </Box>
);

const EvolutionPage: NextPage = () => (
  <Box pb={16}>
    <Header />
    <Box as="main">
      <Box pt={{ base: 24, md: 40 }}>
        <ArchiveBanner />
      </Box>

    <Box bg="gray.50" py={10}>
      <Flex
        maxW="3xl"
        mx="auto"
        px={2}
        wrap="wrap"
        justify="center"
        align="stretch"
      >
        <AccessOtherSite
          title="Monitoramento do R(t)"
          subtitle="Monitoramento estatístico no Brasil e Paraná."
          access="Acessar site"
          src="/wagner_preview.jpg"
          url="http://leg.ufpr.br/~wagner/covid/"
        />
        <AccessOtherSite
          title="Monitoramento geral"
          subtitle="Monitoramento geral no Brasil e Paraná"
          access="Acessar site"
          src="/monitoramento_preview.jpg"
          url="https://lineu96.github.io/covid19/"
        />
        <AccessOtherSite
          title="Monitoramento do R(t)/Bayes"
          subtitle="R(t) estimado por suavização Bayesiana."
          access="Acessar site"
          src="/elias_preview.jpg"
          url="http://www.leg.ufpr.br/~elias/rtmaps/RtPR.html"
        />
        <AccessOtherSite
          title="Visualização temporal"
          subtitle="Visualização temporal de dados de COVID-19."
          access="Acessar site"
          src="/elias_preview.jpg"
          url="http://shiny.leg.ufpr.br/elias/covid19time/"
        />
      </Flex>

      <Separator my={8} color="gray.300" />

      <Container maxW="3xl">
        <SectionTitleAbout>Outras Fontes</SectionTitleAbout>
        <OtherSources />
      </Container>

      <Separator my={8} color="gray.300" />

      <Container maxW="3xl">
        <SectionTitleAbout>Documentos e Links</SectionTitleAbout>
        <Box h={4} />
        <RelatedLinksList />
      </Container>
    </Box>

    </Box>

    <Box h="16px" />

    <Footer />
  </Box>
);

export default EvolutionPage;
