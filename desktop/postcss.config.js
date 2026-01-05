import nested from 'postcss-nested'
import postcssScss from 'postcss-scss'

export default {
  parser: postcssScss,
  plugins: [nested],
}
