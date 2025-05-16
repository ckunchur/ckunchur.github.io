import React from "react";

function Chip({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        width: 72,
        height: 40,
        marginRight: 2,
      }}
    >
      <img src={src} alt={alt} width={56} height={56} style={{ display: "block" }} />
    </span>
  );
}

export const toolIconMap: Record<string, React.ReactNode> = {
  Figma: <Chip src="/logos/figma-logo.png" alt="Figma" />,
  Bezi: <Chip src="/logos/bezi-logo.png" alt="Bezi" />,
  React: <Chip src="/logos/react-logo.png" alt="React" />,
  Swift: <Chip src="/logos/swift-logo.png" alt="Swift" />,
  ReactNative: <Chip src="/logos/reactnative-logo.png" alt="React Native" />,
  Firebase: <Chip src="/logos/firebase-logo.png" alt="Firebase" />,
  d3: <Chip src="/logos/d3-logo.png" alt="D3" />,
  OpenAI: <Chip src="/logos/openai-logo.png" alt="Open AI" />,
  Unity: <Chip src="/logos/unity-logo.png" alt="Unity" />
}; 