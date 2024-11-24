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
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import React from "react";
import { SearchIcon } from "lucide-react";
import { SERVERURL } from "@oursrc/lib/http";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@oursrc/components/ui/sheet";
import { Area } from "@oursrc/lib/models/area";
import { areaService } from "@oursrc/lib/services/areaService";
import { IoIosArrowDown } from "react-icons/io";

const CageList = () => {
  const videoRef = React.useRef<string | Element>("");
  const playerRef = React.useRef<any>(null);
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
    fetchCages();
    fetchAreas();
  }, []);

  React.useEffect(() => {
    if (!isOpenCamera) {
      if (playerRef.current) {
        console.log(playerRef.current);
        onStopLiveCamera();
        playerRef.current.dispose();
      }
    }
  }, [isOpenCamera]);
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
      <Sheet open={isOpenCamera} onOpenChange={setIsOpenCamera}>
        <div className="grid grid-cols-4 gap-5">
          {!isLoading ? (
            filteredCageList.length > 0 ? (
              filteredCageList.map((cage, idx) => (
                <Card key={idx} shadow="md">
                  <CardHeader>
                    <p className="text-lg m-auto">
                      Chuồng <strong>{cage.code}</strong>
                    </p>
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
                    <SheetTrigger asChild>
                      <Button
                        color="primary"
                        variant="solid"
                        onPress={() => {
                          setSelectedCage(cage);
                          onLiveCamera(cage.cameraId ?? "");
                        }}
                        isDisabled={!cage.cameraId}
                      >
                        Xem Camera
                      </Button>
                    </SheetTrigger>
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
        <SheetContent className="w-3/5">
          <SheetHeader>
            <SheetTitle>Camera</SheetTitle>
          </SheetHeader>
          <div>
            <video width={800} ref={videoRef as React.RefObject<HTMLVideoElement>} className="video-js vjs-big-play-centered" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CageList;
