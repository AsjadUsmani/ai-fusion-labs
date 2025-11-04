"use client";
import { useTheme } from "next-themes";
import ChatInputBox from "./_components/ChatInputBox";

/**
 * Render the home page that displays the chat input box.
 *
 * @returns {JSX.Element} The React element for the home page containing a ChatInputBox.
 */
export default function Home() {
  const {setTheme} = useTheme();
  return (
    <div>
      <ChatInputBox/>
    </div>
  );
}