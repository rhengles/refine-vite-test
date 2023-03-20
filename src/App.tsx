import { Refine } from "@refinedev/core";
import routerProvider, {
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { authProvider } from "./authProvider";
import dataProvider from "~/dataProvider";
import RequireAuth from "~/components/RequireAuth";
import Login from "~/pages/Login"

import { ClientList, ClientCreate, ClientEdit, ClientShow } from "./pages/clients";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Refine
                routerProvider={routerProvider}
				authProvider={authProvider}
                dataProvider={dataProvider}
                resources={[
                    {
                        name: "clients",
                        list: "/clients",
                        create: "/clients/create",
                        edit: "/clients/edit/:id",
                        show: "/clients/show/:id",
                        meta: {
                            canDelete: true,
                        },
                    },
                ]}
                options={{
                    warnWhenUnsavedChanges: true,
                    syncWithLocation: true,
                }}
            >
                <Routes>
					<Route
						index
						element={<NavigateToResource resource="clients" />}
					/>

					<Route path="login" element={<Login />} />

					<Route element={
						<RequireAuth>
							<Outlet />
						</RequireAuth>
					}>
						<Route path="clients">
							<Route index element={<ClientList />} />
							<Route path="create" element={<ClientCreate />} />
							<Route path="edit/:id" element={<ClientEdit />} />
							<Route path="show/:id" element={<ClientShow />} />
						</Route>
					</Route>

					<Route path="*" element={<div>Page not found</div>} />
                </Routes>
                <UnsavedChangesNotifier />
            </Refine>
        </BrowserRouter>
    );
};

export default App;
