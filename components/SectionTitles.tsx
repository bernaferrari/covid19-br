import { Heading } from "@chakra-ui/core";

export const SectionTitle = (props) => (
  <Heading fontSize="md" textAlign="center" mx="4px" {...props} />
);

// [SectionTitleAbout] doesn't have subtitle, so the title can be larger.
export const SectionTitleAbout = (props) => (
  <Heading fontSize="lg" textAlign="center" mx="4px" {...props} />
);

export const SectionSubtitle = (props) => (
  <Heading
    fontSize="sm"
    fontWeight="500"
    color="#858585"
    textAlign="center"
    mx="4px"
    {...props}
  />
);
