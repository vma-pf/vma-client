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
import { LuDot } from "react-icons/lu";

type Message = {
  senderName: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
};

const messageList: Message[] = [
  {
    senderName: "Admin",
    title: "Notification 1",
    content: "Content 1",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    senderName: "Admin",
    title: "Notification 2",
    content: "Content 2",
    createdAt: new Date("2024-09-27T00:00:00.000Z").toISOString(),
    isRead: false,
  },
  {
    senderName: "Admin",
    title: "Notification 3",
    content: "Content 3",
    createdAt: new Date("2024-09-27T00:00:00.000Z").toISOString(),
    isRead: false,
  },
];

const CustomHeader = ({
  titleMap,
  prefix,
}: {
  titleMap: { [key: string]: string };
  prefix: string;
}) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const filteredPath = pathname
    .split(prefix)
    .filter((x) => x)
    .toString();

  const [messages, setMessages] = useState<Message[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const checkTime = (msg: Message) => {
    const diffTime = new Date().getTime() - new Date(msg.createdAt).getTime();
    const minutes = Math.floor(diffTime / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const timeAgo = minutes < 60
      ? `${minutes} phút trước`
      : hours < 24
        ? `${hours} giờ trước`
        : days < 7
          ? `${days} ngày trước`
          : days < 30
            ? `${days} tuần trước`
            : `${days} tháng trước`;
    return timeAgo;
  }

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
        connect.on("ReceiveMessage", (message) => {
          const newMessages = [...messages];
          newMessages.push(message);
          setMessages(newMessages);
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

  const toggleMode = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className="bg-slate-200 dark:bg-zinc-800 px-4 py-2 rounded-2xl flex justify-between">
      <p className="font-bold text-4xl">{titleMap[filteredPath] || ""}</p>
      <div className="flex items-center">
        <p>Chào, {prefix === "/veterinarian" ? "Veterinarian" : "Farmer"}</p>
        <Avatar
          className="mx-2"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
        <Dropdown placement="bottom-end" className="w-fit">
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Badge content={
                messageList.filter((msg) => !msg.isRead).length
              } size="sm" color="primary" shape="circle">
                <FaBell className="text-2xl text-yellow-400" />
              </Badge>
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            {messageList.map((msg, index) => (
              <DropdownItem key={index}>
                {msg.isRead ? (
                  <div>
                    <p className="text-lg font-semibold">{msg.title}</p>
                    <p className="text-md">Message: {msg.content}</p>
                    {/* display period from now to msg.createdAt */}
                    <p className="text-sm text-gray-400">{checkTime(msg)}</p>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold">{msg.title}</p>
                      <p className="text-md">Message: {msg.content}</p>
                      <p className="text-sm text-gray-400">{checkTime(msg)}</p>
                    </div>
                    <LuDot size={50} className="text-primary" />
                  </div>
                )}
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

export default CustomHeader;
