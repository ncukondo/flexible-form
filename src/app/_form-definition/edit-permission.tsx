import { SpinnerIcon } from "@/app/_ui/icons";
import { showModal } from "@/app/_ui/modal";
import { FormAccessRole } from "@prisma/client";
import { useState } from "react";
import { toast } from "@/app/_ui/toast";
import { getFormUsers, updateFormDefinitionEditors } from "./server";

type EditPermissionDialogProps = {
  userEmails: string[];
  id_for_edit: string;
  onClose: () => void;
};

const isValidEmails = (emails: string) => {
  const re = /\S+@\S+\.\S+/;
  return emails
    .split("\n")
    .map(email => email.trim())
    .filter(email => email !== "")
    .every(email => re.test(email));
};

const EditPermissionDialog = ({ userEmails, id_for_edit, onClose }: EditPermissionDialogProps) => {
  const [editors, setEditors] = useState(userEmails.join("\n"));
  const [isPending, setIsPending] = useState(false);
  const isValid = isValidEmails(editors);
  const onSave = async () => {
    const emails = editors.split("\n").filter(email => email !== "");
    setIsPending(true);
    try {
      await updateFormDefinitionEditors(id_for_edit, emails);
      toast("Editors were Saved");
    } finally {
      setIsPending(false);
    }
    onClose();
  };
  return (
    <div className="p-4 bg-base-100 rounded-2xl grid grid-cols-1 gap-8">
      <h2 className="text-lg font-bold">Share Config</h2>
      <div className="text-sm text-base-content">
        You can share this form with other users by adding their email addresses below. They will be
        able to edit this form. Split multiple email addresses with a new line.
      </div>
      {isValid ? null : <div className="text-sm text-error">Invalid email address</div>}
      <textarea
        className="textarea textarea-bordered min-h-[10rem] min-w-[20rem]"
        value={editors}
        onChange={e => {
          setEditors(e.target.value);
        }}
      />
      <div className="flex flex-row justify-end gap-4">
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        {isPending ? (
          <span className="flex flex-row items-center gap-4">
            <SpinnerIcon size="small" />
            Saving...
          </span>
        ) : (
          <button className="btn btn-primary" disabled={!isValid} onClick={onSave}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

const showPermissionEditDialog = async (id_for_edit: string) => {
  const users = await getFormUsers(id_for_edit);
  const userEmails = users
    .filter(user => user.role === FormAccessRole.EDITOR)
    .map(user => user.email);
  return await showModal<void>(ok => {
    return <EditPermissionDialog userEmails={userEmails} id_for_edit={id_for_edit} onClose={ok} />;
  });
};

const EditPermissionButton = ({ id_for_edit }: { id_for_edit: string }) => {
  const [isPending, setIsPending] = useState(false);
  return isPending ? (
    <span className="flex flex-row items-center gap-4">
      <SpinnerIcon size="small" />
      Loading...
    </span>
  ) : (
    <button
      className="btn"
      onClick={async e => {
        e.preventDefault();
        setIsPending(true);
        try {
          await showPermissionEditDialog(id_for_edit);
        } finally {
          setIsPending(false);
        }
        setIsPending(false);
      }}
    >
      Share
    </button>
  );
};

export { EditPermissionButton };
