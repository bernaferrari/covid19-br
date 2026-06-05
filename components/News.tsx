import { FiExternalLink } from "react-icons/fi";
import { Separator } from "@/components/ui/separator";

const links = [
  {
    href: "https://www.medrxiv.org/content/10.1101/2020.06.05.20123604v1",
    label: "Scrutinizing the heterogeneous spreading of COVID-19 outbreak in Brazilian territory",
  },
  {
    href: "https://ricmais.com.br/videos/parana-no-ar/diagnostico-do-coronavirus-exame-de-raio-x-identifica-doenca/",
    label: "Diagnóstico do Corona Vírus por Raio-X - professores UFPR e UFOP",
  },
  {
    href: "https://www.youtube.com/watch?v=4HHOuDnW2DQ&feature=emb_logo&fbclid=IwAR3vxB3jC2TkUP9hWTp-9fEqgQ6xlOFKLSRTll5fj6NOjZqtpUzTrAX9tw8",
    label: "Painel da SBF: Físicos e a Pandemia",
  },
  {
    href: "https://www.insper.edu.br/noticias/covid-19-portal-marco-antonio/",
    label: "Professor do Insper colabora com a UFPR em portal sobre a Covid-19",
  },
];

const News = () => (
  <section className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md">
    <h2 className="text-center text-sm font-semibold">Novidades</h2>
    <Separator className="my-2" />
    <p className="my-2 text-center text-xs text-gray-500">
      Registros históricos do projeto no início da pandemia (2020-2021). Links externos podem estar
      desativados.
    </p>
    <div className="mt-2 flex flex-col gap-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          • {link.label} <FiExternalLink className="mx-1 inline" />
        </a>
      ))}
    </div>
  </section>
);

export default News;
