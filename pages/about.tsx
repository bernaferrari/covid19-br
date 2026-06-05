import type { ComponentProps } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import ArchiveBanner from "../components/ArchiveBanner";
import Footer from "../components/Footer";
import GetCovidDataComp from "../components/GetCovidDataComp";
import Header from "../components/Header";
import { SectionSubtitle, SectionTitle, SectionTitleAbout } from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";
import ContourBrazil from "../components/d3/ContourBrazil";
import ContourParana from "../components/d3/ContourParana";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const TextImageContainer = ({ className, ...props }: ComponentProps<"section">) => (
  <section className={cn("mx-auto max-w-3xl px-4 py-4", className)} {...props} />
);

const Contribution = ({ className, ...props }: ComponentProps<"p">) => (
  <p className={cn("mx-1 text-center text-xs", className)} {...props} />
);

const CenteredImage = ({ alt, className, ...props }: ComponentProps<typeof Image>) => (
  <Image
    className={cn("mx-auto h-auto max-w-full", className)}
    alt={alt ?? ""}
    width={720}
    height={480}
    unoptimized
    {...props}
  />
);

const AdaptiveBox = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("w-full py-4 md:w-1/2", className)} {...props} />
);

const AboutPage: NextPage = () => (
  <div className="pb-16">
    <Header />
    <main>
      <div className="pt-24 md:pt-40">
        <ArchiveBanner />
      </div>

      <section className="mx-auto mt-4 max-w-xl px-4">
        <SectionTitleAbout>Fale conosco</SectionTitleAbout>
        <div className="h-4" />
        <p className="mx-2 text-center">
          Se há algo que possamos ajudar, veja o contato dos pesquisadores nos sites dos
          laboratórios{" "}
          <a href="https://www.c3sl.ufpr.br" className="font-bold text-primary hover:underline">
            C3SL
          </a>{" "}
          e{" "}
          <a href="http://web.leg.ufpr.br/" className="font-bold text-primary hover:underline">
            LEG
          </a>
          .
        </p>
      </section>

      <Separator className="my-6" />

      <TextImageContainer>
        <StyledFlex>
          <AdaptiveBox>
            <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
            <SectionSubtitle>Municípios</SectionSubtitle>
            <div className="h-4" />
            <CenteredImage src="/figs/brasil-maiscasos.png" alt="Casos por município" />
          </AdaptiveBox>

          <AdaptiveBox>
            <SectionTitle>Taxa de casos por 100 mil habitantes.</SectionTitle>
            <SectionSubtitle>Municípios</SectionSubtitle>
            <div className="h-4" />
            <CenteredImage
              src="/figs/brasil-maiscasos-taxas.png"
              alt="Taxa de casos por 100 mil habitantes"
            />
          </AdaptiveBox>
        </StyledFlex>
      </TextImageContainer>

      <Separator className="my-6" />

      <TextImageContainer>
        <SectionTitle>Evolução da taxa de óbitos por casos.</SectionTitle>
        <SectionSubtitle>Regiões do Brasil</SectionSubtitle>
        <div className="h-4" />
        <CenteredImage src="/figs/letalidade-regioes.png" alt="Taxa de óbitos por casos" />
      </TextImageContainer>

      <Separator className="my-6" />

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos.</SectionTitle>
        <SectionSubtitle>Estados e regiões do Brasil</SectionSubtitle>
        <div className="h-4" />
        <CenteredImage
          src="/figs/data-casos-obitos-estado-regiao.png"
          alt="Evolução do número de casos"
        />
      </TextImageContainer>

      <section className="bg-black py-8">
        <TextImageContainer>
          <StyledFlex>
            <AdaptiveBox>
              <SectionTitle className="text-white">Previsão do número casos.</SectionTitle>
              <SectionSubtitle className="text-white">Brasil (acumulado e diário)</SectionSubtitle>
              <div className="h-4" />
              <CenteredImage src="/figs/Projec_casos_140420.JPG" alt="Previsão de casos" />
            </AdaptiveBox>

            <AdaptiveBox>
              <SectionTitle className="text-white">Previsão do número de óbitos.</SectionTitle>
              <SectionSubtitle className="text-white">Brasil (acumulado e diário)</SectionSubtitle>
              <div className="h-4" />
              <CenteredImage src="/figs/Projec_mortes_140420.JPG" alt="Previsão de óbitos" />
            </AdaptiveBox>
          </StyledFlex>
          <Contribution className="mt-2 text-white">
            Contribuição: Prof. Marco Antonio Leonel Caetano (Insper-SP)
          </Contribution>
        </TextImageContainer>
      </section>

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
        <SectionSubtitle>Brasil e outros países</SectionSubtitle>
        <div className="h-4" />
        <CenteredImage
          src="/figs/world-country-data.png"
          alt="Casos e óbitos Brasil e outros países"
        />
      </TextImageContainer>

      <Separator className="my-6" />

      <TextImageContainer>
        <SectionTitle>Taxa de óbitos vs número de testes por casos.</SectionTitle>
        <SectionSubtitle>Países com 50 óbitos ou mais</SectionSubtitle>
        <div className="h-4" />
        <CenteredImage
          src="/figs/dispersion-death-tests.png"
          alt="Taxa de óbitos vs número de testes"
        />
      </TextImageContainer>

      <Separator className="my-6" />

      <GetCovidDataComp>
        <section className="mx-auto max-w-3xl px-4 py-4">
          <SectionTitleAbout>Casos no Brasil</SectionTitleAbout>
          <div className="h-4" />
          <ContourBrazil />
        </section>

        <Separator className="my-6" />

        <section className="mx-auto max-w-3xl px-4 py-4">
          <SectionTitleAbout>Casos no Paraná</SectionTitleAbout>
          <div className="h-4" />
          <ContourParana />
        </section>
      </GetCovidDataComp>
    </main>

    <Footer />
  </div>
);

export default AboutPage;
