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

const formatNumber = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });

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
    if (data.length === 0) return null;

    const brazilTotals = data.reduce(
      (acc, row) => {
        acc.confirmed += row.confirmed;
        acc.deaths += row.deaths;
        return acc;
      },
      { confirmed: 0, deaths: 0 },
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
    return <div className="min-h-[196px] w-full flex-1 rounded-lg border p-6" />;
  }

  const parsed = parseDate?.(stats.lastDate);
  const formattedDate = parsed ? parsed.toLocaleDateString("pt-BR") : stats.lastDate;
  const cards = [
    {
      label: "Casos no Brasil",
      value: formatNumber(stats.brazilConfirmed),
      color: "text-orange-400",
    },
    { label: "Óbitos no Brasil", value: formatNumber(stats.brazilDeaths), color: "text-pink-600" },
    {
      label: "Casos no Paraná",
      value: formatNumber(stats.paranaConfirmed),
      color: "text-orange-400",
    },
    { label: "Óbitos no Paraná", value: formatNumber(stats.paranaDeaths), color: "text-pink-600" },
  ];

  return (
    <aside className="w-full flex-1 rounded-lg border bg-white p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.label} className="rounded-md border bg-gray-50 p-4">
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs">
        <a
          href="https://brasil.io/dataset/covid19/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          última atualização: {formattedDate} (fonte Brasil.IO)
        </a>
      </p>
    </aside>
  );
};

export default OverallInfo;
