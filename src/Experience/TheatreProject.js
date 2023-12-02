import { getProject } from '@theatre/core'
import Experience from "./Experience";
import projectState from './mickmanKeyframesGood.json'

export default class TheatreProject
{
    constructor()
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.project = getProject('Audio/Visual Demo KeyFrames', { state: projectState})
        this.mySheet = this.project.sheet('5 Panel Mickman') 
        this.debug = this.experience.debug;
        
        this.project.ready.then(() => 
        {
            // this.mySheet.sequence.play() 
            if (this.debug.active) {
                console.log("idk");
            } else {
                document.getElementById('theatrejs-studio-root').style.display = 'none';
            }
            // Loading Complete
            this.experience.resources.on('ready', () => 
            {
                if (this.debug.active) {
                } else {
                    document.getElementById('theatrejs-studio-root').style.display = 'none';
                }
                this.mySheet.sequence.attachAudio({ source: this.resources.items.mickmanAudio }).then(() => 
                {
                    
                    // console.log(this.resources.items.mickmanAudio);
                })
            })
            
        })
        
        
    }

}