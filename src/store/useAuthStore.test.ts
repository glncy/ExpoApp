import { faker } from "@faker-js/faker";

import { useAuthStore } from "@/src/store/useAuthStore";

describe("useAuthStore", () => {
  const initialStore = useAuthStore.getState();

  beforeEach(() => {
    useAuthStore.setState(initialStore, true);
  });

  it("test setAccessToken function", () => {
    const fakeValue = faker.string.nanoid();
    useAuthStore.getState().setAccessToken(fakeValue);
    expect(useAuthStore.getState().accessToken).toBe(fakeValue);
  });
});
