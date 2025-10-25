import { Box, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { timeParse } from "d3";
import type { DSVRowString } from "d3";
import { useEffect, useMemo, useState } from "react";

type SnapshotRow = {
  state: string;
  date: string;
  confirmed: number;
  deaths: number;
};

const parseDate = timeParse("%Y-%m-%d");

const normalizeRow = (row: DSVRowString<string>): SnapshotRow => ({
  state: row.state ?? "",
  date: row.date ?? "",
  confirmed: Number(row.confirmed ?? 0),
  deaths: Number(row.deaths ?? 0),
});

const formatNumber = (value: number) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

const OverallInfo = () => {
  const [data, setData] = useState<SnapshotRow[]>([]);

  useEffect(() => {
    let isMounted = true;

    import("d3").then(({ csv }) => {
      void csv("/caso_shrink.csv").then((rows) => {
        if (!isMounted) return;
        setData(rows.map(normalizeRow));
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const brazilTotals = data.reduce(
      (acc, row) => {
        acc.confirmed += row.confirmed;
        acc.deaths += row.deaths;
        return acc;
      },
      { confirmed: 0, deaths: 0 }
    );

    const parana = data.find((row) => row.state === "PR");

    return {
      brazilConfirmed: brazilTotals.confirmed,
      brazilDeaths: brazilTotals.deaths,
      paranaConfirmed: parana?.confirmed ?? 0,
      paranaDeaths: parana?.deaths ?? 0,
      lastDate: data[0]?.date ?? "",
    };
  }, [data]);

  if (!stats) {
    return <Box p={6} flex="1" rounded="lg" borderWidth="1px" minH="196px" />;
  }

  const parsed = parseDate?.(stats.lastDate);
  const formattedDate = parsed
    ? parsed.toLocaleDateString("pt-BR")
    : stats.lastDate;

  const cards = [
    {
      label: "Casos no Brasil",
      value: formatNumber(stats.brazilConfirmed),
      color: "orange.400",
    },
    {
      label: "Óbitos no Brasil",
      value: formatNumber(stats.brazilDeaths),
      color: "pink.500",
    },
    {
      label: "Casos no Paraná",
      value: formatNumber(stats.paranaConfirmed),
      color: "orange.400",
    },
    {
      label: "Óbitos no Paraná",
      value: formatNumber(stats.paranaDeaths),
      color: "pink.500",
    },
  ];

  return (
    <Box p={6} flex="1" rounded="lg" borderWidth="1px" bg="white">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {cards.map((card) => (
          <Box key={card.label} borderWidth="1px" rounded="md" p={4} bg="gray.50">
            <Text fontSize="sm" color="gray.600">
              {card.label}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={card.color} mt={1}>
              {card.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Text textAlign="center" mt={4} fontSize="xs">
        <Link
          href="https://brasil.io/dataset/covid19/"
          color="purple.500"
          target="_blank"
          rel="noopener noreferrer"
        >
          última atualização: {formattedDate} (fonte Brasil.IO)
        </Link>
      </Text>
    </Box>
  );
};

export default OverallInfo;
