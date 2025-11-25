import { api, getErrorMessage } from "./api";
import { User } from "@/types";

// NEED to implement this on the backend
export const userApi = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    // const response = await api("/api/users/me", {
    //   method: "PATCH",
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   throw new Error(await getErrorMessage(response));
    // }

	// this is only to simulate the successful api call
    const demo = await new Promise((resolve) =>
      setTimeout(
        () => resolve({ id: 1, username: "test", email: "test@test.com" }),
        1000
      )
    );

	// this is only to simulate the failed api call
	// const demo = await new Promise((_, reject) =>
	// 	setTimeout(
	// 	  () => reject(new Error("Failed to update profile")),
	// 	  1000
	// 	)
	//   );
    return demo as User;
    // return response.json();
  },
};
