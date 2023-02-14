import { AuthChecker } from "type-graphql";
import { Context } from "./context.interface";

// Auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { user } }, roles) => {
  // Check user
  if (!user) {
    // No user, restrict access
    return false;
  }

  // Check '@Authorized()'
  if (roles.length === 0) {
    // Only authentication required
    return true;
  }

  // Check '@Authorized(...)' roles overlap
  return user.roles.some(role => roles.includes(role));
};
