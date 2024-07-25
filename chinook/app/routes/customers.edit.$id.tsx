import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Fieldset,
	Group,
	Select,
	Stack,
	TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { db } from "~/db.server";
import {
	type CustomerUpdateForm,
	type SalesAgent,
	customerUpdateForm,
} from "~/models/customer";
import {
	customerInChinook,
	customer_viewInChinook,
	sales_agent_viewInChinook,
} from "../../drizzle/schema";

const resolver = zodResolver(customerUpdateForm);

type Notification = {
	message: string;
	title: string;
	status: "success" | "error" | "info" | "warning";
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	if (params.id === undefined) {
		return new Response("Missing id", { status: 400 });
	}
	const customer = await db.query.customer_viewInChinook.findFirst({
		where: eq(customer_viewInChinook.customer_id, Number.parseInt(params.id)),
	});
	const salesReps = await db.query.sales_agent_viewInChinook.findMany();
	return json({ customer, salesReps });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const {
		errors,
		data,
		receivedValues: defaultValues,
	} = await getValidatedFormData<CustomerUpdateForm>(request, resolver);
	if (errors) {
		return json({ errors, defaultValues });
	}
	if (data.support_rep_id !== null) {
		const result = await db.query.sales_agent_viewInChinook.findFirst({
			where: eq(
				sales_agent_viewInChinook.employee_id,
				data.support_rep_id ? data.support_rep_id : 0,
			),
		});
		if (result === undefined) {
			const notification: Notification = {
				message: "Invalid request",
				status: "error",
				title: "Invalid Request",
			};
			return json({notification});
		}
	}
	const updatedCustomers = await db
		.update(customerInChinook)
		.set({
			...data,
			support_rep_id: data.support_rep_id,
		})
		.where(eq(customerInChinook.customer_id, data.customer_id))
		.returning();
	if (updatedCustomers.length === 0) {
		const notification: Notification = {
			message: "Saving failed: unknown reason",
			title: "Update failed",
			status: "error",
		};
		return json({ notification });
	}
	const notification: Notification = {
		message: "Customer saved",
		title: "Update success",
		status: "success",
	};
	return json({ notification });
};

type SelectOption = {
	value: string;
	label: string;
};

export default function CustomersEdit() {
	const {
		customer,
		salesReps,
	}: { customer: CustomerUpdateForm; salesReps: SalesAgent[] } =
		useLoaderData<typeof loader>();
	const { notification } = { ...useActionData() } as {
		notification: Notification;
	};
	const {
		handleSubmit,
		formState: { errors },
		register,
		control,
	} = useRemixForm<CustomerUpdateForm>({
		mode: "onSubmit",
		reValidateMode: "onBlur",
		defaultValues: {
			...customer,
			support_rep_id: customer.support_rep_id,
		},
		resolver,
	});
	useEffect(() => {
		if (notification) {
			notifications.show({
				title: notification.title,
				message: notification.message,
				status: notification.status,
			});
		}
	}, [notification]);
	return (
		<>
			<p>This is the page where you can edit a customer.</p>
			<Box w={{ base: 300, sm: 500, lg: 700 }}>
				<Form onSubmit={handleSubmit} method={"post"}>
					<Stack>
						<input type="hidden" {...register("customer_id")} />
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
							placeholder="Email"
							label="Email"
							{...register("email")}
							error={errors.email?.message}
						/>
						<Group grow>
							<TextInput
								placeholder="Phone"
								label="Phone"
								{...register("phone")}
								error={errors.phone?.message}
							/>
							<TextInput
								placeholder="Fax"
								label="Fax"
								{...register("fax")}
								error={errors.fax?.message}
							/>
						</Group>
						<TextInput
							placeholder="Company"
							label="Company"
							{...register("company")}
							error={errors.company?.message}
						/>

						<Fieldset legend="Address">
							<TextInput
								placeholder="Address"
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
						</Fieldset>
						<Controller
							name="support_rep_id"
							control={control}
							render={({ field }) => {
								// Map salesReps to Select options
								const options: SelectOption[] = [
									{
										value: "",
										label: "None",
									},
									...salesReps.map(
										(salesRep) =>
											({
												value: salesRep.employee_id?.toString(),
												label: salesRep.name,
											}) as SelectOption,
									),
								];

								// Set the Select component's value to match the current field value
								const selectedValue = options.find(
									(option) => option.value === (field.value?.toString() || ""),
								);

								return (
									<Select
										label="Sales Agent"
										placeholder="Select sales agent"
										{...field}
										data={options}
										value={selectedValue?.value}
										onChange={(value) => {
											field.onChange(
												value ? Number.parseInt(value || "") : null,
											);
										}}
									/>
								);
							}}
						/>
						<Button
							type="submit"
							style={{
								maxWidth: "100px",
							}}
						>
							Submit
						</Button>
					</Stack>
				</Form>
			</Box>
		</>
	);
}
