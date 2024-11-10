import { Accordion, AccordionItem, Button, Input, Tooltip } from "@nextui-org/react";
import { VaccinationTemplate } from "@oursrc/lib/models/plan-template";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { planTemplateService } from "@oursrc/lib/services/planTemplateService";
import { Trash } from "lucide-react";
import React from "react";

const VaccinationTemplateList = () => {
  const [templates, setTemplates] = React.useState<VaccinationTemplate[]>([]);
  React.useEffect(() => {
    fetchTemplates();
  }, []);
  const fetchTemplates = async () => {
    try {
      const res: ResponseObjectList<VaccinationTemplate> = await planTemplateService.getVaccinationPlanTemplate(1, 500);
      if (res.isSuccess) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Accordion defaultExpandedKeys={["0"]} variant="splitted">
        {templates.map((template, index: number) => {
          return (
            <AccordionItem
              key={index}
              title={template.name}
              startContent={
                <div className="flex flex-row items-start mr-2">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    {templates.length > 1 && (
                      <Tooltip color="danger" content="Xóa giai đoạn">
                        <Button isIconOnly color="danger" size="sm">
                          <Trash size={20} color="#ffffff" />
                        </Button>
                      </Tooltip>
                    )}
                  </span>
                </div>
              }
            >
              {template.name}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
export default VaccinationTemplateList;
