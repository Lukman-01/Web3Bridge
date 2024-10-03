import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import { AppProvider } from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Theme>
            <AppProvider>
                <App />
            </AppProvider>
        </Theme>
    </StrictMode>
);
