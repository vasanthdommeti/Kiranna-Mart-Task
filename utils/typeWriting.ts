/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export function useTypewriter(
  words: string[],
  typingSpeed = 50,
  deletingSpeed = 25,
  pauseDuration = 2000
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const current = words[wordIndex % words.length];

    if (!isDeleting && displayedText === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setWordIndex((i) => i + 1);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeout = setTimeout(() => {
        setDisplayedText((prev) =>
          isDeleting
            ? current.substring(0, prev.length - 1)
            : current.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex]);

  return displayedText;
}
