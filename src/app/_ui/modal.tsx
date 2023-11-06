"use client";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import React, { useRef } from "react";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: (event: React.SyntheticEvent<HTMLDialogElement, Event>) => void;
  onCancel?: (event: React.SyntheticEvent<HTMLDialogElement, Event>) => void;
};

const Modal = ({ children, isOpen, onClose, onCancel }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  if (isOpen && !ref.current?.open) ref.current?.showModal();
  if (!isOpen && ref.current?.open) ref.current?.close();
  return (
    <dialog
      ref={ref}
      className="modal [&::backdrop]:backdrop-blur-sm"
      onClose={onClose}
      onCancel={onCancel}
      onClick={() => ref.current?.close()}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </dialog>
  );
};

type ModalResponse<T> = { hasResponse: false } | { hasResponse: true; response: T };
type EventProps = {
  onClose: () => void;
  onCancel: () => void;
};
type ModalContentMaker<T> = (
  closeWithResponse: (response: T) => void,
  colseWithoutResponse: () => void,
) => React.ReactNode;

type IsOpenStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
};
const isOpenStore = createStore<IsOpenStore>()((set, get) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));
type ResponseSotre<T> = {
  response: ModalResponse<T>;
  setResponse: (response: ModalResponse<T>) => void;
};
const responseStore = createStore<ResponseSotre<unknown>>(set => ({
  response: { hasResponse: false },
  setResponse: (response: ModalResponse<unknown>) => set({ response }),
}));
type ContentStore = {
  content: React.ReactNode | undefined;
  setContent: (content: React.ReactNode | undefined) => void;
};
const contentStore = createStore<ContentStore>(set => ({
  content: undefined,
  setContent: (content: React.ReactNode | undefined) => set({ content }),
}));
type PropsStore = {
  props: EventProps;
  setProps: (props: EventProps) => void;
};
const propsStore = createStore<PropsStore>(set => ({
  props: { onClose: () => null, onCancel: () => null },
  setProps: (props: EventProps) => set({ props }),
}));

const ModalDialog = () => {
  const isOpen = useStore(isOpenStore, s => s.isOpen);
  const content = useStore(contentStore, s => s.content);
  const props = useStore(propsStore, s => s.props);
  return (
    <Modal isOpen={isOpen} {...props}>
      {content}
    </Modal>
  );
};

const ModalProvider = () => {
  return <ModalDialog />;
};

function showModal<T>(contentMaker: ModalContentMaker<T>): Promise<ModalResponse<T>> {
  const closeWithResponse = (response: T) => {
    responseStore.getState().setResponse({ hasResponse: true, response });
    isOpenStore.getState().setIsOpen(false);
  };
  const closeWithoutResponse = () => {
    isOpenStore.getState().setIsOpen(false);
  };
  const content = contentMaker(closeWithResponse, closeWithoutResponse);
  contentStore.getState().setContent(content);

  return new Promise<ModalResponse<T>>(resolve => {
    const onClose = () => {
      isOpenStore.getState().setIsOpen(false);
      propsStore.getState().setProps({ onClose: () => null, onCancel: () => null });
      contentStore.getState().setContent(undefined);
      resolve(responseStore.getState().response as ModalResponse<T>);
    };
    responseStore.getState().setResponse({ hasResponse: false });
    isOpenStore.getState().setIsOpen(true);
    propsStore.getState().setProps({ onClose, onCancel: onClose });
  });
}

export type { ModalProps, ModalResponse, ModalContentMaker as ModalContentFunction };
export { Modal, showModal, ModalProvider };
