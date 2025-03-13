import { format } from "date-fns";
import { LucideBan, LucideCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMemberships } from "../queries/get-memberships";
import { MembershipDeleteButton } from "./membership-delete-button";
import { MembershipMoreMenu } from "./membership-more-menu";
import { PermissionToggle } from "./permission-toggle";

type MembershipListProps = {
  organizationId: string;
};

const MembershipList = async ({ organizationId }: MembershipListProps) => {
  const memberships = await getMemberships(organizationId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Verified Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Can Delete Ticket?</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberships.map((membership) => {
          const membershipMoreMenu = (
            <MembershipMoreMenu
              userId={membership.userId}
              organizationId={membership.organizationId}
              membershipRole={membership.membershipRole}
            />
          );

          const deleteButton = (
            <MembershipDeleteButton
              organizationId={membership.organizationId}
              userId={membership.userId}
            />
          );

          const buttons = (
            <>
              {membershipMoreMenu}
              {deleteButton}
            </>
          );

          return (
            <TableRow key={membership.userId}>
              <TableCell>{membership.user.username}</TableCell>
              <TableCell>{membership.user.email}</TableCell>
              <TableCell>
                {format(membership.joinedAt, "yyyy-MM-dd, HH:mm")}
              </TableCell>
              <TableCell>
                {membership.user.emailVerified ? (
                  <LucideCheck />
                ) : (
                  <LucideBan />
                )}
              </TableCell>
              <TableCell>{membership.membershipRole}</TableCell>
              <TableCell>
                <PermissionToggle
                  userId={membership.userId}
                  organizationId={membership.organizationId}
                  permissionKey="canDeleteTicket"
                  permissionValue={membership.canDeleteTicket}
                />
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

export { MembershipList };
