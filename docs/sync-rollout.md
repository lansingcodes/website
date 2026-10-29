# Firestore sync rollout and recovery

The active `website` deployment writes the `events`, `groups`, and `sponsors`
collections. The sync replaces each collection from Meetup feeds or the
repository JSON files. Use this checklist for a staging rehearsal and before
the first production sync after a code change.

## Admin instructions for this change

1. Review and merge [website PR #18](https://github.com/lansingcodes/website/pull/18)
   first. Retarget [website PR #19](https://github.com/lansingcodes/website/pull/19)
   from `fix/website-security-audit` to `main`, verify that its checks pass,
   then merge it. A merge to `main` publishes the staging Netlify site. Do not
   start the production workflow yet.
2. In Netlify, open the **lansingcodes-staging** site. Under **Site
   configuration → Environment variables**, confirm that its Firebase project
   ID is `lansing-codes-staging`, either in `FIREBASE_PROJECT_ID` or the
   `project_id` field of `FIREBASE_SERVICE_ACCOUNT`. Confirm it has the service
   account settings and `SYNC_SECRET`. Check variable presence and the project
   ID only; do not paste a service account or secret into a PR or Slack.
3. In the Firebase console, open **lansing-codes-staging → Firestore Database →
   Data → events**. Record the current document count and a few document IDs.
   In Netlify, open **lansingcodes-staging → Cloud compute → Functions →
   scheduled-sync** and use **Run now**. Check the invocation and function logs
   for success. Refresh the Firestore collection and compare counts and sample
   records with the Meetup calendars. A failed feed should produce a failed
   invocation while leaving the prior event documents in place. Do not force a
   failed feed just to test this on the shared staging project; the repository's
   local Firestore emulator smoke test covers that case.
4. Verify the staging read path from Slackbot in a non-production workspace.
   We ran PR #100 locally against `lansing-codes-staging`: `upcoming events`
   returned three staging records on 2026-10-28. Repeat after the staging
   website sync if the collection changed. This is a read-only Slackbot check;
   it does not prove the website writer is configured correctly.
5. In the Netlify dashboard and any Heroku or other scheduled jobs, identify
   every deployment that can write `events`, `groups`, or `sponsors`. In
   particular, check the old `api` deployment's environment and recent logs.
   Confirm one active writer per Firestore project before production rollout.
   Decide how to retire any redundant writer only after identifying its callers.
6. Before production deployment, export the three production collections as
   described below and record their counts and representative IDs. Then run
   the repository's **Deploy to production** GitHub Action from `main` after
   the required environment approval. Verify the production Netlify site
   `lansingcodes-www` points to Firebase project `lansing-codes`, and confirm
   its `scheduled-sync` function succeeds. Compare the collection after sync
   with the snapshot and check event display on the website and Slackbot.
   If the sync fails or the event count drops unexpectedly, stop further syncs
   and investigate before another deployment or import.

## Production backup command

Have a project administrator export `events`, `groups`, and `sponsors` to a
Cloud Storage bucket in the same project's region. Managed export requires
billing, an eligible bucket, and appropriate permissions. Record the export
operation and wait for it to complete before syncing. Substitute the approved
production bucket and confirm the project ID before running:

```sh
gcloud firestore export gs://BUCKET/website-pre-sync \
  --collection-ids=events,groups,sponsors \
  --database='(default)' \
  --project=lansing-codes
```

See [Firestore export and import](https://docs.cloud.google.com/firestore/native/docs/manage-data/export-import)
for prerequisites, operation status, and recovery. Do not run an import over a
live database without a reviewed recovery plan. Netlify documents
[scheduled function runs](https://docs.netlify.com/build/functions/scheduled-functions/)
and [function logs](https://docs.netlify.com/build/functions/logs/).
