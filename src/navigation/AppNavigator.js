import { createStackNavigator } from "@react-navigation/stack";
import CadastroScreen from "../screens/CadastroScreen";
import DevScreen from "../screens/DevScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Cadastro">
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="Dev" component={DevScreen} />
    </Stack.Navigator>
  );
}
