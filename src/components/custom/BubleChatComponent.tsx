import React from "react";
import { BubbleChat } from "flowise-embed-react";

const BubleChatComponent: React.FC = () => {
  return (
    <BubbleChat
      chatflowid="d89db284-3de5-4fdd-9f8a-59b9ee33c536"
      apiHost="https://flowise.produkmastah.online"
      theme={{
        button: {
          backgroundColor: "#3B81F6",
          right: 20,
          bottom: 20,
          size: "medium",
          iconColor: "white",
          customIconSrc:
            "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
        },
        chatWindow: {
          welcomeMessage: "Hallo kak, Ada yang bisa kami bantu?",
          backgroundColor: "#ffffff",
          height: 700,
          width: 400,
          fontSize: 16,
          poweredByTextColor: "#303235",
          botMessage: {
            backgroundColor: "#f7f8ff",
            textColor: "#303235",
            showAvatar: true,
            avatarSrc:
              "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
          },
          userMessage: {
            backgroundColor: "#3B81F6",
            textColor: "#ffffff",
            showAvatar: true,
            avatarSrc:
              "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
          },
          textInput: {
            placeholder: "Type your question",
            backgroundColor: "#ffffff",
            textColor: "#303235",
            sendButtonColor: "#3B81F6",
          },
        },
      }}
    />
  );
};

export default BubleChatComponent;
