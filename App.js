import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Device from "./components/Device";
import Details from "./components/Details";
import Container from "./components/Container";
import styles from "./assets/styles/styles";
// import 'expo-dev-client';

// import { RootSiblingParent } from "react-native-root-siblings";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.base}>
        <Stack.Navigator
          screenOptions={({ route, navigation }) => ({
            header: () => (
              <Header
                canGoBack={navigation.canGoBack() && route.name !== "Dashboard"}
                onBackPress={() => navigation.goBack()}
              />
            ),
          })}
        >
          <Stack.Screen name="Dashboard" component={Container(Dashboard)} />
          <Stack.Screen name="Device" component={Container(Device)} />
          <Stack.Screen name="Details" component={Container(Details)}/>
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
