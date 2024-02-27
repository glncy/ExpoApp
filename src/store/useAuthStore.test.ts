import { useAuthStore } from "@/src/store/useAuthStore";

describe("useAuthStore", () => {
  const initialStore = useAuthStore.getState();

  beforeEach(() => {
    useAuthStore.setState(initialStore, true);
  });

  it("can set accessToken", () => {
    useAuthStore.getState().setAccessToken("token");
    expect(useAuthStore.getState().accessToken).toBe(true);
  });
});
