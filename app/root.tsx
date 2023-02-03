import type { MetaFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {rel: "stylesheet", href: "https://rsms.me/inter/inter.css"},
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Jam Fans | Find and add great jams by Phish, The Grateful Dead, SCI, UM, moe. WSMFP, BMFS, Goose, and more",
  description: "Find and add great jams by Phish, The Grateful Dead, SCI, UM, moe. WSMFP, BMFS, Goose, and more",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
