import { formatZodIssue } from "./error-format";
import { useTomlDerivedJson, useTomlText } from "./store";
import { useFormDefinition } from "../store";

export function useHasError() {
  const syntaxError = useTomlDerivedJson(s => s.error);
  const schemaErrors = useFormDefinition(s => s.error);
  return !!syntaxError || schemaErrors.length > 0;
}

export function ErrorDisplay() {
  const syntaxError = useTomlDerivedJson(s => s.error);
  const schemaErrors = useFormDefinition(s => s.error);
  const tomlText = useTomlText(s => s.getToml());

  const hasSyntaxError = !!syntaxError;
  const hasSchemaErrors = schemaErrors.length > 0;

  if (!hasSyntaxError && !hasSchemaErrors) return null;

  return (
    <div
      className="alert alert-error shadow-lg
        m-2 w-[calc(100%-0.5rem)] max-h-32 overflow-auto"
    >
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
      {hasSyntaxError ? (
        <span>{"SyntaxError: " + syntaxError}</span>
      ) : (
        <ul className="list-disc list-inside">
          {schemaErrors.map((issue, i) => (
            <li key={i}>{formatZodIssue(issue, tomlText)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
