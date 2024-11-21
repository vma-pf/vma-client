"use client";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { Avatar, Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { SERVERURL } from "@oursrc/lib/http";
import { NotificationType } from "@oursrc/lib/models/notification";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { notificationService } from "@oursrc/lib/services/notificationService";
import { ROLE, decodeToken } from "@oursrc/lib/utils";
import { checkTime } from "@oursrc/lib/utils/dev-utils";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { connected } from "process";
import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { HiSun, HiMoon } from "react-icons/hi";
import { LuDot } from "react-icons/lu";

const roleMap: { [key: string]: string } = {
  "/farmer": "Farmer",
  "/veterinarian": "Veterinarian",
  "/farm-assist": "Farm Assistant",
  "/admin": "Admin",
};

const CustomHeader = ({ titleMap, prefix }: { titleMap: { [key: string]: string }; prefix: string }) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const filteredPath = pathname
    .split(prefix)
    .filter((x) => x)
    .toString();

  const [messages, setMessages] = useState<NotificationType[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const getNotificationList = async () => {
    try {
      const res: ResponseObject<any> = await notificationService.getNotification();
      if (res.isSuccess) {
        setMessages(res.data);
      }
    } catch (error: any) {
      console.error("Error while getting notification:", error);
    }
  };

  const navigateTo = (message: NotificationType) => {
    console.log(message.notificationType);
    const role = decodeToken(localStorage.getItem("accessToken") || "").role.toLowerCase();
    if (role === ROLE.FARMERASSISTANT) {
      switch (message.notificationType) {
        case "Yêu cầu tiêm phòng":
        case "Yêu cầu cấp phát thuốc":
          router.push("/farm-assist/medicine");
          break;
        case "Dấu hiệu bất thường":
          router.push("/farm-assist/treatment");
          break;
        default:
          break;
      }
    } else if (role === ROLE.VETERINARIAN) {
      switch (message.notificationType) {
        case "Nhắc nhở tiêm phòng":
          router.push("/veterinarian/vaccination");
          break;
        case "Dấu hiệu bất thường":
        case "Nhắc nhở chữa trị":
          router.push("/veterinarian/treatment");
          break;
        default:
          break;
      }
    } else if (role === ROLE.FARMER) {
      switch (message.notificationType) {
        case "Yêu cầu tiêm phòng":
        case "Yêu cầu cấp phát thuốc":
          router.push("/farmer/medicine");
          break;
        case "Dấu hiệu bất thường":
          router.push("/farmer/treatment");
          break;
        default:
          break;
      }
    }
    // const path = message.notificationType === 1 ? "/farmer/medicine" : "/farmer/disease-report";
    // router.push(path);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")?.toString();
    const connect = new HubConnectionBuilder()
      .withUrl(`${SERVERURL}/hubs/notification-hub`, {
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
        console.log("Connected to SignalR Hub");
        getNotificationList();
        connect.on("ReceiveNotifications", (notification: NotificationType[]) => {
          console.log("ReceiveNotifications", notification);
          // const newMessages = [...messages];
          // newMessages.push(message);
          // setMessages(newMessages);
        });
        connect?.on("RefreshNotification", () => {
          getNotificationList();
        });
        // connect.invoke("RetrieveMessageHistory");
      })

      .catch((err) => console.error("Error while connecting to SignalR Hub:", err));

    return () => {
      if (connection) {
        connection.off("ReceiveMessage");
      }
    };
  }, []);

  const toggleMode = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className="bg-slate-100 dark:bg-zinc-800 px-4 py-2 flex justify-between">
      <p className="font-bold text-3xl">{titleMap[filteredPath] || ""}</p>
      <div className="flex items-center">
        {/* <p>Chào, {prefix === "/veterinarian" ? "Veterinarian" : "/farmer" ? "Farmer" : "/farm-assist" ? "Farm Assistant" : ""}</p> */}
        <p>Chào, {roleMap[prefix]}</p>
        <Avatar className="mx-2" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Dropdown
          placement="bottom-end"
          className="w-fit"
          onClose={() => {
            getNotificationList();
          }}
        >
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Badge
                content={messages.filter((msg) => !msg.isRead).length === 0 ? null : messages.filter((msg) => !msg.isRead).length}
                size="sm"
                color="primary"
                shape="circle"
              >
                <FaBell className="text-2xl text-yellow-400" />
              </Badge>
            </Button>
          </DropdownTrigger>
          <DropdownMenu emptyContent="Không có thông báo" className="max-h-[300px] max-w-[600px] overflow-auto">
            {messages.map((msg: NotificationType, index) => (
              <DropdownItem key={index} onClick={() => navigateTo(msg)}>
                {msg.isRead ? (
                  <div>
                    <p className="text-lg font-semibold">{msg.title}</p>
                    <p className="text-md text-wrap">Nội dung: {msg.content}</p>
                    {/* display period from now to msg.createdAt */}
                    <p className="text-sm text-gray-400">{checkTime(msg)}</p>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-semibold">{msg.title}</p>
                      <p className="text-md text-wrap">Nội dung: {msg.content}</p>
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
