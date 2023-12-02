import Experience from "../Experience";
import Environment from './Environment';
import Brain from './Brain';
import MidSphere from './MidSphere';


export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        // Wait for resources
        this.resources.on('ready', () => 
        {
            // Setup
            this.midSphere = new MidSphere()
            this.environment = new Environment()
            this.brain = new Brain()
            
        })

        
    }

    update()
    {   
        if(this.fox)
        {
            this.fox.update()
        }
    }
}