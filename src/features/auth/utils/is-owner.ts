import { User as AuthUser } from "lucia";

type Entity = {
  userId: string | null;
};

export const isOwner = (
  authUser: AuthUser | null | undefined,
  entity: Entity | null | undefined
) => {
  if (!authUser || !entity) {
    return false;
  }

  if (!entity.userId) {
    return false;
  }

  if (entity.userId !== authUser.id) {
    return false;
  } else {
    return true;
  }
};
