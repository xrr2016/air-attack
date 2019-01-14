const LETTERS = '0123456789abcdef'

export function randomColor () {
  let color = '#'

  while (color.length < 7) {
    color += LETTERS[Math.floor(Math.random() * LETTERS.length)]
  }

  return color
}
