# Nixpacks Deployment Fix Documentation

## Problem Summary

The ViuWi application was failing to deploy with the following error:

```
error: undefined variable 'pnpm'
at /app/.nixpacks/nixpkgs-5148520bfab61f99fd25fb9ff7bfbb50dad3c9db.nix:19:38:
```

## Root Cause Analysis

### Primary Issue
The original `nixpacks.toml` configuration was manually trying to install `pnpm` via the `nixPkgs` array:

```toml
nixPkgs = [
  "nodejs_20",
  "pnpm",          # This caused the error
  "python3",
  "gcc",
  "pkg-config",
  "git"
]
```

### Why This Failed
1. **nixpkgs Version Incompatibility**: The nixpkgs version used by nixpacks didn't have `pnpm` available as a package
2. **Conflicting with Auto-Detection**: Nixpacks has built-in support for pnpm and automatically detects it from `pnpm-lock.yaml`
3. **Over-Engineering**: The manual configuration was unnecessary and conflicted with nixpacks' automatic capabilities

## Solution Implemented

### 1. Simplified nixpacks.toml Configuration

**Removed:**
- Manual `pnpm` installation from nixPkgs
- Complex manual install/build phase definitions
- Redundant pnpm-specific environment variables
- Manual caching configurations

**Kept:**
- Essential system dependencies (nodejs_20, python3, gcc, pkg-config, git)
- Core environment variables (NODE_ENV, CI, NEXT_TELEMETRY_DISABLED)
- Node.js version specification

### 2. Enhanced package.json

**Added:**
```json
{
  "packageManager": "pnpm@10.14.0"
}
```

This leverages nixpacks' Corepack support for automatic pnpm installation and version management.

### 3. Key Changes Made

#### Before (nixpacks.toml):
```toml
[phases.setup]
nixPkgs = [
  "nodejs_20",
  "pnpm",          # PROBLEMATIC LINE
  "python3",
  "gcc",
  "pkg-config",
  "git"
]

[phases.install]
cmds = [
  "pnpm install --frozen-lockfile --prefer-offline --store-dir=/app/.pnpm-store"
]

[phases.build]
cmds = [
  "pnpm run build"
]

[start]
cmd = "pnpm run start"
```

#### After (nixpacks.toml):
```toml
[phases.setup]
nixPkgs = [
  "nodejs_20",     # pnpm removed - auto-detected
  "python3",
  "gcc",
  "pkg-config",
  "git"
]

# install, build, and start phases removed - use nixpacks defaults
```

## How the Fix Works

### Automatic Detection Flow
1. **Lockfile Detection**: Nixpacks detects `pnpm-lock.yaml` in the project root
2. **Package Manager Field**: Reads `packageManager: "pnpm@latest"` from package.json
3. **Corepack Integration**: Uses Node.js Corepack to install the specified pnpm version
4. **Automatic Commands**: Runs appropriate pnpm commands for install, build, and start phases

### Benefits of the New Approach
1. **Reliability**: Uses nixpacks' tested automatic detection
2. **Maintainability**: Simpler configuration that's easier to debug
3. **Future-Proof**: Works with nixpacks updates and improvements
4. **Performance**: Still maintains caching through nixpacks' built-in mechanisms

## Verification Steps

To verify the fix works:

1. **Check Build Logs**: Look for pnpm being automatically detected
2. **Monitor Performance**: Ensure build times remain acceptable
3. **Test Deployment**: Confirm successful deployment without errors

## Fallback Plan

If pnpm continues to cause issues, the configuration can be modified to use npm:

```toml
[variables]
NIXPACKS_NODE_VERSION = "20"
NODE_ENV = "production"
CI = "true"

[phases.setup]
nixPkgs = ["nodejs_20", "python3", "gcc", "pkg-config", "git"]

[phases.install]
cmds = ["npm ci --prefer-offline"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"
```

## Files Modified

1. **nixpacks.toml** - Updated configuration with explicit phases and Node.js 22
2. **package.json** - Added packageManager field (pnpm@10.14.0)
3. **.dockerignore** - Added to exclude Supabase functions from build context
4. **nixpacks.toml.backup** - Backup of original configuration
5. **docs/NIXPACKS_DEPLOYMENT_FIX.md** - This documentation

## Latest Configuration Changes

### Node.js Version Update
- **Changed from**: Node.js 20 (v20.6.1 was too old for corepack)
- **Changed to**: Node.js 22 (better corepack compatibility)

### Explicit Build Phases
```toml
[phases.install]
cmds = ['corepack enable', 'corepack prepare pnpm@10.14.0 --activate', 'pnpm install --frozen-lockfile']

[phases.build]
cmds = ["pnpm run build"]

[start]
cmd = "pnpm run start"
```

### Docker Context Exclusions
Created `.dockerignore` to exclude:
- `supabase/functions/` (prevents Deno detection)
- Development and build artifacts
- Unnecessary files for deployment

## References

- [Nixpacks Node Provider Documentation](https://nixpacks.com/docs/providers/node)
- [Nixpacks Corepack Support](https://nixpacks.com/docs/providers/node#corepack)
- [pnpm Package Manager](https://pnpm.io/)
