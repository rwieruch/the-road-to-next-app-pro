import { format } from "date-fns";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
  LucideTrash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";

const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Members</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map((organization) => {
          const switchButton = (
            <Button variant="outline" size="icon">
              <LucideArrowLeftRight className="w-4 h-4" />
            </Button>
          );

          const detailButton = (
            <Button variant="outline" size="icon">
              <LucideArrowUpRightFromSquare className="w-4 h-4" />
            </Button>
          );

          const editButton = (
            <Button variant="outline" size="icon">
              <LucidePen className="w-4 h-4" />
            </Button>
          );

          const deleteButton = (
            <Button variant="destructive" size="icon">
              <LucideTrash className="w-4 h-4" />
            </Button>
          );

          const buttons = (
            <>
              {switchButton}
              {detailButton}
              {editButton}
              {deleteButton}
            </>
          );

          return (
            <TableRow key={organization.id}>
              <TableCell>{organization.id}</TableCell>
              <TableCell>{organization.name}</TableCell>
              <TableCell>
                {format(
                  organization.membershipByUser.joinedAt,
                  "yyyy-MM-dd, HH:mm"
                )}
              </TableCell>
              <TableCell>{organization._count.memberships}</TableCell>
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

export { OrganizationList };
