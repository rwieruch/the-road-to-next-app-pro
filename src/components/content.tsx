import Linkify from "linkify-react";
import { IntermediateRepresentation } from "linkifyjs";
import Link from "next/link";
import { getBaseUrl } from "@/utils/url";

const renderLink = ({ attributes, content }: IntermediateRepresentation) => {
  const { href, ...props } = attributes;

  const isInternal = href.includes(getBaseUrl());
  const url = isInternal ? href.replace(getBaseUrl(), "") : href;

  const handleClick = (event: React.SyntheticEvent) => {
    if (isInternal) return;
    if (!confirm("Are you sure you want to leave this page?")) {
      event.preventDefault();
    }
  };

  let maybeParsedContent = content;
  if (url.startsWith("/tickets/")) {
    maybeParsedContent = url.replace("/tickets/", "Ticket: #");
  }

  // add other feature paths if needed

  return (
    <Link href={url} {...props} onClick={handleClick} className="underline">
      {maybeParsedContent}
    </Link>
  );
};

type ContentProps = {
  children: string;
};

const Content = ({ children }: ContentProps) => {
  return (
    <Linkify
      as="p"
      className="whitespace-pre-line"
      options={{ render: renderLink }}
    >
      {children}
    </Linkify>
  );
};

export { Content };
