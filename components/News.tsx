import { Box, Heading, Divider, Link, Icon } from "@chakra-ui/core";

const News = () => {
  return (
    <Box rounded="lg" boxShadow="md" bg="#ffffff" maxW="3xl" mx="auto" p={4}>
      <Heading size="sm" textAlign="center">
        Novidades
      </Heading>
      <Divider />
      <Link
        href="https://www.medrxiv.org/content/10.1101/2020.06.05.20123604v1"
        isExternal
      >
        <Icon name="chevron-right" mx="2px" /> Scrutinizing the heterogeneous
        spreading of COVID-19 outbreak in Brazilian territory{" "}
        <Icon name="external-link" mx="2px" />
      </Link>{" "}
      <br />
      <Link
        href="https://ricmais.com.br/videos/parana-no-ar/diagnostico-do-coronavirus-exame-de-raio-x-identifica-doenca/"
        isExternal
      >
        <Icon name="chevron-right" mx="2px" /> Diagnóstico do Corona Vírus por
        Raio-X - professores UFPR e UFOP <Icon name="external-link" mx="2px" />
      </Link>{" "}
      <br />
      <Link
        href="https://www.youtube.com/watch?v=4HHOuDnW2DQ&feature=emb_logo&fbclid=IwAR3vxB3jC2TkUP9hWTp-9fEqgQ6xlOFKLSRTll5fj6NOjZqtpUzTrAX9tw8"
        isExternal
      >
        <Icon name="chevron-right" mx="2px" /> Painel da SBF: Físicos e a
        Pandemia <Icon name="external-link" mx="2px" />
      </Link>{" "}
      <br />
      <Link
        href="https://www.insper.edu.br/noticias/covid-19-portal-marco-antonio/"
        isExternal
      >
        <Icon name="chevron-right" mx="2px" /> Professor do Insper colabora com
        a UFPR em portal sobre a Covid-19 <Icon name="external-link" mx="2px" />
      </Link>{" "}
      <br />
    </Box>
  );
};

export default News;
