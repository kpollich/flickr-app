import { useEffect } from "react";

function useKey(code: string, callback: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.code !== code) {
        return;
      }

      callback(e);
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });
}

export default useKey;
