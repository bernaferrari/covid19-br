import {
  Box,
  Grid,
  Flex,
  Image,
  Link,
  Divider,
  Text,
  Button,
} from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SectionTitleAbout } from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";
import RelatedLinksList from "../components/RelatedLinksList";
import OtherSources from "../components/OtherSources";

function AccessOtherSite(props) {
  return (
    <Box padding={2} w={{ sm: "100%", md: "50%" }}>
      <Box
        display="inline-flex"
        rounded={8}
        bg="#ffffff"
        borderWidth={1}
        padding={2}
        w="100%"
      >
        <Box w="100%">
          <a href={props.url}>
            <Box display="inline-flex">
              <Box style={{ flex: "none" }}>
                <Image
                  rounded="lg"
                  size={96}
                  src={props.src}
                  alt="preview do site"
                />
              </Box>
              <Box ml={4} style={{ flex: "1 1 auto" }}>
                <Text
                  mt={1}
                  fontSize="lg"
                  lineHeight="normal"
                  fontWeight="semibold"
                >
                  {props.title}
                </Text>
                <Text mt={2} color="gray.500">
                  {props.subtitle}
                </Text>
              </Box>
            </Box>

            <Button mt={2} w="100%">
              {props.access}
            </Button>
          </a>
        </Box>
      </Box>
    </Box>
  );
}

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size="64px" />

      <Box bg="gray.50">
        <Flex
          maxW="3xl"
          mx="auto"
          py={2}
          px={2}
          flexWrap="wrap"
          justify="center"
          align="center"
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
            title="Visualização temporal"
            subtitle="Visualização temporal de dados de COVID19."
            access="Acessar site"
            src="/elias_preview.jpg"
            url="http://shiny.leg.ufpr.br/elias/covid19time/"
          />
        </Flex>

        <Divider mb={4} borderColor="gray.300" />

        <Box maxW="3xl" mx="auto">
          <SectionTitleAbout>Outras Fontes</SectionTitleAbout>
          <OtherSources />
        </Box>

        <Divider mb={4} borderColor="gray.300" />

        <Box maxW="3xl" mx="auto">
          <SectionTitleAbout>Documentos e Links</SectionTitleAbout>
          <Box size={4} />
          <RelatedLinksList />
        </Box>
      </Box>

      <Box size="16px" />

      <Footer />
    </Box>
  );
};
