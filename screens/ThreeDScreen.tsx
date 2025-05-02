import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SHADOW, BORDER_RADIUS } from '../globalStyles';
import { Vector3, Quaternion} from 'three';
import useBLE from './useBLE';
import DeviceModal from './DeviceConnectionModal';
import ThreeDModal from './threeDModal';

const ThreeDScreen = () => {

    const{
        requestPermissions,
        scanForPeripherals,
        allDevices,
        connectToDevice,
        connectedDevice1,
        connectedDevice2,
        accel1,
        quat1,
        accel2,
        quat2,
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

      


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    {connectedDevice1 ? (
                        <>
                            <Text style={styles.profileName}>{"Accelerometer1"}</Text>
                            <Text style={styles.profileEmail}>{accel1[0]}</Text>
                            <Text style={styles.profileEmail}>{accel1[1]}</Text>
                            <Text style={styles.profileEmail}>{accel1[2]}</Text>
                            <Text style={styles.profileName}>{"Quaternion1"}</Text>
                            <Text style={styles.profileEmail}>{quat1[0]}</Text>
                            <Text style={styles.profileEmail}>{quat1[1]}</Text>
                            <Text style={styles.profileEmail}>{quat1[2]}</Text>
                            <Text style={styles.profileEmail}>{quat1[3]}</Text>
                        </>
                    ) : (
                        <Text style={styles.profileName}>
                            Please connect to devic1
                        </Text>
                    )}
                    {connectedDevice2 ? (
                        <>
                            <Text style={styles.profileName}>{"Accelerometer2"}</Text>
                            <Text style={styles.profileEmail}>{accel2[0]}</Text>
                            <Text style={styles.profileName}>{"Quaternion2"}</Text>
                            <Text style={styles.profileEmail}>{quat2[0]}</Text>
                        </>
                    ) : (
                        <Text style={styles.profileName}>
                            Please connect to device2
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                onPress={openModal}
                style={styles.editProfileButton}
                >
                <Text style={styles.editProfileText}>
                    {"Connect to device"}
                </Text> 
                </TouchableOpacity>
                <TouchableOpacity
                onPress={disconnectFromDevice}
                style={styles.editProfileButton}
                >
                <Text style={styles.editProfileText}>
                    {"Disconnect device(s) "}
                </Text> 
                </TouchableOpacity>
            <DeviceModal
            closeModal={hideModal}
            visible={isModalVisible}
            connectToPeripheral={connectToDevice}
            devices={allDevices}
            />
            <ThreeDModal
            accel1={new Vector3(-accel1[2],accel1[1],accel1[0]).multiplyScalar(0.03)}
            quat1={new Quaternion(quat1[0],quat1[1],quat1[2],quat1[3])}
            accel2={new Vector3(-accel2[2],accel2[1],accel2[0]).multiplyScalar(0.03)}
            quat2={new Quaternion(quat2[0],quat2[1],quat2[2],quat2[3])}
            visible={is3DVisible}
            closeModal={hide3D}/>
            <TouchableOpacity
            onPress={open3D}
            style={styles.editProfileButton}
            >
            <Text style={styles.editProfileText}>
                {"show 3D"}
            </Text>
            </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ThreeDScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,

    },
    scrollContent: {
        paddingBottom: 90,
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    profilePhotoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        backgroundColor: COLORS.primary,
        position: 'relative',
        borderWidth: 4,
        borderColor: COLORS.textPrimary,
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    profilePhotoPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.textSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
    },
    profileInitials: {
        fontSize: 40,
        color: COLORS.textPrimary,
        fontWeight: 'bold',
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 8,
    },
    profileName: {
        fontSize: FONTS.heading,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: 10,
    },
    profileEmail: {
        fontSize: FONTS.small,
        color: COLORS.borderColor,
        marginTop: 5,
    },
    editProfileButton: {
        marginTop: 10,
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: BORDER_RADIUS,
    },
    editProfileText: {
        fontSize: FONTS.body,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },

    statsContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: BORDER_RADIUS,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOW,
    },
    statValue: {
        fontSize: 32,
        fontWeight: '600',
        color: COLORS.primary,
    },
    statLabel: {
        fontSize: FONTS.small,
        color: COLORS.textSecondary,
    },

    personalInfoContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    personalInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: BORDER_RADIUS,
        backgroundColor: COLORS.cardBackground,
        marginBottom: 15,
        ...SHADOW,
    },
    personalInfoLabel: {
        fontSize: FONTS.body,
        color: COLORS.textPrimary,
    },
    personalInfoValue: {
        fontSize: FONTS.body,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },

    subscriptionContainer: {
        marginBottom: 30,
        backgroundColor: COLORS.cardBackground,
        padding: 20,
        borderRadius: BORDER_RADIUS,
        ...SHADOW,
    },
    subscriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    subscriptionTitle: {
        fontSize: FONTS.body,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    subscriptionRenewal: {
        fontSize: FONTS.small,
        color: COLORS.textSecondary,
    },
    subscriptionBadge: {
        backgroundColor: COLORS.success,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    subscriptionBadgeText: {
        color: 'white',
        fontWeight: '700',
    },
    subscriptionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: BORDER_RADIUS,
        alignItems: 'center',
    },
    subscriptionButtonText: {
        fontSize: FONTS.body,
        color: 'white',
        fontWeight: '600',
    },

    settingsContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: BORDER_RADIUS,
        ...SHADOW,
    },
    signOutText: {
        fontSize: FONTS.body,
        color: COLORS.textPrimary,
        marginLeft: 10,
    },
});
