#!/usr/bin/env sh

# Current directory
# shellcheck disable=SC1007
DIRNAME=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

# Load commons
# shellcheck source=SCRIPTDIR/__commons.sh
. "$DIRNAME/__commons.sh"

# ================
# CONFIGURATION
# ================
# Root directory
ROOT_DIR="$DIRNAME/.."
# Website directory
WEBSITE_DIR="$ROOT_DIR/website"

# ================
# CLEANUP
# ================
cleanup() {
  # Exit code
  _exit_code=$?
  [ $_exit_code = 0 ] || WARN "Cleanup exit code $_exit_code"

  exit "$_exit_code"
}

# Trap
trap cleanup INT QUIT TERM EXIT

################################################################################################################################

# Verify system
verify_system() {
  assert_cmd git
  assert_cmd npm

  [ -d "$WEBSITE_DIR" ] || FATAL "Website directory '$WEBSITE_DIR' does not exists"
}

# Publish website
publish_website() {
  { [ "$TRAVIS_PULL_REQUEST" = false ] && [ "$TRAVIS_BRANCH" = master ]; } || {
    WARN "Skipping publishing website"
    return
  }
  INFO "Publishing website"

  # Prepare git
  DEBUG "Preparing git"
  git config user.email "$GIT_USER@users.noreply.github.com"
  git config user.name "Travis"
  printf '%s\n' "machine github.com login $GIT_USER password $GIT_TOKEN" > "$HOME/.netrc"

  # Prepare website
  DEBUG "Preparing website"
  npm --prefix "$WEBSITE_DIR" ci

  # Publish
  DEBUG "Publishing website"
  GIT_USER=$GIT_USER \
    CURRENT_BRANCH=master \
    npm --prefix "$WEBSITE_DIR" run publish-gh-pages

  INFO "Successfully published website"
}

# ================
# MAIN
# ================
{
  verify_system
  publish_website
}
