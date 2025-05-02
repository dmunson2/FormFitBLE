/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from 'react-native-fs';

import {toByteArray } from 'react-native-quick-base64';
import database, { accelDataCollection, quatDataCollection } from "./db";
import DataScreen from "./accelData";

//device 1 UUIDs
const ACC_SERVICE1_UUID=        "12345678-1234-1234-1234-123456789ab0";
const ACC_MSG1_UUID=            "abcdefab-1234-5678-1234-abcdefabcde0";
const QUAT_SERVICE1_UUID=       "12345678-1234-1234-1234-123456789abc";
const QUAT_MSG1_UUID=           "abcdefab-1234-5678-1234-abcdefabcdef";

//device 2 UUIDs
const ACC_SERVICE2_UUID=        "12345678-1234-1234-1234-123456789ab3";
const ACC_MSG2_UUID=            "abcdefab-1234-5678-1234-abcdefabcde3";
const QUAT_SERVICE2_UUID=       "12345678-1234-1234-1234-123456789abd";
const QUAT_MSG2_UUID=           "abcdefab-1234-5678-1234-abcdefabcde0";



interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice1: Device | null;
  connectedDevice2: Device | null;
  allDevices: Device[];
  accel1:number[];
  quat1:number[];
  accel2:number[];
  quat2:number[];
}


function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice1, setConnectedDevice1] = useState<Device | null>(null);
  const [connectedDevice2, setConnectedDevice2] = useState<Device | null>(null);

  const [accel1,setAccel1]=useState<number[]>([0,0,0]);
  const [quat1,setQuat1]=useState<number[]>([0,0,0,0]);
  const [accel2,setAccel2]=useState<number[]>([0,0,0]);
  const [quat2,setQuat2]=useState<number[]>([0,0,0,0]);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes("")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    if(device.name?.includes("FormFit Sensor 1")){
      try {
        const deviceConnection = await bleManager.connectToDevice(device.id);
        setConnectedDevice1(deviceConnection);
        await deviceConnection.discoverAllServicesAndCharacteristics();
        bleManager.stopDeviceScan();
        startStreamingData1(deviceConnection);
  
      } catch (e) {
        console.log("FAILED TO CONNECT", e);
      }
    }
    else if(device.name?.includes("FormFit Sensor 2")){
      try {
        const deviceConnection = await bleManager.connectToDevice(device.id);
        setConnectedDevice2(deviceConnection);
        await deviceConnection.discoverAllServicesAndCharacteristics();
        bleManager.stopDeviceScan();
        startStreamingData2(deviceConnection);
  
      } catch (e) {
        console.log("FAILED TO CONNECT", e);
      }
    }
    else{
      console.log("other device detected");
      try {
        const deviceConnection = await bleManager.connectToDevice(device.id);
        setConnectedDevice1(deviceConnection);
        await deviceConnection.discoverAllServicesAndCharacteristics();
        bleManager.stopDeviceScan();
        startStreamingData1(deviceConnection);
  
      } catch (e) {
        console.log("FAILED TO CONNECT", e);
      }
    }

  };

  const disconnectFromDevice = () => {
    if (connectedDevice1) {
      bleManager.cancelDeviceConnection(connectedDevice1.id);
    }
    if(connectedDevice2){
      bleManager.cancelDeviceConnection(connectedDevice2.id);
    }
    setConnectedDevice1(null);
    setConnectedDevice2(null);
    setAccel1([0,0,0]);
    setQuat1([0,0,0,0]);
    setAccel2([0,0,0]);
    setQuat2([0,0,0,0]);
  };

  const decryptArr = (rawData : Uint8Array, size : number) =>{
    rawData.reverse();
    const accarr=Array(size);
    for(let i=0;i<size;i++){
      var buf=new ArrayBuffer(4);
      var view=new DataView(buf);
      (rawData.slice(4*(i),4*(i+1))).forEach(function (b,i){
        view.setUint8(i,b);
      });
      var num=view.getFloat32(0);
      accarr[i]=num;
    }
    return accarr;  
  }


  const createAccelDatum=async(accArr:number[],primary:boolean)=>{
    //console.warn('Create acceldatum: ',accArr[0],accArr[1],accArr[2]);
    await database.write(async()=> {
        await database.batch(
          accelDataCollection.prepareCreate((accelDatum)=>{
            accelDatum.x=accArr[0];
            accelDatum.y=accArr[1];
            accelDatum.z=accArr[2];
            accelDatum.primary=primary;
          })
        )
        /*
        await accelDataCollection.create((accelDatum)=>{
            accelDatum.x=accArr[0];
            accelDatum.y=accArr[1];
            accelDatum.z=accArr[2];
            accelDatum.primary=primary;
        });
        */
    });
};

const createQuatDatum=async(quatArr:number[],primary:boolean)=>{
  //console.warn('Create quatdatum: ',quatArr[0],quatArr[1],quatArr[2],quatArr[3]);
  await database.write(async()=> {
    await database.batch(
      await quatDataCollection.prepareCreate((quatDatum)=>{
        quatDatum.x=quatArr[0];
        quatDatum.y=quatArr[1];
        quatDatum.z=quatArr[2];
        quatDatum.w=quatArr[3];
        quatDatum.primary=primary;        
    })
    )

  });
};

  const onAccel1Update = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    const rawData = toByteArray(characteristic.value);
    const finalArr=decryptArr(rawData, 3);

      setAccel1(finalArr);
    
    createAccelDatum(finalArr,true);
  };

  const onAccel2Update = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    const rawData = toByteArray(characteristic.value);
    const finalArr=decryptArr(rawData, 3);
    setAccel2(finalArr);
    createAccelDatum(finalArr,false);
  };

  const onQuat1Update = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    const rawData = toByteArray(characteristic.value);
    const finalArr=decryptArr(rawData, 4);
    
      setQuat1(finalArr);

    createQuatDatum(finalArr,true);
  };

  const onQuat2Update = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    const rawData = toByteArray(characteristic.value);
    const finalArr=decryptArr(rawData, 4);

      setQuat2(finalArr);

    createQuatDatum(finalArr,false);
  };

  const startStreamingData1 = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(ACC_SERVICE1_UUID,ACC_MSG1_UUID,onAccel1Update);
      device.monitorCharacteristicForService(QUAT_SERVICE1_UUID,QUAT_MSG1_UUID,onQuat1Update);
    } else {
      console.log("No Device Connected");
    }
  };
  const startStreamingData2 = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(ACC_SERVICE2_UUID,ACC_MSG2_UUID,onAccel2Update);
      device.monitorCharacteristicForService(QUAT_SERVICE2_UUID,QUAT_MSG2_UUID,onQuat2Update);
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice1,
    connectedDevice2,
    disconnectFromDevice,
    accel1,
    quat1,
    accel2,
    quat2,
  };
}

export default useBLE;