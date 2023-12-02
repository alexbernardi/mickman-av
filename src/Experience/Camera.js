import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from "./Experience";
import { getProject, types } from '@theatre/core'

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.debug = this.experience.debug;
        this.resources = this.experience.resources
        

        this.setSceneCamera()
        this.resources.on('ready', () => {
            this.project = this.experience.project
            this.setProject()
        });

        this.cameraSettings = {
            camera1: { 
                name: "camera1",
                position: new THREE.Vector3(0, 1.3, 1.45),
                fov: 130,
                rotation: new THREE.Euler(0.6, 0, 0)
             },
            camera2: { 
                name: "camera2",
                position: new THREE.Vector3(-10, 8, 5),
                fov: 75,
                rotation: new THREE.Euler(1, 1,1)
             },
            camera3: { 
                name: "camera3",
                position: new THREE.Vector3(2.54, 0.93, 2.59),
                fov: 35,
                rotation: new THREE.Euler(-0.12, 0.90, 0.09)
             }
        };

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Active Camera');
        }

        this.currentCamera = null;
        this.setInstance('sceneCamera');
        this.setOrbitControls();
        if (this.debug.active) {
            const debugObject = {
                camera1: () => this.setInstance(this.cameraSettings.camera1),
                camera2: () => this.setInstance(this.cameraSettings.camera2),
                camera3: () => this.setInstance(this.cameraSettings.camera3),
                sceneCamera: () => this.setInstance('sceneCamera')
            };
            this.debugFolder.add(debugObject, 'camera1').name('Camera 1');
            this.debugFolder.add(debugObject, 'camera2').name('Camera 2');
            this.debugFolder.add(debugObject, 'camera3').name('Camera 3');
            this.debugFolder.add(debugObject, 'sceneCamera').name('sceneCamera');
        }
        
    }

    setInstance(cameraKey) {
        if (this.currentCamera) {
            this.scene.remove(this.currentCamera);
        }
        if (cameraKey === 'sceneCamera')
        {
            this.currentCamera = this.sceneCamera
            if (this.controls) {
                this.controls.enabled = false;
            }
        } 
        else
        {
            this.currentCamera = new THREE.PerspectiveCamera(
                cameraKey.fov,
                this.sizes.width / this.sizes.height,
                0.01,
                1000
            );
            this.currentCamera.position.copy(cameraKey.position);
            this.currentCamera.name = cameraKey.name;
            this.currentCamera.rotation.order = 'XYZ';
            this.currentCamera.rotation.set(
                cameraKey.rotation.x, 
                cameraKey.rotation.y, 
                cameraKey.rotation.z
            );
            this.scene.add(this.currentCamera);
    
            if (this.controls) {
                this.controls.object = this.currentCamera;
                this.controls.enabled = true;
                this.controls.update();
            }
        }
        
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.currentCamera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.addEventListener('change', () => {
            let pos = this.currentCamera.position;
            let rot = this.currentCamera.rotation;
            let fov = this.currentCamera.fov;
            document.getElementById('cameraName').innerText = `Camera Name: ${this.currentCamera.name}`;
            document.getElementById('cameraPosition').innerText = `Camera Position: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`;
            document.getElementById('cameraEuler').innerText = `Camera Euler: x=${rot.x.toFixed(2)}, y=${rot.y.toFixed(2)}, z=${rot.z.toFixed(2)}`;
            document.getElementById('cameraFOV').innerText = `Camera FOV: ${fov}`;
        });
    }

    resize() {
        this.currentCamera.aspect = this.sizes.width / this.sizes.height;
        this.currentCamera.updateProjectionMatrix();
        this.sceneCamera.aspect = this.sizes.width / this.sizes.height;
        this.sceneCamera.updateProjectionMatrix()
        // this.helper.update()
    }

    update() {
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }
        // this.helper.update()
    }

    setSceneCamera()
    {
        this.sceneCamera = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.01,
            100
        );
        // this.helper = new THREE.CameraHelper( this.sceneCamera )
        this.scene.add(this.sceneCamera)
    }

    

    setProject() {
        const transformControls = this.project.mySheet.object('Scene Camera / Transform', {
            fov: types.number(this.sceneCamera.fov, { range: [10, 160] }),
            position: types.compound({
                y: types.number(this.sceneCamera.position.y, { range: [-100, 100] }),
                x: types.number(this.sceneCamera.position.x, { range: [-100, 100] }),
                z: types.number(this.sceneCamera.position.z, { range: [-100, 100] }),
                
            }),
            rotation: types.compound({
                y: types.number(this.sceneCamera.rotation.y, { range: [-Math.PI, Math.PI] }),
                x: types.number(this.sceneCamera.rotation.x, { range: [-Math.PI, Math.PI] }),
                z: types.number(this.sceneCamera.rotation.z, { range: [-Math.PI, Math.PI] }),
            }),
            
        });
        transformControls.onValuesChange((values) => {
            //Position
            this.sceneCamera.position.set(values.position.x, values.position.y, values.position.z);
            //Rotation
            this.sceneCamera.rotation.set(values.rotation.x, values.rotation.y, values.rotation.z);
            //FOV
            this.sceneCamera.fov = values.fov
            // Set center position
            this.sceneCamera.lookAt(new THREE.Vector3(0,0,0))
            this.sceneCamera.updateProjectionMatrix()
            if (this.helper) {
                this.helper.update();
            }
        });
    }

}
