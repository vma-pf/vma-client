"use client";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { Avatar, Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";
import { SERVERURL } from "@oursrc/lib/http";
import { NotificationType } from "@oursrc/lib/models/notification";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
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
  const [username, setUsername] = useState("");

  const [messages, setMessages] = useState<NotificationType[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  // const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loadMore, setLoadMore] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [openNoti, setOpenNoti] = useState(false);

  const getNotificationList = async () => {
    try {
      setLoadMore(true);
      const res: ResponseObjectList<NotificationType> = await notificationService.getNotification(1, rowsPerPage);
      if (res.isSuccess) {
        setMessages(res.data.data);
        setTotalPages(res.data.totalPages);
        setRowsPerPage(res.data.pageSize);
        if (res.data.totalPages === 1) {
          setHasMore(false);
        }
      } else {
        console.log(res.errorMessage);
      }
    } catch (error: any) {
      console.error("Error while getting notification:", error);
    } finally {
      setLoadMore(false);
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

  function toCamelCase(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => (index === 0 ? match.toLowerCase() : match.toUpperCase())).replace(/\s+/g, "");
  }

  function convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => convertKeysToCamelCase(item)); // For arrays
    } else if (obj !== null && obj && typeof obj === "object") {
      const newObj: { [key: string]: any } = {}; // Add index signature
      Object.keys(obj).forEach((key) => {
        const isCamelCase = /^[a-z]+([A-Z][a-z]*)*$/.test(key); // Check if key is camelCase
        const newKey = isCamelCase ? key : toCamelCase(key); // Convert if not camelCase
        const value = obj[key];
        if (value instanceof Date) {
          newObj[newKey] = value.toISOString(); // Convert Date to ISO string
        } else {
          newObj[newKey] = convertKeysToCamelCase(value); // Recurse for nested objects
        }
      });
      return newObj;
    }
    return obj; // Return the value as is if not an object/array
  }

  useEffect(() => {
    console.log(decodeToken(localStorage.getItem("accessToken") || "").unique_name ?? "");
    setUsername(decodeToken(localStorage.getItem("accessToken") || "").unique_name ?? "");
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
          const newMessage = convertKeysToCamelCase(notification);
          console.log(newMessage);
          setMessages(newMessage);
          // setMessages(notification.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)));
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

  useEffect(() => {
    getNotificationList();
  }, [rowsPerPage]);

  const toggleMode = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className="bg-slate-100 dark:bg-zinc-800 px-4 py-2 flex justify-between">
      <p className="font-bold text-3xl">{titleMap[filteredPath] ?? ""}</p>
      <div className="flex items-center">
        {/* <p>Chào, {prefix === "/veterinarian" ? "Veterinarian" : "/farmer" ? "Farmer" : "/farm-assist" ? "Farm Assistant" : ""}</p> */}
        <p>Chào, {username ?? ""}</p>
        <Avatar className="mx-2" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
        <Popover
          placement="bottom"
          isOpen={openNoti}
          onOpenChange={(open) => {
            setOpenNoti(open);
            if (!open) {
              getNotificationList();
            }
          }}
          shouldBlockScroll
        >
          <PopoverTrigger>
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
          </PopoverTrigger>
          <PopoverContent>
            <div className="my-2 max-h-[300px] max-w-[600px] overflow-auto">
              {messages.map((msg: NotificationType, index) => (
                <div key={index} onClick={() => navigateTo(msg)} className="mx-1 p-3 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700">
                  {msg.isRead ? (
                    <div>
                      <p className="text-lg font-semibold">{msg.title}</p>
                      <p className="text-md text-wrap">Nội dung: {msg.content}</p>
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
                </div>
              ))}
              {hasMore && (
                <div className="flex justify-center">
                  {loadMore ? (
                    <Spinner color="primary" />
                  ) : (
                    <Button className="w-full" variant="light" size="sm" color="default" onPress={() => setRowsPerPage(rowsPerPage + 5)}>
                      Xem thêm
                    </Button>
                  )}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Button isIconOnly variant="light" onClick={toggleMode}>
          <HiSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <HiMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </div>
  );
};

export default CustomHeader;
