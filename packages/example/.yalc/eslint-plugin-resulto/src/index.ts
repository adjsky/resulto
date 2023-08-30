import recommended from "./configs/recommended"
import mustUseResult from "./rules/must-use-result"

export default {
  configs: {
    recommended
  },
  rules: {
    "must-use-result": mustUseResult
  }
}
