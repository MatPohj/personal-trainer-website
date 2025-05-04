import { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { parse, startOfWeek, getDay, format } from "date-fns";
import { fi } from "date-fns/locale";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import "./CalendarPage.css";

const locales = {
  fi: fi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"month" | "week" | "day">(Views.WEEK);
  const [date, setDate] = useState<Date>(new Date());
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings");
        if (!response.ok) throw new Error("Failed to fetch trainings");
        const data = await response.json();
        if (Array.isArray(data)) {
          const eventsWithCustomer = data.map((training) => {
            const startDate = new Date(training.date);
            const endDate = new Date(startDate.getTime() + training.duration * 60000);
            return {
              id: String(training.id),
              title: `${training.activity}${training.customer ? " / " + training.customer.firstname + " " + training.customer.lastname : ""}`,
              start: startDate,
              end: endDate,
            };
          });
          setEvents(eventsWithCustomer);
        }
      } catch (err) {
        setError("Error loading calendar data");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="calendar-root">
      <Container maxWidth={false} sx={{ mt: 4, px: 0 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calendar
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {format(date, view === "month" ? "MMMM yyyy" : view === "week" ? "'Week of' MMM d, yyyy" : "MMMM d, yyyy")}
        </Typography>
        <Box className="calendar-box">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 800 }}
            defaultView={Views.WEEK}
            views={{
              month: true,
              week: true,
              day: true,
            }}
            view={view}
            onView={(newView) => {
              if (newView === "month" || newView === "week" || newView === "day") {
                setView(newView);
              }
            }}
            date={date}
            onNavigate={setDate}
            popup
            formats={{
              timeGutterFormat: "HH:mm",
              eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                localizer
                  ? localizer.format(start, "HH:mm", culture) +
                    " – " +
                    localizer.format(end, "HH:mm", culture)
                  : "",
              agendaTimeFormat: "HH:mm",
            }}
          />
        </Box>
      </Container>
    </div>
  );
}