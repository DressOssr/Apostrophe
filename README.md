# ApostropheCMS Demo

## Get started

If you want to just fork this repo and go:

1. Make sure you have Node.js (22 or better, a current LTS release).
2. Make sure you have MongoDB. A MongoDB Atlas free tier account will work. If you're not running MongoDB on your own computer, set the `APOS_MONGODB_URI` environment variable.
3. Install dependencies with `npm install`.
4. Add your first user with `node app @apostrophecms/user:add {MY_USERNAME} admin`.

## Running the project during development

Run `npm run dev` to build the Apostrophe UI and start the site up.

Go to `http://localhost:3000/login` to log in and start editing.

## AWS S3 uploads

This project now supports storing Apostrophe uploads in AWS S3 through `@apostrophecms/uploadfs`.

Required environment variables:

- `APOS_S3_BUCKET`
- `APOS_S3_REGION`
- `APOS_S3_KEY`
- `APOS_S3_SECRET`

Behavior:

- if all four variables are present, uploads use S3
- if any are missing, uploads stay on local disk so development still works

Optional:

- set `APOS_UPLOADFS_ASSETS=1` in production to publish built Apostrophe frontend assets through uploadfs as well

How to test:

1. Set the S3 environment variables.
2. Restart the app.
3. Upload an image in Apostrophe.
4. Open the uploaded image URL and confirm it resolves from your S3 bucket domain instead of `/uploads` on localhost.

## For more information

See the [documentation](https://apostrophecms.com/docs/) for more information.
