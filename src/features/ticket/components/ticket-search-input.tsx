"use client";

import { useQueryState } from "nuqs";
import { SearchInput } from "@/components/search-input";
import { searchParser } from "../search-params";

type SearchInputProps = {
  placeholder: string;
};

const TicketSearchInput = ({ placeholder }: SearchInputProps) => {
  const [search, setSearch] = useQueryState("search", searchParser);

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder={placeholder}
    />
  );
};

export { TicketSearchInput };
