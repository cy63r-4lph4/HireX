import { UserRoleProvider } from "../hooks/useUserRole";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "sonner";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "HireX - Web3 Task Platform | Find & Post Tasks with CØRE Token",
  description:
    "HireX is the ultimate Web3 platform for finding and posting skilled labor tasks. Connect with electricians, plumbers, cooks, and more using CØRE cryptocurrency.",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <body>
        <UserRoleProvider>
          <ThemeProvider enableSystem>
            <ScaffoldEthAppWithProviders>
              {" "}
              {children}
              <Toaster position="top-right" richColors />
            </ScaffoldEthAppWithProviders>
          </ThemeProvider>
        </UserRoleProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
