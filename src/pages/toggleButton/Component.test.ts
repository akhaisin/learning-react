/* eslint-disable @typescript-eslint/no-explicit-any */
export function runTests({ describe, it, expect, render, fireEvent }: any) {
  describe("Toggle Button Exercise", () => {
    it("renders the button initially with OFF label", () => {
      const { getByText } = render();
      const button = getByText("OFF");
      expect(button).toBeInTheDocument();
      expect(button.className).toContain("toggle");
      expect(button.className).toContain("off");
    });

    it("toggles label and class name on click", () => {
      const { getByText } = render();
      const button = getByText("OFF");

      // Click to toggle ON
      fireEvent.click(button);
      expect(button.textContent).toContain("ON");
      expect(button.className).toContain("on");
      expect(button.className).not.toContain("off");

      // Click to toggle OFF again
      fireEvent.click(button);
      expect(button.textContent).toContain("OFF");
      expect(button.className).toContain("off");
      expect(button.className).not.toContain("on");
    });
  });
}

export default runTests;
