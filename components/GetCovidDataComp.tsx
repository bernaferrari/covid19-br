import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { loadDataIntoCache } from "../utils/fetcher";

const GetCovidDataComp = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void loadDataIntoCache()
      .then(() => setIsReady(true))
      .catch(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <Flex w="100%" minH="512px" rounded="lg">
        <Flex mx="auto" my="auto" direction="column" align="center">
          <Spinner size="xl" colorPalette="purple" />
          <Box h="16px" />
          <Text fontSize="sm" color="gray.600">
            carregando os dados...
          </Text>
        </Flex>
      </Flex>
    );
  }

  return <>{children}</>;
};

export default GetCovidDataComp;
