import { FlatList, View } from "react-native";
import { useState, useEffect } from "react";
import DataListItem from "./AccelListItem";
import { accelDataCollection, quatDataCollection } from "./db";
import AccelDatum from "./model/AccelDatum";
import { withObservables } from "@nozbe/watermelondb/react";
import QuatDatum from "./model/QuatDatum";
import QuatListItem from "./QuatListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Q } from "@nozbe/watermelondb";

function QuatList({quatDataL,quatDataR}: {quatDataL:QuatDatum[],quatDataR:QuatDatum[]}){
    return(
        <SafeAreaView style={[{flexDirection:'row'}]}>
            <View style={{flex:1}}>
                <FlatList
                data={quatDataL}
                contentContainerStyle={{gap:5}}
                renderItem={({item})=><QuatListItem quatDatum={item}/>}
            />
            </View>
            <View style={{flex:1}}>
                <FlatList
                data={quatDataR}
                contentContainerStyle={{gap:5}}
                renderItem={({item})=><QuatListItem quatDatum={item}/>}
            />
            </View>
        </SafeAreaView>

    );
}

const enhanceQuat=withObservables([],()=> ({
    quatDataL: quatDataCollection.query(Q.where('primary',true)),
    quatDataR: quatDataCollection.query(Q.where('primary',false)),
}));

export default enhanceQuat(QuatList);
