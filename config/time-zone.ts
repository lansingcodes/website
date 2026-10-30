import { tz } from '@date-fns/tz'

// All Lansing Codes events happen in Lansing, so dates are always displayed
// and bucketed in Michigan time regardless of the server's time zone
// (Netlify functions run in UTC).
export const timeZone = 'America/Detroit'

// Pass as `{ in: inLansing }` to date-fns functions
export const inLansing = tz(timeZone)
