import { colors } from 'quasar'


const QuasarColors = [
    'red',
    'pink',
    'purple',
    'deep-purple',
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
    'blue-grey',
  ];
  
/**
 * Returns random quasar color in hexadecimal.
 * @returns color in hex notation
 */
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * QuasarColors.length);
  return QuasarColors[randomIndex];
}
  

export { getRandomColor };