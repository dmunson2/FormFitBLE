// Import necessary modules from React, React-Three-Fiber, and Drei
import React, { FC, useEffect, useRef } from "react";
import { Modal, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Plane, Sphere, OrbitControls, Cone } from "@react-three/drei";
import { Vector3,Quaternion, Group } from 'three';


type ThreeDModalProps = {
  accel: Vector3;
  mag: Vector3;
  gyro: Vector3;
  quat: Quaternion;
  visible: boolean;
  closeModal: () => void;
};

type AccelProp={
  accel: Vector3;
  mag: Vector3;
  gyro: Vector3;
  quat: Quaternion;
};

const ThreeDModal: FC<ThreeDModalProps> = (props) =>{
  const {accel,mag,gyro,quat, visible,closeModal}=props;


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
        <Canvas
          gl={{debug: {checkShaderErrors:false,onShaderError:null} }}>
          <Scene 
            accel={accel}
            mag={mag}
            gyro={gyro}
            quat={quat}/>
        </Canvas>
        <Text style={modalStyle.ctaButtonText}>
            {accel.x}
        </Text>
        <Text style={modalStyle.ctaButtonText}>
            {accel.y}
        </Text>
        <Text style={modalStyle.ctaButtonText}>
            {accel.z}
        </Text>
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
  let velocityRef = useRef(new Vector3(0,0,0));

  useFrame(() =>{
    const position=moverRef.current?.position||new Vector3(-1,1,-1);
    const thisQuat=moverRef.current?.quaternion||new Quaternion(0,0,0,0);
    const velocity = velocityRef.current;
    const acceleration=props.accel;
    const quaternion=props.quat;
    velocity.add(acceleration);
    position.add(velocity);
    thisQuat.copy(quaternion);

  });
  return (
    <group ref={moverRef}>
      <Cone args={[0.1,0.4,32]}>
        <meshLambertMaterial color="hotpink"/>
      </Cone>
    </group>
  );
};


const Background = () => {
  return (
    <Plane args={[4, 4, 4, 4]} position={[0, 0, 0]}>
      <meshLambertMaterial color="white" opacity={0.5} wireframe />
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



function Scene(props: AccelProp) {
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

      <pointLight intensity={2} position={[1, 1, -8]} />
      <pointLight intensity={2} position={[1, 1, 8]} />
      <Mover 
      accel={props.accel}
      mag={props.mag}
      gyro={props.gyro}
      quat={props.quat}/>
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
});
export default ThreeDModal;
