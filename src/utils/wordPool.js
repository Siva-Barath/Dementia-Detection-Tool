export const WORD_POOL = [
  'Apple', 'Ocean', 'Guitar', 'Mountain', 'Sunset', 'River', 'Piano', 'Forest',
  'Candle', 'Window', 'Garden', 'Laptop', 'Bridge', 'Coffee', 'Mirror', 'Desert',
  'Violin', 'Valley', 'Thunder', 'Marble', 'Pencil', 'Flower', 'Castle', 'Rocket',
  'Dolphin', 'Compass', 'Lantern', 'Pyramid', 'Anchor', 'Feather', 'Glacier',
  'Telescope', 'Fountain', 'Emerald', 'Tornado', 'Butterfly', 'Lighthouse', 'Volcano',
  'Sapphire', 'Waterfall', 'Horizon', 'Meadow', 'Carousel', 'Hammock', 'Prism',
  'Oasis', 'Eclipse', 'Cavern', 'Blossom', 'Comet'
]

export const ANIMALS = [
  'dog', 'cat', 'elephant', 'lion', 'tiger', 'bear', 'wolf', 'fox', 'deer', 'rabbit',
  'horse', 'cow', 'pig', 'sheep', 'goat', 'chicken', 'duck', 'goose', 'turkey', 'eagle',
  'hawk', 'owl', 'parrot', 'penguin', 'dolphin', 'whale', 'shark', 'fish', 'octopus',
  'crab', 'lobster', 'snake', 'lizard', 'turtle', 'frog', 'crocodile', 'alligator',
  'monkey', 'gorilla', 'chimpanzee', 'zebra', 'giraffe', 'hippo', 'rhino', 'kangaroo',
  'koala', 'panda', 'raccoon', 'squirrel', 'mouse', 'rat', 'hamster', 'guinea pig',
  'butterfly', 'bee', 'ant', 'spider', 'scorpion', 'camel', 'llama', 'moose', 'elk',
  'buffalo', 'panther', 'leopard', 'cheetah',
  'flamingo', 'peacock', 'swan', 'pelican', 'toucan', 'macaw', 'crow', 'pigeon',
  'sparrow', 'robin', 'hummingbird', 'woodpecker', 'ostrich', 'emu', 'kiwi',
  'salmon', 'tuna', 'clownfish', 'seahorse', 'jellyfish', 'starfish', 'seal', 'walrus',
  'otter', 'beaver', 'mole', 'hedgehog', 'bat', 'skunk', 'badger', 'weasel', 'ferret',
  'meerkat', 'mongoose', 'hyena', 'jackal', 'coyote', 'bison', 'yak', 'alpaca',
  'donkey', 'mule', 'pony', 'reindeer', 'caribou', 'gazelle', 'antelope', 'impala',
  'warthog', 'baboon', 'orangutan', 'gibbon', 'lemur', 'sloth', 'armadillo', 'anteater',
  'platypus', 'wombat', 'tasmanian devil', 'iguana', 'chameleon', 'gecko', 'python',
  'cobra', 'viper', 'salamander', 'newt', 'toad', 'axolotl'
]

export const SPEECH_IMAGES = [
  { 
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80', 
    desc: 'Kitchen scene',
    keywords: ['kitchen', 'cooking', 'stove', 'counter', 'food']
  },
  { 
    url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80', 
    desc: 'Park scene',
    keywords: ['park', 'trees', 'grass', 'people', 'outdoor']
  },
  { 
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80', 
    desc: 'Family gathering',
    keywords: ['family', 'people', 'table', 'dinner', 'eating']
  },
  { 
    url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&q=80', 
    desc: 'Grocery store',
    keywords: ['store', 'shopping', 'food', 'shelves', 'products']
  }
]

export function getRandomWords(count) {
  const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getDistractorWords(originalWords, count) {
  const available = WORD_POOL.filter(w => !originalWords.includes(w))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function validateAnimal(word) {
  return ANIMALS.includes(word.toLowerCase().trim())
}

export function getRandomImage() {
  return SPEECH_IMAGES[Math.floor(Math.random() * SPEECH_IMAGES.length)]
}
