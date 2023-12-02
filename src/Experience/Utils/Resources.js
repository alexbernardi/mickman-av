import * as THREE from 'three'
import { AudioLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources
        
        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0
        this.finishedLoading = false

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loader = {}
        this.loader.audioLoader = new AudioLoader();
        this.loader.gltfLoader = new GLTFLoader()
        this.loader.gltfDLoader = new GLTFLoader()
        this.loader.dracoLoader = new DRACOLoader()
        this.loader.dracoLoader.setDecoderPath('/draco/')
        this.loader.gltfDLoader.setDRACOLoader(this.loader.dracoLoader)
        this.loader.textureLoader = new THREE.TextureLoader()
        this.loader.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loader.gltfLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    },
                    progressEvent => {
                        this.updateProgress(progressEvent);
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loader.textureLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    },
                    progressEvent => {
                        this.updateProgress(progressEvent);
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loader.cubeTextureLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    },
                    progressEvent => {
                        this.updateProgress(progressEvent);
                    }
                )
            }
            else if(source.type === 'glbModel')
            {
                this.loader.gltfDLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    },
                    progressEvent => {
                        this.updateProgress(progressEvent);
                    }
                )
            }
            else if (source.type === 'audio') 
            {
                this.loader.audioLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    },
                    undefined, // Progress callback (if needed)
                    (error) => {
                        console.error('Error loading audio file:', error);
                    },
                    progressEvent => {
                        this.updateProgress(progressEvent);
                    }
                );
            }
            else if (source.type === 'waveform') 
            {
                fetch(source.path)
                    .then(response => response.json())
                    .then(waveformData => {
                        this.sourceLoaded(source, waveformData);
                    })
                    .catch(error => console.error('Error loading waveform data:', error));
            }
            else if (source.type === 'keyframes') 
            {
                fetch(source.path)
                    .then(response => response.json())
                    .then(file => {
                        this.sourceLoaded(source, file);
                    })
                    .catch(error => console.error('Error loading waveform data:', error));
            }
        }
    }

    sourceLoaded(source, file) {
        
        if (source.type === 'waveform') {
            // Assuming the waveform data is in file.waveform
            const waveformArray = new Float32Array(file.waveform);
            this.items[source.name] = waveformArray;
        } else {
            // Handle other source types
            this.items[source.name] = file;
        }
        this.loaded++;
    
        if (this.loaded === this.toLoad) {
            this.trigger('ready');
            this.finishedLoading = true;
        }
    }

    updateProgress(progressEvent) {
        // Calculate progress
        let progressRatio = progressEvent.loaded / progressEvent.total;
        this.trigger('progress', [progressRatio]);
    }
}