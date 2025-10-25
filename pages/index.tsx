import {
  Box,
  Container,
  Flex,
  Heading,
  Separator,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import ArchiveBanner from "../components/ArchiveBanner";
import Footer from "../components/Footer";
import GetCovidDataComp from "../components/GetCovidDataComp";
import Header from "../components/Header";
import News from "../components/News";
import OverallInfo from "../components/OverallInfo";
import BrazilInteractive from "../components/d3/DailyMapSpikesBrazil";
import ParanaFilledInteractive from "../components/d3/DailyMapFilledParana";
import StatesLines from "../components/d3/DailyLinesBrazil";
import TopGrowing from "../components/d3/TopGrowing";

const IndexPage: NextPage = () => (
  <Box pb={16}>
    <Header />

    <Box as="main">
      <Container maxW="3xl" pt={{ base: 24, md: 40 }} pb={16}>
        <ArchiveBanner />

        <Flex
          align="flex-start"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 8, md: 12 }}
        >
          <Box flex="1" p={{ base: 0, md: 6 }}>
            <Heading as="h1" size="xl" fontWeight="semibold">
              Portal COVID-19 no{" "}
              <Box as="span" color="purple.500">
                Paraná
              </Box>
            </Heading>

            <Text mt={4} fontSize="sm" lineHeight="tall">
              Este portal tem por objetivo agregar informações atualizadas,
              modelos estatísticos, visualizações de dados e links úteis sobre a
              pandemia COVID-19 no Brasil, especialmente no Estado do Paraná.
            </Text>

            <Text mt={3} fontSize="sm" lineHeight="tall">
              O conteúdo disponibilizado é um esforço conjunto de pesquisadores
              dos Departamentos de Estatística, Informática, Física, Matemática,
              Design e Saúde da Universidade Federal do Paraná e pesquisador do
              Insper-SP, com o apoio da Direção do Setor de Ciências Exatas da
              UFPR.
            </Text>
          </Box>

          <OverallInfo />
        </Flex>

        <Box mt={10}>
          <News />
        </Box>
      </Container>

      <GetCovidDataComp>
        <Box bg="gray.50" py={8}>
          <Container maxW="3xl">
            <Heading size="sm" textAlign="center">
              Evolução dos casos
            </Heading>

            <Box mt={6} textAlign="center">
              <div id="externalDiv">
                <TopGrowing />
              </div>
            </Box>
          </Container>
        </Box>

        <Container maxW="3xl" py={10}>
          <ParanaFilledInteractive />
        </Container>

        <Separator my={4} />

        <Container maxW="3xl" py={10}>
          <BrazilInteractive />
        </Container>

        <Separator my={4} />
      </GetCovidDataComp>

      <Container maxW="3xl" py={10}>
        <StatesLines />
      </Container>
    </Box>

    <Footer />
  </Box>
);

export default IndexPage;
