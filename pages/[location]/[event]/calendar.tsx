import EventsView from "components/eventsView";
import { useRouter } from "next/router";

export default function CalendarPage() {
  const router = useRouter();
  const { location, event } = router.query;

  if (!location || !event) return <div>hello</div>;

  return (
    <EventsView location={location.toString()} projectId={event.toString()} />
  );
}
