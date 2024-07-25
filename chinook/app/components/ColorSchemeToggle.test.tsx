import { fireEvent, render, screen } from "test-utils";
import { describe, expect, it, vi } from "vitest";

import { useMantineColorScheme } from "@mantine/core";
import { ColorSchemeToggle } from "./ColorSchemeToggle";

// Mock useMantineColorScheme
const setColorScheme = vi.fn();
vi.mock("@mantine/core", async (importOriginal) => {
	const actual = await importOriginal();
	const useMantineColorScheme = vi
		.fn()
		.mockImplementation(() => ({ setColorScheme }));
	// @ts-ignore
	return { ...actual, useMantineColorScheme };
});

describe("ColorSchemeToggle", () => {
	it("toggles color scheme correctly", () => {
		render(<ColorSchemeToggle />);

		const lightButton = screen.getByRole("button", { name: "Light" });
		const darkButton = screen.getByRole("button", { name: "Dark" });
		const autoButton = screen.getByRole("button", { name: "Auto" });

		fireEvent.click(lightButton);
		expect(setColorScheme).toHaveBeenCalledWith("light");

		fireEvent.click(darkButton);
		expect(setColorScheme).toHaveBeenCalledWith("dark");

		fireEvent.click(autoButton);
		expect(setColorScheme).toHaveBeenCalledWith("auto");
	});
});
