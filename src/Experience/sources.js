export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMap/space/sky_neg_x.png',
            'textures/environmentMap/space/sky_neg_y.png',
            'textures/environmentMap/space/sky_neg_z.png',
            'textures/environmentMap/space/sky_pos_x.png',
            'textures/environmentMap/space/sky_pos_y.png',
            'textures/environmentMap/space/sky_pos_z.png'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'brainModel',
        type: 'glbModel',
        path: 'models/Brain/brain.glb'
    },
    {
        name: 'mickmanAudio',
        type: 'audio',
        path: 'audio/mickmanSong.mp3'
    },
    {
        name: 'mickmanKeyframes',
        type: 'keyframes',
        path: 'keyframes/mickmanKeyframes.json'
    }
]