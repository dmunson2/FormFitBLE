import {View,Text,StyleSheet} from 'react-native';
import AccelDatum from './model/AccelDatum';
import {withObservables} from '@nozbe/watermelondb/react'
import QuatDatum from './model/QuatDatum';

type QuatListItem={
    quatDatum: QuatDatum;
}


function QuatListItem({quatDatum}: QuatListItem){
    return (
        <View>
            <Text>{quatDatum.x}</Text>
            <Text>{quatDatum.y}</Text>
            <Text>{quatDatum.z}</Text>
            <Text>{quatDatum.w}</Text>
            <Text>{JSON.stringify(quatDatum.createdAt)}</Text>
        </View>
    );
}


const enhanceQuat=withObservables(
    ['quatDatum'],
    ({quatDatum}:QuatListItem) => ({
        quatDatum,
})
);

export default enhanceQuat(QuatListItem);

