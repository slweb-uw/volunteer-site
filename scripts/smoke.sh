#!/usr/bin/env bash
# Smoke test: start the production build and check that key routes respond
# with the expected HTTP status. Catches pages that crash on the server,
# broken imports, and routes that disappear.
#
# Usage: yarn build && bash scripts/smoke.sh
#
# Server-rendered pages that read Firestore ([location]/[project] and
# calendar/[event]/signup) are not checked: they need real Firebase data.
# /api/firebase-to-firestore is not checked: its handler never responds.

set -u
PORT="${PORT:-3123}"
BASE="http://localhost:${PORT}"

# route expected-status
ROUTES="
/ 200
/opportunities 200
/opportunities/Seattle 200
/Seattle/calendar 200
/donations 200
/foundationsOfServiceLearning 200
/help 200
/onboarding 200
/protocols 200
/requiredTraining 200
/resources 200
/standardOfCare 200
/userManager 200
/AuthorizationMessage 200
/welcome/categoriesOfService 200
/welcome/communitypartners 200
/welcome/studentVolunteers 200
/welcome/volunteerProviders 200
/this-page-does-not-exist 404
/api/set-roles 405
/api/reconcile-role 405
/api/lookup-volunteer 405
/api/calendar/Atlantis.ics 404
"

npx next start -p "$PORT" > smoke-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

for _ in $(seq 1 60); do
  curl -s -o /dev/null --max-time 2 "$BASE/" && break
  sleep 1
done

failed=0
while read -r route expected; do
  [ -z "$route" ] && continue
  status=$(curl -s -o /dev/null --max-time 10 -w "%{http_code}" "$BASE$route")
  if [ "$status" = "$expected" ]; then
    echo "ok    $status $route"
  else
    echo "FAIL  $status $route (expected $expected)"
    failed=$((failed + 1))
  fi
done <<< "$ROUTES"

if [ "$failed" -gt 0 ]; then
  echo
  echo "$failed route(s) failed. Server log:"
  tail -n 50 smoke-server.log
  exit 1
fi
echo "All routes responded as expected."
