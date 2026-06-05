import { timeParse } from "d3";
import type { DSVRowString } from "d3";
import { useEffect, useState } from "react";

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

const OtherSources = () => {
  const [rows, setRows] = useState<SourceStats[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { csv } = await import("d3");

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
          { cases: 0, deaths: 0 },
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
    <div className="overflow-x-auto py-4">
      <table className="mx-auto w-full max-w-[720px] border-collapse rounded-md border bg-white text-sm">
        <caption className="p-2 text-center text-xs text-gray-600">
          Séries históricas preservadas para consulta; valores refletem um momento intermediário da
          pandemia.
        </caption>
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-200 p-3 text-left">Fonte</th>
            <th className="border border-gray-200 p-3 text-right">Casos</th>
            <th className="border border-gray-200 p-3 text-right">Óbitos</th>
            <th className="border border-gray-200 p-3 text-right">Recuperados</th>
            <th className="border border-gray-200 p-3 text-left">Atualização</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              <td className="min-w-40 border border-gray-100 p-3">
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {row.label}
                </a>
              </td>
              <td className="border border-gray-100 p-3 text-right">{row.cases}</td>
              <td className="border border-gray-100 p-3 text-right">{row.deaths}</td>
              <td className="border border-gray-100 p-3 text-right">{row.recovered}</td>
              <td className="border border-gray-100 p-3">{row.updated}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="border border-gray-100 p-3 text-center" colSpan={5}>
                Dados não disponíveis.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="mt-2 text-center text-xs text-gray-500">Arquivo CSV ausente ou inválido.</p>
      )}
    </div>
  );
};

export default OtherSources;
