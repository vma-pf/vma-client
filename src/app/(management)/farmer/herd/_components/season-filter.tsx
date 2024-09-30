"use client";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, SharedSelection } from "@nextui-org/react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { useToast } from "@oursrc/hooks/use-toast";
import { herdService } from "@oursrc/lib/services/herdService";

const items = [
  {
    key: "Vụ Xuân Hè 2024",
    value: "Vụ Xuân Hè 2024",
  },
  {
    key: "Vụ Đông Xuân 2024",
    value: "Vụ Đông Xuân 2024",
  },
  {
    key: "Vụ Thu Đông 2023",
    value: "Vụ Thu Đông 2023",
  },
  {
    key: "Vụ Đông Xuân 2023",
    value: "Vụ Đông Xuân 2023",
  },
  {
    key: "Vụ Thu Đông 2022",
    value: "Vụ Thu Đông 2022",
  },
  {
    key: "Vụ Đông Xuân 2022",
    value: "Vụ Đông Xuân 2022",
  },
  {
    key: "Vụ Thu Đông 2021",
    value: "Vụ Thu Đông 2021",
  },
  {
    key: "Vụ Đông Xuân 2021",
    value: "Vụ Đông Xuân 2021",
  },
  {
    key: "Vụ Thu Đông 2020",
    value: "Vụ Thu Đông 2020",
  },
  {
    key: "Vụ Đông Xuân 2020",
    value: "Vụ Đông Xuân 2020",
  },
];

const SeasonFilter = ({ setSelectedHerd }: { setSelectedHerd: React.Dispatch<React.SetStateAction<HerdInfo | undefined>> }) => {
  const { toast } = useToast();
  const [herds, setHerds] = React.useState<HerdInfo[]>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<SharedSelection>(new Set(["Chọn vụ nuôi"]));

  const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", ").replaceAll("_", " "), [selectedKeys]);

  React.useEffect(() => {
    fetchHerd();
  }, [selectedKeys]);

  const fetchHerd = async () => {
    try {
      const response: ResponseObjectList<HerdInfo> = await herdService.getHerd(1, 500);
      if (response.isSuccess) {
        setHerds(response.data.data);
        setSelectedHerd(
          response.data.data.filter((herd) => herd.id === selectedValue).length > 0
            ? response.data.data.filter((herd) => herd.id === selectedValue)[0]
            : response.data.data[0]
        );
        if (response.data.data.filter((herd) => herd.id === selectedValue).length === 0) {
          setSelectedKeys(new Set([response.data.data[0].id]));
        }
      } else {
        toast({
          variant: "destructive",
          title: response.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    }
  };
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button variant="flat" endContent={<HiChevronDown className="text-small" />}>
          {/* {selectedValue || "Chọn vụ nuôi"} */}
          Chọn vụ nuôi
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        className="max-h-[300px] overflow-auto"
        items={herds}
      >
        {(item) => (
          <DropdownItem key={item.id}>
            <p className="text-sm">{item.code}</p>
            <p className="text-xs text-zinc-400">{item.totalNumber}</p>
            <p className="text-xs text-zinc-400">{item.breed}</p>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SeasonFilter;
