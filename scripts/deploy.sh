# https://devcenter.heroku.com/articles/platform-api-deploying-slugs

# make sure we have a clean env
rm -rf ../app
rm ../extract_slug_id.js
rm ../extract_slug_url.js

# setup the heroku api key
echo "machine api.heroku.com
  login reedcwilson@gmail.com
  password ${HEROKU_API_KEY}
machine git.heroku.com
  login reedcwilson@gmail.com
  password ${HEROKU_API_KEY}" > ~/.netrc

# copy the scripts you'll need to the parent dir
cp scripts/extract_slug_id.js ../
cp scripts/extract_slug_url.js ../

# create an 'app' directory
mkdir ../app
cp -r ./* ../app
cd ../app

echo "Now in $(pwd)"

# download the version of node you'll need
curl http://nodejs.org/dist/v4.1.2/node-v4.1.2-linux-x64.tar.gz | tar xz

# tar up the app dir
cd ..
tar -cxf slug.tgz ./app

# tell heroku that you want to publish a slug and give it the command to call after compile
OUTPUT=$(curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/vnd.heroku+json; version=3' -d '{"process_types":{"web":"NODE_ENV=production node-v4.1.2-linux-x64/bin/node ./bin/www"}}' -n https://api.heroku.com/apps/name-prospector/slugs)
echo "\n${OUTPUT}\n"

# store the post url
URL=$(echo ${OUTPUT} | ./app/node-v4.1.2-linux-x64/bin/node extract_slug_url.js)
echo "\nURL: ${URL}"

# store the slug id
ID=$(echo ${OUTPUT} | ./app/node-v4.1.2-linux-x64/bin/node extract_slug_id.js)
echo "ID: ${ID}\n"

## push the slug to heroku's given url
curl -X PUT -H "Content-Type:" --data-binary @slug.tgz ${URL}

## release the kraken (slug)
curl -X POST -H "Accept: application/vnd.heroku+json; version=3" -H "Content-Type: application/json" -d {'"'slug'"':'"'${ID}'"'} -n https://api.heroku.com/apps/name-prospector/releases
