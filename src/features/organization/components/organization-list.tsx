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
import { getAuth } from "@/features/auth/queries/get-auth";
import { getOrganizationsByUser } from "../queries/get-organizations-by-user";
import { OrganizationSwitchButton } from "./organization-switch-button";
import { SubmitButton } from "@/components/form/submit-button";

const OrganizationList = async () => {
  const { user } = await getAuth();
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
          const hasActive = !!user?.activeOrganizationId;

          const isActive =
            hasActive && user.activeOrganizationId === organization.id;

          const switchButton = (
            <OrganizationSwitchButton
              organizationId={organization.id}
              trigger={
                <SubmitButton
                  icon={<LucideArrowLeftRight />}
                  label={
                    !hasActive ? "Activate" : isActive ? "Active" : "Switch"
                  }
                  variant={
                    !hasActive ? "secondary" : isActive ? "default" : "outline"
                  }
                />
              }
            />
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
