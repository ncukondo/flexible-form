import { Fragment, ReactNode } from "react";
import { CloseIcon } from "./icons";
import { showModal } from "./modal";

type Props = {
  content: string | ReactNode;
  title?: string;
  choises?: string[];
  primary?: string;
};

const Title = ({ title, cancel }: { title: string; cancel: () => void }) => {
  return (
    <div className="flex">
      <div className="flex-1 text-lg font-medium leading-6 text-base-content">{title}</div>
      <button onClick={cancel} className="cursor-pointer">
        <CloseIcon className="flex-none" />
      </button>
    </div>
  );
};

const ConfirmDialog = ({
  title = "",
  content,
  onClose,
  choises = [],
  primary = "",
}: Props & { onClose: (res: string) => void }) => {
  return (
    <div className="modal-box">
      <Title title={title} cancel={() => onClose("")} />
      <div className="mt-2">{content}</div>

      <div className="mt-4 flex justify-end gap-1">
        {choises.map(key => {
          return key === primary ? (
            <button
              type="button"
              key={key}
              autoFocus={true}
              className="btn-primary btn"
              onClick={() => onClose(key)}
            >
              {key}
            </button>
          ) : (
            <button type="button" key={key} className="btn-ghost btn" onClick={() => onClose(key)}>
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const showConfirmDialog = async (props: Props) => {
  const response = await showModal<string>(ok => {
    return <ConfirmDialog {...props} onClose={ok} />;
  });
  return response.hasResponse ? response.response : "";
};

export { ConfirmDialog, showConfirmDialog };
export type { Props as ConfirmDialogProps };
