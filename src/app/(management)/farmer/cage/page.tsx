"use client";
import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Skeleton, Tooltip, useDisclosure } from "@nextui-org/react";
import { Cage as CageProps } from "@oursrc/lib/models/cage";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import Link from "next/link";
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import AddEditForm from "./_components/add-edit-form";
import { SearchIcon } from "lucide-react";

const Cage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
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

  React.useEffect(() => {
    fetchCages();
  }, []);
  return (
    <div className="p-5 mb-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
      <div className="mb-3 flex justify-between items-end">
        <div className="w-3/4">
          <p className="text-2xl mb-3 font-bold ">Danh sách chuồng</p>
          <Input label="Tìm kiếm" placeholder="Nhập mã chuồng" size="lg" labelPlacement="outside" startContent={<SearchIcon size={20} />} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {!isLoading
          ? cageList.map((cage, idx) => (
              <Card key={idx} shadow="md">
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
                    <p className="text-center text-lg font-semibold">{cage.availableQuantity}</p>
                  </div>
                </CardBody>
                <CardFooter className="flex justify-center gap-2">
                  <Link href={`/farmer/cage/${cage.id}/camera`}>
                    <Button color="primary" variant="solid">
                      Xem Camera
                    </Button>
                  </Link>
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
    </div>
  );
};

export default Cage;
