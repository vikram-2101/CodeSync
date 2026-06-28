| Option                  | Meaning                               | Example                       |
| ----------------------- | ------------------------------------- | ----------------------------- |
| `semi: true`            | Always add semicolons                 | `const a = 1;`                |
| `singleQuote: false`    | Use `"double quotes"`                 | `"Hello"`                     |
| `trailingComma: "all"`  | Add trailing commas where valid       | Cleaner Git diffs             |
| `printWidth: 100`       | Wrap long lines after ~100 characters | Improves readability          |
| `tabWidth: 2`           | Two-space indentation                 | Common JS/TS convention       |
| `useTabs: false`        | Use spaces instead of tabs            | Avoids editor inconsistencies |
| `arrowParens: "always"` | Always write `(x) =>`                 | More consistent style         |

# @codesync/prettier-config

Shared Prettier configuration for the CodeSync monorepo.

## Usage

```js
import config from "@codesync/prettier-config";

export default config;
```
