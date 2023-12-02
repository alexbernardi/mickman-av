import * as THREE from 'three'
import Experience from "../Experience";
import { getProject, types } from '@theatre/core'
import brainVertexShader from '../../shaders/brain/brain.vertex.glsl'
import brainFragmentShader from '../../shaders/brain/brain.fragment.glsl'


export default class Brain
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.project = this.experience.project

        // Setup
        this.resource = this.resources.items.brainModel

        this.settings = {
            shellParams: new THREE.Vector4(32, 0.07) // (shell count, shell thickness, tbd, tbd)
        }

        // this.setTextures()
        this.setMaterial()
        this.setModel()
        
        this.setProject()
        this.setupTimeUpdate()
        
    }

    // setTextures()
    // {
    //     this.textures = {}

    //     this.mapSize = 512;
    //     this.normalMapRT = new THREE.WebGLRenderTarget(this.mapSize, this.mapSize, { 
    //         type: THREE.HalfFloatType, 
    //         format: THREE.RGBAFormat, 
    //         magFilter: THREE.LinearFilter, 
    //         minFilter: THREE.LinearFilter,
    //         wrapS: THREE.ClampToEdgeWrapping,
    //         wrapT: THREE.ClampToEdgeWrapping,
    //         generateMipmaps: false
    //     });

    //     this.textures.color = this.resources.items.furTexture
    //     this.textures.color.wrapS = THREE.RepeatWrapping
    //     this.textures.color.wrapT = THREE.RepeatWrapping
    //     this.textures.magFilter = THREE.LinearFilter;
    //     this.textures.minFilter = THREE.LinearMipMapLinearFilter;
    //     this.textures.generateMipmaps = true;
    //     this.furTexture = this.textures.color
    // }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            vertexShader: brainVertexShader,
            fragmentShader: brainFragmentShader,
            uniforms: {
                uTime: { value: 0 },
                // shellParams: {value: this.settings.shellParams},
                // furTexture: {value: this.furTexture},
                // normalMapTexture: {value: this.normalMapRT.texture},
                uTest: { value: 8.0 },
                u2: { value: 2.0 },
                u3: { value: 0.3 },
                u4: { value: 0.4 },

            },
            transparent: true,
            wireframe: false,
        })

        const uniformControls = this.project.mySheet.object(`Brain / Shader Uniforms`, {
            uniforms: types.compound({
                uTest: types.number(this.material.uniforms.uTest.value, { range: [-10, 10]}),
                u2: types.number(this.material.uniforms.u2.value, { range: [-10, 10]}),
                u3: types.number(this.material.uniforms.u3.value, { range: [-10, 10]}),
                u4: types.number(this.material.uniforms.u4.value, { range: [-10, 10]}),
            })
        })

        uniformControls.onValuesChange((values) => 
        {
            this.material.uniforms.uTest.value = values.uniforms.uTest
            this.material.uniforms.u2.value = values.uniforms.u2
            this.material.uniforms.u3.value = values.uniforms.u3
            this.material.uniforms.u4.value = values.uniforms.u4
        })
    }

    setModel()
    {
        
        this.model = this.resource.scene
        this.model.scale.set(0.5, 0.5, 0.5)
        this.model.position.y = 0
        this.model.rotation.y = - Math.PI /2 
        this.scene.add(this.model)

        this.brainControls = {};

        // Traverse the glb object and setup internal meshes with their correct shaders and controls

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                // Seperate the Meshes
                this[child.name] = child;
                this[child.name].material = this.material;

                // Setup theatre JS

                //Transform Controls
                const transformControls = this.project.mySheet.object(`Brain / ${child.name} / Transform`, {
                    position: types.compound({
                        x: types.number(this[child.name].position.x, { range: [-4, 4]}),
                        y: types.number(this[child.name].position.y, { range: [-4, 4]}),
                        z: types.number(this[child.name].position.z, { range: [-4, 4]}),
                    }),
                    rotation: types.compound({
                        x: types.number(this[child.name].rotation.x, { range: [-4, 4]}),
                        y: types.number(this[child.name].rotation.y, { range: [-100, 100]}),
                        z: types.number(this[child.name].rotation.z, { range: [-4, 4]}),
                    })
                })

                // Store controls in the brainControls object
                this.brainControls[child.name] = {
                    transform: transformControls
                };


                // Update mesh animation
                this.brainControls[child.name].transform.onValuesChange((values) => 
                {
                    this[child.name].position.x = values.position.x
                    this[child.name].position.y = values.position.y
                    this[child.name].position.z = values.position.z
                    this[child.name].rotation.x = values.rotation.x
                    this[child.name].rotation.y = values.rotation.y
                    this[child.name].rotation.z = values.rotation.z
                })

            }
        })
        // console.log(this.model);
    }
    setProject()
    {
        // this.brainObject = this.project.mySheet.object('Brain / cerebro_HPoly1 / Position', {
        //      Position: types.compound({
        //         x: types.number(this.cerebro_HPoly1.position.x, { range: [-2, 2] })
        //      }) 
        //     });
    }

    setupTimeUpdate() 
    {
        this.time.on('tick', (elapsed) => {
            this.material.uniforms.uTime.value = elapsed / 1000.0
        });
    }
}