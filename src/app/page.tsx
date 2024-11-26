"use client";
import Image from "next/image";
import { Button, Card, CardBody, Checkbox, Select, SelectItem } from "@nextui-org/react";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import React, { useEffect, useState } from "react";
import { cageService } from "@oursrc/lib/services/cageService";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Cage } from "@oursrc/lib/models/cage";
import { notificationService } from "@oursrc/lib/services/notificationService";
import { toast } from "@oursrc/hooks/use-toast";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | string>();
  const [selectedAbnormalities, setSelectedAbnormalities] = useState<string[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | undefined>(undefined);
  const [touched, setTouched] = React.useState(false);

  const [cages, setCages] = useState<Cage[]>([]);

  const fetchCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if(res.isSuccess) {
        setCages(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cages", error);
    }
  };

  useEffect(() => {
    fetchCages();
  }, []);

  const abnorbilitiesOptions = [
    "Biếng ăn",
    "Lười vận động",
    "Khó ngủ",
    "Mệt mỏi",
    "Đau đầu",
    "Chóng mặt"
  ];
  const onSubmit = async() => {
    const request = {
      cageId: selectedCage?.id,
      content: selectedAbnormalities.join(", "),
      image: selectedFile as Blob
    }
    const res = await notificationService.sendWariningAI(request);
    if(res.isSuccess) { 
      toast({
        variant: "success",
        title: "Gửi cảnh báo thành công! Vui lòng kiểm tra lại",
      });
      setSelectedAbnormalities([]);
      setSelectedFile(undefined);
      setSelectedCage(undefined);
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
            
            <AttachMedia
              fileId="1"
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Chọn chuồng theo mã"
                placeholder="Chọn chuồng"
                size="lg"
                isRequired
                labelPlacement="outside"
                className="mb-5"
                radius="md"
                selectionMode="single"
                selectedKeys={selectedCage?.id ? new Set([selectedCage.id]) : new Set()}
                onSelectionChange={(e) => {
                  setSelectedCage(cages.find((option: Cage) => option.id === e.anchorKey));
                }}
                items={cages}
                onClose={() => setTouched(true)}
              >
                {(item) => (
                  <SelectItem color="primary" key={item.id ?? ""} value={item.id}>
                    {item.code}
                  </SelectItem>
                )}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {abnorbilitiesOptions.map((item, index) => (
                <Checkbox 
                  key={index} 
                  isSelected={selectedAbnormalities.includes(item)}
                  onChange={() => {
                  setSelectedAbnormalities(prev => 
                    prev.includes(item) 
                    ? prev.filter(abnormality => abnormality !== item) 
                    : [...prev, item]
                  );
                  }}
                >
                  {item}
                </Checkbox>
              ))}
            </div>
          </div>
          <Button
            className="w-full mt-5"
            variant="solid"
            color="primary"
            isDisabled={!selectedCage}
            onPress={onSubmit}
          >Gửi</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
