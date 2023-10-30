export { MdClose as CloseIcon } from "react-icons/md";
export { MdContentCopy as CopyIcon } from "react-icons/md";

type SpinnerSize = "small" | "medium" | "large";
type SpinnerProps = {
  size?: SpinnerSize;
};
const SpinnerIcon = ({ size = "medium" }: SpinnerProps) => {
  const sizeMap = {
    small: "loading-xs",
    medium: "loading-sm",
    large: "loading-lg",
  };
  return <span className={`loading loading-spinner ${sizeMap}`}></span>;
};

export { SpinnerIcon };
