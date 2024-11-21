"use client";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Skeleton } from "@nextui-org/react";
import { Cage as CageProps } from "@oursrc/lib/models/cage";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import React from "react";
import { SearchIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@oursrc/components/ui/sheet";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { SERVERURL } from "@oursrc/lib/http";

const Cage = () => {
  const videoRef = React.useRef<string | Element>("");
  const playerRef = React.useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = React.useState(false);
  const [isOpenCamera, setIsOpenCamera] = React.useState(false);
  const [cageList, setCageList] = React.useState<CageProps[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<CageProps | null>(null);
  const fetchCages = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<CageProps> = await cageService.getCages(1, 500);
      if (res && res.isSuccess) {
        setCageList(res.data.data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewCamera = async (cameraId: string) => {
    try {
      // setIsLoadingVideo(true);
      if (cameraId === "") return;
      const res = await fetch(`${SERVERURL}/api/cameras/${cameraId}/live`, {
        credentials: "include",
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setCageList(data);
      } else if (contentType && contentType.includes("application/vnd.apple.mpegurl")) {
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
        // setIsLoadingVideo(false);
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
    <div className="p-5 mb-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
      <div className="mb-3 flex justify-between items-end">
        <div className="w-3/4">
          <p className="text-2xl mb-3 font-bold ">Danh sách chuồng</p>
          <Input label="Tìm kiếm" placeholder="Nhập mã chuồng" size="lg" labelPlacement="outside" startContent={<SearchIcon size={20} />} />
        </div>
      </div>
      <Sheet open={isOpenCamera} onOpenChange={setIsOpenCamera}>
        <div className="grid grid-cols-4 gap-5">
          {!isLoading
            ? cageList.map((cage, idx) => (
                <Card key={cage.id} shadow="md">
                  <CardHeader>
                    <p className="text-lg m-auto font-semibold">Chuồng {cage.code}</p>
                  </CardHeader>
                  <CardBody className="p-2 mx-auto">
                    <Image className="mx-auto" width={200} alt="chuong" src="https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg" />
                    <p className="text-center">{cage.description}</p>
                    <div className="flex justify-between">
                      <p className="text-center">Sức chứa tối đa</p>
                      <p className="text-center text-lg font-semibold">{cage.capacity}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-center">Số lượng hiện tại</p>
                      <p className="text-center text-lg font-semibold">{cage.availableQuantity ?? 0}</p>
                    </div>
                  </CardBody>
                  <CardFooter className="w-full flex justify-center">
                    <SheetTrigger asChild>
                      <Button
                        color="primary"
                        variant="solid"
                        onPress={() => {
                          setSelectedCage(cage);
                          viewCamera(cage.cameraId ?? "");
                        }}
                      >
                        Xem Camera
                      </Button>
                    </SheetTrigger>
                  </CardFooter>
                </Card>
              ))
            : [...Array(8)].map((_, idx) => (
                <div key={idx} className="m-2 border-2 rounded-lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-72 w-full"></div>
                  </Skeleton>
                </div>
              ))}
        </div>
        <SheetContent className="w-3/5">
          <SheetHeader>
            <SheetTitle>Camera</SheetTitle>
          </SheetHeader>
          <div>
            {isLoadingVideo ? (
              <Skeleton className="rounded-lg h-96" />
            ) : (
              <video width={800} ref={videoRef as React.RefObject<HTMLVideoElement>} className="video-js vjs-big-play-centered" />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cage;
