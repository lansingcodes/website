# Firestore sync rollout and recovery

The active `website` deployment writes the `events`, `groups`, and `sponsors`
collections. The sync replaces each collection from Meetup feeds or the
repository JSON files. Use this checklist for a staging rehearsal and before
the first production sync after a code change.

1. Confirm the Netlify site's Firebase project ID. Staging and production must
   point to their respective Firestore projects. Confirm `SYNC_SECRET` is set
   for that site, and check that `scheduled-sync` appears under **Cloud compute
   → Functions** with its next run time. [Netlify scheduled functions](https://docs.netlify.com/build/functions/scheduled-functions/)
   can be run manually with **Run now** on a deploy preview or published site.
2. Check whether an old `api` deployment or any other scheduled job can still
   write these same collections. Review its deployment and function logs and
   identify callers before disabling it. Keep only `website` as the active
   writer in each environment. This repository cannot verify another site's
   deployed configuration.
3. Before a production replacement, have a project administrator export
   `events`, `groups`, and `sponsors` to a Cloud Storage bucket in the same
   project's region. Managed export requires billing, an eligible bucket, and
   appropriate permissions. Record the export operation and wait for it to
   complete before syncing. For example, after substituting the approved
   project and bucket:

   ```sh
   gcloud firestore export gs://BUCKET/website-pre-sync \
     --collection-ids=events,groups,sponsors \
     --database='(default)' \
     --project=PROJECT_ID
   ```

   See [Firestore export and import](https://docs.cloud.google.com/firestore/native/docs/manage-data/export-import)
   for prerequisites, operation status, and recovery. Do not run an import
   over a live database without a reviewed recovery plan.
4. Record document counts and a few representative event IDs before the sync.
   Run the sync in staging first. Confirm the route returns success, compare
   counts and event fields, and verify website and Slackbot event replies.
   A failed Meetup feed now stops event replacement before Firestore writes;
   an invalid calendar also fails the sync.
5. On the production site, use **Run now** or wait for the next scheduled run.
   Check the `scheduled-sync` function logs and invocation status afterward.
   A missing secret, non-success response, or network error now fails the
   function instead of completing normally. Investigate any count drop before
   retrying or deploying further changes. [Netlify function logs](https://docs.netlify.com/build/functions/logs/)
   and metrics can help confirm failures.

Merging to `main` deploys staging. Production uses the repository's manual
GitHub Actions workflow and its required environment approval.
