import { useState, useEffect } from "react";
// Global Context Variables
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function ChatTypingEffect({ chatResponse }) {
  const [displayedText, setDisplayedText] = useState("");
  const typingSpeed = 30; // Adjust typing speed (milliseconds per word)
  const { globalTheme } = useGlobalContext();

  // Preprocess chatResponse to handle line returns and bullet points
  const formatChatResponse = (response) => {
    return response.split("\n").map((line) => {
      if (line.trim().startsWith("•")) {
        // Handle bullet points
        return `<ul><li>${line.trim().substring(1).trim()}</li></ul>`;
      } else if (line.trim() === "") {
        // Handle empty lines as <br />
        return "<br />";
      } else {
        // Handle regular text
        return `<p className="mb-2">${line.trim()}</p>`;
      }
    });
  };

  const formattedResponse = formatChatResponse(chatResponse).join(" ");

  useEffect(() => {
    const words = formattedResponse
      .trim() // Trim any leading or trailing whitespace
      .split(/\s+/) // Split by one or more whitespace characters
      .filter((word) => word); // Filter out empty strings

    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        const currentWord = words[currentIndex]; // Get the current word
        setDisplayedText((prev) =>
          prev ? `${prev} ${currentWord}` : currentWord
        );
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval); // Cleanup interval on unmount or prop change
  }, [formattedResponse]);

  return (
    <div
      className="text-gray-100"
      dangerouslySetInnerHTML={{ __html: displayedText }}
    ></div>
  );
}
