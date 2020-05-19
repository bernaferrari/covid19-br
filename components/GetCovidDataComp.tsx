import React, { useState, Fragment, useEffect } from "react";
import { loadDataIntoCache } from "../utils/fetcher";
import { Box, Flex, Spinner, Text } from "@chakra-ui/core";

const GetCovidDataComp = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDataIntoCache().then((d) => setData(d));
  });

  if (data === null) {
    return (
      <Flex w="100%" minH="512px" rounded="10px">
        <Flex mx="auto" my="auto" direction="column">
          <Spinner
            size="xl"
            speed="1s"
            mx="auto"
            thickness="2px"
            color="purple.500"
          />
          <Box size="16px" />
          <Text fontSize="sm">carregando os dados...</Text>
        </Flex>
      </Flex>
    );
  }

  return <Fragment>{props.children}</Fragment>;
};

export default GetCovidDataComp;
