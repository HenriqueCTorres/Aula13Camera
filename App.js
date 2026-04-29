import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Alert,Button,Image } from 'react-native';
import { useState,useEffect,useRef } from 'react';

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

  return (
    <View style={styles.container}>
      {
        !foto?(
          <>
          <CameraView
            ref={cameraRef}
             style={styles.camera}
              facing='back'
          />
          <Button title='TIRAR UMA FOTO' onPress={tirarFoto}/>
          </>
        ):(
          <>
            <Image 
              source={{uri:foto.uri}}
              style={{width:200,height:200}}
            />
            <Button title='Salvar Foto'/>
            <Button title='Tirar outra foto' onPress={()=>setFoto(null)}/>
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
