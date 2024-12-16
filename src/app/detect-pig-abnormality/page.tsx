"use client";
import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import AttachVideo from "@oursrc/components/ui/attach-media/attach-video";
import { toast } from "@oursrc/hooks/use-toast";
import { notificationService } from "@oursrc/lib/services/notificationService";
import Image from "next/image";
import { useState } from "react";

interface DetectionResult {
  abnormal: string;
  healthy_pig: number;
  sick_pig: number;
  image: string[];
  time: string;
}

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | string>();
  const [result, setResult] = useState<DetectionResult>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const request = {
        video: selectedFile as Blob,
      };
      const res = await notificationService.detectPigByVideo(request);
      if (res) {
        setResult(res);
        toast({
          variant: "success",
          title: "Xử lý quá trình phát hiện bệnh thành công",
        });
        setSelectedFile(undefined);
      }
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Có lỗi xảy ra khi xử lý video! Vui lòng thử lại sau",
      });
      setSelectedFile(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Image
        src="/assets/login-bg.jpg"
        alt="background"
        className="w-screen h-screen -z-50 blur-sm"
        sizes="100vh"
        fill={true}
      />

      <Card className="w-[600px] p-4">
        <CardBody>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">
              VMA-PF - PHÁT HIỆN DẤU HIỆU BẤT THƯỜNG
            </h2>

            <AttachVideo
              fileId="1"
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            {result && (
              <div className="space-y-4 mt-4 p-4 border rounded-lg">
                <h3 className="text-xl font-semibold">Kết quả phân tích</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="font-medium">{result.abnormal}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Thời gian</p>
                    <p className="font-medium">{result.time}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Số heo khỏe mạnh</p>
                    <p className="font-medium">{result.healthy_pig}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Số heo bệnh</p>
                    <p className="font-medium">{result.sick_pig}</p>
                  </div>
                </div>

                {result.image?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Hình ảnh phân tích
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {result.image.map((img, index) => (
                        <div key={index} className="relative aspect-video">
                          <Image
                          src={img}
                          alt={`Analysis ${index + 1}`}
                          fill={true}
                          className="rounded-lg object-cover"
                          />
                        </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            className="w-full mt-5"
            variant="solid"
            color="primary"
            isDisabled={isLoading || !selectedFile}
            isLoading={isLoading}
            onPress={onSubmit}
          >
            {isLoading ? "Đang xử lý..." : "Gửi yêu cầu xử lý"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
