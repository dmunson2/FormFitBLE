import { StatusBar } from 'expo-status-bar';
import React, {useState, useRef} from "react";
import { 
  Modal,
  SafeAreaView,
  StyleSheet, 
  Text,
  TouchableOpacity,
  View } from 'react-native';
import DeviceModal from './DeviceConnectionModal';
import ThreeDModal from './threeDModal';
import useBLE from "./useBLE";
import {Canvas, useFrame} from '@react-three/fiber';
import {Quaternion, Vector3} from 'three';
import {SQLiteDatabase, SQLiteProvider} from "expo-sqlite";

const App = () => {
  const{
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    accel,
    mag,
    gyro,
    quat,
    disconnectFromDevice,
  }=useBLE();
  const [isModalVisible,setIsModalVisible]=useState<boolean>(false);
  const [is3DVisible, setIs3DVisible]=useState<boolean>(false);

  const scanForDevices=async()=>{
    const isPermissionsEnabled=await requestPermissions();
    if(isPermissionsEnabled){
      scanForPeripherals();
    }
  };

  const hideModal=()=>{
    setIsModalVisible(false);
  };

  const openModal=async()=>{
    scanForDevices();
    setIsModalVisible(true);
  };

  const hide3D=()=>{
    setIs3DVisible(false);
  };

  const open3D=async()=>{
    setIs3DVisible(true);
  };

  const createDbIfNeeded=async(db:SQLiteDatabase) => {
    console.log("Creating database if needed");
    await db.execAsync("CREATE TABLE IF NOT EXISTS accel (id INTEGER PRIMARY KEY AUTOINCREMENT, asciiarr TEXT);");
  };
  
  return (
    //<SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <SafeAreaView style={styles.container}>
        <View style={styles.heartRateTitleWrapper}>
          {connectedDevice ? (
            <>
              <Text style={styles.heartRateText}>{"Accelerometer"}</Text>
              <Text style={styles.heartRateText}>{accel[0]}</Text>
              <Text style={styles.heartRateText}>{accel[1]}</Text>
              <Text style={styles.heartRateText}>{accel[2]}</Text>
              <Text style={styles.heartRateText}>{"Magnetometer"}</Text>
              <Text style={styles.heartRateText}>{mag[0]}</Text>
              <Text style={styles.heartRateText}>{mag[1]}</Text>
              <Text style={styles.heartRateText}>{mag[2]}</Text>
              <Text style={styles.heartRateText}>{"Gyroscope"}</Text>
              <Text style={styles.heartRateText}>{gyro[0]}</Text>
              <Text style={styles.heartRateText}>{gyro[1]}</Text>
              <Text style={styles.heartRateText}>{gyro[2]}</Text>
              <Text style={styles.heartRateText}>{"Quaternion"}</Text>
              <Text style={styles.heartRateText}>{quat[0]}</Text>
              <Text style={styles.heartRateText}>{quat[1]}</Text>
              <Text style={styles.heartRateText}>{quat[2]}</Text>
              <Text style={styles.heartRateText}>{quat[3]}</Text>
            </>
          ) : (
            <Text style={styles.heartRateTitleText}>
              Please Connect to a device
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={connectedDevice ? disconnectFromDevice : openModal}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>
            {connectedDevice ? "Disconnect" : "Connect"}
          </Text> 
        </TouchableOpacity>
        <DeviceModal
          closeModal={hideModal}
          visible={isModalVisible}
          connectToPeripheral={connectToDevice}
          devices={allDevices}
        />
        <ThreeDModal
          accel={new Vector3(-accel[2],accel[1],accel[0]*0).multiplyScalar(0.01)}
          mag={new Vector3(mag[2],mag[1],mag[0])}
          gyro={new Vector3(gyro[2],gyro[1],gyro[0])}
          quat={new Quaternion(quat[0],quat[1],quat[2],quat[3])}
          visible={is3DVisible}
          closeModal={hide3D}/>
        <TouchableOpacity
          onPress={open3D}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>
            {"show 3D"}
          </Text>
        </TouchableOpacity>

          
      </SafeAreaView>
    //</SQLiteProvider>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});


export default App;
