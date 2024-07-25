import { MantineProvider } from "@mantine/core";
// ./test-utils/render.tsx
import { render as testingLibraryRender } from "@testing-library/react";
// Import your theme object
import { theme } from "~/theme";

export function render(ui: React.ReactNode) {
	// biome-ignore lint/complexity/noUselessFragments: <explanation>
	return testingLibraryRender(<>{ui}</>, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<MantineProvider theme={theme}>{children}</MantineProvider>
		),
	});
}
