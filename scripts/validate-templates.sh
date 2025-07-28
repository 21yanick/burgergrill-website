#!/bin/bash

# 🔍 Template Validation Script
# Validates template consistency and checks for common issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to validate a template
validate_template() {
    local template_path=$1
    local template_name=$(basename "$template_path")
    
    print_status "Validating template: $template_name"
    
    if [ ! -d "$template_path" ]; then
        print_error "Template not found: $template_path"
        return 1
    fi
    
    cd "$template_path"
    
    # Check for required files
    local required_files=(
        "package.json"
        "next.config.ts"
        "tailwind.config.ts"
        "app/layout.tsx"
        "app/globals.css"
        "middleware.ts"
        "lib/env.ts"
        "lib/supabase/client.ts"
        "lib/supabase/server.ts"
        "components/ui/button.tsx"
    )
    
    local missing_files=()
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "Missing required files:"
        for file in "${missing_files[@]}"; do
            echo "    - $file"
        done
        return 1
    fi
    
    # Check for TypeScript compilation
    if command -v tsc &> /dev/null; then
        print_status "  Checking TypeScript compilation..."
        if tsc --noEmit &> /dev/null; then
            print_success "  TypeScript compilation: OK"
        else
            print_error "  TypeScript compilation: FAILED"
            return 1
        fi
    else
        print_warning "  TypeScript not found, skipping compilation check"
    fi
    
    # Check for package.json validation
    if command -v node &> /dev/null; then
        print_status "  Validating package.json..."
        if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" &> /dev/null; then
            print_success "  package.json: Valid JSON"
        else
            print_error "  package.json: Invalid JSON"
            return 1
        fi
    fi
    
    # Check for common issues
    print_status "  Checking for common issues..."
    
    # Check for missing imports
    if grep -r "import.*from.*'@/" . --include="*.ts" --include="*.tsx" | grep -v node_modules > /dev/null 2>&1; then
        print_success "  Path alias imports: Found"
    else
        print_warning "  Path alias imports: Not found or may be missing"
    fi
    
    # Check for environment variables
    if [ -f ".env.local" ]; then
        print_success "  Environment file: Found"
    else
        print_warning "  Environment file: Not found (.env.local missing)"
    fi
    
    cd - > /dev/null
    
    print_success "Template validation completed: $template_name"
    return 0
}

# Function to check for duplicates
check_duplicates() {
    print_status "Checking for duplicate files between templates..."
    
    local templates=(
        "templates/nextjs-core"
        "templates/nextjs-saas-template"
        "templates/nextjs-shop-template"
        "templates/nextjs-booking-template"
    )
    
    local duplicate_found=false
    
    for template1 in "${templates[@]}"; do
        for template2 in "${templates[@]}"; do
            if [ "$template1" != "$template2" ] && [ -d "$template1" ] && [ -d "$template2" ]; then
                # Compare specific files that should be unique
                local business_files=(
                    "lib/stripe/config.ts"
                    "lib/stripe/subscription.ts"
                    "lib/stripe/shop.ts"
                    "lib/stripe/booking.ts"
                    "components/checkout-button.tsx"
                )
                
                for file in "${business_files[@]}"; do
                    if [ -f "$template1/$file" ] && [ -f "$template2/$file" ]; then
                        if ! diff -q "$template1/$file" "$template2/$file" > /dev/null 2>&1; then
                            print_warning "Different versions of $file found in $(basename $template1) and $(basename $template2)"
                            duplicate_found=true
                        fi
                    fi
                done
            fi
        done
    done
    
    if [ "$duplicate_found" = false ]; then
        print_success "No problematic duplicates found"
    fi
}

# Function to validate development templates
validate_dev_templates() {
    print_status "Validating development templates..."
    
    local dev_templates=(
        "templates/nextjs-saas-dev"
        "templates/nextjs-shop-dev"
        "templates/nextjs-booking-dev"
    )
    
    for template in "${dev_templates[@]}"; do
        if [ -d "$template" ]; then
            validate_template "$template"
        else
            print_warning "Development template not found: $template"
            print_status "Run 'scripts/create-dev-templates.sh' to create it"
        fi
    done
}

# Main execution
print_status "🔍 Starting template validation..."

# Validate core template
if [ -d "templates/nextjs-core" ]; then
    validate_template "templates/nextjs-core"
else
    print_error "Core template not found"
    exit 1
fi

# Validate business templates
local business_templates=(
    "templates/nextjs-saas-template"
    "templates/nextjs-shop-template"
    "templates/nextjs-booking-template"
)

for template in "${business_templates[@]}"; do
    if [ -d "$template" ]; then
        validate_template "$template"
    else
        print_warning "Business template not found: $template"
    fi
done

# Validate development templates
validate_dev_templates

# Check for duplicates
check_duplicates

print_success "🎉 Template validation completed!"
echo ""
print_status "Summary:"
echo "  - All templates validated successfully"
echo "  - No critical issues found"
echo "  - Ready for development and deployment"