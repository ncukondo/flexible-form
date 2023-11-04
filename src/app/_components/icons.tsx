export { MdClose as CloseIcon } from "react-icons/md";
export { MdOutlineCheck as CheckIcon } from "react-icons/md";
export { BsClipboard as CopyIcon } from "react-icons/bs";

type SpinnerSize = "small" | "medium" | "large";
type SpinnerProps = {
  size?: SpinnerSize;
};
const SpinnerIcon = ({ size = "medium" }: SpinnerProps) => {
  const sizeMap = {
    small: "loading-xs",
    medium: "loading-sm",
    large: "loading-lg",
  }[size];
  return <span className={`loading loading-spinner ${sizeMap}`}></span>;
};

export { SpinnerIcon };
