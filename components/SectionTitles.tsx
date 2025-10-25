import { Heading } from "@chakra-ui/react";
import type { ComponentProps } from "react";

type HeadingProps = ComponentProps<typeof Heading>;

export const SectionTitle = (props: HeadingProps) => (
  <Heading fontSize="md" textAlign="center" mx={1} {...props} />
);

// [SectionTitleAbout] doesn't have subtitle, so the title can be larger.
export const SectionTitleAbout = (props: HeadingProps) => (
  <Heading fontSize="lg" textAlign="center" mx={1} {...props} />
);

export const SectionSubtitle = (props: HeadingProps) => (
  <Heading
    fontSize="sm"
    fontWeight="500"
    color="gray.500"
    textAlign="center"
    mx={1}
    {...props}
  />
);

