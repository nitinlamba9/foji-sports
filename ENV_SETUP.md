# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these to your Vercel Environment Variables:

### Database Connection
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foji-sports
```

### Authentication
```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
NEXTAUTH_SECRET=your-nextauth-secret-key-min-32-characters
```

### Application URLs
```
NEXTAUTH_URL=https://your-app.vercel.app
```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (free tier)
   - Select a cloud provider and region closest to your users

3. **Configure Network Access**
   - Go to "Network Access" in your cluster
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for Vercel

4. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Enter username and password
   - Give "Read and write to any database" permissions

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Vercel Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables**
   - In Vercel dashboard → Your Project → Settings → Environment Variables
   - Add all the variables from above
   - Redeploy the application

## Testing the Deployment

After deployment, test these endpoints:
- `https://your-app.vercel.app` - Homepage
- `https://your-app.vercel.app/api/products` - Products API
- `https://your-app.vercel.app/admin` - Admin Dashboard

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI is correct
   - Ensure IP access is configured (0.0.0.0/0)
   - Verify database user permissions

2. **JWT Errors**
   - Ensure JWT_SECRET is at least 32 characters
   - Check NEXTAUTH_URL matches your Vercel domain

3. **Build Errors**
   - Check all environment variables are set
   - Ensure MongoDB models are properly imported

### Debug Mode

Add this to your environment variables to enable debug logging:
```
DEBUG=mongoose:*
```

## Production Considerations

1. **Security**
   - Use strong, unique secrets
   - Enable IP whitelisting for MongoDB
   - Use HTTPS (automatic on Vercel)

2. **Performance**
   - Monitor MongoDB usage
   - Set up alerts for high traffic
   - Consider upgrading MongoDB tier for production

3. **Monitoring**
   - Enable Vercel Analytics
   - Set up error monitoring
   - Monitor API response times
