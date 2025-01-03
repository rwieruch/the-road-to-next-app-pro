import { format } from "date-fns";
import { Placeholder } from "@/components/placeholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCredentials } from "../queries/get-credentials";

type CredentialListProps = {
  organizationId: string;
};

const CredentialList = async ({ organizationId }: CredentialListProps) => {
  const credentials = await getCredentials(organizationId);

  if (!credentials.length) {
    return <Placeholder label="No credentials for this organization" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map((credential) => {
          const buttons = <></>; // TODO add revoke credential button

          return (
            <TableRow key={credential.id}>
              <TableCell>{credential.name}</TableCell>
              <TableCell>
                {format(credential.createdAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {credential.lastUsed
                  ? format(credential.lastUsed, "yyyy-MM-dd, HH:mm")
                  : "Never"}
              </TableCell>
              <TableCell className="flex justify-end gap-x-2">
                {buttons}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export { CredentialList };
