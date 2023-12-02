import * as THREE from 'three'
import Experience from '../Experience'
import solVertexShader from '../../shaders/sol/sol.vertex.glsl'
import solFragmentShader from '../../shaders/sol/sol.fragment.glsl'
import { getProject, types } from '@theatre/core'

export default class CrazySphere
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.project = this.experience.project

        this.debugObject = {}

        // Surface level Color

        this.debugObject.depthColor = '#2e2e2d'
        this.debugObject.surfaceColor = '#bababa'

        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Mid Sphere')
        }

        this.setGeometry()
        this.setMaterial()
        this.setTextures()
        this.setMesh()
        this.setProject()
        this.setupTimeUpdate();
    }

    setGeometry()
    {
        this.geometry = new THREE.SphereGeometry(4, 1000, 1000)
    }

    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.grassNormalTexture
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
        this.material.uniforms.uMap.value = this.textures.color
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            vertexShader: solVertexShader,
            fragmentShader: solFragmentShader,
            uniforms:
            {
                uTime: { value: 0 },

                uBigWavesSpeed: { value: 0.35 },
                uBigWavesElevation: { value: 0.1844 },
                uBigWavesFrequency: { value: new THREE.Vector2(6.0, 2.0) },

                uSmallWavesElevation: { value: 0.23},
                uSmallWavesFrequency: { value: 25},
                uSmallWavesSpeed: { value: 0.3},
                uSmallWavesIterations: { value: 3},

                uDepthColor: { value: new THREE.Color(this.debugObject.depthColor)},
                uSurfaceColor: { value: new THREE.Color(this.debugObject.surfaceColor)},
                uColorOffset: { value: 0.11 },
                uColorMultiplier: { value: 10 },

                uTextureBlendFactor: { value: 0.11 },
                uScaleFactor: { value: 10 },


                uMap: { value: null }

            },
            wireframe: false,
            side: THREE.BackSide
        })

        const uniformControls = this.project.mySheet.object(`Mid Sphere / Shader Uniforms`, {
            uniforms: types.compound({
                uBigWavesSpeed: types.number(this.material.uniforms.uBigWavesSpeed.value, { range: [-10, 10]}),
                uBigWavesElevation: types.number(this.material.uniforms.uBigWavesElevation.value, { range: [-10, 10]}),
                uBigWavesFrequencyX: types.number(this.material.uniforms.uBigWavesFrequency.value.x, { range: [-10, 10]}),
                uSmallWavesElevation: types.number(this.material.uniforms.uSmallWavesElevation.value, { range: [-10, 10]}),
                uSmallWavesFrequency: types.number(this.material.uniforms.uSmallWavesFrequency.value, { range: [-10, 10]}),
                uSmallWavesSpeed: types.number(this.material.uniforms.uSmallWavesSpeed.value, { range: [-10, 10]}),
                uSmallWavesIterations: types.number(this.material.uniforms.uSmallWavesIterations.value, { range: [-10, 10]}),
                uColorOffset: types.number(this.material.uniforms.uColorOffset.value, { range: [-10, 10]}),
                uColorMultiplier: types.number(this.material.uniforms.uColorMultiplier.value, { range: [-10, 10]}),
                uTextureBlendFactor: types.number(this.material.uniforms.uTextureBlendFactor.value, { range: [-10, 10]}),
            })
        })

        uniformControls.onValuesChange((values) => 
        {
            this.material.uniforms.uBigWavesSpeed.value = values.uniforms.uBigWavesSpeed
            this.material.uniforms.uBigWavesElevation.value = values.uniforms.uBigWavesElevation
            this.material.uniforms.uBigWavesFrequency.value.x = values.uniforms.uBigWavesFrequencyX
            this.material.uniforms.uSmallWavesElevation.value = values.uniforms.uSmallWavesElevation
            this.material.uniforms.uSmallWavesFrequency.value = values.uniforms.uSmallWavesFrequency
            this.material.uniforms.uSmallWavesSpeed.value = values.uniforms.uSmallWavesSpeed
            this.material.uniforms.uSmallWavesIterations.value = values.uniforms.uSmallWavesIterations
            this.material.uniforms.uColorOffset.value = values.uniforms.uColorOffset
            this.material.uniforms.uColorMultiplier.value = values.uniforms.uColorMultiplier
            this.material.uniforms.uTextureBlendFactor.value = values.uniforms.uTextureBlendFactor
        })

        if (this.debug.active) 
        {
            this.debugFolder
                .add(this.material.uniforms.uBigWavesElevation, 'value')
                .name('uBigWavesElevation')
                .min(0)
                .max(20)
                .step(0.0001),
            this.debugFolder
                .add(this.material.uniforms.uBigWavesFrequency.value, 'x')
                .name('uBigWavesFrequencyX')
                .min(0)
                .max(10)
                .step(0.001)
            this.debugFolder
                .add(this.material.uniforms.uBigWavesFrequency.value, 'y')
                .name('uBigWavesFrequencyY')
                .min(0)
                .max(10)
                .step(0.001)  
            this.debugFolder
                .add(this.material.uniforms.uBigWavesSpeed, 'value')
                .name('uBigWavesSpeed')
                .min(0)
                .max(4)
                .step(0.001)

            this.debugFolder
                .add(this.material.uniforms.uSmallWavesElevation, 'value')
                .name('uSmallWavesElevation')
                .min(0)
                .max(20)
                .step(0.0001)
            this.debugFolder
                .add(this.material.uniforms.uSmallWavesFrequency, 'value')
                .name('uSmallWavesFrequency')
                .min(0)
                .max(25)
                .step(0.001)
            this.debugFolder
                .add(this.material.uniforms.uSmallWavesSpeed, 'value')
                .name('uSmallWavesSpeed')
                .min(0)
                .max(4)
                .step(0.001)
            this.debugFolder
                .add(this.material.uniforms.uSmallWavesIterations, 'value')
                .name('uSmallWavesIterations')
                .min(0)
                .max(10)
                .step(1)

            this.debugFolder
                .addColor(this.debugObject, 'depthColor')
                .name('depthColor')
                .onChange(() => 
                { 
                    this.material.uniforms.uDepthColor.value.set(this.debugObject.depthColor)
                })
            this.debugFolder
                .addColor(this.debugObject, 'surfaceColor')
                .name('surfaceColor')
                .onChange(() => 
                { 
                    this.material.uniforms.uSurfaceColor.value.set(this.debugObject.surfaceColor)
                })

            this.debugFolder
                .add(this.material.uniforms.uColorOffset, 'value')
                .name('uColorOffset')
                .min(0)
                .max(4)
                .step(0.001)
            this.debugFolder
                .add(this.material.uniforms.uColorMultiplier, 'value')
                .name('uColorMultiplier')
                .min(0)
                .max(10)
                .step(0.001)
            this.debugFolder
                .add(this.material.uniforms.uTextureBlendFactor, 'value')
                .name('uTextureBlendFactor')
                .min(0)
                .max(1)
                .step(0.001)
            this.debugFolder
                .add(this.material.uniforms.uScaleFactor, 'value')
                .name('uScaleFactor')
                .min(0)
                .max(100)
                .step(1)
            
        }
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)

    }
    // setProject()
    // {
    //     console.log(this.material.uniforms.uBigWavesElevation);
    //     this.crazySphereObject = this.project.mySheet.object('Crazy Sphere', 
    //         {
    //             rota: types.compound({
    //                 uBigWavesElevation: types.number(this.material.uniforms.uBigWavesElevation.value, { range: [-2, 2] }),
    //                 uBigWavesElevation: types.number(this.mesh.position.y, { range: [-2, 2] }),
    //               })
    //         }
    //     )
    // }

    setProject() {
        
    }
    

    setupTimeUpdate() 
    {
        this.time.on('tick', (elapsed) => {
            this.material.uniforms.uTime.value = elapsed / 1000.0
        });
    }
}