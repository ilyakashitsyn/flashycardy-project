import { describe, it, expect } from "@jest/globals";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      const result = cn("class1", "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", true && "conditional", false && "hidden");
      expect(result).toBe("base conditional");
    });

    it("should handle undefined and null values", () => {
      const result = cn("base", undefined, null, "valid");
      expect(result).toBe("base valid");
    });

    it("should merge conflicting Tailwind classes", () => {
      const result = cn("p-2", "p-4");
      expect(result).toBe("p-4");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should handle objects with boolean values", () => {
      const result = cn({
        active: true,
        disabled: false,
        hidden: true,
      });
      expect(result).toBe("active hidden");
    });

    it("should handle complex combinations", () => {
      const result = cn(
        "base-class",
        {
          "conditional-true": true,
          "conditional-false": false,
        },
        ["array-class1", "array-class2"],
        "simple-class"
      );
      expect(result).toBe(
        "base-class conditional-true array-class1 array-class2 simple-class"
      );
    });

    it("should resolve Tailwind conflicts correctly", () => {
      // Test margin conflicts
      const marginResult = cn("m-2", "m-4", "mx-6");
      expect(marginResult).toBe("m-4 mx-6");

      // Test color conflicts
      const colorResult = cn("text-red-500", "text-blue-500");
      expect(colorResult).toBe("text-blue-500");
    });

    it("should preserve non-conflicting classes", () => {
      const result = cn(
        "p-4",
        "text-center",
        "bg-blue-500",
        "hover:bg-blue-600"
      );
      expect(result).toBe("p-4 text-center bg-blue-500 hover:bg-blue-600");
    });
  });
});
