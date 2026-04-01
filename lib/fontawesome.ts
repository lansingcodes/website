import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

// Prevent FontAwesome from dynamically inserting CSS into the <head>,
// which causes React hydration mismatches in Next.js SSR.
config.autoAddCss = false

// Register all icon sets once at app startup.
library.add(fas, fab, far)
