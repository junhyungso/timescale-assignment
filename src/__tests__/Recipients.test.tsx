import { render, screen, fireEvent } from "@testing-library/react";
import Recipients from "../components/Recipients/Recipients";

jest.mock("../assets/recipientsData.json", () => [
  { email: "ann@timescale.com", isSelected: false },
  { email: "bob@timescale.com", isSelected: false },
  { email: "jane@awesome.com", isSelected: true },
  {
    email: "brian@qwerty.com",
    isSelected: true,
  },
  {
    email: "katie@qwerty.com",
    isSelected: true,
  },
]);

describe("Recipients Component", () => {
  beforeEach(() => {
    render(<Recipients />);
  });

  test("renders Recipients component", () => {
    expect(screen.getByText("Available recipients")).toBeInTheDocument();
    expect(screen.getByText("Selected recipients")).toBeInTheDocument();
    expect(screen.getByText("ann@timescale.com")).toBeInTheDocument();
  });

  test("adds a new recipient when enter key is pressed", () => {
    const searchInput = screen.getByLabelText("search");

    fireEvent.change(searchInput, { target: { value: "hi@hi.com" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

    expect(screen.getByText("hi@hi.com")).toBeInTheDocument();
  });

  test("moves recipient to selected list on click", () => {
    const availableRecipient = screen.getByText("ann@timescale.com");
    fireEvent.click(availableRecipient);

    expect(screen.queryByText("ann@timescale.com")).not.toBeInTheDocument();
  });

  test("removes recipient from selected list on click", () => {
    const individualToggle = screen.getByTestId("expand-arrow");
    fireEvent.click(individualToggle);

    const selectedRecipient = screen.getByText("jane@awesome.com");
    fireEvent.click(selectedRecipient);

    expect(screen.queryByText("jane@awesome.com")).not.toBeInTheDocument();
  });
});
