git config --global user.email "reedcwilson@gmail.com"
git config --global user.name "Reed Wilson"
echo "Host heroku.com" >> ~/.ssh/config
echo "   StrictHostKeyChecking no" >> ~/.ssh/config
echo "   CheckHostIP no" >> ~/.ssh/config; 
echo "   UserKnownHostsFile=/dev/null" >> ~/.ssh/config;
if [[ $TRAVIS_PULL_REQUEST == "false" && $TRAVIS_BRANCH == "master" ]] then
  gem install heroku
  heroku keys:clear
  echo yes | heroku keys:add
  git checkout .
  git remote add heroku https://git.heroku.com/name-prospector.git 
  git subtree push --prefix=server heroku master
  heroku keys:clear
fi
if [[ $TRAVIS_PULL_REQUEST == "false" ]] then
  echo $TRAVIS_BRANCH
fi
echo
echo "...done."
