import { useEffect, useState } from "preact/hooks";

export default function Message({ message }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message.message === "") return;
    setIsVisible(true);
  }, [message.id]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible]);

  return (
    isVisible && (
      <div class="message">
        {message.message}
      </div>
    )
  );
}
