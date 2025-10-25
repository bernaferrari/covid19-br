import {
  Box,
  Heading,
  Link,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";

const News = () => {
  return (
    <Box rounded="lg" boxShadow="md" bg="#ffffff" maxW="3xl" mx="auto" p={4}>
      <Heading size="sm" textAlign="center">
        Novidades
      </Heading>
      <Separator my={2} />
      <Text fontSize="xs" color="gray.500" my={2} textAlign="center">
        Registros históricos do projeto no início da pandemia (2020-2021). Links
        externos podem estar desativados.
      </Text>
      <Stack gap={2} mt={2}>
        <Link
          href="https://www.medrxiv.org/content/10.1101/2020.06.05.20123604v1"
          target="_blank"
          rel="noopener noreferrer"
        >
          • Scrutinizing the heterogeneous spreading of COVID-19 outbreak in
          Brazilian territory <Box as={FiExternalLink} display="inline" mx="4px" />
        </Link>
        <Link
          href="https://ricmais.com.br/videos/parana-no-ar/diagnostico-do-coronavirus-exame-de-raio-x-identifica-doenca/"
          target="_blank"
          rel="noopener noreferrer"
        >
          • Diagnóstico do Corona Vírus por Raio-X - professores UFPR e UFOP{" "}
          <Box as={FiExternalLink} display="inline" mx="4px" />
        </Link>
        <Link
          href="https://www.youtube.com/watch?v=4HHOuDnW2DQ&feature=emb_logo&fbclid=IwAR3vxB3jC2TkUP9hWTp-9fEqgQ6xlOFKLSRTll5fj6NOjZqtpUzTrAX9tw8"
          target="_blank"
          rel="noopener noreferrer"
        >
          • Painel da SBF: Físicos e a Pandemia <Box as={FiExternalLink} display="inline" mx="4px" />
        </Link>
        <Link
          href="https://www.insper.edu.br/noticias/covid-19-portal-marco-antonio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          • Professor do Insper colabora com a UFPR em portal sobre a Covid-19{" "}
          <Box as={FiExternalLink} display="inline" mx="4px" />
        </Link>
      </Stack>
    </Box>
  );
};

export default News;
