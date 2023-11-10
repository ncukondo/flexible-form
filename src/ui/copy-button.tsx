import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

const copyToClip = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const wait = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const CopyButton = ({ content, className }: { content: string; className?: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const onClick = async () => {
    await copyToClip(content);
    setShowTooltip(true);
    await wait(1000);
    setShowTooltip(false);
  };
  return (
    <span className={showTooltip ? "tooltip tooltip-open tooltip-info" : ""} data-tip="Copied!">
      {showTooltip ? (
        <CheckIcon />
      ) : (
        <button title="Copy to Clipboard" {...{ onClick, className }}>
          <CopyIcon />
        </button>
      )}
    </span>
  );
};

export { CopyButton };
