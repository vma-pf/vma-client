import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { pigService } from "@oursrc/lib/services/pigService";
import React from "react";

const DestroyPig = ({ isOpen, onClose, pigs }: { isOpen: boolean; onClose: () => void; pigs: Pig[] }) => {
  const [selectedPigs, setSelectedPigs] = React.useState<Pig[]>([]);
  const handleDestroyPig = async () => {
    try {
      const res: ResponseObject<any> = await pigService.destroyPig(selectedPigs.map((pig) => pig.id));
      if (res.isSuccess) {
        toast({
          title: "Tiêu hủy heo thành công",
          variant: "success",
        });
        onClose();
      } else {
        toast({
          title: res.errorMessage ?? "Tiêu hủy heo thất bại",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isDismissable={false} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <p className="text-xl font-semibold">Xác nhận tiêu hủy heo</p>
        </ModalHeader>
        <ModalBody>
          <p className="text-lg mb-4">Chọn heo cần tiêu hủy</p>
          <Table
            isHeaderSticky
            color="primary"
            classNames={{
              wrapper: "max-h-[550px]",
            }}
            selectionMode="multiple"
            // selectedKeys={selectedPig ? new Set([selectedPig.id]) : new Set()}
            onSelectionChange={(keys) => {
              const selectedKeysArray = Array.from(keys);
              setSelectedPigs(pigs.filter((pig) => selectedKeysArray.includes(pig.id)));
            }}
          >
            <TableHeader>
              <TableColumn align="center">Mã heo</TableColumn>
              <TableColumn align="center">Giống</TableColumn>
              <TableColumn align="center">Trọng lượng (kg)</TableColumn>
              <TableColumn align="center">Chiều cao (cm)</TableColumn>
              <TableColumn align="center">Chiều dài (cm)</TableColumn>
              <TableColumn align="center">Tình trạng</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Không có kết quả"}>
              {pigs.map((pig) => (
                <TableRow key={pig.id}>
                  <TableCell>{pig.pigCode}</TableCell>
                  <TableCell>{pig.breed}</TableCell>
                  <TableCell>{pig.weight}</TableCell>
                  <TableCell>{pig.height}</TableCell>
                  <TableCell>{pig.width}</TableCell>
                  <TableCell>{pig.healthStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="solid" onPress={onClose}>
            Hủy
          </Button>
          <Button color="danger" variant="solid" onPress={handleDestroyPig} isDisabled={selectedPigs.length === 0}>
            Xác nhận
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DestroyPig;
