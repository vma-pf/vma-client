"use client";
import React, { MutableRefObject, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  DatePicker,
  DateRangePicker,
  DateValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  RangeValue,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { CalendarDate, getLocalTimeZone, parseDate, parseDateTime, today } from "@internationalized/date";
import MedicineList from "./_components/medicine-list";
import { Medicine } from "@oursrc/lib/models/medicine";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import { useToast } from "@oursrc/hooks/use-toast";
import { supplierService } from "@oursrc/lib/services/supplierService";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Supplier } from "@oursrc/lib/models/supplier";
import { BatchCreateProps } from "@oursrc/lib/models/batch";
import { v4 as uuidv4 } from "uuid";
import { Save, Trash, Trash2Icon } from "lucide-react";
import { invoiceService } from "@oursrc/lib/services/invoiceService";
import { useRouter } from "next/navigation";
import { SERVERURL } from "@oursrc/lib/http";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";

const NewBatch = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const router = useRouter();
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [isDoneAll, setIsDoneAll] = React.useState<boolean>(false);
  const [touched, setTouched] = React.useState(false);
  const [selectedBatch, setSelectedBatch] = React.useState<BatchCreateProps | undefined>(undefined);
  const [selectedMedicine, setSelectedMedicine] = React.useState<Medicine | undefined>(undefined);
  const [selectedSupplier, setSelectedSupplier] = React.useState<Supplier | undefined>(undefined);
  const [date, setDate] = React.useState<DateValue>();
  const [image, setImage] = React.useState<File | string | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [data, setData] = React.useState<{ title: string; supplierId: string }>({ title: "", supplierId: "" });

  const [batchList, setBatchList] = React.useState<BatchCreateProps[]>([
    {
      id: uuidv4(),
      medicineId: null,
      invoiceId: null,
      quantity: null,
      expiredAt: null,
    },
  ]);

  const handleQuantityChange = (event: string, batch: BatchCreateProps) => {
    setBatchList((prev) => {
      return prev.map((item) => {
        if (item.id === batch.id) {
          let numericValue = event.replace(/[^0-9]/g, "");
          if (numericValue[0] === "-") {
            numericValue = numericValue.slice(1);
          }
          if (parseInt(numericValue) > 1000000) {
            numericValue = "1000000";
          }
          return { ...item, quantity: parseInt(numericValue) };
        }
        return item;
      });
    });
  };

  const handleDateChange = (event: DateValue, batch: BatchCreateProps) => {
    setBatchList((prev) => {
      return prev.map((item) => {
        if (item.id === batch.id) {
          return { ...item, expiredAt: event.toString() };
        }
        return item;
      });
    });
  };

  const isFormFilled = (): boolean => {
    return batchList.some((batch) => !batch.quantity || !batch.expiredAt || !batch.medicineId) || !image || Object.keys(errors).length > 0;
  };

  const isAllBatchFilled = (): boolean => {
    return batchList.some((batch) => !batch.quantity || !batch.expiredAt || !batch.medicineId) || !image;
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (isFormFilled()) {
        toast({
          title: "Vui lòng điền đầy đủ thông tin cho đợt nhập thuốc",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      const jsonBatches = batchList.map((item) => ({ medicineId: item.medicineId, quantity: item.quantity, expiredAt: item.expiredAt }));
      console.log(data, jsonBatches);

      const formData = new FormData();
      formData.append("Title", data.title);
      formData.append("SupplierId", data.supplierId);
      formData.append("Images", image as Blob);
      formData.append("JsonBatches", JSON.stringify(jsonBatches));

      const response: ResponseObject<any> = await invoiceService.createInvoiceBatch(data.title, data.supplierId, image as Blob, jsonBatches);
      console.log(response);
      if (response.isSuccess) {
        toast({
          title: "Tạo đợt nhập mới thành công",
          variant: "success",
        });
        setIsDoneAll(true);
        router.push("/farm-assist/medicine");
      } else {
        console.log(response?.errorMessage);
        toast({
          title: "Tạo đợt nhập mới thất bại",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplier = async () => {
    try {
      const response: ResponseObjectList<Supplier> = await supplierService.getAllSupplier(1, 500);
      if (response.isSuccess) {
        setSuppliers(response.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedMedicine) {
      setBatchList((prev) => {
        return prev.map((item) => {
          if (item.id === selectedBatch?.id) {
            return { ...item, medicineId: selectedMedicine.id as string | null, medicine: selectedMedicine };
          }
          return item;
        });
      });
      onClose();
    }
  }, [selectedMedicine]);

  useEffect(() => {
    fetchSupplier();
  }, []);

  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {/* <div className="grid grid-cols-2 gap-3"> */}
        <div className="p-5 my-2 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <p className="text-xl font-semibold mb-3">Thông tin hóa đơn</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              className="mb-5"
              type="text"
              radius="md"
              size="lg"
              label="Nội dung hóa đơn"
              placeholder="Nhập nội dung hóa đơn"
              labelPlacement="outside"
              isRequired
              isInvalid={errors.title ? true : false}
              errorMessage="Nội dung hóa đơn không được để trống"
              // value={data.title || ""}
              // onValueChange={(event) => setData({ ...data, title: event })}
              {...register("title", { required: true })}
            />
            <Select
              label="Nhà cung cấp"
              placeholder="Chọn nhà cung cấp"
              size="lg"
              isRequired
              labelPlacement="outside"
              className="mb-5"
              radius="md"
              isInvalid={touched && !selectedSupplier}
              errorMessage="Nhà cung cấp không được để trống"
              selectionMode="single"
              selectedKeys={selectedSupplier?.id ? new Set([selectedSupplier.id]) : new Set()}
              onSelectionChange={(e) => {
                setValue("supplierId", e.anchorKey);
                setSelectedSupplier(suppliers.find((supplier) => supplier.id === e.anchorKey));
              }}
              items={suppliers}
              onClose={() => setTouched(true)}
            >
              {(item) => (
                <SelectItem color="primary" key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              )}
            </Select>
          </div>
          <p className="text-lg mb-3">Hình ảnh hóa đơn</p>
          <AttachMedia fileId="1" selectedFile={image} setSelectedFile={setImage} />
          <p className="text-xl font-semibold mb-3">Danh sách các danh mục thuốc cần nhập</p>
          {batchList.map((batch) => (
            <div key={batch.id} className="flex justify-between items-center">
              <div className="p-3 my-3 mx-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    radius="md"
                    size="lg"
                    label="Số luợng"
                    placeholder="Nhập số luợng"
                    labelPlacement="outside"
                    isRequired
                    value={batch.quantity ? batch.quantity.toString() : ""}
                    onValueChange={(event) => handleQuantityChange(event, batch)}
                    isInvalid={batch.quantity ? false : true}
                    errorMessage="Số luợng không được để trống"
                    endContent={<p className="text-lg font-semibold">{batch.medicine?.unit ?? ""}</p>}
                  />
                  <DatePicker
                    label="Ngày hết hạn"
                    radius="md"
                    size="lg"
                    labelPlacement="outside"
                    isRequired
                    isInvalid={batch.expiredAt ? false : true}
                    errorMessage="Ngày hết hạn không được để trống"
                    minValue={today(getLocalTimeZone())}
                    validationBehavior="native"
                    value={batch.expiredAt ? parseDate(batch.expiredAt.toString()) : null}
                    onChange={(event) => handleDateChange(event, batch)}
                  />
                </div>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={() => {
                    setSelectedBatch(batch);
                    onOpen();
                  }}
                >
                  Chọn thuốc
                </Button>
                {batch.medicineId && batch.medicine && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2">
                      <p>Tên thuốc:</p>
                      <p className="text-lg font-semibold">{batch.medicine?.name}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p>Đơn vị:</p>
                      <p className="text-lg font-semibold">{batch.medicine?.unit}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p>Thành phần chính:</p>
                      <p className="text-lg font-semibold">{batch.medicine?.mainIngredient}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p>Cách sử dụng:</p>
                      <p className="text-lg font-semibold">{batch.medicine?.usage}</p>
                    </div>
                  </div>
                )}
              </div>
              {batchList.length > 1 && <Trash2Icon className="ml-4 text-danger-500" onClick={() => setBatchList(batchList.filter((item) => item.id !== batch.id))} />}
              {selectedBatch?.medicineId === batch.medicineId && (
                <Modal size="5xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside" isDismissable={false}>
                  <ModalContent>
                    <ModalHeader>
                      <p className="text-xl font-semibold">Chọn thuốc</p>
                    </ModalHeader>
                    <ModalBody>
                      <MedicineList
                        selectedMedicine={batchList.find((item) => item.id === selectedBatch?.id)?.medicine || undefined}
                        setSelectedMedicine={setSelectedMedicine}
                        batchMedicineList={batchList.map((item) => item.medicine as Medicine) || []}
                      />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              )}
            </div>
          ))}
          <div className="mt-3 flex justify-end">
            <Button
              color="primary"
              variant="solid"
              onPress={() => setBatchList([...batchList, { id: uuidv4(), medicineId: null, invoiceId: null, quantity: null, expiredAt: null }])}
              isDisabled={isAllBatchFilled() ? true : false}
            >
              Thêm danh mục thuốc
            </Button>
          </div>
        </div>
        <div className="mb-5 mt-3 flex justify-end">
          <Button color="primary" type="submit" variant="solid" isDisabled={isFormFilled() || isDoneAll} isLoading={loading} endContent={<Save size={20} />}>
            Tạo đợt nhập thuốc mới
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewBatch;
