"use client";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { HiSun, HiMoon } from "react-icons/hi";

type Message = {
  user: string;
  message: string;
};

const VetHeader = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const filteredPath = pathname
    .split("/veterinarian")
    .filter((x) => x)
    .toString();
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

  const titleMap: { [key: string]: string } = {
    "/dashboard": "Tổng quan",
    "/pig": "Quản lý heo",
    "/herd": "Quản lý đàn heo",
    "/medicine": "Quản lý thuốc",
    "/vaccination": "Lịch tiêm phòng",
    "/treatment": "Kế hoạch điều trị",
    "/cage": "Quản lý chuồng",
    "/alert": "Cảnh báo",
  };

  const toggleMode = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className="bg-slate-200 dark:bg-zinc-800 px-4 py-2 rounded-2xl flex justify-between">
      <p className="font-bold text-4xl">{titleMap[filteredPath] || ""}</p>
      <div className="flex items-center">
        <p>Chào, Vet</p>
        <Avatar
          className="mx-2"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Badge content="5" size="sm" color="primary" shape="circle">
                <FaBell className="text-2xl text-yellow-400" />
              </Badge>
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {messages.map((msg, index) => (
              <DropdownItem key={index}>
                <p className="text-sm">User: {msg.user}</p>
                <p className="text-md font-medium">Message: {msg.message}</p>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button isIconOnly variant="light" onClick={toggleMode}>
          <HiSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <HiMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </div>
  );
};

export default VetHeader;
