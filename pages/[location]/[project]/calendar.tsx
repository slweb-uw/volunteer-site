import EventsView from "components/eventsView";
import { useRouter } from "next/router";

export default function CalendarPage() {
  const router = useRouter();
  const { location, project } = router.query;

  if (!location || !project) return <div>hello</div>;

  return (
    <EventsView location={location.toString()} projectId={project.toString()} />
  );
}
