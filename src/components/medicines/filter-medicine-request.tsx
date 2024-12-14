import { Button, Popover, PopoverContent, PopoverTrigger, Skeleton, Tab, Tabs } from "@nextui-org/react";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { TreatmentData } from "@oursrc/lib/models/treatment";
import { VaccinationData } from "@oursrc/lib/models/vaccination";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { Filter } from "lucide-react";
import React, { Key } from "react";
import { BsFillCalendarHeartFill } from "react-icons/bs";
import { TbVaccine } from "react-icons/tb";

const FilterMedicineRequest = ({
  selectedVaccination,
  setSelectedVaccination,
  selectedTreatment,
  setSelectedTreatment,
}: {
  selectedVaccination: VaccinationData | undefined;
  setSelectedVaccination: React.Dispatch<React.SetStateAction<VaccinationData | undefined>>;
  selectedTreatment: TreatmentData | undefined;
  setSelectedTreatment: React.Dispatch<React.SetStateAction<TreatmentData | undefined>>;
}) => {
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [filterBy, setFilterBy] = React.useState<Key>("vaccination");
  const [isOpenFilter, setIsOpenFilter] = React.useState(false);
  const [vaccinationList, setVaccinationList] = React.useState<VaccinationData[]>([]);
  const [treatmentList, setTreatmentList] = React.useState<TreatmentData[]>([]);
  React.useEffect(() => {
    if (isOpenFilter) {
      if (filterBy === "vaccination") {
        fetchVaccinationTreatmentData("vaccination");
      } else if (filterBy === "treatment") {
        fetchVaccinationTreatmentData("treatment");
      } else {
        console.log("all");
      }
    }
  }, [filterBy, isOpenFilter]);
  const fetchVaccinationTreatmentData = async (type: "vaccination" | "treatment") => {
    try {
      setLoading(true);
      if (type === "vaccination") {
        const res: ResponseObjectList<VaccinationData> = await vaccinationService.getAllVaccinationPlan(1, 1000);
        if (res.isSuccess) {
          setVaccinationList(res.data.data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((vaccination) => vaccination) ?? []);
        } else {
          console.log(res.errorMessage);
        }
      } else {
        const res: ResponseObjectList<TreatmentData> = await treatmentPlanService.getAll(1, 1000);
        if (res.isSuccess) {
          setTreatmentList(res.data.data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((treatment) => treatment) ?? []);
        } else {
          console.log(res.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Popover
      placement="bottom-end"
      isOpen={isOpenFilter}
      onOpenChange={(open) => {
        setIsOpenFilter(open);
      }}
      shouldBlockScroll
    >
      <PopoverTrigger>
        <Button variant="bordered" color="primary" endContent={<Filter size={20} />}>
          Lọc
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 max-h-[400px] overflow-auto">
          <Tabs
            color="primary"
            variant="solid"
            defaultSelectedKey="vacccination"
            onSelectionChange={(e) => {
              setFilterBy(e);
            }}
          >
            <Tab
              key="vaccination"
              title={
                <div className="flex items-center">
                  <TbVaccine size={20} />
                  <span className="ml-2">Lịch tiêm phòng</span>
                </div>
              }
            >
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <div key={idx} className="m-2 border-2 rounded-lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-10 w-20"></div>
                    </Skeleton>
                  </div>
                ))
              ) : vaccinationList.length <= 0 ? (
                <p>Không có dữ liệu</p>
              ) : (
                <div>
                  {vaccinationList.map((vaccination) => (
                    <div
                      key={vaccination.id}
                      className={`flex justify-between rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer active:bg-gray-200 dark:active:bg-zinc-800 ${
                        selectedVaccination?.id === vaccination.id ? "bg-emerald-200 dark:bg-emerald-500" : ""
                      }`}
                      onClick={() => {
                        if (vaccination) {
                          setSelectedVaccination(vaccination ?? undefined);
                          setIsOpenFilter(false);
                        }
                      }}
                    >
                      <p>{vaccination.title}</p>
                      {selectedVaccination?.id === vaccination.id && <span>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </Tab>
            <Tab
              key="treatment"
              title={
                <div className="flex items-center">
                  <BsFillCalendarHeartFill size={20} />
                  <span className="ml-2">Kế hoạch điều trị</span>
                </div>
              }
            >
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <div key={idx} className="m-2 border-2 rounded-lg">
                    <Skeleton className="rounded-lg">
                      <div className="h-10 w-20"></div>
                    </Skeleton>
                  </div>
                ))
              ) : treatmentList.length <= 0 ? (
                <p>Không có dữ liệu</p>
              ) : (
                <div>
                  {treatmentList.map((treatment) => (
                    <div
                      key={treatment.id}
                      className={`flex justify-between rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer active:bg-gray-200 dark:active:bg-zinc-800 ${
                        selectedTreatment?.id === treatment.id ? "bg-emerald-200 dark:bg-emerald-500" : ""
                      }`}
                      onClick={() => {
                        if (treatment) {
                          setSelectedTreatment(treatment ?? undefined);
                          setIsOpenFilter(false);
                        }
                      }}
                    >
                      <p>{treatment.title}</p>
                      {selectedTreatment?.id === treatment.id && <span>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterMedicineRequest;
