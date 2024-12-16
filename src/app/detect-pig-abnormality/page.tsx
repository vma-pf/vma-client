"use client";
import { Button, Card, CardBody } from "@nextui-org/react";
import AttachVideo from "@oursrc/components/ui/attach-media/attach-video";
import { toast } from "@oursrc/hooks/use-toast";
import { notificationService } from "@oursrc/lib/services/notificationService";
import Image from "next/image";
import { useState } from "react";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | string>();


  const onSubmit = async() => {
    const request = {
      video: selectedFile as Blob 
    }
    const res = await notificationService.detectPigByVideo(request);
    console.log(res)
    if(res) { 
      toast({
        variant: "success",
        title: "Gửi cảnh báo thành công! Vui lòng kiểm tra lại",
      });
      setSelectedFile(undefined);
    }
  }

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
            <h2 className="text-2xl font-bold text-center">VMA-PF - CẢNH BÁO TRIỆU CHỨNG</h2>
            <AttachVideo
              fileId="1"
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
          <Button
            className="w-full mt-5"
            variant="solid"
            color="primary"
            onPress={onSubmit}
          >Gửi yêu cầu xử lý</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;