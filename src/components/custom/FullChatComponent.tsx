import React from "react";
import { FullPageChat } from "flowise-embed-react";

const FullChat: React.FC = () => {
  return (
    <FullPageChat
      chatflowid="d89db284-3de5-4fdd-9f8a-59b9ee33c536"
      apiHost="https://flowise.produkmastah.online"
    />
  );
};

export default FullChat;
