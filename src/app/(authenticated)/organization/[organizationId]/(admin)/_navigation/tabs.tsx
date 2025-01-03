"use client";

import { useParams, usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  credentialsPath,
  invitationsPath,
  membershipsPath,
  organizationsPath,
  subscriptionPath,
} from "@/paths";

const OrganizationBreadcrumbs = () => {
  const params = useParams<{ organizationId: string }>();
  const pathName = usePathname();

  const title = {
    memberships: "Memberships" as const,
    invitations: "Invitations" as const,
    credentials: "Credentials" as const,
    subscription: "Subscription" as const,
  }[
    pathName.split("/").at(-1) as
      | "memberships"
      | "invitations"
      | "credentials"
      | "subscription"
  ];

  return (
    <Breadcrumbs
      breadcrumbs={[
        { title: "Organizations", href: organizationsPath() },
        {
          title,
          dropdown: [
            {
              title: "Memberships",
              href: membershipsPath(params.organizationId),
            },
            {
              title: "Invitations",
              href: invitationsPath(params.organizationId),
            },
            {
              title: "Credentials",
              href: credentialsPath(params.organizationId),
            },
            {
              title: "Subscription",
              href: subscriptionPath(params.organizationId),
            },
          ],
        },
      ]}
    />
  );
};

export { OrganizationBreadcrumbs };
