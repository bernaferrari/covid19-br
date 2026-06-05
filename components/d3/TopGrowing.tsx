import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { group, line, max, scaleLinear, scaleTime } from "d3";
import { useMemo } from "react";
import {
  formatDate,
  formatNumber,
  getMetricValue,
  latestDate,
  loadCities,
  loadParanaTopCityDays,
  parseCovidDate,
  type City,
  type MunicipalityDay,
} from "../../utils/covidData";
import { ChartFrame } from "./chartUi";
import { useAsyncData } from "./useAsyncData";

type TopGrowingData = {
  cities: City[];
  days: MunicipalityDay[];
};

const sparklineWidth = 140;
const sparklineHeight = 44;

const loadTopGrowingData = async (): Promise<TopGrowingData> => {
  const [cities, days] = await Promise.all([loadCities(), loadParanaTopCityDays()]);
  return { cities, days };
};

const Sparkline = ({ rows }: { rows: MunicipalityDay[] }) => {
  const x = scaleTime()
    .domain([parseCovidDate(rows[0].date), parseCovidDate(rows.at(-1)?.date ?? rows[0].date)])
    .range([0, sparklineWidth]);
  const y = scaleLinear()
    .domain([0, max(rows, (row) => row.confirmed) ?? 0])
    .nice()
    .range([sparklineHeight - 4, 4]);
  const path = line<MunicipalityDay>()
    .x((row) => x(parseCovidDate(row.date)))
    .y((row) => y(row.confirmed));

  return (
    <svg viewBox={`0 0 ${sparklineWidth} ${sparklineHeight}`} aria-hidden>
      <path
        d={path(rows) ?? undefined}
        fill="none"
        stroke="#7c3aed"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TopGrowing = () => {
  const state = useAsyncData(loadTopGrowingData);

  const model = useMemo(() => {
    if (state.status !== "ready") return null;

    const cityByCode = new Map(state.data.cities.map((city) => [city.code, city]));
    const date = latestDate(state.data.days);
    const rowsByCity = group(state.data.days, (row) => row.cityCode);
    const leaders = [...rowsByCity.entries()]
      .map(([cityCode, rows]) => {
        const sortedRows = rows.sort((a, b) => a.date.localeCompare(b.date));
        const latest = sortedRows.findLast((row) => row.date === date) ?? sortedRows.at(-1);
        const previous = sortedRows.at(-8);
        const city = cityByCode.get(cityCode);

        return latest && city
          ? {
              city,
              latest,
              rows: sortedRows,
              weeklyGrowth: previous ? latest.confirmed - previous.confirmed : latest.confirmed,
            }
          : null;
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .sort((a, b) => b.weeklyGrowth - a.weeklyGrowth)
      .slice(0, 8);

    return { date, leaders };
  }, [state]);

  if (state.status === "loading") {
    return <ChartFrame status="loading" message="Carregando ranking de municípios..." />;
  }

  if (state.status === "error") {
    return <ChartFrame status="error" message="Não foi possível carregar o ranking." />;
  }

  if (!model || model.leaders.length === 0) {
    return <ChartFrame status="empty" message="Sem ranking disponível." />;
  }

  return (
    <Stack gap={3}>
      <Text textAlign="center" fontSize="sm" color="gray.600">
        Municípios do Paraná com maior crescimento semanal até {formatDate(model.date)}
      </Text>
      <Stack gap={2}>
        {model.leaders.map((row, index) => (
          <Flex
            key={row.city.code}
            align="center"
            justify="space-between"
            gap={3}
            p={3}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            rounded="md"
          >
            <Flex align="center" gap={3} minW={0}>
              <Text fontSize="sm" fontWeight="bold" color="purple.600" w={6}>
                {index + 1}
              </Text>
              <Box minW={0}>
                <Text fontSize="sm" fontWeight="semibold" truncate>
                  {row.city.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  +{formatNumber(row.weeklyGrowth)} casos na semana
                </Text>
              </Box>
            </Flex>
            <Box w={`${sparklineWidth}px`} hideBelow="sm">
              <Sparkline rows={row.rows} />
            </Box>
            <Text fontSize="sm" fontWeight="semibold" minW="88px" textAlign="right">
              {formatNumber(getMetricValue(row.latest, "confirmed"))}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
};

export default TopGrowing;
