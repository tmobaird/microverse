import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { render, screen } from "@testing-library/react-native";
import GenreList from "../screens/GenreList";

describe("GenreList", () => {
  it("renders genre avatars", () => {
    render(
      <GluestackUIProvider config={config}>
        <GenreList genres={["romance", "horror"]} />
      </GluestackUIProvider>,
    );
    expect(screen.getByLabelText("romance")).toBeTruthy();
    expect(screen.getByLabelText("horror")).toBeTruthy();
  });

  describe("when genre does not exist", () => {
    it("does not raise exception", () => {
      render(
        <GluestackUIProvider config={config}>
          <GenreList genres={["rando"]} />
        </GluestackUIProvider>,
      );
      expect(screen.queryByLabelText("rando")).toBeNull();
    });
  });
});
