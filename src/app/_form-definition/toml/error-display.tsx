import { useFormDefinition } from "../store";
import { useTomlDerivedJson } from "./store";

export function useErrorMessage() {
  const { error: syntaxError } = useTomlDerivedJson(s => ({ error: s.error }));
  const schemaError = useFormDefinition(s => s.error);
  return (
    (syntaxError ? "SyntaxError: " + syntaxError : "") ||
    (schemaError ? "SchemaError: " + schemaError : "")
  );
}

export function ErrorDisplay() {
  const error = useErrorMessage();
  return (
    <>
      {error && (
        <div className="alert alert-error shadow-lg m-2 w-[calc(100%-0.5rem)] max-h-32 overflow-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </>
  );
}
