"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";

const Cage = () => {
  const cages = [
    {
      id: 1,
      name: "Chuồng 1",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 2,
      name: "Chuồng 2",
      status: "Inactive",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 3,
      name: "Chuồng 3",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 4,
      name: "Chuồng 4",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 5,
      name: "Chuồng 5",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 6,
      name: "Chuồng 6",
      status: "Inactive",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 7,
      name: "Chuồng 7",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 8,
      name: "Chuồng 8",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    {
      id: 9,
      name: "Chuồng 9",
      status: "Active",
      maxCapacity: 10,
      imageUrl:
        "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    },
    // {
    //   id: 10,
    //   name: "Chuồng 10",
    //   status: "Active",
    //   maxCapacity: 10,
    //   imageUrl:
    //     "https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg",
    // },
  ];
  const router = useRouter();
  return (
    <div className="p-5 mb-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
      <div className="mb-3 flex justify-between">
        <p className="text-2xl font-bold ">Danh sách chuồng</p>
        <Button
          color="primary"
          variant="solid"
          endContent={<IoAddOutline size={20} />}
        >
          Thêm chuồng
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {cages.map((cage) => (
          <Card shadow="md">
            <CardHeader>
              <p className="text-lg m-auto font-semibold">Chuồng {cage.id}</p>
            </CardHeader>
            <CardBody className="p-2 mx-auto">
              <div className="flex justify-between">
                <p className="text-center">Trạng thái</p>
                <p
                  className={`text-center font-semibold
                ${
                  cage.status === "Active"
                    ? "text-success-500"
                    : "text-danger-500"
                }
                `}
                >
                  {cage.status}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-center">Sức chứa tối đa</p>
                <p className="text-center font-semibold">{cage.maxCapacity}</p>
              </div>
              <Image
                className="mx-auto"
                width={200}
                alt="chuong"
                src={cage.imageUrl}
              />
            </CardBody>
            <CardFooter className="flex justify-center gap-2">
              <Button
                color="primary"
                variant="solid"
                onPress={() => router.push("/cage/camera")}
              >
                Xem Camera
              </Button>
              <Tooltip content="Chỉnh sửa" closeDelay={200}>
                <Button color="warning" isIconOnly variant="solid">
                  <FaRegEdit />
                </Button>
              </Tooltip>
              <Tooltip content="Xóa" closeDelay={200}>
                <Button color="danger" isIconOnly variant="solid">
                  <FaRegTrashAlt />
                </Button>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cage;
