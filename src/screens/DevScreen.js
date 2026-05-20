import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from "react-native";

// DevScreen: mostra info dos 3 desenvolvedores
const devs = [
  { nome: "Mathaus Marcelino", rm: "564146", foto: require('../../assets/developers/Mathaus.jpg') },
  { nome: "Carlos Neto", rm: "566022", foto: require('../../assets/developers/Carlos.jpg') },
  { nome: "Eduardo Mollo", rm: "561516", foto: require('../../assets/developers/eduardo.jpg') },
];

export default function DevScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
          Desenvolvedores
        </Text>
        {devs.map((d, i) => (
          <View key={i} style={styles.card}>
            {d.foto ? (
              <Image source={d.foto} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text>Sem foto</Text>
              </View>
            )}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{d.nome}</Text>
              <Text>RM: {d.rm}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontWeight: "700" },
});
