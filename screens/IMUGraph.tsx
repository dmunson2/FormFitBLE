import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../globalStyles';
import { accelDataCollection, quatDataCollection } from './db';
import AccelDatum from './model/AccelDatum';
import DataLineChart from './DataLineChart';
import { Q } from '@nozbe/watermelondb';
import QuatDatum from './model/QuatDatum';

const IMUGraph = () => {
    const [accelDataL, setAccelDataL] = useState<AccelDatum[]>([]);
    const [accelDataR, setAccelDataR] = useState<AccelDatum[]>([]);
    const [quatDataL, setQuatDataL] = useState<QuatDatum[]>([]);
    const [quatDataR, setQuatDataR] = useState<QuatDatum[]>([]);
    
    const [refreshing,setRefreshing]=useState(false);
    const loadDataCallback=useCallback(async()=>{
      try{
        const accelData1=await accelDataCollection.query(Q.where('primary',true)).fetch();
        const quatData1=await quatDataCollection.query(Q.where('primary',true)).fetch();
        const accelData2=await accelDataCollection.query(Q.where('primary',false)).fetch();
        const quatData2=await quatDataCollection.query(Q.where('primary',false)).fetch();
        if (accelData1.length) {
            setAccelDataL(accelData1);
        }
        if (accelData2.length) {
            setAccelDataR(accelData2);
        }
        if (quatData1.length) {
            setQuatDataL(quatData1);
        }

        if (quatData2.length) {
            setQuatDataR(quatData2);
        }
      }
      catch(error){
        console.error('uuuh ',error);
      }
    },[]);
    useEffect(() => {
      loadDataCallback();
    }, [loadDataCallback]);

    const onRefresh=useCallback(()=> {
        setRefreshing(true);
        loadDataCallback();
        setTimeout(()=>{
            setRefreshing(false);
        },2000);
    },[]);

    const accelLlabels=accelDataL.map(item=> {
        return item.createdAt;
    });

    const accelLxval=accelDataL.map(item=> {
        return item.x;
    })
    const accelLyval=accelDataL.map(item=> {
        return item.y;
    })
    const accelLzval=accelDataL.map(item=> {
        return item.z;
    })

    const accelRlabels=accelDataR.map(item=> {
        return item.createdAt;
    });

    const accelRxval=accelDataR.map(item=> {
        return item.x;
    })
    const accelRyval=accelDataR.map(item=> {
        return item.y;
    })
    const accelRzval=accelDataR.map(item=> {
        return item.z;
    })

    const quatLlabels=quatDataL.map(item=> {
        return item.createdAt;
    });

    const quatLxval=quatDataL.map(item=> {
        return item.x;
    })
    const quatLyval=quatDataL.map(item=> {
        return item.y;
    })
    const quatLzval=quatDataL.map(item=> {
        return item.z;
    })
    const quatLwval=quatDataL.map(item=> {
        return item.w;
    })

    const quatRlabels=quatDataR.map(item=> {
        return item.createdAt;
    });

    const quatRxval=quatDataR.map(item=> {
        return item.x;
    })
    const quatRyval=quatDataR.map(item=> {
        return item.y;
    })
    const quatRzval=quatDataR.map(item=> {
        return item.z;
    })
    const quatRwval=quatDataR.map(item=> {
        return item.w;
    })
    const accelLChartData = {
        labels: accelDataL.length? accelLlabels: [0,0,0,0,0],
        datasets: [
            {
                data: accelDataL.length? accelLxval : [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#003049',
                withDots: false,
                withShadow: false,
            },
            
            {
                data: accelDataL.length? accelLyval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#d62828', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },

            {
                data: accelDataL.length? accelLzval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#f77f00', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },
            
        ],
    };
    const accelRChartData = {
        labels: accelDataR.length? accelRlabels: [0,0,0,0,0],
        datasets: [
            {
                data: accelDataR.length? accelRxval : [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#003049',
                withDots: false,
                withShadow: false,
            },
            
            {
                data: accelDataR.length? accelRyval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#d62828', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },

            {
                data: accelDataR.length? accelRzval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#f77f00', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },
            
        ],
    };
    const quatLChartData = {
        labels: quatDataL.length? quatLlabels: [0,0,0,0,0],
        datasets: [
            {
                data: quatDataL.length? quatLxval : [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#003049',
                withDots: false,
                withShadow: false,
            },
            
            {
                data: quatDataL.length? quatLyval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#d62828', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },

            {
                data: quatDataL.length? quatLzval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#f77f00', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },
            {
                data: quatDataL.length? quatLwval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#f71f00', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },           
        ],
    };
    const quatRChartData = {
        labels: quatDataR.length? quatRlabels: [0,0,0,0,0],
        datasets: [
            {
                data: quatDataR.length? quatRxval : [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#003049',
                withDots: false,
                withShadow: false,
            },
            
            {
                data: quatDataR.length? quatRyval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#d62828', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },

            {
                data: quatDataR.length? quatRzval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#f77f00', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },
            {
                data: quatDataR.length? quatRwval: [0,0,0,0,0],
                strokeWidth: 2,
                color: () => '#f71f00', // Solid color for right knee (RGB: 54, 162, 235)
                withDots: false,
                withShadow: false,
            },           
        ],
    };

    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - 64; // Subtract 16 for padding

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }>

              <DataLineChart
                title="accelL"
                chartData={accelLChartData}
                fillShadowGradient="#ccc"
                legend={lineChartLegends}
              />
              <DataLineChart
                title="quatL"
                chartData={accelRChartData}
                fillShadowGradient="#ccc"
                legend={lineChartLegends}
              />
              <DataLineChart
                title="accelR"
                chartData={quatLChartData}
                fillShadowGradient="#ccc"
                legend={lineChartLegends}
              />
              <DataLineChart
                title="quatR"
                chartData={quatRChartData}
                fillShadowGradient="#ccc"
                legend={lineChartLegends}
              />
            </ScrollView>
        </SafeAreaView>
    );
};

const lineChartLegends = [
    {
      name: 'x',
      color: '#003049',
    },
    {
      name: 'y',
      color: '#d62828',
    },
    {
      name: 'z',
      color: '#f77f00',
    },
  ];
  


export default IMUGraph;
