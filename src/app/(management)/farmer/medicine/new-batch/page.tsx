"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button, DateRangePicker, Input, Radio, RadioGroup, RangeValue, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import MedicineList from "./_components/medicine-list";
import { Medicine } from "@oursrc/lib/models/medicine";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import { useToast } from "@oursrc/hooks/use-toast";

const NewBatch = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<string>("1");
  const [selectedMedicine, setSelectedMedicine] = React.useState<Medicine | undefined>(undefined);
  const [registerNumber, setRegisterNumber] = React.useState<string | undefined>(undefined);
  const [quantity, setQuantity] = React.useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)),
  });
  const [image, setImage] = React.useState<File | string | undefined>(undefined);

  const handleRegisterNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    // if (parseInt(numericValue) > 10000) {
    //   numericValue = "10000";
    // }
    setRegisterNumber(numericValue);
  };

  const handleQuantityChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 1000000) {
      numericValue = "1000000";
    }
    setQuantity(numericValue);
  };

  const handleDateChange = (event: RangeValue<CalendarDate>) => {
    setDateRange({
      start: event.start,
      end: event.end,
    });
  };

  const isFormFilled = (): boolean => {
    if (selected === "1") {
      return (
        !selectedMedicine ||
        !!errors.batchName ||
        !!errors.quantity ||
        dateRange.end <= dateRange.start ||
        image === undefined ||
        !!errors.title ||
        !!errors.supplierName ||
        !!errors.supplierAddress
      );
    } else {
      return (
        !!errors.title ||
        !!errors.supplierName ||
        !!errors.supplierAddress ||
        !!errors.batchName ||
        !!errors.quantity ||
        !!errors.registerNumber ||
        !!errors.netWeight ||
        !!errors.unit ||
        !!errors.mainIngredient ||
        !!errors.usage ||
        dateRange.end <= dateRange.start ||
        image === undefined
      );
    }
  };

  const handleSubmitForm = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("formFile", image as Blob);
      console.log(formData.get("formFile"));
      // const img = await fetch("http://35.198.240.3:10000/test-upload-file", {
      //   method: "POST",
      //   body: formData,
      // });
      // console.log(img.json());
      if (selected === "1") {
        // create batch with medicine
        const payload = {
          title: data.title,
          supplierName: data.supplierName,
          supplierAddress: data.supplierAddress,
          batchName: data.batchName,
          quantity: data.quantity,
          startDate: new Date(dateRange.start.toString()).toISOString(),
          endDate: new Date(dateRange.end.toString()).toISOString(),
          image: formData,
          medicineId: selectedMedicine?.id,
        };
        console.log(JSON.stringify(payload));
      } else {
        // create batch with new medicine
        const payload = {
          title: data.title,
          supplierName: data.supplierName,
          supplierAddress: data.supplierAddress,
          batchName: data.batchName,
          quantity: data.quantity,
          startDate: new Date(dateRange.start.toString()).toISOString(),
          endDate: new Date(dateRange.end.toString()).toISOString(),
          image: formData,
          medicine: {
            name: data.medicineName,
            registerNumber: data.registerNumber,
            netWeight: data.netWeight,
            unit: data.unit,
            mainIngredient: data.mainIngredient,
            usage: data.usage,
          },
        };
        console.log(JSON.stringify(payload));
      }
    } catch (error) {
      toast({
        title: "Tạo lô mới thất bại",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("registerNumber", registerNumber);
  }, [registerNumber]);
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 my-2 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-xl font-semibold mb-3">Thông tin hóa đơn</p>
            <div className="grid grid-cols-1 gap-2">
              <Input
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Nội dung hóa đơn"
                placeholder="Nhập nội dung hóa đơn"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.title && true}
                errorMessage="Nội dung hóa đơn không được để trống"
                {...register("title", { required: true })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Nhà cung cấp"
                placeholder="Nhập tên nhà cung cấp"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.supplierName && true}
                errorMessage="Tên nhà cung cấp không được để trống"
                {...register("supplierName", { required: true })}
              />
              <Input
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Địa chỉ nhà cung cấp"
                placeholder="Nhập địa chỉ nhà cung cấp"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.supplierAddress && true}
                errorMessage="Địa chỉ nhà cung cấp không được để trống"
                {...register("supplierAddress", { required: true })}
              />
            </div>
            <p className="text-lg mb-3">Hình ảnh hóa đơn</p>
            <AttachMedia fileId="1" selectedFile={image} setSelectedFile={setImage} />
          </div>
          <div className="p-5 my-2 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-xl font-semibold mb-3">Thông tin lô</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Tên lô"
                placeholder="Nhập tên lô"
                labelPlacement="outside"
                isRequired
                // value={name || ""}
                isInvalid={errors.batchName && true}
                errorMessage="Tên lô không được để trống"
                {...register("batchName", { required: true })}
              />
              <Input
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Số luợng"
                placeholder="Nhập số luợng"
                labelPlacement="outside"
                isRequired
                value={quantity || ""}
                onValueChange={(event) => handleQuantityChange(event)}
                isInvalid={errors.netWeight && true}
                errorMessage="Số luợng không được để trống"
                {...register("quantity", { required: true, valueAsNumber: true })}
              />
            </div>
            <DateRangePicker
              label="Ngày sản xuất - Hạn sử dụng"
              radius="md"
              size="lg"
              labelPlacement="outside"
              isRequired
              isInvalid={dateRange.end <= dateRange.start ? true : false}
              errorMessage="Vui lòng nhập đúng ngày bắt đầu - ngày kết thúc"
              minValue={today(getLocalTimeZone())}
              validationBehavior="native"
              value={dateRange || ""}
              onChange={(event) => {
                handleDateChange(event);
              }}
            />
          </div>
        </div>
        <div className="mb-2 mt-5 flex">
          <RadioGroup
            onValueChange={(value: string) => {
              setSelected(value);
              if (value === "2") {
                setSelectedMedicine(undefined);
              } else if (value === "1") {
                setValue("medicineName", "");
                setValue("registerNumber", "");
                setValue("netWeight", "");
                setValue("unit", "");
                setValue("mainIngredient", "");
                setValue("usage", "");
              }
            }}
            value={selected}
            label={<p className="text-2xl text-black dark:text-white font-bold">Chọn loại thuốc</p>}
            className="w-[350px] mr-2"
          >
            <Radio
              className="inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[400px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent
          data-[selected=true]:border-primary"
              value="1"
            >
              Thuốc có sẵn trong kho
            </Radio>
            <Radio
              className="inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between
          flex-row-reverse max-w-[400px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent
          data-[selected=true]:border-primary"
              value="2"
            >
              Thuốc mới
            </Radio>
          </RadioGroup>
          {selected === "1" && (
            <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
              <p className="text-xl font-semibold mb-3">Danh sách thuốc trong kho</p>
              <MedicineList selectedMedicine={selectedMedicine || undefined} setSelectedMedicine={setSelectedMedicine} />
            </div>
          )}
          {selected === "2" && (
            <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
              <p className="text-xl font-semibold mb-3">Nhập thông tin thuốc mới</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Tên thuốc"
                  placeholder="Nhập tên thuốc"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={errors.medicineName ? true : false}
                  errorMessage="Tên thuốc không được để trống"
                  {...register("medicineName", { required: true })}
                />
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Số đăng ký"
                  placeholder="Nhập số đăng ký"
                  labelPlacement="outside"
                  isRequired
                  value={registerNumber || ""}
                  onValueChange={(event) => handleRegisterNumberChange(event)}
                  isInvalid={errors.registerNumber ? true : false}
                  errorMessage="Số đăng ký không được để trống"
                  {...register("registerNumber", { required: true, valueAsNumber: true })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Trọng lượng"
                  placeholder="Nhập trọng lượng"
                  labelPlacement="outside"
                  isRequired
                  // value={netWeight || ""}
                  // onValueChange={(event) => handleNetWeightChange(event)}
                  isInvalid={errors.netWeight && true}
                  errorMessage="Trọng lượng không được để trống"
                  {...register("netWeight", { required: true })}
                />
                <Input
                  className="mb-5"
                  type="text"
                  radius="md"
                  size="lg"
                  label="Đơn vị"
                  placeholder="Nhập đơn vị"
                  labelPlacement="outside"
                  isRequired
                  // value={unit || ""}
                  isInvalid={errors.unit && true}
                  {...register("unit", { required: true })}
                />
              </div>
              <Textarea
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Thành phần chính"
                placeholder="Nhập thành phần chính"
                labelPlacement="outside"
                isRequired
                // value={mainIngredient || ""}
                isInvalid={errors.mainIngredient && true}
                errorMessage="Thành phần chính không được để trống"
                {...register("mainIngredient", { required: true })}
              />
              <Textarea
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Cách sử dụng"
                placeholder="Nhập cách sử dụng"
                labelPlacement="outside"
                isRequired
                // value={usage || ""}
                isInvalid={errors.usage && true}
                errorMessage="Cách sử dụng không được để trống"
                {...register("usage", { required: true })}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button color="primary" variant="solid" type="submit" size="lg" isDisabled={isFormFilled()}>
            Tạo lô mới
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewBatch;
