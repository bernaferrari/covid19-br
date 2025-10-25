import { Alert, Box, Link } from "@chakra-ui/react";

const ArchiveBanner = () => (
  <Box maxW="3xl" mx="auto" px={{ base: 4, md: 6 }} py={4}>
    <Alert.Root
      variant="subtle"
      colorPalette="purple"
      alignItems="flex-start"
      rounded="xl"
      borderWidth="1px"
      borderColor="purple.200"
      shadow="sm"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      gap={3}
    >
      <Alert.Indicator boxSize={5} />
      <Alert.Content>
        <Alert.Title fontSize="sm" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
          Portal arquivado
        </Alert.Title>
        <Alert.Description fontSize="sm" color="gray.700">
          Mantemos este site como registro histórico da mobilização coletiva nos primeiros anos da pandemia
          (2020-2021). Os dados não são mais atualizados e os serviços estão indisponíveis.{" "}
          Para saber mais sobre o contexto e as limitações atuais, consulte o{" "}
          <Link
            href="https://github.com/bernardoferrari/portal_covid"
            target="_blank"
            rel="noopener noreferrer"
            fontWeight="semibold"
            color="purple.600"
          >
            README do repositório
          </Link>
          .
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  </Box>
);

export default ArchiveBanner;
