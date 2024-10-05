import { Card, CardBody, Chip } from "@nextui-org/react";
import { Pig } from "@oursrc/lib/models/pig";

const PopOverPigList = ({ pigs }: any) => {
  return (
    <div>
      <div className="p-2">
        {pigs.map((x: Pig) => {
          return (
            <div key={x.id} className="mt-2 flex justify-between items-center">
              <h2 className="mr-24 truncate">{x.pigCode}</h2>
              <Chip color="success">{x.breed}</Chip>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PopOverPigList;
