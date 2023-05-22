const StyleCollection = [
    { prompt: '', label: 'None', value: 'none'},
    { prompt: 'a close-up photograph portrait', negativePrompt: 'disfigured, ugly, deformed, illustration, drawing, anime', label: 'Photograph', value: 'photograph'},
    { prompt: 'a vector illustration', negativePrompt: 'disfigured, ugly, deformed, photograph', label: 'Vector', value: 'vector'},
    { prompt: 'a charcoal illustration', negativePrompt: 'disfigured, ugly, deformed, photograph', label: 'Charcoal', value: 'charcoal'},
    { prompt: 'a watercolor painting', negativePrompt: 'disfigured, ugly, deformed, photograph', label: 'Watercolor', value: 'watercolor'},
    { prompt: 'a lego', negativePrompt: 'disfigured, ugly, deformed', label: 'Lego', value: 'lego'},
    { prompt: '3d render', negativePrompt: 'disfigured, ugly, deformed', label: '3D Render', value: '3d-render'},
    { prompt: 'a warcraft character', negativePrompt: 'disfigured, ugly, deformed', label: 'Warcraft', value: 'warcraft'},
    { prompt: 'funko pop figurine', negativePrompt: 'disfigured, ugly, deformed', label: 'Funko Pop', value: 'funko-pop'},
    { prompt: 'wrapped in plastic wrap', negativePrompt: 'disfigured, ugly, deformed', label: 'Plastic Wrap', value: 'plastic'},
    { prompt: 'pixel art, 16-bit, 8-bit', value: 'pixel', label: 'Pixel Art'},
    { prompt: 'an oil painting', value: 'oil', label: 'Oil Painting'},
    { prompt: 'a renaissance oil painting', value: 'renaissance', label: 'Renaissance'},
    { prompt: 'ceramic sculpture statue', value: 'ceramic', label: 'Ceramics'}, // ceramic sculpture statue
    { prompt: 'corroded rusted metal oxidized', value: 'rust', label: 'Rust'}, // corroded rusted metal oxidized
    { prompt: 'undead zombie', value: 'undead', label: 'Undead'}, // undead zombie
    { prompt: 'a vampire dracula, with blood red water on fangs', value: 'vampiric', label: 'Vampiric'}, // a vampire dracula, with blood red water on fangs
    { prompt: 'neo noir, vaporwave', value: 'vaporwave', label: 'Vaporwave'}, // neo noir, vaporwave
    { prompt: 'made out of fire', value: 'fire', label: 'Fire'}, // made out of fire
    { prompt: 'made out of water, drops, underwater', value: 'water', label: 'Water'}, // made out of water, drops, underwater
    { prompt: 'surrounded in flowers, floral portrait, a close-up photograph', value: 'floral', label: 'Floral'}, // surrounded in flowers, floral portrait, a close-up photograph
];

module.exports = StyleCollection;
  