import Link from "next/link";
import { type ReactNode } from "react";
import { mapText, type MapDict } from "./map-text";

const urlRegex = /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g;

const replaceMap = {
  $default: (text, i) => <span key={i}>{text}</span>,
  [urlRegex.source]: (url, i) => (
    <Link className="link" href={url} target="_blank" key={i}>
      {url}
    </Link>
  ),
  [/\n/.source]: (_, i) => <br key={i} />,
} as const satisfies MapDict<ReactNode>;

const styledText = (text: string) => mapText(text, replaceMap);

export { styledText };
