# shellcheck shell=sh

# Fail on error
set -o errexit
# Disable wildcard character expansion
set -o noglob
# Disable undefined variable reference
set -o nounset

# ================
# LOGGER
# ================
# Fatal log level. Cause exit failure
LOG_LEVEL_FATAL=100
# Error log level
LOG_LEVEL_ERROR=200
# Warning log level
LOG_LEVEL_WARN=300
# Informational log level
LOG_LEVEL_INFO=500
# Debug log level
LOG_LEVEL_DEBUG=600
# Log level
LOG_LEVEL=$LOG_LEVEL_INFO
# Log color flag
LOG_COLOR_ENABLE=true

# Convert log level to equivalent name
# @param $1 Log level
to_log_level_name() {
  _log_level=${1:-LOG_LEVEL}
  _log_level_name=

  case $_log_level in
    "$LOG_LEVEL_FATAL") _log_level_name=fatal ;;
    "$LOG_LEVEL_ERROR") _log_level_name=error ;;
    "$LOG_LEVEL_WARN") _log_level_name=warn ;;
    "$LOG_LEVEL_INFO") _log_level_name=info ;;
    "$LOG_LEVEL_DEBUG") _log_level_name=debug ;;
    *) FATAL "Unknown log level '$_log_level'" ;;
  esac

  printf '%s\n' "$_log_level_name"
}

# Check if log level is enabled
# @param $1 Log level
is_log_level_enabled() {
  [ "$1" -le "$LOG_LEVEL" ]

  return $?
}

# Print log message
# @param $1 Log level
# @param $2 Message
_log_print_message() {
  _log_level=${1:-LOG_LEVEL_FATAL}
  shift
  _log_level_name=
  _log_message=${*:-}
  _log_prefix=
  _log_suffix="\033[0m"

  # Check log level
  is_log_level_enabled "$_log_level" || return 0

  case $_log_level in
    "$LOG_LEVEL_FATAL")
      _log_level_name=FATAL
      _log_prefix="\033[41;37m"
      ;;
    "$LOG_LEVEL_ERROR")
      _log_level_name=ERROR
      _log_prefix="\033[1;31m"
      ;;
    "$LOG_LEVEL_WARN")
      _log_level_name=WARN
      _log_prefix="\033[1;33m"
      ;;
    "$LOG_LEVEL_INFO")
      _log_level_name=INFO
      _log_prefix="\033[37m"
      ;;
    "$LOG_LEVEL_DEBUG")
      _log_level_name=DEBUG
      _log_prefix="\033[1;34m"
      ;;
  esac

  # Check color flag
  if [ "$LOG_COLOR_ENABLE" = false ]; then
    _log_prefix=
    _log_suffix=
  fi

  # Log
  printf '%b[%-5s] %b%b\n' "$_log_prefix" "$_log_level_name" "$_log_message" "$_log_suffix"
}

# Fatal log message
# @param $1 Message
FATAL() {
  _log_print_message "$LOG_LEVEL_FATAL" "$@" >&2
  exit 1
}
# Error log message
# @param $1 Message
ERROR() { _log_print_message "$LOG_LEVEL_ERROR" "$@" >&2; }
# Warning log message
# @param $1 Message
WARN() { _log_print_message "$LOG_LEVEL_WARN" "$@" >&2; }
# Informational log message
# @param $1 Message
INFO() { _log_print_message "$LOG_LEVEL_INFO" "$@"; }
# Debug log message
# @param $1 Message
DEBUG() { _log_print_message "$LOG_LEVEL_DEBUG" "$@"; }

# ================
# ASSERT
# ================
# Assert command is installed
# @param $1 Command name
assert_cmd() {
  check_cmd "$1" || FATAL "Command '$1' not found"
  DEBUG "Command '$1' found at '$(command -v "$1")'"
}

# ================
# FUNCTIONS
# ================
# Check command is installed
# @param $1 Command name
check_cmd() {
  command -v "$1" > /dev/null 2>&1
}

# ================
# CONFIGURATION
# ================
# Log level
LOG_LEVEL=$LOG_LEVEL_INFO
# Log color flag
LOG_COLOR_ENABLE=true
