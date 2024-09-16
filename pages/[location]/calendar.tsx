import EventsView from "components/eventsView";
import { useRouter } from "next/router";

export default function CalendarPage() {
  const router = useRouter();
  const { location } = router.query;

  if(!location) return <div>Not a valid location</div>

  return <EventsView location={location.toString()} />
}
