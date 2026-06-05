import Image from "next/image";

const partners = [
  {
    href: "https://www.c3sl.ufpr.br/",
    src: "/header_footer/img_c3sl.png",
    alt: "C3SL",
    width: 347,
    height: 196,
  },
  {
    href: "http://www.exatas.ufpr.br/portal/en/",
    src: "/header_footer/img_exatas.png",
    alt: "Setor de Ciências Exatas UFPR",
    width: 333,
    height: 188,
  },
  {
    href: "http://web.leg.ufpr.br/",
    src: "/header_footer/img_leg.png",
    alt: "Laboratório de Estatística e Geoinformação",
    width: 333,
    height: 188,
  },
  {
    href: undefined,
    src: "/header_footer/img_labdsi.png",
    alt: "Laboratório de Design de Sistemas de Informação",
    width: 110,
    height: 85,
  },
];

const Footer = () => (
  <footer className="border-t bg-white py-6">
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
        {partners.map(({ href, src, alt, width, height }) => {
          const logo = (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              priority
              style={{ width: 120, height: "auto" }}
            />
          );

          return href ? (
            <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
              {logo}
            </a>
          ) : (
            <div key={alt}>{logo}</div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs leading-6 text-gray-600">
          Developed &amp; designed by{" "}
          <a
            href="https://github.com/bernaferrari"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Bernardo Ferrari
          </a>{" "}
          &amp; Rafael Ancara.
          <br />
          Mantido por Fernanda Yukari Kawasaki (IC voluntária), Natália Yada e Tamy Beppler (com
          financiamento da bolsa CAPES para combate ao COVID-19).
          <br />
          Administrado por André Grégio.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
