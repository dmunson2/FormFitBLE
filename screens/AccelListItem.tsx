import {View,Text,StyleSheet} from 'react-native';
import AccelDatum from './model/AccelDatum';
import {withObservables} from '@nozbe/watermelondb/react'
import QuatDatum from './model/QuatDatum';
type AccelListItem={
    accelDatum: AccelDatum;
};

function AccelListItem({accelDatum}: AccelListItem){
    return (
        <View>
            <Text>{accelDatum.x}</Text>
            <Text>{accelDatum.y}</Text>
            <Text>{accelDatum.z}</Text>
            <Text>{JSON.stringify(accelDatum.createdAt)}</Text>
        </View>
    );
}


const enhanceAccel=withObservables(
    ['accelDatum'],
    ({accelDatum}:AccelListItem) => ({
        accelDatum,
})
);

export default enhanceAccel(AccelListItem);
