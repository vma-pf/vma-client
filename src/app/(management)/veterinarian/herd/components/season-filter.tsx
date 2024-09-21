"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SharedSelection,
} from "@nextui-org/react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";

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

const SeasonFilter = () => {
  const [selectedKeys, setSelectedKeys] = React.useState<SharedSelection>(
    new Set(["Chọn vụ nuôi"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="flat"
          endContent={<HiChevronDown className="text-small" />}
        >
          {selectedValue || "Chọn vụ nuôi"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        className="max-h-[300px] overflow-auto"
        items={items}
      >
        {(item) => <DropdownItem key={item.key}>{item.value}</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SeasonFilter;
