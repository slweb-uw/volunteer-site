import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// FullCalendar needs the browser, so it is not rendered on the server.
const LocationCalendar = dynamic(() => import("components/LocationCalendar"), {
  ssr: false,
});

export default function CalendarPage() {
  const router = useRouter();
  const { location, project } = router.query;

  if (!location || !project) return <div>Loading…</div>;

  return (
    <LocationCalendar
      location={location.toString()}
      projectId={project.toString()}
    />
  );
}
