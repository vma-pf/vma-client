"use client";
import React, { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { encode, decode } from "@msgpack/msgpack";

type Message = {
  user: string;
  message: string;
};

const Demo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")?.toString();
    const connect = new HubConnectionBuilder()
      .withUrl("http://35.198.240.3:10000/hubs/notification-hub", {
        // send access token here
        accessTokenFactory: () => accessToken || "",
      })
      .withAutomaticReconnect()
      .withHubProtocol(
        new MessagePackHubProtocol({
          // encoder: encode,
        })
      )
      .configureLogging(LogLevel.Information)
      .build();
    setConnection(connect);
    connect
      .start()
      .then(() => {
        connect.on("ReceiveMessage", (user, message) => {
          setMessages((prev) => [...prev, { user, message }]);
        });
        // connect.invoke("RetrieveMessageHistory");
      })

      .catch((err) =>
        console.error("Error while connecting to SignalR Hub:", err)
      );

    return () => {
      if (connection) {
        connection.off("ReceiveMessage");
      }
    };
  }, []);

  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      await connection.send("PostMessage", newMessage);
      console.log("Message sent:", newMessage);
      setNewMessage("");
    }
  };
  const isMyMessage = (username: string) => {
    return connection && username === connection.connectionId;
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            // className={`p-2 my-2 rounded ${
            //   isMyMessage(msg.sender) ? "bg-blue-200" : "bg-gray-200"
            // }`}
          >
            <p>user: {msg.user}</p>
            <p>message: {msg.message}</p>
            {/* <p className="text-xs">{new Date(msg.sentTime).toLocaleString()}</p> */}
          </div>
        ))}
      </div>
      <div className="d-flex justify-row">
        <input
          type="text"
          className="border p-2 mr-2 rounded w-[300px]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Demo;
