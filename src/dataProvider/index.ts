import dataProvider from "./provider";
import { authProvider, UserIdentity } from "~/authProvider";

// const API_URL = "https://api.nestjsx-crud.refine.dev";
const API_URL =
  "https://api-dev.jabberbrain.com";

export default dataProvider({
  apiUrl: API_URL,
  getAuthorization: async () => {
    const user = authProvider.getIdentity?.();
    if (user) {
      const identity = (await user) as UserIdentity | undefined;
      if (identity) return `Bearer ${identity.access_token}`;
    }
  }
});
