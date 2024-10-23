export const getStatusColor = (status: string) => {
  switch (status) {
    case "not_started":
      return "bg-red-500 text-background";
    case "in_progress":
      return "bg-yellow-500 text-background";
    case "done":
      return "bg-green-500 text-background";
    default:
      return "";
  };
};

export const getStatusUpdatedText = (status: string) => {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return "";
  };
};