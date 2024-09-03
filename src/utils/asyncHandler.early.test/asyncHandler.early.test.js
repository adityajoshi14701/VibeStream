// Unit tests for: asyncHandler

import { asyncHandler } from "../asyncHandler";

describe("asyncHandler() asyncHandler method", () => {
  // Mock objects for req, res, and next
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // Happy Path Tests
  describe("Happy Path", () => {
    it("should call the request handler and not call next if no error occurs", async () => {
      // Arrange
      const requestHandler = jest.fn().mockResolvedValue("success");
      const wrappedHandler = asyncHandler(requestHandler);

      // Act
      await wrappedHandler(req, res, next);

      // Assert
      expect(requestHandler).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should call next with an error if the request handler throws an error", async () => {
      // Arrange
      const error = new Error("Test error");
      const requestHandler = jest.fn().mockRejectedValue(error);
      const wrappedHandler = asyncHandler(requestHandler);

      // Act
      await wrappedHandler(req, res, next);

      // Assert
      expect(requestHandler).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle synchronous errors thrown by the request handler", async () => {
      // Arrange
      const error = new Error("Synchronous error");
      const requestHandler = jest.fn(() => {
        throw error;
      });
      const wrappedHandler = asyncHandler(requestHandler);

      // Act
      await wrappedHandler(req, res, next);

      // Assert
      expect(requestHandler).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle cases where request handler returns a non-promise value", async () => {
      // Arrange
      const requestHandler = jest.fn().mockReturnValue("non-promise value");
      const wrappedHandler = asyncHandler(requestHandler);

      // Act
      await wrappedHandler(req, res, next);

      // Assert
      expect(requestHandler).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: asyncHandler
