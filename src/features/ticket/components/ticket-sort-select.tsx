"use client";

import { useQueryStates } from "nuqs";
import { SortSelect, SortSelectOption } from "@/components/sort-select";
import { sortOptions, sortParser } from "../search-params";

type TicketSortSelectProps = {
  options: SortSelectOption[];
};

const TicketSortSelect = ({ options }: TicketSortSelectProps) => {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);

  return <SortSelect value={sort} onChange={setSort} options={options} />;
};

export { TicketSortSelect };
