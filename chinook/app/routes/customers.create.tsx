import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Group, Stack, TextInput} from "@mantine/core";
import {type ActionFunctionArgs, json, redirect} from "@remix-run/node";
import {Form, isRouteErrorResponse, useRouteError,} from "@remix-run/react";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {db} from "~/db.server";
import {type CustomerCreateForm, customerCreateForm} from "~/models/customer";
import {customerInChinook} from "../../drizzle/schema";

const resolver = zodResolver(customerCreateForm);

export const action = async ({ request }: ActionFunctionArgs) => {
	const {
		errors,
		data,
		receivedValues: defaultValues,
	} = await getValidatedFormData<CustomerCreateForm>(request, resolver);
	if (errors) {
		return json({ errors, defaultValues });
	}
	const insertedCustomers = await db
		.insert(customerInChinook)
		.values(data)
		.returning();
	if (insertedCustomers.length === 0) {
		return json({ errors: { root: { type: "insert_failed" } } });
	}
	return redirect(`/customers/edit/${insertedCustomers[0].customer_id}`);
};

export default function CustomersCreate() {
	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useRemixForm<CustomerCreateForm>({
		mode: "onSubmit",
		reValidateMode: "onBlur",
		resolver,
	});

	return (
		<>
			<p>This is the page where you can create a new customer.</p>
			<Box w={{ base: 300, sm: 500, lg: 700 }}>
				<Form onSubmit={handleSubmit} method={"post"}>
					{errors && (errors.root?.message || errors.root?.type)}
					<Stack>
						<Group grow>
							<TextInput
								placeholder="First Name"
								label={"First Name"}
								{...register("first_name")}
								error={errors.first_name?.message}
							/>
							<TextInput
								placeholder="Last Name"
								label="Last Name"
								{...register("last_name")}
								error={errors.last_name?.message}
							/>
						</Group>
						<TextInput
							placeholder="Address / Street"
							label="Address"
							{...register("address")}
							error={errors.address?.message}
						/>
						<Group grow>
							<TextInput
								placeholder="Postal Code"
								label="Postal Code"
								{...register("postal_code")}
								error={errors.postal_code?.message}
							/>
							<TextInput
								placeholder="City"
								label="City"
								{...register("city")}
								error={errors.city?.message}
							/>
						</Group>
						<Group grow>
							<TextInput
								placeholder="State"
								label="State"
								{...register("state")}
								error={errors.state?.message}
							/>
							<TextInput
								placeholder="Country"
								label="Country"
								{...register("country")}
								error={errors.country?.message}
							/>
						</Group>
						<TextInput
							placeholder="Phone"
							label="Phone"
							{...register("phone")}
							error={errors.phone?.message}
						/>
						<TextInput
							placeholder="Email"
							label="Email"
							{...register("email")}
							error={errors.email?.message}
						/>
						<Button type="submit" style={{ maxWidth: "100px" }}>
							Submit
						</Button>
					</Stack>
				</Form>
			</Box>
		</>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</div>
		);
	}
	if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	}
	return <h1>Unknown Error</h1>;
}
