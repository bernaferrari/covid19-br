import {
  Badge,
  Box,
  Flex,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { FaFileAlt, FaInfoCircle, FaNewspaper } from "react-icons/fa";

type DocumentKind = "article" | "info" | "document";

type RelatedDocument = {
  title: string;
  kind: DocumentKind;
  author: string;
  url: string;
};

const documents: RelatedDocument[] = [
  {
    title: "Atualização da Situação do Estado do Paraná",
    kind: "article",
    author: "Silva, R., Beims, M., 22/06/2020",
    url: "/docs/arquivo-parana.pdf",
  },
  {
    title: "Cuidados com análises de dados da Covid19",
    kind: "info",
    author: "Bastos, L. (FIOCRUZ), 05/05/2020",
    url: "http://www.statpop.com.br/2020/05/cuidados-com-analises-de-dados-da.html",
  },
  {
    title: "Combate ao COVID-19 em cidades menores, o dia D é hoje!",
    kind: "article",
    author: "Brugnago, E., Beims, M., 30/04/2020",
    url: "/docs/CoronaGeral.pdf",
  },
  {
    title:
      "Strong correlations between power-law growth of COVID-19 in four continents and the inefficiency of soft quarantine strategies",
    kind: "article",
    author: "Manchein, C. et al., CHAOS 30, 041102 (2020)",
    url: "https://aip.scitation.org/doi/pdf/10.1063/5.0009454?download=true&",
  },
  {
    title: "Mapa interativo",
    kind: "info",
    author: "Dante Aléo/Prof. André Grégio (DInf@UFPR)",
    url: "https://pinsis.c3sl.ufpr.br/corona-parana",
  },
  {
    title: "A quem servem os dados?",
    kind: "article",
    author: "Sunye, M.S., SBC Horizontes, 2020",
    url: "http://horizontes.sbc.org.br/index.php/2020/04/15/a-quem-servem-os-dados/",
  },
  {
    title: "FAKE NEWS sobre o COVID-19!",
    kind: "info",
    author: "",
    url: "https://docs.google.com/document/d/1N6uGC45kdg-hrAk1zsFCYtT89E-5oV5JwxI1eM798kQ/edit",
  },
  {
    title: "Identificação de modelos para COVID-19…",
    kind: "article",
    author: "Caetano, M. A. L. 2020",
    url: "http://covid.c3sl.ufpr.br/docs/covid19enxameparticulas.pdf",
  },
  {
    title: "Nota Técnica na SBMAC: Combate ao Coronavírus…",
    kind: "info",
    author: "Vasconcelos et al.",
    url: "https://www.sbmac.org.br/wp-content/uploads/2020/04/Covid-19-Nota-NEW.pdf",
  },
  {
    title: "Modelling fatality curves of COVID-19…",
    kind: "article",
    author: "Vasconcelos et al., 2020",
    url: "https://www.medrxiv.org/content/10.1101/2020.04.02.20051557v1",
  },
  {
    title: "Correlação entre crescimento/quarentena do COVID-19",
    kind: "article",
    author: "Manchein, Cesar, et al.",
    url: "http://covid.c3sl.ufpr.br/docs/corrcovid.pdf",
  },
  {
    title: "Modelagem e Previsões para o COVID19",
    kind: "document",
    author: "Marco Antonio Leonel Caetano",
    url: "http://covid.c3sl.ufpr.br/docs/rascunhocorona.pdf",
  },
  {
    title:
      "Scrutinizing the heterogeneous spreading of COVID-19 outbreak in Brazilian territory",
    kind: "article",
    author: "Silva,R.M., Mendes,C.F.O., Manchein,C.,2020",
    url: "https://www.medrxiv.org/content/10.1101/2020.06.05.20123604v1",
  },
];

const kindConfig: Record<
  DocumentKind,
  { label: string; icon: IconType; colorScheme: "green" | "orange" | "gray" }
> = {
  article: { label: "Artigo", icon: FaNewspaper, colorScheme: "green" },
  info: { label: "Informação", icon: FaInfoCircle, colorScheme: "orange" },
  document: { label: "Documento", icon: FaFileAlt, colorScheme: "gray" },
};

const RelatedLinksList = () => (
  <SimpleGrid w="full" gap={{ base: 4, md: 5 }} columns={{ base: 1, md: 2, xl: 3 }}>
    {documents.map((document) => {
      const { label, icon, colorScheme } = kindConfig[document.kind];
      const isExternal = document.url.startsWith("http");

      return (
        <LinkBox
          key={document.url}
          as="article"
          role="group"
          h="full"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="xl"
          bg="white"
          shadow="sm"
          transition="all 0.2s ease"
          _hover={{
            shadow: "md",
            borderColor: `${colorScheme}.300`,
          }}
        >
          <Stack gap={4} p={{ base: 4, sm: 5 }} h="full">
            <Flex align="center" gap={3}>
              <Flex
                rounded="full"
                w={10}
                h={10}
                align="center"
                justify="center"
                bg={`${colorScheme}.100`}
                color={`${colorScheme}.600`}
                transition="all 0.2s ease"
                _groupHover={{ color: `${colorScheme}.700` }}
              >
                <Icon as={icon} boxSize={5} />
              </Flex>
              <Stack gap={1} flex="1" minW={0}>
                <Badge
                  colorScheme={colorScheme}
                  variant="subtle"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  fontSize="xs"
                  w="fit-content"
                >
                  {label}
                </Badge>
                <Heading as="h3" fontSize="md" lineHeight="short" fontWeight="semibold" lineClamp={3}>
                  <LinkOverlay
                    href={document.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {document.title}
                  </LinkOverlay>
                </Heading>
              </Stack>
            </Flex>

            {document.author && (
              <Text fontSize="sm" color="gray.600" lineClamp={2}>
                {document.author}
              </Text>
            )}
          </Stack>
        </LinkBox>
      );
    })}
  </SimpleGrid>
);

export default RelatedLinksList;
