#!/bin/bash

echo "🚀 Oh My Kiro - Installation Script"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"

# Build
echo ""
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build project"
    exit 1
fi

echo "✓ Project built successfully"

# Link globally
echo ""
echo "🔗 Linking globally..."
npm link

if [ $? -ne 0 ]; then
    echo "❌ Failed to link globally"
    echo "   Try running with sudo: sudo npm link"
    exit 1
fi

echo "✓ Linked globally"

# Run setup
echo ""
echo "⚙️  Running setup..."
omk setup

if [ $? -ne 0 ]; then
    echo "❌ Failed to run setup"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'omk doctor' to verify installation"
echo "  2. Start Kiro: kiro-cli chat"
echo "  3. Use skills: \$team, \$autopilot, \$ralph, \$ultrawork"
echo ""
echo "Documentation:"
echo "  - README.md - Full documentation (English)"
echo "  - USAGE_KR.md - Usage guide (Korean)"
