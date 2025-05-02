import React, { FC, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, Text, SafeAreaView, View } from 'react-native';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Plane, Sphere, OrbitControls, Cone } from "@react-three/drei";
import { Vector3,Quaternion, Group, Euler } from 'three';


type ThreeDModalProps = {
  accel1: Vector3;
  quat1: Quaternion;
  accel2: Vector3;
  quat2: Quaternion;
  visible: boolean;
  closeModal: () => void;
};

type SceneProp={
  accel1: Vector3;
  quat1: Quaternion;
  accel2: Vector3;
  quat2: Quaternion;  
}

type AccelProp={
  accel1: Vector3;
  quat1: Quaternion;
  startPos: Vector3;
};

const diff=(quata:Quaternion, quatb:Quaternion)=>{
  const diffeuler=new Quaternion(0,0,0,0);
  const final=new Euler(0,0,0);
  diffeuler.copy(quata);
  diffeuler.invert();
  diffeuler.multiply(quatb);
  final.setFromQuaternion(diffeuler)
  return final;
}

const ThreeDModal: FC<ThreeDModalProps> = (props) =>{
  const {accel1,quat1,accel2,quat2, visible,closeModal}=props;
  const noAccel = new Vector3(0,0,0);
  const eul1=new Euler;
  const eul2=new Euler;
  eul1.setFromQuaternion(quat1);
  eul2.setFromQuaternion(quat2);
  const [usingAccel,setUsingAccel]=useState<boolean>(false);

  const swichAccel=()=>{
    if(usingAccel){
      setUsingAccel(false);
    }
    else{
      setUsingAccel(true);
    }
  }
  return (
    // Render a Canvas element with a directional light, ambient light, and the Mover component
    // Add frameloop="never" to canvas to slow down renders to every .5 seconds.
    <Modal
    style={modalStyle.modalContainer}
    animationType="slide"
    transparent={false}
    visible={visible}
    >

      <SafeAreaView style={modalStyle.modalTitle}>
        <View style={[{flexDirection: 'row'}]}>
          {Math.abs((diff(quat1,quat2)).x) < 0.2 ? 
          <Text style={modalStyle.goodText}>
            {'Δx'}
            {(diff(quat1,quat2)).x.toFixed(3)}
          </Text>:
          <Text style={modalStyle.badText}>
            {'Δx'}
            {(diff(quat1,quat2)).x.toFixed(3)}
          </Text>}
          {Math.abs((diff(quat1,quat2)).y) < 0.2 ? 
          <Text style={modalStyle.goodText}>
            {'Δy'}
            {(diff(quat1,quat2)).y.toFixed(3)}
          </Text>:
          <Text style={modalStyle.badText}>
            {'Δy'}
            {(diff(quat1,quat2)).y.toFixed(3)}
          </Text>}
          {Math.abs((diff(quat1,quat2)).z) < 0.2 ? 
          <Text style={modalStyle.goodText}>
            {'Δz'}
            {(diff(quat1,quat2)).z.toFixed(3)}
          </Text>:
          <Text style={modalStyle.badText}>
            {'Δz'}
            {(diff(quat1,quat2)).z.toFixed(3)}
          </Text>}
        </View>
        <View style={[{flexDirection: 'row'}]}>
          
          {((Math.abs(eul1.z)>2.8)) ?
            <Text style={modalStyle.goodText}>
              {eul1.z.toFixed(3)}
            </Text>:
            <Text style={modalStyle.badText}>
              {eul1.z.toFixed(3)}
              {"\noff-balance"}
            </Text>}
            {((Math.abs(eul2.z)>2.8)) ?
            <Text style={modalStyle.goodText}>
              {eul2.z.toFixed(3)}
            </Text>:
            <Text style={modalStyle.badText}>
              {eul2.z.toFixed(3)}
              {"\noff-balance"}
            </Text>}
        </View>
        <Canvas
          gl={{debug: {checkShaderErrors:false,onShaderError:null} }}>
          <Scene 
            accel1={usingAccel? accel1 : noAccel}
            quat1={quat1}
            accel2={usingAccel? accel2 : noAccel}
            quat2={quat2}/>
        </Canvas>
        <TouchableOpacity
          onPress={swichAccel}
          style={modalStyle.ctaButton}>
          <Text style={modalStyle.ctaButtonText}>
            {(usingAccel) ? "accel off" : "accel on"}
          </Text>              
        </TouchableOpacity>
        <TouchableOpacity
        onPress={closeModal}
        style={modalStyle.ctaButton}>
          <Text style={modalStyle.ctaButtonText}>
            {"back"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

    </Modal>
  );
}
const Mover = (props: AccelProp) => { 
  const moverRef=useRef<Group>(null);
  moverRef.current?.position.copy(props.startPos);
  let velocityRef = useRef(new Vector3(0,0,0));
  //const test=new Quaternion(0, 0, 0.4794255, 0.8775826);
  useFrame(() =>{
    const position=moverRef.current?.position||new Vector3(0,0,0);
    const quaternion=moverRef.current?.quaternion||new Quaternion(0,0,0,0);
    const velocity = velocityRef.current;
    const acceleration=props.accel1;
    
    const test2=new Quaternion( 0, 0.5, 0.8,0);
    velocity.add(acceleration);
    position.add(velocity);
    quaternion.copy(props.quat1);

  });
  return (
    <group ref={moverRef}>
      <Cone args={[0.1,0.4,32]} >
        <meshLambertMaterial color="hotpink"/>
      </Cone>
    </group>
  );
};


const Background = () => {
  return (
    <Plane args={[4, 4, 4, 4]} position={[0, 0, 0]}>
      <meshLambertMaterial color="blue" opacity={0.5} wireframe />
    </Plane>
  );
};

// A useInverval hook to help us call the render loop on a set time.
const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};



function Scene(props: SceneProp) {
  const { advance } = useThree();
  useInterval(() => advance(1), 1000);
  const isDragging=React.useRef(false);
  return (
    <>
      <OrbitControls 
        onStart={() => {
          isDragging.current = true;
        }}
        onEnd={() => {
          isDragging.current = false;
        }}
        autoRotate={false}
        autoRotateSpeed={0.4}/>
      <pointLight color="#fff" intensity={1000} position={[10, 10, 10]} />
      <pointLight color="#fff" intensity={1000} position={[-10, -10, -10]} />
      <Mover 
        accel1={props.accel1}
        quat1={props.quat1}
        startPos={new Vector3(1,0,0)}/>
      <Mover 
        accel1={props.accel2}
        quat1={props.quat2}
        startPos={new Vector3(-1,0,0)}/>
      
      <Background />
    </>
  );
}
const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: "center",
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    textAlign: "center",
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
  goodText: {
    flex:1,
    fontSize:18,
    fontWeight: "bold",
    color: "green",
  },
  badText: {
    flex:1,
    fontSize:18,
    fontWeight: "bold",
    color: "red",
  }
});
export default ThreeDModal;
