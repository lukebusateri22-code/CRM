#!/bin/bash

# CRM Deployment Setup Script
# This script helps you prepare your CRM for deployment

echo "🚀 CRM Deployment Setup"
echo "======================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if already a git repository
if [ -d .git ]; then
    echo "⚠️  Git repository already exists"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
fi

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Create a GitHub repository at: https://github.com/new"
echo "2. Copy the repository URL (e.g., https://github.com/username/crm-app.git)"
echo ""
read -p "Enter your GitHub repository URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin "$repo_url"
echo "✅ Remote added"

echo ""
echo "📦 Adding files to git..."
git add .
echo "✅ Files added"

echo ""
echo "💾 Creating initial commit..."
git commit -m "Initial CRM setup - ready for deployment"
echo "✅ Commit created"

echo ""
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your code is now on GitHub!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Deploy backend to Railway: https://railway.app"
    echo "2. Deploy frontend to Netlify: https://netlify.com"
    echo "3. Follow the DEPLOYMENT_GUIDE.md for detailed instructions"
    echo ""
    echo "🔗 Your repository: $repo_url"
else
    echo ""
    echo "❌ Push failed. Please check your credentials and try again."
    echo "You may need to authenticate with GitHub."
fi
