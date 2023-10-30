import { SpinnerIcon } from "@components/icons";

export default function Loading() {
  return (
    <div className="w-full h-full grid items-center justify-center min-h-[100dvh]">
      <div className="flex flex-row gap-5">
        <SpinnerIcon />
        Loading...
      </div>
    </div>
  );
}
