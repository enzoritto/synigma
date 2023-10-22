import { useEffect } from "preact/hooks";

export default function Message({ message, isVisible, toggleVisibility }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        toggleVisibility();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, toggleVisibility]);

  return (
    isVisible && (
      <div>
        {message}
      </div>
    )
  );
}
