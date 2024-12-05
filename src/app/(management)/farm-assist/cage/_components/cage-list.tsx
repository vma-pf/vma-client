import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Selection,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Cage } from "@oursrc/lib/models/cage";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { Cctv, SearchIcon } from "lucide-react";
import { SERVERURL } from "@oursrc/lib/http";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { cameraService } from "@oursrc/lib/services/cameraService";
import { GiCage } from "react-icons/gi";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@oursrc/components/ui/sheet";
import AddEditCage from "./_modals/add-edit-cage";
import { Area } from "@oursrc/lib/models/area";
import { areaService } from "@oursrc/lib/services/areaService";
import { IoIosArrowDown } from "react-icons/io";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import ActivityLog from "../../../../../components/cages/modals/activty-log";
import { HiDotsVertical } from "react-icons/hi";
import { MdHistory } from "react-icons/md";

const CageList = () => {
  const videoRef = React.useRef<string | Element>("");
  const playerRef = React.useRef<any>(null);
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenLog, onOpen: onOpenLog, onClose: onCloseLog } = useDisclosure();
  const [isOpenCamera, setIsOpenCamera] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [cageList, setCageList] = React.useState<Cage[]>([]);
  const [areaList, setAreaList] = React.useState<Area[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | null>(null);
  const [selectedArea, setSelectedArea] = React.useState<Area | null>(null);
  const [filteredCageList, setFilteredCageList] = React.useState<Cage[]>([]);

  const fetchCages = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res && res.isSuccess) {
        setCageList(res.data.data);
        setFilteredCageList(res.data.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Area> = await areaService.getAll(1, 1000);
      if (res.isSuccess) {
        setAreaList(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLiveCamera = async (cameraId: string) => {
    try {
      if (cameraId === "") return;
      const res = await fetch(`${SERVERURL}/api/cameras/${cameraId}/live`, {
        credentials: "include",
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/vnd.apple.mpegurl")) {
        const m3uData = await res.text();
        console.log(m3uData);
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          sources: [
            {
              src: `${SERVERURL}/api/cameras/${cameraId}/live`,
              type: "application/vnd.apple.mpegurl",
            },
          ],
        });
        setIsOpenCamera(true);
      } else {
        console.error("Received non-JSON response:", await res.text());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onStopLiveCamera = async () => {
    try {
      const res = await fetch(`${SERVERURL}/api/cameras/${selectedCage?.cameraId}/stop-live`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (!isOpenAdd && !isOpenEdit && !isOpenDelete) fetchCages();
  }, [isOpenAdd, isOpenEdit, isOpenDelete]);

  React.useEffect(() => {
    fetchAreas();
  }, []);

  React.useEffect(() => {
    if (isOpenCamera) {
      const accessToken = localStorage.getItem("accessToken")?.toString();
      const connect = new HubConnectionBuilder()
        .withUrl(`${SERVERURL}/hubs/camera`, {
          // send access token here
          accessTokenFactory: () => accessToken || "",
          headers: {
            CameraId: selectedCage?.cameraId ?? "",
          },
        })
        .withAutomaticReconnect()
        .withHubProtocol(
          new MessagePackHubProtocol({
            // encoder: encode,
          })
        )
        .configureLogging(LogLevel.Information)
        .build();
      connect
        .start()
        .then(() => {
          console.log("Connected to SignalR Camera Hub");
          connect.on("", () => {});
        })

        .catch((err) => console.log("Error while connecting to SignalR Hub:", err));

      return () => {
        if (connect) {
          connect.off("ReceiveMessage");
          connect.stop();
        }
      };
    } else {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    }
  }, [isOpenCamera]);

  // React.useEffect(() => {
  //   if (!isOpenCamera) {
  //     if (playerRef.current) {
  //       console.log(playerRef.current);
  //       onStopLiveCamera();
  //       playerRef.current.dispose();
  //     }
  //   }
  // }, [isOpenCamera]);
  return (
    <div>
      <div className="mb-5">
        <div className="flex justify-between items-center gap-3">
          <p className="text-2xl mb-3 font-bold ">Danh sách chuồng</p>
          <div className="space-x-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" color="primary" endContent={<IoIosArrowDown size={20} />}>
                  {selectedArea?.code || "Tất cả"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                variant="solid"
                selectionMode="single"
                selectedKeys={selectedArea?.id ? new Set([selectedArea.id]) : new Set()}
                onSelectionChange={(keys: Selection) => {
                  const keysArray = Array.from(keys);
                  const area = areaList.filter((area) => area.id && keysArray.includes(area.id))[0];
                  setSelectedArea(area);
                  if (area) {
                    setFilteredCageList(cageList.filter((cage) => cage.areaId === area.id));
                  } else {
                    setFilteredCageList(cageList);
                  }
                }}
                items={areaList}
              >
                {(item) => <DropdownItem key={item.id}>{item.code}</DropdownItem>}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" variant="solid" endContent={<IoAddOutline />} onPress={onOpenAdd}>
              Thêm chuồng
            </Button>
          </div>
        </div>
        <Input
          label="Tìm kiếm"
          placeholder="Nhập mã chuồng"
          size="lg"
          labelPlacement="outside"
          startContent={<SearchIcon size={20} />}
          onValueChange={(e) => {
            if (e === "") {
              setFilteredCageList(cageList);
            } else {
              setFilteredCageList(cageList.filter((cage) => cage.code.includes(e)));
            }
          }}
        />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {!isLoading ? (
          filteredCageList.length > 0 ? (
            filteredCageList.map((cage, idx) => (
              <Card key={idx} shadow="md">
                <CardHeader className="flex justify-between">
                  <p className="text-lg font-semibold">Chuồng {cage.code}</p>
                  <div>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light">
                          <HiDotsVertical size={20} className="text-default-400" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu disabledKeys={cage.cameraId ? [] : ["camera"]}>
                        <DropdownItem
                          key="camera"
                          variant="solid"
                          onPress={() => {
                            setSelectedCage(cage);
                            setIsOpenCamera(true);
                            onLiveCamera(cage.cameraId ?? "");
                          }}
                          startContent={<Cctv size={25} className="text-primary" />}
                        >
                          Xem Camera
                        </DropdownItem>
                        <DropdownItem
                          key="activity-log"
                          variant="solid"
                          onPress={() => {
                            onOpenLog();
                            setSelectedCage(cage);
                          }}
                          startContent={<MdHistory size={25} className="text-primary" />}
                        >
                          Lịch sử hoạt động chuồng
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardHeader>
                <CardBody className="p-2 mx-auto">
                  <Image
                    className="mx-auto"
                    width={200}
                    height={200}
                    alt="chuong"
                    src="https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg"
                  />
                  <div className="flex justify-between">
                    <p className="text-center">Sức chứa tối đa</p>
                    <p className="text-center text-lg font-semibold">{cage.capacity}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-center">Số lượng hiện tại</p>
                    <p className="text-center text-lg font-semibold">{cage.availableQuantity}</p>
                  </div>
                  <p className="text-center font-semibold">Mô tả:</p>
                  <p className="text-center">{cage.description}</p>
                </CardBody>
                <CardFooter className="flex justify-center gap-2">
                  <Tooltip content="Chỉnh sửa" closeDelay={200}>
                    <Button
                      color="warning"
                      isIconOnly
                      variant="solid"
                      onPress={() => {
                        setSelectedCage(cage);
                        onOpenEdit();
                      }}
                    >
                      <FaRegEdit size={20} />
                    </Button>
                  </Tooltip>
                  {/* <AddEditForm isOpen={isOpenAdd} onClose={onCloseAdd} cage={cage} /> */}
                  <Tooltip content="Xóa" closeDelay={200}>
                    <Button
                      color="danger"
                      isIconOnly
                      isDisabled={cage.availableQuantity !== undefined && cage.availableQuantity >= cage.capacity}
                      variant="solid"
                      onPress={() => {
                        onOpenDelete();
                        setSelectedCage(cage);
                      }}
                    >
                      <FaRegTrashAlt size={20} />
                    </Button>
                  </Tooltip>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="mt-5 w-full col-span-4 text-center">Không có dữ liệu</p>
          )
        ) : (
          [...Array(8)].map((_, idx) => (
            <div key={idx} className="m-2 border-2 rounded-lg">
              <Skeleton className="rounded-lg">
                <div className="h-72 w-full"></div>
              </Skeleton>
            </div>
          ))
        )}
      </div>
      <Sheet open={isOpenCamera} onOpenChange={setIsOpenCamera}>
        <SheetContent className="w-3/5">
          <SheetHeader>
            <SheetTitle>Camera</SheetTitle>
          </SheetHeader>
          <div>
            <video width={800} ref={videoRef as React.RefObject<HTMLVideoElement>} className="video-js vjs-big-play-centered" />
          </div>
        </SheetContent>
      </Sheet>
      {isOpenEdit && <AddEditCage key={1} operation="edit" isOpen={isOpenEdit} onClose={onCloseEdit} cage={selectedCage || undefined} />}
      {isOpenAdd && <AddEditCage key={2} operation="add" isOpen={isOpenAdd} onClose={onCloseAdd} />}
      {isOpenDelete && <AddEditCage key={3} operation="delete" isOpen={isOpenDelete} onClose={onCloseDelete} cage={selectedCage || undefined} />}
      {isOpenLog && <ActivityLog isOpen={isOpenLog} onClose={onCloseLog} cage={selectedCage || undefined} />}
    </div>
  );
};

export default CageList;
