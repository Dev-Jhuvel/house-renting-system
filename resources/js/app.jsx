import "../css/app.css";
import "./bootstrap";
import "leaflet/dist/leaflet.css";
import "./lib/leaflet";

import { createInertiaApp, usePage } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout";
import GuestLayout from "./Layouts/GuestLayout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        );
        page.default.layout =
            page.default.layout ||
            ((pageProps) => {
                const Layout = pageProps.props.auth.user
                    ? AuthenticatedLayout
                    : GuestLayout;
                return <Layout>{pageProps}</Layout>;
            });
            return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
