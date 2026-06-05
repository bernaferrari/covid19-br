import type { NextPage } from "next";
import ArchiveBanner from "../components/ArchiveBanner";
import Footer from "../components/Footer";
import GetCovidDataComp from "../components/GetCovidDataComp";
import Header from "../components/Header";
import News from "../components/News";
import OverallInfo from "../components/OverallInfo";
import { Separator } from "@/components/ui/separator";
import BrazilInteractive from "../components/d3/DailyMapSpikesBrazil";
import ParanaFilledInteractive from "../components/d3/DailyMapFilledParana";
import StatesLines from "../components/d3/DailyLinesBrazil";
import TopGrowing from "../components/d3/TopGrowing";

const IndexPage: NextPage = () => (
  <div className="pb-16">
    <Header />

    <main>
      <section className="mx-auto max-w-3xl px-4 pt-24 pb-16 md:pt-40">
        <ArchiveBanner />

        <div className="flex flex-col items-start gap-8 md:flex-row md:gap-12">
          <div className="flex-1 md:p-6">
            <h1 className="text-3xl font-semibold">
              Portal COVID-19 no <span className="text-primary">Paraná</span>
            </h1>

            <p className="mt-4 text-sm leading-7">
              Este portal tem por objetivo agregar informações atualizadas, modelos estatísticos,
              visualizações de dados e links úteis sobre a pandemia COVID-19 no Brasil,
              especialmente no Estado do Paraná.
            </p>

            <p className="mt-3 text-sm leading-7">
              O conteúdo disponibilizado é um esforço conjunto de pesquisadores dos Departamentos de
              Estatística, Informática, Física, Matemática, Design e Saúde da Universidade Federal
              do Paraná e pesquisador do Insper-SP, com o apoio da Direção do Setor de Ciências
              Exatas da UFPR.
            </p>
          </div>

          <OverallInfo />
        </div>

        <div className="mt-10">
          <News />
        </div>
      </section>

      <GetCovidDataComp>
        <section className="bg-gray-50 py-8">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-sm font-semibold">Evolução dos casos</h2>

            <div className="mt-6 text-center">
              <div id="externalDiv">
                <TopGrowing />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <ParanaFilledInteractive />
        </section>

        <Separator className="my-4" />

        <section className="mx-auto max-w-3xl px-4 py-10">
          <BrazilInteractive />
        </section>

        <Separator className="my-4" />
      </GetCovidDataComp>

      <section className="mx-auto max-w-3xl px-4 py-10">
        <StatesLines />
      </section>
    </main>

    <Footer />
  </div>
);

export default IndexPage;
