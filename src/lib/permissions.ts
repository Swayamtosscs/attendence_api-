import { SessionUser } from "./current-user";

export function assertAuthenticated(user: SessionUser | null): asserts user {
  if (!user) {
    throw new Error("Unauthorized");
  }
}

export function assertRole(
  user: SessionUser | null,
  allowedRoles: SessionUser["role"][]
): asserts user {
  assertAuthenticated(user);
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}



