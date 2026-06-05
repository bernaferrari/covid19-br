import type { IconType } from "react-icons";
import { FaFileAlt, FaInfoCircle, FaNewspaper } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

type DocumentKind = "article" | "info" | "document";

type RelatedDocument = {
  title: string;
  kind: DocumentKind;
  author: string;
  url: string;
};

const documents: RelatedDocument[] = [
  {
    title: "Atualização da Situação do Estado do Paraná",
    kind: "article",
    author: "Silva, R., Beims, M., 22/06/2020",
    url: "/docs/arquivo-parana.pdf",
  },
  {
    title: "Cuidados com análises de dados da Covid19",
    kind: "info",
    author: "Bastos, L. (FIOCRUZ), 05/05/2020",
    url: "http://www.statpop.com.br/2020/05/cuidados-com-analises-de-dados-da.html",
  },
  {
    title: "Combate ao COVID-19 em cidades menores, o dia D é hoje!",
    kind: "article",
    author: "Brugnago, E., Beims, M., 30/04/2020",
    url: "/docs/CoronaGeral.pdf",
  },
  {
    title:
      "Strong correlations between power-law growth of COVID-19 in four continents and the inefficiency of soft quarantine strategies",
    kind: "article",
    author: "Manchein, C. et al., CHAOS 30, 041102 (2020)",
    url: "https://aip.scitation.org/doi/pdf/10.1063/5.0009454?download=true&",
  },
  {
    title: "Mapa interativo",
    kind: "info",
    author: "Dante Aléo/Prof. André Grégio (DInf@UFPR)",
    url: "https://pinsis.c3sl.ufpr.br/corona-parana",
  },
  {
    title: "A quem servem os dados?",
    kind: "article",
    author: "Sunye, M.S., SBC Horizontes, 2020",
    url: "http://horizontes.sbc.org.br/index.php/2020/04/15/a-quem-servem-os-dados/",
  },
  {
    title: "FAKE NEWS sobre o COVID-19!",
    kind: "info",
    author: "",
    url: "https://docs.google.com/document/d/1N6uGC45kdg-hrAk1zsFCYtT89E-5oV5JwxI1eM798kQ/edit",
  },
  {
    title: "Identificação de modelos para COVID-19…",
    kind: "article",
    author: "Caetano, M. A. L. 2020",
    url: "http://covid.c3sl.ufpr.br/docs/covid19enxameparticulas.pdf",
  },
  {
    title: "Nota Técnica na SBMAC: Combate ao Coronavírus…",
    kind: "info",
    author: "Vasconcelos et al.",
    url: "https://www.sbmac.org.br/wp-content/uploads/2020/04/Covid-19-Nota-NEW.pdf",
  },
  {
    title: "Modelling fatality curves of COVID-19…",
    kind: "article",
    author: "Vasconcelos et al., 2020",
    url: "https://www.medrxiv.org/content/10.1101/2020.04.02.20051557v1",
  },
  {
    title: "Correlação entre crescimento/quarentena do COVID-19",
    kind: "article",
    author: "Manchein, Cesar, et al.",
    url: "http://covid.c3sl.ufpr.br/docs/corrcovid.pdf",
  },
  {
    title: "Modelagem e Previsões para o COVID19",
    kind: "document",
    author: "Marco Antonio Leonel Caetano",
    url: "http://covid.c3sl.ufpr.br/docs/rascunhocorona.pdf",
  },
  {
    title: "Scrutinizing the heterogeneous spreading of COVID-19 outbreak in Brazilian territory",
    kind: "article",
    author: "Silva,R.M., Mendes,C.F.O., Manchein,C.,2020",
    url: "https://www.medrxiv.org/content/10.1101/2020.06.05.20123604v1",
  },
];

const kindConfig: Record<
  DocumentKind,
  { label: string; icon: IconType; tone: "green" | "orange" | "gray" }
> = {
  article: { label: "Artigo", icon: FaNewspaper, tone: "green" },
  info: { label: "Informação", icon: FaInfoCircle, tone: "orange" },
  document: { label: "Documento", icon: FaFileAlt, tone: "gray" },
};

const toneClasses = {
  green: {
    icon: "bg-green-100 text-green-700",
    border: "hover:border-green-300",
    badge: "bg-green-100 text-green-800",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700",
    border: "hover:border-orange-300",
    badge: "bg-orange-100 text-orange-800",
  },
  gray: {
    icon: "bg-gray-100 text-gray-700",
    border: "hover:border-gray-300",
    badge: "bg-gray-100 text-gray-800",
  },
} satisfies Record<string, Record<string, string>>;

const RelatedLinksList = () => (
  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
    {documents.map((document) => {
      const { label, icon: Icon, tone } = kindConfig[document.kind];
      const isExternal = document.url.startsWith("http");
      const classes = toneClasses[tone];

      return (
        <article
          key={document.url}
          className={`h-full rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${classes.border}`}
        >
          <a
            href={document.url}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="flex h-full flex-col gap-4 p-4 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-full ${classes.icon}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <Badge className={`mb-1 uppercase tracking-wide ${classes.badge}`}>{label}</Badge>
                <h3 className="line-clamp-3 text-base font-semibold leading-tight">
                  {document.title}
                </h3>
              </div>
            </div>

            {document.author && (
              <p className="line-clamp-2 text-sm text-gray-600">{document.author}</p>
            )}
          </a>
        </article>
      );
    })}
  </div>
);

export default RelatedLinksList;
