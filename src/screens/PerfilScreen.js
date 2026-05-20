import { useContext } from "react";
import {
    Alert,
    Button,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { UserContext } from "../context/UserContext";


export default function PerfilScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);

  // Debug
  console.log('User no Perfil:', JSON.stringify(user, null, 2));

  const handleClear = async () => {
    Alert.alert('Confirmar', 'Deseja limpar os dados do usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'OK', onPress: async () => { await setUser({ nome: '', rm: '', cep: '', endereco: { rua: '', bairro: '', cidade: '', estado: '' }, foto: null }); } }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Perfil do Aluno</Text>
        
        {user?.foto ? (
          <Image source={{ uri: user.foto }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text>Sem foto</Text>
          </View>
        )}
        
        <Text style={styles.name}>{user.nome || 'Sem nome cadastrado'}</Text>
        <Text style={{ marginTop: 8 }}>RM: {user.rm || '-'}</Text>
        <Text style={{ marginTop: 12, fontWeight: '700' }}>Endereço:</Text>
        <Text>{user.endereco?.rua || '-'}</Text>
        <Text>
          {user.endereco?.bairro || '-'} - {user.endereco?.cidade || '-'} / {user.endereco?.estado || '-'}
        </Text>

        <View style={{ height: 20 }} />
        <Button
          title="Desenvolvedores"
          onPress={() => navigation.navigate("Dev")}
        />
        <View style={{ height: 12 }} />
        <Button title="Limpar dados" onPress={handleClear} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "700", marginTop: 8 },
});
