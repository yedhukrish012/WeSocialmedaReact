echo "Switching to branch master"
git checkout master


echo "Building app..."
npm run build


echo "Deploying files to server..."
scp -r build/*   ubuntu@ec2-16-171-55-21:/var/www/16.171.55.21/


echo "done"