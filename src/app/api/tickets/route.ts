import { getTickets } from "@/features/ticket/queries/get-tickets";
import { searchParamsCache } from "@/features/ticket/search-params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const untypedSearchParams = Object.fromEntries(searchParams);
  const typedSearchParams = searchParamsCache.parse(untypedSearchParams);

  const { list, metadata } = await getTickets(undefined, typedSearchParams);

  return Response.json({ list, metadata });
}
