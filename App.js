import React                       /**/ from 'react'
import { LogBox }                       from 'react-native'
import * as SplashScreen                from 'expo-splash-screen'
import * as Font                        from 'expo-font'
import { Ionicons }                     from '@expo/vector-icons'
import { NavigationContainer }          from '@react-navigation/native'
import { ApolloProvider, ApolloClient, HttpLink,
}                                       from '@apollo/client'
//
import { AppWrapper }                   from './src/components/AppWrapper'
import AppNavigator                     from './src/navigation/AppNavigator'
import useLinking                       from './src/navigation/useLinking'
import { typeDefs, resolvers }          from './src/graphql/resolvers'
import Cache                            from './src/graphql/Cache'
import Secrets                          from './Secrets'

// Don't yell at me about other modules' error messages
LogBox.ignoreLogs(['Error: Native splash screen is already hidden'])

const apollo = new ApolloClient({
  cache: Cache,
  link: new HttpLink({
    uri: Secrets.graphql_api,
    // uri: 'http://localhost:4000/graphql',
  }),
  typeDefs,
  resolvers,
})

export default function App(props) {
  const [isLoadingComplete,      setLoadingComplete]        = React.useState(false)
  const [initialNavigationState, setInitialNavigationState] = React.useState()
  const containerRef = React.useRef()
  const { getInitialState } = useLinking(containerRef)

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState())

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        })
      } catch (err) {
        // We might want to provide this error information to an error reporting service
        console.warn(err) // eslint-disable-line
      } finally {
        setLoadingComplete(true)
        SplashScreen.hideAsync()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  if (! isLoadingComplete && ! props.skipLoadingScreen) {
    return null
  } else {
    return (
      <ApolloProvider client={apollo}>
        <AppWrapper>
          {
            ({ navTheme }) => (
              <NavigationContainer
                ref={containerRef}
                initialState={initialNavigationState}
                theme={navTheme}
              >
                <AppNavigator />
              </NavigationContainer>
            )
          }
        </AppWrapper>
      </ApolloProvider>
    )
  }
}
