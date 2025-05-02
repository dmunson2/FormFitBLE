import { FlatList, View } from "react-native";
import { useState, useEffect } from "react";
import DataListItem from "./AccelListItem";
import { accelDataCollection, quatDataCollection } from "./db";
import AccelDatum from "./model/AccelDatum";
import { withObservables } from "@nozbe/watermelondb/react";
import QuatDatum from "./model/QuatDatum";
import AccelListItem from "./AccelListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Q } from "@nozbe/watermelondb";


function AccelList({accelDataL,accelDataR}: {accelDataL:AccelDatum[],accelDataR:AccelDatum[]}){
    return(

        <SafeAreaView style={[{flexDirection: 'row'}]}>
            <View style={{flex:1}}>
                <FlatList
                    data={accelDataL}
                    contentContainerStyle={{gap:5}}
                    renderItem={({item})=><AccelListItem accelDatum={item}/>}
                />
            </View>
            <View style={{flex:1}}>
                <FlatList
                    data={accelDataR}
                    contentContainerStyle={{gap:5}}
                    renderItem={({item})=><AccelListItem accelDatum={item}/>}
                />
            </View>

        </SafeAreaView>

    );
}


const enhanceAccel=withObservables([],()=> ({
    accelDataL: accelDataCollection.query(Q.where('primary',true)),
    accelDataR: accelDataCollection.query(Q.where('primary',false)),
}));

export default enhanceAccel(AccelList);