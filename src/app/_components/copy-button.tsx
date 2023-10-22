import { toast } from "@components/toast";
import { CopyIcon } from "./icons";

const copyToClip = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const CopyButton = ({ content, className }: { content: string; className?: string }) => {
  const onClick = async () => {
    await copyToClip(content);
    toast("Copied to clipboard");
  };
  return (
    <button title="Copy to Clipboard" {...{ onClick, className }}>
      <CopyIcon />
    </button>
  );
};

export { CopyButton };
