import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Hive from "@/types/Hive";

type OperationTypesDialogProps = {
  operationTypes: Hive.OperationPattern[];
  triggerTitle: string;
  selectedOperations: number[];
  colorClass: string;
  setSelectedOperations: (operationIds: number[]) => void;
};

const OperationTypesDialog: React.FC<OperationTypesDialogProps> = ({
  operationTypes,
  triggerTitle,
  selectedOperations,
  colorClass,
  setSelectedOperations,
}) => {
  const [selectedOperationsIds, setSelectedOperationsIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onFiltersSelect = (id: number) => {
    if (selectedOperationsIds.includes(id)) {
      setSelectedOperationsIds(
        selectedOperationsIds.filter((operationId) => operationId !== id)
      );
    } else {
      setSelectedOperationsIds([...selectedOperationsIds, id]);
    }
  };

  const handleOnSubmit = () => {
    setSelectedOperations(selectedOperationsIds);
    onOpenChange(false)
  };

  const handleOnClear = () => {
    setSelectedOperationsIds([]);
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setSelectedOperationsIds(selectedOperations);
    }
    setIsOpen(open);
  }

  const renderOperation = (operation: Hive.OperationPattern) => {
    return (
      <li
        onClick={() => onFiltersSelect(operation.op_type_id)}
        key={operation.op_type_id}
        className="col-span-3 pl-2 md:col-span-1 flex items-center font-bold text-base rounded-lg bg-inherit hover:border-2-gray group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white "
      >
        <Input
          type="checkbox"
          checked={selectedOperationsIds.includes(operation.op_type_id)}
          name="bordered-checkbox"
          className=" w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 "
          onChange={() => onFiltersSelect(operation.op_type_id)}
        />
        <Label
          htmlFor="bordered-checkbox-1"
          className="p-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {operation.operation_name}
        </Label>
      </li>
    )
  }

  const virtualOperations = operationTypes.filter((operationType) => operationType.is_virtual);
  const nonVirtualOperations = operationTypes.filter((operationType) => !operationType.is_virtual);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {onOpenChange(open)}}>
      <DialogTrigger asChild>
        <Button className={ `${colorClass}  text-white hover:bg-gray-700 rounded-[4px]`}>
          {triggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%] h-[80%] flex-column justify-center align-center  bg-white text-black ">
        <DialogHeader>
          <DialogTitle className="flex justify-center pt-2">Operation Types</DialogTitle>
        </DialogHeader>
      <div className="overflow-auto">

        <ul className="my-4 grid grid-cols-3 gap-4 place-items-stretch text-white ">
          {nonVirtualOperations.map((operation) => renderOperation(operation))}
        </ul>
        <div className="text-center mt-8">Virtual operations</div>
        <ul className="my-4 grid grid-cols-3 gap-4 place-items-stretch text-white ">
          {virtualOperations.map((operation) => renderOperation(operation))}
        </ul>
      </div>
        <DialogFooter>
          <div className="flex">
          <Button type="button" variant='secondary' onClick={() => {onOpenChange(false)}}>
              Cancel
            </Button>
            <Button type="button" variant='secondary' onClick={handleOnClear}>
              Clear
            </Button>
            <Button className="bg-blue-800 hover:bg-blue-600 text-white rounded" type="submit" variant='default' onClick={handleOnSubmit}>
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OperationTypesDialog;
