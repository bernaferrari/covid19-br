import { Box, Text, chakra } from "@chakra-ui/react";
import { timeParse } from "d3";
import type { DSVRowString } from "d3";
import { useEffect, useState } from "react";

const Table = chakra("table");
const Caption = chakra("caption");
const Thead = chakra("thead");
const Tbody = chakra("tbody");
const Tr = chakra("tr");
const Th = chakra("th");
const Td = chakra("td");

const parseDate = timeParse("%Y-%m-%d");

const formatDate = (value: string | undefined) => {
  if (!value) return "--";
  const parsed = parseDate?.(value);
  if (!parsed) return value;
  return parsed.toLocaleDateString("pt-BR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

type SourceStats = {
  label: string;
  href: string;
  cases: string;
  deaths: string;
  recovered: string;
  updated: string;
};

const RelatedLinksList = () => {
  const [rows, setRows] = useState<SourceStats[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const [{ csv }] = await Promise.all([import("d3")]);

      const [jhuBr, brio] = await Promise.all([
        csv("/current_BR.csv").catch(() => [] as DSVRowString<string>[]),
        csv("/caso_shrink.csv").catch(() => [] as DSVRowString<string>[]),
      ]);

      if (!isMounted) return;

      const table: SourceStats[] = [];

      const jhuRow = jhuBr.at(0);
      if (jhuRow) {
        table.push({
          label: "Johns Hopkins",
          href: "https://coronavirus.jhu.edu/map.html",
          cases: Number(jhuRow.TotalConfirmed ?? 0).toLocaleString("pt-BR"),
          deaths: Number(jhuRow.TotalDeaths ?? 0).toLocaleString("pt-BR"),
          recovered: Number(jhuRow.TotalRecovered ?? 0).toLocaleString("pt-BR"),
          updated: formatDate((jhuRow.Date ?? "").slice(0, 10)),
        });
      }

      if (brio.length > 0) {
        const totals = brio.reduce(
          (acc, row) => {
            acc.cases += Number(row.confirmed ?? 0);
            acc.deaths += Number(row.deaths ?? 0);
            return acc;
          },
          { cases: 0, deaths: 0 }
        );

        table.push({
          label: "Brasil.IO",
          href: "https://brasil.io/dataset/covid19/",
          cases: totals.cases.toLocaleString("pt-BR"),
          deaths: totals.deaths.toLocaleString("pt-BR"),
          recovered: "---",
          updated: formatDate(brio[0].date),
        });
      }

      setRows(table);
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box overflowX="auto" py={4}>
      <Table
        w="full"
        maxW="720px"
        mx="auto"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        borderCollapse="collapse"
        bg="white"
        fontSize="sm"
      >
        <Caption textAlign="center" fontSize="xs" color="gray.600" p={2}>
          Séries históricas preservadas para consulta; valores refletem um momento intermediário da pandemia.
        </Caption>
        <Thead bg="gray.50">
          <Tr>
            <Th p={3} borderWidth="1px" borderColor="gray.200" textAlign="left">
              Fonte
            </Th>
            <Th p={3} borderWidth="1px" borderColor="gray.200" textAlign="right">
              Casos
            </Th>
            <Th p={3} borderWidth="1px" borderColor="gray.200" textAlign="right">
              Óbitos
            </Th>
            <Th p={3} borderWidth="1px" borderColor="gray.200" textAlign="right">
              Recuperados
            </Th>
            <Th p={3} borderWidth="1px" borderColor="gray.200" textAlign="left">
              Atualização
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, index) => (
            <Tr key={row.label} bg={index % 2 === 0 ? "white" : "gray.25"}>
              <Td p={3} borderWidth="1px" borderColor="gray.100" minW="160px">
                <a href={row.href} target="_blank" rel="noopener noreferrer">
                  {row.label}
                </a>
              </Td>
              <Td p={3} borderWidth="1px" borderColor="gray.100" textAlign="right">
                {row.cases}
              </Td>
              <Td p={3} borderWidth="1px" borderColor="gray.100" textAlign="right">
                {row.deaths}
              </Td>
              <Td p={3} borderWidth="1px" borderColor="gray.100" textAlign="right">
                {row.recovered}
              </Td>
              <Td p={3} borderWidth="1px" borderColor="gray.100">
                {row.updated}
              </Td>
            </Tr>
          ))}
          {rows.length === 0 && (
            <Tr>
              <Td p={3} borderWidth="1px" borderColor="gray.100" textAlign="center" colSpan={5}>
                Dados não disponíveis.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {rows.length === 0 && (
        <Text fontSize="xs" color="gray.500" textAlign="center" mt={2}>
          Arquivo CSV ausente ou inválido.
        </Text>
      )}
    </Box>
  );
};

export default RelatedLinksList;
