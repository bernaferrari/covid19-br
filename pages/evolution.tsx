import type { NextPage } from "next";
import Image from "next/image";
import ArchiveBanner from "../components/ArchiveBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import OtherSources from "../components/OtherSources";
import RelatedLinksList from "../components/RelatedLinksList";
import { SectionTitleAbout } from "../components/SectionTitles";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AccessOtherSiteProps = {
  title: string;
  subtitle: string;
  access: string;
  src: string;
  url: string;
};

const AccessOtherSite = ({ title, subtitle, access, src, url }: AccessOtherSiteProps) => (
  <div className="w-full p-2 md:w-1/2">
    <div className="inline-flex w-full rounded-lg border bg-white p-2 transition hover:border-primary/60 hover:shadow-md">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full">
        <div className="flex items-center">
          <div className="shrink-0">
            <Image
              className="size-24 rounded-lg object-cover"
              src={src}
              alt={`Preview ${title}`}
              width={96}
              height={96}
            />
          </div>
          <div className="ml-4 flex-auto">
            <p className="text-lg font-semibold leading-tight">{title}</p>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <Button className="mt-3 w-full" variant="outline">
          {access}
        </Button>
      </a>
    </div>
  </div>
);

const EvolutionPage: NextPage = () => (
  <div className="pb-16">
    <Header />
    <main>
      <div className="pt-24 md:pt-40">
        <ArchiveBanner />
      </div>

      <section className="bg-gray-50 py-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-stretch justify-center px-2">
          <AccessOtherSite
            title="Monitoramento do R(t)"
            subtitle="Monitoramento estatístico no Brasil e Paraná."
            access="Acessar site"
            src="/wagner_preview.jpg"
            url="http://leg.ufpr.br/~wagner/covid/"
          />
          <AccessOtherSite
            title="Monitoramento geral"
            subtitle="Monitoramento geral no Brasil e Paraná"
            access="Acessar site"
            src="/monitoramento_preview.jpg"
            url="https://lineu96.github.io/covid19/"
          />
          <AccessOtherSite
            title="Monitoramento do R(t)/Bayes"
            subtitle="R(t) estimado por suavização Bayesiana."
            access="Acessar site"
            src="/elias_preview.jpg"
            url="http://www.leg.ufpr.br/~elias/rtmaps/RtPR.html"
          />
          <AccessOtherSite
            title="Visualização temporal"
            subtitle="Visualização temporal de dados de COVID-19."
            access="Acessar site"
            src="/elias_preview.jpg"
            url="http://shiny.leg.ufpr.br/elias/covid19time/"
          />
        </div>

        <Separator className="my-8 bg-gray-300" />

        <section className="mx-auto max-w-3xl px-4">
          <SectionTitleAbout>Outras Fontes</SectionTitleAbout>
          <OtherSources />
        </section>

        <Separator className="my-8 bg-gray-300" />

        <section className="mx-auto max-w-3xl px-4">
          <SectionTitleAbout>Documentos e Links</SectionTitleAbout>
          <div className="h-4" />
          <RelatedLinksList />
        </section>
      </section>
    </main>

    <div className="h-4" />

    <Footer />
  </div>
);

export default EvolutionPage;
