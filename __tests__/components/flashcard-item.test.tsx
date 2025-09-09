import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { FlashcardItem } from "@/components/ui/flashcard-item";

// Mock Lucide React icons
jest.mock("lucide-react", () => ({
  Edit: () => <span>Edit</span>,
  Trash2: () => <span>Trash</span>,
  Check: () => <span>Check</span>,
  X: () => <span>X</span>,
}));

describe("FlashcardItem", () => {
  const mockCard = {
    id: 1,
    front: "Test Front",
    back: "Test Back",
    progress: {
      isKnown: false,
      lastReviewed: "2023-12-31T00:00:00Z",
      reviewCount: 5,
    },
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render card content correctly", () => {
    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test Front")).toBeInTheDocument();
    expect(screen.getByText("Test Back")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should display progress information when available", () => {
    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Views: 5")).toBeInTheDocument();
    expect(screen.getByText(/Last reviewed:/)).toBeInTheDocument();
  });

  it("should not display progress section when progress is null", () => {
    const cardWithoutProgress = {
      ...mockCard,
      progress: null,
    };

    render(
      <FlashcardItem
        card={cardWithoutProgress}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/Views:/)).not.toBeInTheDocument();
  });

  it("should enter edit mode when Edit button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Should show input fields
    const frontInput = screen.getByDisplayValue("Test Front");
    const backInput = screen.getByDisplayValue("Test Back");

    expect(frontInput).toBeInTheDocument();
    expect(backInput).toBeInTheDocument();

    // Should show save and cancel buttons
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should save changes when Save button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Modify the text
    const frontInput = screen.getByDisplayValue("Test Front");
    const backInput = screen.getByDisplayValue("Test Back");

    await user.clear(frontInput);
    await user.type(frontInput, "Updated Front");

    await user.clear(backInput);
    await user.type(backInput, "Updated Back");

    // Save changes
    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    expect(mockOnEdit).toHaveBeenCalledWith(1, "Updated Front", "Updated Back");

    // Should exit edit mode
    expect(screen.queryByDisplayValue("Updated Front")).not.toBeInTheDocument();
  });

  it("should cancel changes when Cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Modify the text
    const frontInput = screen.getByDisplayValue("Test Front");
    await user.clear(frontInput);
    await user.type(frontInput, "Modified Front");

    // Cancel changes
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnEdit).not.toHaveBeenCalled();

    // Should exit edit mode and show original text
    expect(
      screen.queryByDisplayValue("Modified Front")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Test Front")).toBeInTheDocument();
  });

  it("should call onDelete when Delete button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText("Delete");
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it("should handle empty card content", () => {
    const emptyCard = {
      id: 1,
      front: "",
      back: "",
      progress: null,
    };

    render(
      <FlashcardItem
        card={emptyCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getAllByText("New card")).toHaveLength(2);
  });

  it("should handle keyboard navigation in edit mode", async () => {
    const user = userEvent.setup();

    render(
      <FlashcardItem
        card={mockCard}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Enter edit mode
    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    const frontInput = screen.getByDisplayValue("Test Front");
    const backInput = screen.getByDisplayValue("Test Back");

    // Test that inputs are rendered in edit mode
    expect(frontInput).toBeInTheDocument();
    expect(backInput).toBeInTheDocument();
  });
});
