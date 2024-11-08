import { Theme } from "@aws-amplify/ui-react"
// Access tokens directly from the defaultTheme without using `useTheme`
const theme: Theme = {
  name: "Auth Example Theme",
  tokens: {
    components: {
      authenticator: {
        router: {
          borderWidth: "0",
          backgroundColor: "#15101c",
        },
      },
      input: {
        color: "white",
      },
      button: {
        primary: {
          backgroundColor: "#9e78cf",
          _hover: {
            backgroundColor: "#3E1671",
            borderColor: "#3E1671",
          },
        },
        link: {
          color: "#9e78cf",
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: "#9e78cf",
        },
      },
      tabs: {
        item: {
          color: "#9e78cf",
          _hover: {
            color: "#3E1671",
            borderColor: "#9e78cf",
          },
          _active: {
            borderColor: "#9e78cf",
            color: "#3E1671",
          },
        },
      },
    },
  },
}

export { theme }
