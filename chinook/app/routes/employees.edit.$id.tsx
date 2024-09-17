import {json, type LoaderFunction} from '@remix-run/node';
import {kysely} from '~/db.server';
import {zodResolver} from '@hookform/resolvers/zod';
import {type EmployeeEditForm, employeeEditSchema} from '~/models/employee-model';
import {Form, useLoaderData} from '@remix-run/react';
import {useRemixForm} from 'remix-hook-form';
import {Box, Button, Stack, TextInput} from '@mantine/core';

const resolver = zodResolver(employeeEditSchema);

export const loader: LoaderFunction = async ({ request, params }) => {
	const employee = await kysely
		.selectFrom("employee")
		.where("employee_id", "=", params.id || 0)
		.executeTakeFirstOrThrow();
	return json({ employee });
};

export default function EmployeeEdit() {
	const { employee } = useLoaderData<typeof loader>();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useRemixForm<EmployeeEditForm>({
		resolver,
		defaultValues: {
			firstName: employee.first_name,
			lastName: employee.last_name,
		},
	});
	return (
		<div>
			<h1>Edit employee {employee.employee_id}</h1>
			<Box w={300} p={20} mx="auto">
				<Form method="post" onSubmit={handleSubmit}>
					<Stack gap={5}>
						<TextInput
							{...register("firstName")}
							label="First Name"
							placeholder="Enter first name"
							error={errors.firstName?.message}
						/>
						<TextInput
							{...register("lastName")}
							label="Last Name"
							placeholder="Enter last name"
							error={errors.lastName?.message}
						/>
						<Button type="submit">Save</Button>
					</Stack>
				</Form>
			</Box>
		</div>
	);
}
