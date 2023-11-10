/* eslint-disable tailwindcss/no-custom-classname */
import toast, { Toaster } from "react-hot-toast";

type ToastProps = {
  message: string;
  duration?: number;
};

const ToastProvider = () => {
  return (
    <>
      <style>
        {`
        @keyframes slide-x-out {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(-100%);
          }
        }`}
      </style>
      <Toaster />
    </>
  );
};

const customToast = (prop: string | ToastProps) => {
  const message = typeof prop === "string" ? prop : prop.message;
  const duration = typeof prop === "string" ? 3000 : prop.duration ?? 3000;
  let id = "";
  setTimeout(() => {
    toast.dismiss(id);
  }, duration);
  toast.custom(
    t => {
      id = t.id;
      return (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } pointer-events-auto flex w-full max-w-md flex-col z-50
      overflow-hidden rounded-full bg-base-100 shadow-lg ring-1 ring-base-content/5`}
        >
          <div className="flex w-full">
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm text-base-content/80">{message}</p>
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="p-4 text-sm font-medium text-info
          hover:underline focus:underline"
              >
                Close
              </button>
            </div>
          </div>
          <div className={`h-2 w-full rounded bg-base-100`}>
            <div
              style={
                t.visible
                  ? {
                      animation: `${`slide-x-out ${duration}ms`}   forwards`,
                    }
                  : { visibility: "hidden" }
              }
              className={`h-4 w-full bg-base-content/20`}
            ></div>
          </div>
        </div>
      );
    },
    { duration },
  );
};

export { customToast as toast, ToastProvider };
export type { ToastProps };
