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

import {toByteArray } from 'react-native-quick-base64';

const ACC_SERVICE_UUID="ADAF0200-C332-42A8-93BD-25E905756CB8";
const ACC_MSG_UUID="ADAF0201-C332-42A8-93BD-25E905756CB8";

const MAG_SERVICE_UUID="ADAF0800-C332-42A8-93BD-25E905756CB8";
const MAG_MSG_UUID="ADAF0801-C332-42A8-93BD-25E905756CB8";

const GYRO_SERVICE_UUID="ADAF0500-C332-42A8-93BD-25E905756CB8";
const GYRO_MSG_UUID="ADAF0501-C332-42A8-93BD-25E905756CB8";

const QUAT_SERVICE_UUID="ADAF0400-C332-42A8-93BD-25E905756CB8";
const QUAT_MSG_UUID="ADAF0401-C332-42A8-93BD-25E905756CB8";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  accel:number[];
  mag:number[];
  gyro:number[];
  quat:number[];
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  const [accel,setAccel]=useState<number[]>([0,0,0]);
  const [mag,setMag]=useState<number[]>([0,0,0]);
  const [gyro,setGyro]=useState<number[]>([0,0,0]);
  const [quat,setQuat]=useState<number[]>([0,0,0,0]);

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
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setAccel([0,0,0]);
      setMag([0,0,0]);
      setGyro([0,0,0]);
    }
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
        
        
      console.log(num);
    }
    return accarr;  
  }

  const onAccelUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = toByteArray(characteristic.value);
    setAccel(decryptArr(rawData, 3));
  };
  const onMagUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = toByteArray(characteristic.value);
    setMag(decryptArr(rawData,3));
  };
  const onGyroUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = toByteArray(characteristic.value);
    setGyro(decryptArr(rawData,3));
  };

  const onQuatUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null
  ) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }

    const rawData = toByteArray(characteristic.value);
    setQuat(decryptArr(rawData,4));
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(ACC_SERVICE_UUID,ACC_MSG_UUID,onAccelUpdate);
      device.monitorCharacteristicForService(MAG_SERVICE_UUID,MAG_MSG_UUID,onMagUpdate);
      device.monitorCharacteristicForService(GYRO_SERVICE_UUID,GYRO_MSG_UUID,onGyroUpdate);
      device.monitorCharacteristicForService(QUAT_SERVICE_UUID,QUAT_MSG_UUID,onQuatUpdate);
    } else {
      console.log("No Device Connected");
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    accel,
    mag,
    gyro,
    quat
  };
}

export default useBLE;