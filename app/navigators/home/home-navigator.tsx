import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { HomeScreen, QrScreen } from "../../screens"

export type HomeParamList = {
  home: undefined
  qr: undefined
}

const Stack = createStackNavigator<HomeParamList>()
export const Home = () => {
  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false }}
    >
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="qr" component={QrScreen} />
    </Stack.Navigator>
  )
}
