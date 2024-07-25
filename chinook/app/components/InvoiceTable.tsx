import {Box, Button, NumberFormatter, Text} from "@mantine/core";
import {NavLink, useNavigate} from "@remix-run/react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import {MantineReactTable, type MRT_ColumnDef, type MRT_TableState, useMantineReactTable,} from "mantine-react-table";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import type {Invoice} from "~/models/invoices-model";

type InvoicesTableProps = {
    invoices: Invoice[];
    initialState?: Partial<MRT_TableState<Invoice>>;
};
dayjs.extend(calendar);

export const InvoiceTable = ({
                                 invoices,
                                 initialState,
                             }: InvoicesTableProps) => {
    const {t} = useTranslation();
    const [enableGrouping, setEnableGrouping] = useState<boolean>(false);
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
        () => [
            {
                accessorKey: "invoice_date",
                header: t("invoice.date", "Invoice Date"),
                Cell: ({cell}) => {
                    const date = cell.getValue<string>();
                    const formattedDate = dayjs(date).calendar();
                    return <>{formattedDate}</>;
                },
                enableColumnFilter: false,
                enableGrouping: false,
            },
            {
                accessorKey: "customer_name",
                header: "Customer Name",
                enableGrouping: true,
            },
            {
                accessorKey: "total",
                header: "Total",
                Cell: ({cell}) =>
                    cell.getValue<number>().toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    }),
                enableGrouping: false,
                aggregationFn: (columnId, leafRows, childRows) => {
                    return leafRows.reduce(
                        (sum, row) => sum + Number.parseFloat(row.original.total || "0"),
                        0,
                    );
                },
                AggregatedCell: ({cell}) => (
                    <div>
                        Total:{" "}
                        <NumberFormatter value={cell.getValue<number>()} decimalScale={2}/>
                    </div>
                ),
            },
        ],
        [t],
    );
    const table = useMantineReactTable({
        columns,
        data: invoices,
        enableColumnFilterModes: true,
        enableFacetedValues: true,
        enableGrouping: enableGrouping,
        getRowId: (originalRow) => String(originalRow.invoice_id),
        renderDetailPanel: ({row}) => (
            <Box
                style={{
                    display: "grid",
                    margin: "auto",
                    gridTemplateColumns: "1fr 1fr",
                    width: "50%",
                }}
            >
                <Text>Address: {row.original.billing_address}</Text>
                <Text>City: {row.original.billing_city}</Text>
                <Text>Postal Code: {row.original.billing_postal_code}</Text>
                <Text>State: {row.original.billing_state}</Text>
                <Text>Country: {row.original.billing_country}</Text>
            </Box>
        ),
        renderTopToolbarCustomActions: ({table}) => {
            return (
                <Button component={NavLink} to={"/invoices/create#create"}>
                    Create Invoice
                </Button>
            );
        },
        initialState: initialState ? initialState : undefined,
    });
    useEffect(() => {
        setEnableGrouping(true);
    }, []);
    return <MantineReactTable table={table}/>;
};
