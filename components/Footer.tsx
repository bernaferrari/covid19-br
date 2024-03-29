/** @jsx jsx */
import { Box, Text } from "@chakra-ui/core";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

export const FooterContainer = (props) => (
  <Box
    left="0"
    right="0"
    borderTopWidth="1px"
    width="full"
    minH="4rem"
    {...props}
  />
);

const Footer = (props) => {
  return (
    <div>
      <FooterContainer bg="white" {...props}>
        <div style={{ height: 2 }} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexFlow: "row wrap",
            alignItems: "center",
            minHeight: "4rem",
          }}
        >
          <a href="https://www.c3sl.ufpr.br/">
            <img
              height="12"
              width="85"
              src="/header_footer/img_c3sl.png"
              alt="C3SL"
            />
          </a>
          <a href="http://www.exatas.ufpr.br/portal/en/">
            <img
              height="12"
              width="85"
              src="/header_footer/img_exatas.png"
              alt="Exatas UFPR"
            />
          </a>
          <a href="http://web.leg.ufpr.br/">
            <img
              height="12"
              width="85"
              src="/header_footer/img_leg.png"
              alt="Laboratório de Estatística e Geoinformação"
            />
          </a>
          <img
            height="12"
            width="85"
            style={{ padding: "12px" }}
            // padding of 24 so that 62+24 ~= 85 (all other images are 85)
            src="/header_footer/img_labdsi.png"
            alt="Laboratório de Design 
de Sistemas de Informação"
          />
        </div>
      </FooterContainer>
      <div style={{ marginTop: 4, textAlign: "center" }}>
        <Text fontSize="xs">
          Developed & Designed by{" "}
          <a href="https://github.com/bernaferrari">Bernardo Ferrari</a> &
          Rafael Ancara <br />
          Mantido por Fernanda Yukari Kawasaki (IC voluntária), Natália Yada e
          Tamy Beppler (com financiamento da bolsa CAPES para combate ao
          COVID-19) <br />
          Administrado por André Grégio
        </Text>
      </div>
      <img
        width="64px"
        height="16px"
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "8px",
        }}
        src="https://hitcounter.pythonanywhere.com/count/tag.svg?url=http%3A%2F%2Fcovid.c3sl.ufpr.br%2F"
        alt="Hits"
      />
    </div>
  );
};

export default Footer;
