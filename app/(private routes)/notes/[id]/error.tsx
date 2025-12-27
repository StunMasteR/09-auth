'use client';
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
interface ErrorProps {
  error: Error;
}

export default function Error({error}:ErrorProps) {
  return (
    <ErrorMessage error={error} />
  );
}