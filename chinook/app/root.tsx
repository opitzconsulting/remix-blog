import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //make sure MRT styles were imported in your app root (once)
import "@mantine/notifications/styles.css";
import {AppShell, Burger, ColorSchemeScript, Flex, List, MantineProvider,} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {Notifications} from "@mantine/notifications";
import {json, type LoaderFunctionArgs, type MetaFunction,} from "@remix-run/node";
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
    useRouteLoaderData,
} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import {useChangeLanguage} from "remix-i18next/react";
import {ColorSchemeToggle} from "~/components/ColorSchemeToggle";
import i18next from "~/i18next.server";
import {theme} from "~/theme";

export const meta: MetaFunction = () => {
    return [
        {title: "Chinook / Remix demo app"},
        {
            name: "description",
            content: "A demo app to showcase remix and some other libraries",
        },
    ];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
    const locale = (await i18next.getLocale(request)) || "en";
    return json({locale});
};

export function Layout() {
    const {locale = "en"} = {...useRouteLoaderData<typeof loader>("root")};
    const {i18n} = useTranslation();
    const [opened, {toggle}] = useDisclosure();
    const error = useRouteError();

    // This hook will change the i18n instance language to the current locale
    // detected by the loader, this way, when we do something to change the
    // language, this locale will change and i18next will load the correct
    // translation files
    useChangeLanguage(locale);

    return (
        <html lang={locale} dir={i18n.dir()}>
        <head>
            <title>Remix Demo App</title>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
            <ColorSchemeScript/>
        </head>
        <body>
        <MantineProvider theme={theme}>
            <Notifications position={"top-right"}/> {/* for mantine */}
            <AppShell
                header={{height: 60}}
                navbar={{
                    width: 300,
                    breakpoint: "sm",
                    collapsed: {mobile: !opened},
                }}
                padding="md"
            >
                <AppShell.Header>
                    <Flex gap={"md"} justify={"flex-start"} direction={"row"}>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <div>Logo</div>
                        <Flex
                            gap={"md"}
                            justify={"flex-end"}
                            direction={"row"}
                            flex={1}
                        >
                            <ColorSchemeToggle/>
                        </Flex>
                    </Flex>
                </AppShell.Header>

                <AppShell.Navbar p={"md"}>
                    <h2>App</h2>
                    <List>
                        <List.Item>
                            <Link to={"/albums"} prefetch={"intent"}>
                                Albums
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"/customers"} prefetch={"intent"}>
                                Customers
                            </Link>{" "}
                        </List.Item>
                        <List.Item>
                            <Link to={"/invoices"} prefetch={"intent"}>
                                Invoices
                            </Link>
                        </List.Item>
                    </List>
                    <h2>Docs</h2>
                    <List>
                        <List.Item>
                            <Link to={"https://github.com/lerocha/chinook-database"}>
                                Chinook Database (data source)
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://yarnpkg.com"}>Yarn</Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://remix.run/docs/en/main"}>Remix Docs</Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://mantine.dev/docs/getting-started/"}>
                                Mantine Docs
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://www.mantine-react-table.com"}>
                                Mantine React Table
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://github.com/forge42dev/remix-hook-form"}>
                                Remix Hook Form
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://react-hook-form.com"}>
                                React Hook Form
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://orm.drizzle.team/docs/overview"}>
                                Drizzle ORM
                            </Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://zod.dev"}>Zod</Link>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://www.typescriptlang.org"}>Typescript</Link>
                            <List withPadding={true}>
                                <List.Item>
                                    <Link
                                        to={
                                            "https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring"
                                        }
                                    >
                                        Destructuring
                                    </Link>
                                </List.Item>
                            </List>
                        </List.Item>
                        <List.Item>
                            <Link to={"https://biomejs.dev"}>Biome</Link>
                        </List.Item>
                    </List>
                </AppShell.Navbar>
                <AppShell.Main>
                    {error ? <ErrorBoundary/> : <Outlet/>}
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    );
}

export default function Root() {
    return <Outlet/>;
}

export function ErrorBoundary() {
    // why this is not rendered automatically, but requires specific handling in Root Component, I don't know
    const error = useRouteError();
    console.error(error);
    return (
        <>
            <h1>ErrorBoundary: Root</h1>
            <p>Something bad has happened</p>
        </>
    );
}
