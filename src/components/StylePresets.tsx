import React from 'react';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  color: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean lines, neutral colors, minimal décor',
    prompt: 'Transform into a modern minimalist space with clean lines, neutral color palette (white, beige, grey), minimal furniture, hidden storage, and plenty of negative space',
    icon: '▢',
    color: 'from-slate-400 to-slate-600',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Cozy, natural materials, bright spaces',
    prompt: 'Redesign in Scandinavian style with white oak furniture, natural light, cozy textiles, neutral colors with pastel accents, plants, and functional minimalist design',
    icon: '🌲',
    color: 'from-blue-300 to-blue-500',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Exposed brick, metal, urban vibe',
    prompt: 'Create an industrial loft style with exposed brick walls, metal fixtures, concrete floors, leather furniture, Edison bulb lighting, and raw urban aesthetic',
    icon: '🏗️',
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic, colorful, globally inspired',
    prompt: 'Transform into bohemian style with vibrant colors, mixed patterns, macramé wall hangings, lots of plants, layered textiles, vintage furniture, and eclectic global décor',
    icon: '🌺',
    color: 'from-pink-400 to-purple-500',
  },
  {
    id: 'mid-century',
    name: 'Mid-Century Modern',
    description: 'Retro 50s-60s, bold colors, organic shapes',
    prompt: 'Redesign in mid-century modern style with tapered wooden legs furniture, bold geometric patterns, vibrant accent colors (mustard, teal, orange), sunburst mirrors, and organic curved shapes',
    icon: '🕰️',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'contemporary',
    name: 'Contemporary Luxury',
    description: 'Sophisticated, high-end finishes',
    prompt: 'Create a contemporary luxury space with marble accents, velvet furniture, gold or brass fixtures, statement lighting, large mirrors, and sophisticated neutral color palette',
    icon: '💎',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'rustic',
    name: 'Rustic Farmhouse',
    description: 'Warm wood, vintage, countryside charm',
    prompt: 'Transform into rustic farmhouse style with reclaimed wood, shiplap walls, vintage furniture, cozy textiles, warm earth tones, farmhouse sink, and countryside charm',
    icon: '🏡',
    color: 'from-amber-700 to-brown-600',
  },
  {
    id: 'coastal',
    name: 'Coastal Beach',
    description: 'Light, airy, ocean-inspired',
    prompt: 'Redesign in coastal beach style with white and blue color scheme, natural textures (rattan, jute), nautical accents, driftwood elements, sheer curtains, and light airy atmosphere',
    icon: '🌊',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'japanese',
    name: 'Japanese Zen',
    description: 'Minimalist, peaceful, natural elements',
    prompt: 'Create a Japanese Zen space with tatami mats, low furniture, shoji screens, natural materials (bamboo, wood), minimal décor, indoor plants, and peaceful serene atmosphere',
    icon: '🎋',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'art-deco',
    name: 'Art Deco Glamour',
    description: 'Geometric, luxurious, 1920s inspired',
    prompt: 'Transform into Art Deco glamour with geometric patterns, bold black and gold colors, mirrored surfaces, velvet upholstery, luxurious materials, and 1920s inspired elegance',
    icon: '✨',
    color: 'from-yellow-600 to-amber-700',
  },
];

interface StylePresetsProps {
  onSelectStyle: (preset: StylePreset) => void;
  className?: string;
}

export const StylePresets: React.FC<StylePresetsProps> = ({ onSelectStyle, className = '' }) => {
  return (
    <div className={className}>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 font-display">
        ✨ Quick Style Presets
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectStyle(preset)}
            className="group relative p-5 rounded-2xl border-2 border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:border-accent-400 dark:hover:border-accent-500 transition-all duration-300 text-left overflow-hidden hover:scale-105 hover:shadow-xl"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{preset.icon}</div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2 font-display">
                {preset.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-glow" />
          </button>
        ))}
      </div>
    </div>
  );
};
