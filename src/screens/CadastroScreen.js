import * as ImagePicker from "expo-image-picker";
import { useContext, useState, useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { UserContext } from "../context/UserContext";
import cepService from "../services/cepService";


export default function CadastroScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [nome, setNome] = useState(user.nome);
  const [rm, setRm] = useState(user.rm);
  const [cep, setCep] = useState(user.cep);
  const [endereco, setEndereco] = useState(user.endereco);
  const [foto, setFoto] = useState(user.foto);
  const [loading, setLoading] = useState(false); // loading para requisição CEP
  const [saving, setSaving] = useState(false); // salvar em andamento
  const [errors, setErrors] = useState({ nome: '', rm: '', cep: '' });
  const cepTimeout = useRef(null);

  
  useEffect(() => {
    const cleaned = String(cep).replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    if (cepTimeout.current) clearTimeout(cepTimeout.current);
    cepTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await cepService.fetchAddressByCEP(cleaned);
        setEndereco(data);
        setErrors(prev => ({ ...prev, cep: '' }));
      } catch (err) {
        setErrors(prev => ({ ...prev, cep: err.message || 'Falha ao buscar CEP' }));
        Alert.alert('Erro', err.message || 'Falha ao buscar CEP');
      } finally {
        setLoading(false);
      }
    }, 800);
    return () => {
      if (cepTimeout.current) clearTimeout(cepTimeout.current);
    };
  }, [cep]);

  
  const handleBuscarCEP = async () => {
    const cleaned = String(cep).replace(/\D/g, "");
    if (cleaned.length !== 8) {
      setErrors(prev => ({ ...prev, cep: 'CEP deve ter 8 dígitos' }));
      Alert.alert("CEP inválido", "Digite um CEP com 8 dígitos.");
      return;
    }
    setLoading(true);
    try {
      const data = await cepService.fetchAddressByCEP(cleaned);
      setEndereco(data);
      setErrors(prev => ({ ...prev, cep: '' }));
    } catch (err) {
      setErrors(prev => ({ ...prev, cep: err.message || 'Falha ao buscar CEP' }));
      Alert.alert("Erro", err.message || "Falha ao buscar CEP");
    } finally {
      setLoading(false);
    }
  };

 
  const handleOpenCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Permissão para usar a câmera foi negada."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.6,
        allowsEditing: true,
      });
      console.log('Resultado câmera:', JSON.stringify(result, null, 2));
      
     
      if (result.cancelled || result.canceled) {
        Alert.alert('Cancelado', 'A captura da câmera foi cancelada.');
        return;
      }
      
      
      const photoUri = result.uri || (result.assets && result.assets[0] && result.assets[0].uri);
      if (photoUri) {
        console.log('Foto salva:', photoUri);
        setFoto(photoUri);
      } else {
        console.warn('Nenhum URI encontrado:', result);
        Alert.alert('Erro', 'Nenhuma foto foi capturada.');
      }
    } catch (err) {
      console.error('Erro câmera:', err);
      Alert.alert("Erro", "Não foi possível abrir a câmera.");
    }
  };

 
  const handleSave = async () => {
    const currentErrors = { nome: '', rm: '', cep: '' };
    if (!nome.trim()) currentErrors.nome = 'Nome obrigatório';
    if (!rm.trim()) currentErrors.rm = 'RM obrigatório';
    const cleanedCep = String(cep).replace(/\D/g, '');
    if (cleanedCep && cleanedCep.length !== 8) currentErrors.cep = 'CEP inválido';

    setErrors(currentErrors);

    if (currentErrors.nome || currentErrors.rm || currentErrors.cep) {
      Alert.alert('Erros nos campos', 'Corrija os campos destacados antes de salvar.');
      return;
    }

    const newUser = {
      nome: nome.trim(),
      rm: rm.trim(),
      cep: cleanedCep,
      endereco,
      foto,
    };

    setSaving(true);
    try {
      // setUser persiste no AsyncStorage (veja UserContext)
      await setUser(newUser);
      navigation.navigate("Perfil");
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={[styles.input, errors.nome ? styles.inputError : null]}
          value={nome}
          onChangeText={text => { setNome(text); if (errors.nome) setErrors(prev => ({ ...prev, nome: '' })); }}
          placeholder="Nome completo"
        />
        {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

        <Text style={styles.label}>RM</Text>
        <TextInput
          style={[styles.input, errors.rm ? styles.inputError : null]}
          value={rm}
          onChangeText={text => { setRm(text); if (errors.rm) setErrors(prev => ({ ...prev, rm: '' })); }}
          placeholder="RM"
        />
        {errors.rm ? <Text style={styles.errorText}>{errors.rm}</Text> : null}

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={[styles.input, errors.cep ? styles.inputError : null]}
          value={cep}
          onChangeText={text => { setCep(text); if (errors.cep) setErrors(prev => ({ ...prev, cep: '' })); }}
          placeholder="00000-000"
          keyboardType="numeric"
        />
        {errors.cep ? <Text style={styles.errorText}>{errors.cep}</Text> : null}

        <View style={styles.row}>
          <Button title="Buscar CEP" onPress={handleBuscarCEP} disabled={loading} />
          <View style={{ width: 12 }} />
          <Button title="Abrir Câmera" onPress={handleOpenCamera} />
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : (
          <View style={{ width: "100%", marginTop: 12 }}>
            <Text style={styles.label}>Endereço</Text>
            <Text>{endereco.rua}</Text>
            <Text>
              {endereco.bairro} - {endereco.cidade}/{endereco.estado}
            </Text>
          </View>
        )}

        {foto ? <Image source={{ uri: foto }} style={styles.avatar} /> : null}

        <View style={{ height: 16 }} />
        <Button title={saving ? "Salvando..." : "Salvar"} onPress={handleSave} disabled={saving || loading} />

        {saving ? <ActivityIndicator style={{ marginTop: 12 }} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: "700", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginTop: 4
  },
  row: { flexDirection: "row", marginTop: 12 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginTop: 12 },
});
