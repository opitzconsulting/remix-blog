import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("/");

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Remix Demo App/);
});

test("get customer link", async ({ page }) => {
	await page.goto("/");

	// Click the get started link.
	await page.getByRole("link", { name: "About" }).click();

	// Expects page to have a heading with the name of Installation.
	await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
});
