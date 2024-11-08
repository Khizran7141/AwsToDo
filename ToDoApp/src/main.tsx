import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { Amplify } from "aws-amplify"
import awsmobile from "./aws-exports"
Amplify.configure(awsmobile)
import { Authenticator, ThemeProvider, View } from "@aws-amplify/ui-react"
import { theme } from "./Authenticator/theme.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <View padding="xxL" marginTop="xxL">
        <Authenticator>
          <App />
        </Authenticator>
      </View>
    </ThemeProvider>
  </StrictMode>
)
