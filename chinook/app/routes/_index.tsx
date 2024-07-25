import { List } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl">Welcome to Remix</h1>
			<List>
				<List.Item>
					<Link to={"/albums"} prefetch={"intent"}>
						Albums
					</Link>
				</List.Item>
				<List.Item>Remix Docs</List.Item>
			</List>
		</div>
	);
}
