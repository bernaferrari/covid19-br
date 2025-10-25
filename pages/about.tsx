import {
  Box,
  Container,
  Image,
  Link,
  Separator,
  Text,
} from "@chakra-ui/react";
import type { ComponentProps } from "react";
import type { NextPage } from "next";
import ArchiveBanner from "../components/ArchiveBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ContourBrazil from "../components/d3/ContourBrazil";
import ContourParana from "../components/d3/ContourParana";
import GetCovidDataComp from "../components/GetCovidDataComp";
import {
  SectionTitle,
  SectionSubtitle,
  SectionTitleAbout,
} from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";

const TextImageContainer = (props: ComponentProps<typeof Box>) => (
  <Container maxW="3xl" py={4} {...props} />
);

const Contribution = (props: ComponentProps<typeof Text>) => (
  <Text fontSize="xs" mx={1} textAlign="center" {...props} />
);

const CenteredImage = ({ alt, ...props }: ComponentProps<typeof Image>) => (
  <Image mx="auto" alt={alt ?? ""} {...props} />
);

const AdaptiveBox = (props: ComponentProps<typeof Box>) => (
  <Box
    width={{ base: "100%", md: "50%" }}
    py={4}
    {...props}
  />
);

const AboutPage: NextPage = () => (
  <Box pb={16}>
    <Header />
    <Box as="main">
      <Box pt={{ base: 24, md: 40 }}>
        <ArchiveBanner />
      </Box>

      <Container maxW="xl" mt={4}>
      <SectionTitleAbout>Fale conosco</SectionTitleAbout>
      <Box h={4} />
      <Text textAlign="center" mx={2}>
        Se há algo que possamos ajudar, veja o contato dos pesquisadores nos
        sites dos laboratórios{" "}
        <Link href="https://www.c3sl.ufpr.br" color="purple.500" fontWeight="bold">
          C3SL
        </Link>{" "}
        e{" "}
        <Link href="http://web.leg.ufpr.br/" color="purple.500" fontWeight="bold">
          LEG
        </Link>
        .
      </Text>
    </Container>

    <Separator my={6} />

    <TextImageContainer>
      <SectionTitle>Curva de casos</SectionTitle>
      <SectionSubtitle>Estados do Brasil</SectionSubtitle>
      <Box h={4} />
      <CenteredImage src="/figs/animacao_corona.gif" alt="Curva de casos" />
      <Text mt={2} textAlign="center">
        Contribuição: Prof. Marco Antonio Leonel Caetano (INSPER/SP)
      </Text>
    </TextImageContainer>

    <Separator my={6} />

    <TextImageContainer>
      <StyledFlex>
        <AdaptiveBox>
          <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
          <SectionSubtitle>Municípios</SectionSubtitle>
          <Box h={4} />
          <CenteredImage src="/figs/brasil-maiscasos.png" alt="Casos por município" />
        </AdaptiveBox>

        <AdaptiveBox>
          <SectionTitle>Taxa de casos por 100 mil habitantes.</SectionTitle>
          <SectionSubtitle>Municípios</SectionSubtitle>
          <Box h={4} />
          <CenteredImage
            src="/figs/brasil-maiscasos-taxas.png"
            alt="Taxa de casos por 100 mil habitantes"
          />
        </AdaptiveBox>
      </StyledFlex>
    </TextImageContainer>

    <Separator my={6} />

    <TextImageContainer>
      <SectionTitle>Evolução da taxa de óbitos por casos.</SectionTitle>
      <SectionSubtitle>Regiões do Brasil</SectionSubtitle>
      <Box h={4} />
      <CenteredImage src="/figs/letalidade-regioes.png" alt="Taxa de óbitos por casos" />
    </TextImageContainer>

    <Separator my={6} />

    <TextImageContainer>
      <SectionTitle>Evolução do número de casos.</SectionTitle>
      <SectionSubtitle>Estados e regiões do Brasil</SectionSubtitle>
      <Box h={4} />
      <CenteredImage
        src="/figs/data-casos-obitos-estado-regiao.png"
        alt="Evolução do número de casos"
      />
    </TextImageContainer>

    <Box bg="black" py={8}>
      <TextImageContainer>
        <StyledFlex>
          <AdaptiveBox>
            <SectionTitle color="white">Previsão do número casos.</SectionTitle>
            <SectionSubtitle color="white">
              Brasil (acumulado e diário)
            </SectionSubtitle>
            <Box h={4} />
            <CenteredImage
              src="/figs/Projec_casos_140420.JPG"
              alt="Previsão de casos"
            />
          </AdaptiveBox>

          <AdaptiveBox>
            <SectionTitle color="white">Previsão do número de óbitos.</SectionTitle>
            <SectionSubtitle color="white">
              Brasil (acumulado e diário)
            </SectionSubtitle>
            <Box h={4} />
            <CenteredImage
              src="/figs/Projec_mortes_140420.JPG"
              alt="Previsão de óbitos"
            />
          </AdaptiveBox>
        </StyledFlex>
        <Contribution color="white" mt={2}>
          Contribuição: Prof. Marco Antonio Leonel Caetano (Insper-SP)
        </Contribution>
      </TextImageContainer>
    </Box>

    <TextImageContainer>
      <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
      <SectionSubtitle>Brasil e outros países</SectionSubtitle>
      <Box h={4} />
      <CenteredImage
        src="/figs/world-country-data.png"
        alt="Casos e óbitos Brasil e outros países"
      />
    </TextImageContainer>

    <Separator my={6} />

    <TextImageContainer>
      <SectionTitle>Taxa de óbitos vs número de testes por casos.</SectionTitle>
      <SectionSubtitle>Países com 50 óbitos ou mais</SectionSubtitle>
      <Box h={4} />
      <CenteredImage
        src="/figs/dispersion-death-tests.png"
        alt="Taxa de óbitos vs número de testes"
      />
    </TextImageContainer>

    <Separator my={6} />

    <GetCovidDataComp>
      <Container maxW="3xl" py={4}>
        <SectionTitleAbout>Casos no Brasil</SectionTitleAbout>
        <Box h={4} />
        <ContourBrazil />
      </Container>

      <Separator my={6} />

      <Container maxW="3xl" py={4}>
        <SectionTitleAbout>Casos no Paraná</SectionTitleAbout>
        <Box h={4} />
        <ContourParana />
      </Container>
    </GetCovidDataComp>

    </Box>

    <Footer />
  </Box>
);

export default AboutPage;
