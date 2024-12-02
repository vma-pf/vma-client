import React, { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useToast } from "@oursrc/hooks/use-toast";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { areaService } from "@oursrc/lib/services/areaService";
import { User } from "@oursrc/lib/models/account";
import { accountService } from "@oursrc/lib/services/accountService";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";

const AddEditUser = ({ isOpen, onClose, user, operation }: { isOpen: boolean; onClose: () => void; user?: User; operation: "add" | "activate" | "deactivate" }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [touched, setTouched] = React.useState(false);
  const username = watch("username");
  const email = watch("email");
  const password = watch("password");
  const roleName = watch("roleName");

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      if (operation === "add") {
        const res: ResponseObject<User> = await accountService.create(data);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Thêm người dùng thành công",
          });
          onClose();
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);
      if (operation === "activate") {
        const res: ResponseObject<User> = await accountService.activate(user?.id || "");
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Kích hoạt người dùng thành công",
          });
          onClose();
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      } else if (operation === "deactivate") {
        const res: ResponseObject<User> = await accountService.deactivate(user?.id || "");
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Vô hiệu hóa người dùng thành công",
          });
          onClose();
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("username", user?.username ?? "");
    setValue("email", user?.email ?? "");
    setValue("password", user?.password ?? "");
    setValue("roleName", user?.roleName ?? "");
  }, [user, setValue]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={operation === "add" ? "md" : "sm"} hideCloseButton isDismissable={false}>
      {operation === "add" ? (
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <ModalContent>
            <ModalHeader>{user ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</ModalHeader>
            <ModalBody>
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Mã người dùng"
                placeholder="Nhập mã người dùng"
                labelPlacement="outside"
                isRequired
                value={username || ""}
                // value={cage?.code ? cage?.code : ""}
                isInvalid={errors.username ? true : false}
                errorMessage="Mã người dùng không được để trống"
                {...register("username", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Email"
                placeholder="Nhập email"
                labelPlacement="outside"
                isRequired
                value={email || ""}
                isInvalid={errors.email ? true : false}
                errorMessage="Email không được để trống"
                {...register("email", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                labelPlacement="outside"
                isRequired
                value={password || ""}
                isInvalid={errors.password ? true : false}
                errorMessage="Mật khẩu không được để trống"
                {...register("password", { required: true })}
              />
              <Select
                className="mb-2"
                radius="md"
                size="lg"
                label="Vai trò"
                placeholder="Chọn vai trò"
                labelPlacement="outside"
                isRequired
                value={roleName || ""}
                isInvalid={roleName || !touched ? false : true}
                errorMessage="Vai trò không được để trống"
                selectionMode="single"
                selectedKeys={roleName ? [roleName] : []}
                onSelectionChange={(e) => {
                  setValue("roleName", e.anchorKey);
                }}
                onClose={() => setTouched(true)}
              >
                <SelectItem key="Farmer">Chủ trang trại</SelectItem>
                <SelectItem key="Veterinarian">Bác sĩ thú y</SelectItem>
                <SelectItem key="FarmerAssistant">Nhân viên trang trại</SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button color="primary" type="submit" isDisabled={Object.keys(errors).length > 0 ? true : false} isLoading={loading}>
                {user ? "Chỉnh sửa" : "Thêm"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      ) : (
        <ModalContent>
          <ModalHeader>Xác nhận {operation === "activate" ? "kích hoạt" : "vô hiệu hóa"} người dùng</ModalHeader>
          <ModalBody>
            <p className="text-center">
              Bạn có chắc chắn muốn {operation === "activate" ? "kích hoạt" : "vô hiệu hóa"} người dùng <strong className="text-xl">{user?.username}</strong> không?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" onPress={handleUpdateUser}>
              {operation === "activate" ? "Kích hoạt" : "Vô hiệu hóa"}
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default AddEditUser;
