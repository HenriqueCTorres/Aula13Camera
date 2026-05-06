import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Alert,Button,Image } from 'react-native';
import { useState,useEffect,useRef } from 'react';
import * as Sharing from 'expo-sharing'

//Biblioteca de camera no Expo
import { CameraView,useCameraPermissions } from 'expo-camera';

//Biblioteca para salvar a foto na galeria
import * as MediaLibrary from "expo-media-library"


export default function App() {
  //Estado de permissão da câmera
  const[permissaoCam,requestPermissaoCam]=useCameraPermissions()

  //Estado de permissao da biblioteca de media
  const[permissaoMedia,requestPermissaoMedia]=MediaLibrary.usePermissions()

  //Referência da câmera(acesso  direto ao componente)
  const cameraRef = useRef(null)

  //Estado da foto capturada
  const[foto,setFoto]=useState(null)

  //Estado para alternar entre a câmera frontal e traseira
  const[isFrontCamera,setIsFrontCamera]=useState(false)

  //Estado para o gerenciamento do flash
  const[flashLigado,setFlashLigado]=useState(false)


  //Pedindo permissão da galeria no inicio do app
  useEffect(()=>{
    if(permissaoMedia===null)return;
    if(!permissaoMedia?.granted){
      requestPermissaoMedia()
    }
  },[])

  
    if(!permissaoCam)return <View/>
    //Se a permissão da câmera foi negado
    if(!permissaoCam.granted){
      return(
        <View>
          <Text>Permissão da câmera não foi concedida</Text>
          <Button 
            title='Permitir'
            onPress={requestPermissaoCam}
          />
        </View>
      )
    }


  //Função para tirar foto
  const tirarFoto = async()=>{
    if(cameraRef.current){
      const dadoFoto = await cameraRef.current.takePictureAsync();
      setFoto(dadoFoto)
    }
  }

  //Função para salvar foto na galeria do aparelho
  const salvarFoto = async ()=>{
    if(foto?.uri){
      try{
        await MediaLibrary.createAssetAsync(foto.uri)//Salva foto na galeria
        Alert.alert("Sucesso","Foto salva na galeria")
        setFoto(null)//Reseta o estado para tirar outra foto
      }catch(error){
        Alert.alert("Error","Não foi possível salvar a foto.")
      }
    }
  }

  //Função para alternar entre as câmeras
  const toggleCameraType = () =>{
    setIsFrontCamera((prev)=>!prev)//Alterna entre true e false
  }

  //Função para alternar o flash
  const alternarFlash = ()=>{
    setFlashLigado((prev)=>!prev)
  }

  const compartilharFoto = async ()=>{
    if(foto?.uri && await Sharing.isAvailableAsync()){
      await Sharing.shareAsync(foto.uri)
    }else{
      Alert.alert("Erro","Compartilhamento não disponível")
    }
  }

  return (
    <View style={styles.container}>
      {
        !foto?(
          <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={isFrontCamera?"front":"back"}
            flash={flashLigado?"on":"off"}
          />
          <Button title='TIRAR UMA FOTO' onPress={tirarFoto}/>
          <Button title="Alternar Câmera" onPress={toggleCameraType}/>
          <Button title={flashLigado?"Desligar Flash":"Ligar Flash"} onPress={alternarFlash}/>
          </>
        ):(
          <>
            <Image 
              source={{uri:foto.uri}}
              style={{width:200,height:200}}
            />
            <Button title='Salvar Foto' onPress={salvarFoto}/>
            <Button title='Tirar outra foto' onPress={()=>setFoto(null)}/>
            <Button title="Compartilhar Foto" onPress={compartilharFoto}/>
          </>
        )
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  camera:{
    width:"100%",
    height:"80%"
  }
});
