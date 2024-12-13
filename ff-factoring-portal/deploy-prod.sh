echo "Deploying to production..."

echo "Building application..."
npm run build

echo "Deploying to S3..."
aws s3 sync ./out s3://prod-ff-factoring-frontend

echo "Invalidating Cloudfront cache..."
aws cloudfront create-invalidation --distribution-id EKLPERJB3JTCT --paths "/*"

echo "Done!"
