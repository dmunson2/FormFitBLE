import database, {accelDataCollection, quatDataCollection} from "./db";
import AccelList from "./AccelList";
import {useState} from 'react';
import {View,Text,StyleSheet,Button,TextInput,TouchableOpacity,Dimensions, ScrollView} from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { Q } from "@nozbe/watermelondb";
import QuatList from "./QuatList";
import { COLORS, FONTS, BORDER_RADIUS, SHADOW } from "../globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth=Dimensions.get("window").width;
export default function DataScreen(){

    const dbDelete=async()=>{
        await database.write(async()=> {
            await accelDataCollection.query().destroyAllPermanently();
            await quatDataCollection.query().destroyAllPermanently();
        })
        
    }



    return (
        <SafeAreaView style={styles.container}>
                <View 
                    style={[
                        styles.container,
                        {
                            flexDirection: 'column',
                        },
                    ]}>

                    <TouchableOpacity style={styles.editProfileButton}
                    onPress={dbDelete}>
                    <Text>
                        dbDelete
                    </Text> 
                    </TouchableOpacity>
                    <View style={{flex:1,backgroundColor:'red'}}>
                        <AccelList/>
                    </View>
                    <View style={{flex:1,backgroundColor:'blue'}}>
                        <QuatList/>
                    </View>
                </View>
        </SafeAreaView>

        
    )
}

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