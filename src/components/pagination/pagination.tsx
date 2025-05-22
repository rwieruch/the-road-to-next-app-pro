import { useTransition } from "react";
import { PaginatedData } from "@/types/pagination";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PAGE_SIZES } from "./constants";

type PageAndSize = {
  page: number;
  size: number;
};

type PaginationProps = {
  pagination: PageAndSize;
  onPagination: (pagination: PageAndSize) => void;
  paginatedMetadata: PaginatedData<unknown>["metadata"];
};

const Pagination = ({
  pagination,
  onPagination,
  paginatedMetadata: { count, hasNextPage },
}: PaginationProps) => {
  const startOffset = pagination.page * pagination.size + 1;
  const endOffset = startOffset - 1 + pagination.size;
  const actualEndOffset = Math.min(endOffset, count);

  const label = `${startOffset}-${actualEndOffset} of ${count}`;

  const [isPending, startTransition] = useTransition();

  const handlePreviousPage = () => {
    startTransition(() => {
      onPagination({ ...pagination, page: pagination.page - 1 });
    });
  };

  const handleNextPage = () => {
    startTransition(() => {
      onPagination({ ...pagination, page: pagination.page + 1 });
    });
  };

  const handleChangeSize = (size: string) => {
    startTransition(() => {
      onPagination({ page: 0, size: parseInt(size) });
    });
  };

  const previousButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={pagination.page < 1 || isPending}
      onClick={handlePreviousPage}
    >
      Previous
    </Button>
  );

  const nextButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={!hasNextPage || isPending}
      onClick={handleNextPage}
    >
      Next
    </Button>
  );

  const sizeButton = (
    <Select
      onValueChange={handleChangeSize}
      defaultValue={pagination.size.toString()}
    >
      <SelectTrigger className="h-[36px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZES.map((size) => (
          <SelectItem key={size} value={size.toString()}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-x-2">
        {sizeButton}
        {previousButton}
        {nextButton}
      </div>
    </div>
  );
};

export { Pagination };
