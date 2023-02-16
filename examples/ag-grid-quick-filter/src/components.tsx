import React, { FC, useState } from "react";
import "./App.css";

interface ClipboardCopyProps {
  text: string;
}

export const ClipboardCopy: FC<ClipboardCopyProps> = ({ text }) => {
  const [copied, setCopied] = useState("Click to copy");
  return (
    <div
      className="clipboardCopy"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied("Copied");
      }}
    >
      {copied}
    </div>
  );
};

