import { json } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "test-utils";
import { describe, it, vi } from "vitest";
import Index from "~/routes/_index";

describe("Home Page", () => {
	const RemixStub = createRemixStub([
		{
			path: "/",
			Component: Index,
			loader() {
				return json({ message: "hello from loader" });
			},
		},
	]);
	render(<RemixStub />);
	it("should render Welcome to Remix", async () => {
		await waitFor(() => screen.getByText("Welcome to Remix"));
	});
});
