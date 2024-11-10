import { Accordion, AccordionItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { PlanTemplate } from "@oursrc/lib/models/plan-template";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { planTemplateService } from "@oursrc/lib/services/planTemplateService";
import { Plus, Trash } from "lucide-react";
import React from "react";
import { v4 } from "uuid";
import MedicineInStage from "../medicine-in-stage";

const UpdateDeleteTemplate = ({
  isOpen,
  onClose,
  operation,
  planType,
  planTemplate,
  setPlanTemplate,
}: {
  isOpen: boolean;
  onClose: () => void;
  operation: "edit" | "delete";
  planType: "vaccination" | "treatment";
  planTemplate: PlanTemplate | undefined;
  setPlanTemplate: React.Dispatch<React.SetStateAction<PlanTemplate | undefined>>;
}) => {
  // const { toast } = useToast();
  // const [newPlanTemplate, setNewPlanTemplate] = React.useState<PlanTemplate | undefined>();
  // const [selectedMedicine, setSelectedMedicine] = React.useState<any>();
  // const onStageChange = (stageTemplateId: string, key: string, value: string) => {
  //   setNewPlanTemplate(
  //     (prev) =>
  //       prev && {
  //         ...prev,
  //         stageTemplates: prev.stageTemplates.map((stageTemplate) => {
  //           if (stageTemplate.id === stageTemplateId) {
  //             return { ...stageTemplate, [key]: value };
  //           }
  //           return stageTemplate;
  //         }),
  //       }
  //   );
  // };
  // const onAddTodoInStage = (stageTemplateId: string) => {
  //   setNewPlanTemplate((prev) => {
  //     if (prev) {
  //       const newPlanTemplate = structuredClone(prev); // Create a deep copy of the previous state
  //       newPlanTemplate.stageTemplates = newPlanTemplate.stageTemplates.map((stageTemplate) => {
  //         if (stageTemplate.id === stageTemplateId) {
  //           stageTemplate.toDoTemplates.push({ id: v4(), description: "" });
  //         }
  //         return stageTemplate;
  //       });
  //       return newPlanTemplate;
  //     }
  //     return prev;
  //   });
  // };
  // const onDeleteTodoInStage = (toDoId: string) => {
  //   // Delete to do in stage
  //   setNewPlanTemplate((prev) => {
  //     if (prev) {
  //       const newPlanTemplate = { ...prev };
  //       newPlanTemplate.stageTemplates = newPlanTemplate.stageTemplates.map((stageTemplate) => {
  //         stageTemplate.toDoTemplates = stageTemplate.toDoTemplates.filter((toDoTemplate) => toDoTemplate.id !== toDoId) as [{ id: string; description: string }];
  //         return stageTemplate;
  //       });
  //       return newPlanTemplate;
  //     }
  //     return prev;
  //   });
  // };
  // const onToDoChange = (toDoId: string, stageId: string, value: string) => {
  //   const stageIndex = newPlanTemplate?.stageTemplates.findIndex((stageTemplate) => stageTemplate.id === stageId);
  //   const toDoIndex = newPlanTemplate?.stageTemplates[stageIndex ?? 0].toDoTemplates.findIndex((toDoTemplate) => toDoTemplate.id === toDoId);
  //   if (stageIndex !== undefined && toDoIndex !== undefined) {
  //     setNewPlanTemplate((prev) => {
  //       if (prev) {
  //         const newPlanTemplate = structuredClone(prev); // Create a deep copy of the previous state
  //         newPlanTemplate.stageTemplates[stageIndex].toDoTemplates[toDoIndex].description = value;
  //         return newPlanTemplate;
  //       }
  //       return prev;
  //     });
  //   }
  // };
  // const isAllFieldsFilled = () => {
  //   return newPlanTemplate?.stageTemplates.every((stageTemplate) => {
  //     return stageTemplate.title && stageTemplate.timeSpan && stageTemplate.toDoTemplates.every((toDoTemplate) => toDoTemplate.description);
  //   });
  // };
  // const handleUpdateTemplate = async () => {
  //   try {
  //     if (newPlanTemplate) {
  //       delete newPlanTemplate.treatmentGuide;
  //       delete newPlanTemplate.treatmentGuideId;
  //       const newPlanTemplateCopy = structuredClone(newPlanTemplate);
  //       newPlanTemplateCopy.stageTemplates = newPlanTemplateCopy.stageTemplates.map((stageTemplate) => {
  //         // compare stageTemplate.toDoTemplates with planTemplate.stageTemplates.toDoTemplates to get the new toDoTemplates
  //         const oldStageTemplate = planTemplate?.stageTemplates.find((oldStageTemplate) => oldStageTemplate.id === stageTemplate.id);
  //         if (oldStageTemplate) {
  //           stageTemplate.toDoTemplates = stageTemplate.toDoTemplates.map((toDoTemplate) => {
  //             const oldToDoTemplate = oldStageTemplate.toDoTemplates.find((oldToDoTemplate) => oldToDoTemplate.id === toDoTemplate.id);
  //             if (oldToDoTemplate) {
  //               return { ...toDoTemplate, id: oldToDoTemplate.id };
  //             }
  //             return { ...toDoTemplate, id: null };
  //           });
  //         }
  //         return stageTemplate;
  //       });
  //       console.log("newPlanTemplateCopy", newPlanTemplateCopy);
  //       // const res: ResponseObject<PlanTemplate> = await planTemplateService.updatePlanTemplate(newPlanTemplate.id, newPlanTemplate);
  //       // if (res.isSuccess) {
  //       //   setPlanTemplate(res.data);
  //       //   onClose();
  //       //   setNewPlanTemplate(undefined);
  //       //   toast({ title: "Cập nhật mẫu thành công", variant: "success" });
  //       // } else {
  //       //   toast({ title: res.errorMessage ?? "Có lỗi xảy ra", variant: "destructive" });
  //       //   console.log(res.errorMessage);
  //       // }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // React.useEffect(() => {
  //   if (isOpen) {
  //     setNewPlanTemplate(planTemplate);
  //     setSelectedMedicine(planTemplate?.stageTemplates[0].medicineTemplates);
  //   }
  // }, [isOpen, planTemplate]);
  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     size={operation === "delete" ? "sm" : "full"}
  //     hideCloseButton
  //     scrollBehavior="inside"
  //     classNames={{
  //       wrapper: "w-full h-fit",
  //     }}
  //   >
  //     {operation === "edit" ? (
  //       <ModalContent>
  //         <ModalHeader>
  //           <p className="text-2xl font-bold">{planType === "vaccination" ? "Chỉnh sửa lịch tiêm phòng" : "Chỉnh sửa lịch điều trị"}</p>
  //         </ModalHeader>
  //         <ModalBody>
  //           {newPlanTemplate && (
  //             <div>
  //               <Input
  //                 className="mb-3"
  //                 label="Tên mẫu"
  //                 value={newPlanTemplate.name ?? ""}
  //                 onValueChange={(value) => setNewPlanTemplate({ ...newPlanTemplate, name: value })}
  //               />
  //               <Accordion variant="splitted">
  //                 {newPlanTemplate &&
  //                   newPlanTemplate.stageTemplates
  //                     .sort((a, b) => a.numberOfDays - b.numberOfDays)
  //                     .map((stageTemplate, index) => (
  //                       <AccordionItem
  //                         key={stageTemplate.id}
  //                         title={`Giai đoạn ${index + 1}`}
  //                         startContent={
  //                           newPlanTemplate.stageTemplates.length > 1 && (
  //                             <Button
  //                               isIconOnly
  //                               color="danger"
  //                               size="sm"
  //                               onClick={() =>
  //                                 setNewPlanTemplate((prev) => prev && { ...prev, stageTemplates: prev.stageTemplates.filter((stage) => stage.id !== stageTemplate.id) })
  //                               }
  //                             >
  //                               <Trash size={20} color="#ffffff" />
  //                             </Button>
  //                           )
  //                         }
  //                       >
  //                         <div className="grid grid-cols-3 gap-2">
  //                           <Input
  //                             className="col-span-1"
  //                             label="Tên giai đoạn"
  //                             value={stageTemplate.title ?? ""}
  //                             onValueChange={(value) => onStageChange(stageTemplate.id, "title", value)}
  //                           />
  //                           <Input
  //                             className="col-span-1"
  //                             label="Số ngày thực hiện"
  //                             value={stageTemplate.timeSpan}
  //                             onValueChange={(value) => onStageChange(stageTemplate.id, "timeSpan", value)}
  //                           />
  //                           <Input
  //                             className="col-span-1"
  //                             label="Khoảng cách (kể từ ngày bắt đầu)"
  //                             value={stageTemplate.numberOfDays.toString()}
  //                             isDisabled={stageTemplate.numberOfDays === 0}
  //                             onValueChange={(value) => onStageChange(stageTemplate.id, "numberOfDays", value)}
  //                           />
  //                         </div>
  //                         <div>
  //                           {stageTemplate.toDoTemplates.map((toDoTemplate, index) => (
  //                             <div className="grid grid-cols-12 gap-2" key={toDoTemplate.id}>
  //                               <Input
  //                                 className="my-2 col-span-10"
  //                                 label={`Công việc ${index + 1}`}
  //                                 value={toDoTemplate.description}
  //                                 onValueChange={(value) => toDoTemplate.id && onToDoChange(toDoTemplate.id, stageTemplate.id, value)}
  //                               />
  //                               <div className="flex gap-2 my-auto">
  //                                 {stageTemplate.toDoTemplates && stageTemplate.toDoTemplates.length > 1 && (
  //                                   <Button isIconOnly color="danger" size="sm" onClick={() => toDoTemplate.id && onDeleteTodoInStage(toDoTemplate.id)}>
  //                                     <Trash size={20} color="#ffffff" />
  //                                   </Button>
  //                                 )}
  //                                 {toDoTemplate.id === stageTemplate.toDoTemplates[stageTemplate.toDoTemplates.length - 1].id && (
  //                                   <Button isIconOnly color="primary" size="sm" onClick={() => onAddTodoInStage(stageTemplate.id)}>
  //                                     <Plus size={20} color="#ffffff" />
  //                                   </Button>
  //                                 )}
  //                               </div>
  //                             </div>
  //                           ))}
  //                         </div>
  //                         <div>{stageTemplate && <MedicineInStage template={stageTemplate} setTemplate={setNewPlanTemplate} />}</div>
  //                       </AccordionItem>
  //                     ))}
  //               </Accordion>
  //             </div>
  //           )}
  //         </ModalBody>
  //         <ModalFooter>
  //           <Button
  //             color="danger"
  //             variant="solid"
  //             onPress={() => {
  //               onClose();
  //               setNewPlanTemplate(undefined);
  //             }}
  //           >
  //             Hủy
  //           </Button>
  //           <Button color="primary" variant="solid" isDisabled={!isAllFieldsFilled()} onPress={handleUpdateTemplate}>
  //             {operation === "edit" ? "Lưu" : "Xóa"}
  //           </Button>
  //         </ModalFooter>
  //       </ModalContent>
  //     ) : (
  //       <ModalContent>
  //         <ModalHeader>
  //           <p className="text-xl font-bold">Xác nhận xóa mẫu {planType === "vaccination" ? "tiêm phòng" : "điều trị"}</p>
  //         </ModalHeader>
  //         <ModalBody>
  //           <p className="text-center">
  //             Bạn có chắc chắn muốn xóa mẫu <strong>{newPlanTemplate?.name}</strong> không?
  //           </p>
  //         </ModalBody>
  //         <ModalFooter>
  //           <Button color="danger" variant="solid" onPress={onClose}>
  //             Hủy
  //           </Button>
  //           <Button color="primary" variant="solid">
  //             Xóa
  //           </Button>
  //         </ModalFooter>
  //       </ModalContent>
  //     )}
  //   </Modal>
  // );
};

export default UpdateDeleteTemplate;
